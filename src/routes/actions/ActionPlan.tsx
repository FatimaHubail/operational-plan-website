import { useEffect, useMemo, useState } from "react"
import { Link, Navigate, useLocation, useNavigate, useParams } from "react-router-dom"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import { proposalStatusToneSurfaceClass, requestStatusToProposalTone } from "@/lib/proposalStatusChip"
import type { ActionPlanLocationState } from "@/lib/buildActionPlanHref"
import { resolveActionPlanContext } from "@/lib/actionPlanResolve"
import { getAppRoutePrefix, getDashboardHref, isRoleScopedPath } from "@/lib/appRoutePrefix"
import {
  type ActionPlanAction,
  type ActionPlanTask,
  aggregateActionAchievementPercent,
  computeObjectiveAchievementPercent,
  flattenTasksFromActions,
  formatDate,
  initialActionsData,
  normalizeStatus,
  parseISODate,
  sumTaskWeightsPercent,
  taskBucket,
  taskStatusPillClass,
} from "@/routes/actions/actionPlanModel"
import { ProposedByBlock } from "@/components/proposed-by"
import { HorizontalRatioStack } from "@/components/ratio-bars"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
const PLAN_SECTIONS = ["catalysts", "enablers", "beneficiary", "stakeholders"] as const
type PlanSection = (typeof PLAN_SECTIONS)[number]

const SECTION_LABELS: Record<`/${PlanSection}`, string> = {
  "/catalysts": "Catalysts",
  "/enablers": "Enablers",
  "/beneficiary": "Beneficiary",
  "/stakeholders": "Stakeholders",
}

/** Segment fills for Task status overview bar (`HorizontalRatioStack`). */
const TASK_STATUS_BAR_FILLS = {
  /** Exact tones from `action-plan.html` summary bar. */
  in_progress: "fill-amber-400",
  completed: "fill-emerald-500",
  not_started: "fill-slate-300",
} as const

/** Grey segments swapped for destructive red (action weight balance). */
const WEIGHT_BAR_FILLS = [
  "fill-primary",
  "fill-destructive",
  "fill-chart-2",
  "fill-chart-1",
  "fill-chart-5",
] as const

const WEIGHT_LEGEND_BG = ["bg-primary", "bg-destructive", "bg-chart-2", "bg-chart-1", "bg-chart-5"] as const

const WEIGHT_LABEL_TEXT = ["text-primary", "text-destructive", "text-chart-2", "text-chart-1", "text-chart-5"] as const

/** Match `action-plan.html` glance achievement column - emerald-700 headline + emerald-500/600 gradient bars + cards. */
const ACHIEVEMENT_CARD_SURFACE =
  "border-emerald-100/90 bg-gradient-to-br from-emerald-50/50 to-card p-2.5 ring-1 ring-emerald-100/40 dark:border-emerald-900/35 dark:from-emerald-950/20 dark:to-card dark:ring-emerald-900/25"

/** Mini action achievement bars - HTML hex swatches mapped to Tailwind (`action-plan.html`). */
const ACHIEVEMENT_MINI_SEGMENT_BG = [
  "bg-emerald-600",
  "bg-teal-600",
  "bg-emerald-800",
  "bg-sky-700",
] as const

function EmeraldGradientPercentBar({ percent }: { percent: number }) {
  const p = Math.min(100, Math.max(0, percent))
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200/90 ring-1 ring-slate-200/70 dark:bg-muted dark:ring-border/70">
      <div
        className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 transition-[width] duration-300 ease-out"
        style={{ width: `${p}%` }}
      />
    </div>
  )
}

/** Same shades as HTML achievement-detail bars (solid branch colours per row). */
function AchievementSolidMiniBar({ percent, shadeIdx }: { percent: number; shadeIdx: number }) {
  const p = Math.min(100, Math.max(0, percent))
  const seg = ACHIEVEMENT_MINI_SEGMENT_BG[shadeIdx % ACHIEVEMENT_MINI_SEGMENT_BG.length]
  return (
    <div className="h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-slate-200/90 ring-1 ring-slate-200/65 dark:bg-muted dark:ring-border/60">
      <div className={cn("h-full rounded-full transition-[width] duration-300 ease-out", seg)} style={{ width: `${p}%` }} />
    </div>
  )
}

/** Same surfaces as Catalysts `getStatusClasses` - adapted for action-plan vocabulary. */
function actionPlanObjectiveStatusSurfaceClass(status: string): string {
  const t = normalizeStatus(status)
  if (t.includes("complete")) {
    return "border-0 strategic-perspective-bg-chart-2 text-secondary-foreground shadow-sm"
  }
  if (t.includes("not start")) {
    return "border-0 bg-muted text-secondary-foreground shadow-sm ring-1 ring-border/60"
  }
  return "notif-new-badge border-0 shadow-sm"
}

function RequestStatusPill({ label }: { label: string }) {
  const text = label?.trim() ? label.trim() : "-"
  const surface = proposalStatusToneSurfaceClass(requestStatusToProposalTone(text))
  return (
    <span
      className={cn(
        "inline-flex max-w-full min-w-0 flex-wrap items-center gap-x-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold text-[oklch(0.55_0.015_255)] transition",
        surface
      )}
    >
      <span className="min-w-0 break-words">{text}</span>
    </span>
  )
}

function FieldCell({
  label,
  value,
  wide,
  mode,
  onEdit,
  editing = false,
  editValue,
  onEditValueChange,
  onCancelEdit,
  multiline = false,
}: {
  label: string
  value: string
  wide?: boolean
  mode?: "default" | "metric" | "status"
  onEdit?: () => void
  editing?: boolean
  editValue?: string
  onEditValueChange?: (next: string) => void
  onCancelEdit?: () => void
  multiline?: boolean
}) {
  const display = value != null && value !== "" ? String(value) : "-"
  const base =
    "min-w-0 rounded-xl border border-border/80 bg-white px-3 py-2.5 shadow-md ring-1 ring-border/25 transition sm:px-4" +
    (wide ? " sm:col-span-2" : "")
  const borderClass =
    mode === "metric"
      ? " border-border/80 bg-white ring-1 ring-border/25"
      : " border-border/80 bg-white ring-1 ring-border/25"
  return (
    <div className={cn(base, borderClass)}>
      <div className="flex items-start justify-between gap-2">
        <p className="min-w-0 flex-1 text-[9px] font-bold uppercase leading-tight tracking-wide text-muted-foreground">{label}</p>
        {editing && onCancelEdit ? (
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            onClick={onCancelEdit}
            aria-label={`Cancel editing ${label}`}
            className="shrink-0 text-[oklch(0.55_0.015_255)] hover:bg-muted/50 hover:text-[oklch(0.55_0.015_255)]"
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </Button>
        ) : onEdit ? (
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            onClick={onEdit}
            aria-label={`Edit ${label}`}
            className="shrink-0 text-[oklch(0.55_0.015_255)] hover:bg-muted/50 hover:text-[oklch(0.55_0.015_255)]"
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
              <path d="M17.414 2.586a2 2 0 010 2.828l-9.9 9.9a1 1 0 01-.39.242l-3 1a1 1 0 01-1.265-1.265l1-3a1 1 0 01.242-.39l9.9-9.9a2 2 0 012.828 0z" />
            </svg>
          </Button>
        ) : null}
      </div>
      <div className="mt-1 break-words text-xs leading-snug whitespace-pre-wrap text-foreground sm:text-[13px] sm:leading-snug">
        {editing ? (
          multiline ? (
            <Textarea
              rows={3}
              value={editValue ?? ""}
              onChange={(event) => onEditValueChange?.(event.target.value)}
              className="min-h-[4.5rem] border-border/80 bg-white text-sm text-zinc-950 shadow-sm ring-1 ring-border/25"
            />
          ) : (
            <Input
              type="text"
              value={editValue ?? ""}
              onChange={(event) => onEditValueChange?.(event.target.value)}
              className="h-auto min-h-9 w-full border-border/80 bg-white py-2 text-sm text-zinc-950 shadow-sm ring-1 ring-border/25"
            />
          )
        ) : mode === "status" && value ? (
          <span
            className={cn(
              "inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-bold",
              taskStatusPillClass(value)
            )}
          >
            {value}
          </span>
        ) : (
          display
        )}
      </div>
    </div>
  )
}

export default function ActionPlan() {
  const location = useLocation()
  const navigate = useNavigate()
  const { planSection } = useParams<{ planSection: string }>()
  const { state } = location
  const routePrefix = getAppRoutePrefix(location.pathname)
  const isRoleScoped = isRoleScopedPath(location.pathname)
  const dashboardHref = getDashboardHref(location.pathname)
  const nav = state as ActionPlanLocationState | undefined

  const isValidSection = (s: string | undefined): s is PlanSection =>
    !!s && (PLAN_SECTIONS as readonly string[]).includes(s)

  const parentPath = (`/${planSection ?? ""}` as keyof typeof SECTION_LABELS) as `/${PlanSection}`
  const sectionHref = isRoleScoped ? `${routePrefix}${parentPath}` : parentPath
  const addTaskHref = `${sectionHref}/add-task`
  const parentLabel = isValidSection(planSection) ? SECTION_LABELS[parentPath] ?? "Planning" : "Planning"

  const resolved = useMemo(() => {
    if (!planSection || !isValidSection(planSection) || !nav?.p) return null
    const { p, si, oi } = nav
    if (!Number.isFinite(si) || !Number.isFinite(oi)) return null
    return resolveActionPlanContext(planSection, p, si, oi)
  }, [planSection, nav])

  const sub = resolved?.subLabel ?? "C1.1"
  const obj = resolved?.objDisplay ?? "1"
  const objectiveLead =
    resolved?.objectiveLead ?? "Align institutional KPIs with national quality benchmarks"
  const status = resolved?.status ?? "In progress"

  const headingText = `${sub} - Objective ${obj}`

  const [actionsData, setActionsData] = useState<ActionPlanAction[]>(() =>
    structuredClone(initialActionsData)
  )

  const [taskModal, setTaskModal] = useState<{
    task: ActionPlanTask
    taskIndex: number
    actionIndex: number
    action: ActionPlanAction
  } | null>(null)

  const [taskEditingField, setTaskEditingField] = useState<keyof Pick<
    ActionPlanTask,
    "weight" | "startDate" | "expectedEndDate" | "performanceIndicators" | "targetValue" | "actualValueAchieved" | "achievementPercentage"
  > | null>(null)
  const [taskDraft, setTaskDraft] = useState<Pick<
    ActionPlanTask,
    "weight" | "startDate" | "expectedEndDate" | "performanceIndicators" | "targetValue" | "actualValueAchieved" | "achievementPercentage"
  >>({
    weight: "",
    startDate: "",
    expectedEndDate: "",
    performanceIndicators: "",
    targetValue: "",
    actualValueAchieved: "",
    achievementPercentage: "",
  })

  const [actionDetails, setActionDetails] = useState<{
    action: ActionPlanAction
    index: number
  } | null>(null)

  const [actionEditingField, setActionEditingField] = useState<
    | "actionTitle"
    | "taskMainEntity"
    | "taskSupportingEntities"
    | "taskHumanResources"
    | "taskFinancialResources"
    | "taskActionContributionPercentage"
    | "taskStatus"
    | "taskNotes"
    | "actionProposalStatus"
    | null
  >(null)
  const [actionDetailsDraft, setActionDetailsDraft] = useState({
    actionTitle: "",
    totalWeight: "",
    taskMainEntity: "",
    taskSupportingEntities: "",
    taskHumanResources: "",
    taskFinancialResources: "",
    taskActionContributionPercentage: "",
    taskStatus: "",
    taskNotes: "",
    actionProposalStatus: "",
  })

  const glance = useMemo(() => {
    const actions = actionsData
    const tasks = flattenTasksFromActions(actions)
    const totalTasks = tasks.length

    const buckets = {
      in_progress: { label: "In progress", names: [] as string[] },
      completed: { label: "Completed", names: [] as string[] },
      not_started: { label: "Not started", names: [] as string[] },
    }
    const order = ["in_progress", "completed", "not_started"] as const
    tasks.forEach((t) => {
      const b = taskBucket(t.status)
      if (buckets[b]) buckets[b].names.push(t.name || "Untitled task")
    })

    const objAch = computeObjectiveAchievementPercent(actions)

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const endDates = tasks
      .map((t) => {
        const d = parseISODate(t.expectedEndDate)
        if (!d || !t.expectedEndDate) return null
        const iso = t.expectedEndDate.match(/^(\d{4}-\d{2}-\d{2})/)
        return {
          d,
          iso: iso ? iso[1] : null,
          name: t.name || "Untitled task",
          task: t,
        }
      })
      .filter((x): x is NonNullable<typeof x> => x != null)

    const startRows = tasks
      .map((t) => {
        if (normalizeStatus(t.status).includes("complete")) return null
        const d = parseISODate(t.startDate)
        if (!d || !t.startDate) return null
        const iso = t.startDate.match(/^(\d{4}-\d{2}-\d{2})/)
        if (!iso) return null
        return { d, iso: iso[1], name: t.name || "Untitled task", task: t }
      })
      .filter((x): x is NonNullable<typeof x> => x != null && x.d >= today)
      .sort((a, b) => a.d.getTime() - b.d.getTime())

    const firstStartIso = startRows.length > 0 ? startRows[0].iso : null
    const tasksOnFirstStart = firstStartIso
      ? startRows.filter((r) => r.iso === firstStartIso)
      : []

    const openEnding = endDates
      .filter((x) => !normalizeStatus(x.task.status).includes("complete"))
      .sort((a, b) => a.d.getTime() - b.d.getTime())

    let overdueCount = 0
    tasks.forEach((t) => {
      if (normalizeStatus(t.status).includes("complete")) return
      const d = parseISODate(t.expectedEndDate)
      if (d && d < today) overdueCount += 1
    })

    let weightSumParsed = 0
    const weightSegs: { pct: number; title: string; i: number }[] = []
    actions.forEach((action, i) => {
      const wm = (action.totalWeight || "").match(/(\d+(?:\.\d+)?)/)
      const pct = wm ? parseFloat(wm[1]) : 0
      weightSegs.push({ pct, title: action.title || `Action ${i + 1}`, i })
      weightSumParsed += pct
    })

    return {
      actions,
      tasks,
      totalTasks,
      buckets,
      order,
      objAch,
      firstStartIso,
      tasksOnFirstStart,
      startRowsLength: startRows.length,
      openEnding,
      overdueCount,
      weightSegs,
      weightSumParsed,
    }
  }, [actionsData])

  const totalTaskCount = useMemo(
    () => actionsData.reduce((acc, a) => acc + (a.tasks?.length || 0), 0),
    [actionsData]
  )

  const openTaskModal = (
    task: ActionPlanTask,
    taskIndex: number,
    actionIndex: number,
    action: ActionPlanAction
  ) => {
    setTaskEditingField(null)
    setTaskDraft({
      weight: task.weight || "",
      startDate: task.startDate || "",
      expectedEndDate: task.expectedEndDate || "",
      performanceIndicators: task.performanceIndicators || "",
      targetValue: task.targetValue || "",
      actualValueAchieved: task.actualValueAchieved || "",
      achievementPercentage: task.achievementPercentage || "",
    })
    setTaskModal({ task, taskIndex, actionIndex, action })
  }

  const closeTaskModal = () => {
    setTaskModal(null)
    setTaskEditingField(null)
  }

  const openActionDetails = (action: ActionPlanAction, index: number) => {
    const firstTask = action.tasks?.[0]
    setActionEditingField(null)
    setActionDetails({ action, index })
    setActionDetailsDraft({
      actionTitle: action.title || "",
      totalWeight: action.totalWeight || "",
      taskMainEntity: firstTask?.mainEntity || "",
      taskSupportingEntities: firstTask?.supportingEntities || "",
      taskHumanResources: firstTask?.humanResources || "",
      taskFinancialResources: firstTask?.financialResources || "",
      taskActionContributionPercentage: firstTask?.actionContributionPercentage || "",
      taskStatus: firstTask?.status || "Not started",
      taskNotes: firstTask?.notes || "",
      actionProposalStatus: firstTask?.requestStatus || "-",
    })
  }

  const saveActionDetails = () => {
    if (!actionDetails) return
    setActionsData((prev) => {
      const next = structuredClone(prev)
      const act = next[actionDetails.index]
      if (!act) return prev
      act.title = actionDetailsDraft.actionTitle.trim() || "Untitled action"
      act.totalWeight = actionDetailsDraft.totalWeight.trim() || "0%"
      const firstTask = act.tasks?.[0]
      if (firstTask) {
        firstTask.mainEntity = actionDetailsDraft.taskMainEntity.trim()
        firstTask.supportingEntities = actionDetailsDraft.taskSupportingEntities.trim()
        firstTask.humanResources = actionDetailsDraft.taskHumanResources.trim()
        firstTask.financialResources = actionDetailsDraft.taskFinancialResources.trim()
        firstTask.actionContributionPercentage = actionDetailsDraft.taskActionContributionPercentage.trim()
        firstTask.status = actionDetailsDraft.taskStatus.trim() || "Not started"
        firstTask.notes = actionDetailsDraft.taskNotes.trim()
        firstTask.requestStatus = actionDetailsDraft.actionProposalStatus.trim() || "-"
      }
      return next
    })
    setActionDetails((prev) =>
      prev
        ? {
            ...prev,
            action: {
              ...prev.action,
              title: actionDetailsDraft.actionTitle.trim() || "Untitled action",
              totalWeight: actionDetailsDraft.totalWeight.trim() || "0%",
            },
          }
        : null
    )
    setActionEditingField(null)
  }

  const saveTaskEdit = () => {
    if (!taskModal) return
    const updatedTask: ActionPlanTask = {
      ...taskModal.task,
      weight: taskDraft.weight.trim(),
      startDate: taskDraft.startDate.trim(),
      expectedEndDate: taskDraft.expectedEndDate.trim(),
      performanceIndicators: taskDraft.performanceIndicators.trim(),
      targetValue: taskDraft.targetValue.trim(),
      actualValueAchieved: taskDraft.actualValueAchieved.trim(),
      achievementPercentage: taskDraft.achievementPercentage.trim(),
    }

    setActionsData((prev) => {
      const next = structuredClone(prev)
      const action = next[taskModal.actionIndex]
      const t = action?.tasks?.[taskModal.taskIndex]
      if (!t) return prev
      Object.assign(t, updatedTask)
      return next
    })
    setTaskModal({ ...taskModal, task: updatedTask })
    setTaskEditingField(null)
  }

  if (!isValidSection(planSection)) {
    return <Navigate to={isRoleScoped ? `${routePrefix}/catalysts/action-plan` : "/catalysts/action-plan"} replace />
  }

  return (
    <div className="flex min-h-0 min-w-0 w-full max-w-full flex-1 flex-col overflow-x-hidden">
      <header className="mt-6 mb-0 flex min-w-0 shrink-0 items-center gap-2 bg-background px-4 pt-0 pb-0 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:pt-2">
        <SidebarTrigger className="md:hidden" />
        <Breadcrumb className="min-w-0">
          <BreadcrumbList className="min-w-0 flex-wrap">
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link to={dashboardHref} />}>Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link to={sectionHref} />}>{parentLabel}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Action plan</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="min-h-0 min-w-0 flex-1 overflow-x-hidden bg-gradient-to-b from-background via-background to-primary/[0.06] p-4 sm:p-6 lg:p-8">
        <header className="mb-8 w-full min-w-0">
          <nav
            aria-label="Breadcrumb"
            className="mb-5 inline-flex flex-wrap items-center gap-2 rounded-full bg-card/90 px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-sm ring-1 ring-border/70 backdrop-blur-sm sm:hidden sm:text-sm"
          >
            <Link to={dashboardHref} className="text-primary transition hover:text-primary/90">
              Dashboard
            </Link>
            <span className="text-muted-foreground/50" aria-hidden="true">
              /
            </span>
            <Link to={sectionHref} className="text-primary transition hover:text-primary/90">
              {parentLabel}
            </Link>
            <span className="text-muted-foreground/50" aria-hidden="true">
              /
            </span>
            <span className="text-foreground">Action plan</span>
          </nav>
          <div className="mt-1 flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-6">
            <div
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary text-primary-foreground shadow-lg shadow-primary/30"
              aria-hidden="true"
            >
              <svg className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664v.75h-4.5M4.5 15.75v-2.25m0 0h15m-15 0H3m9.75 0H9m9.75 0H15"
                />
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Action plan</h1>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                Track actions, task ownership, resources, and delivery dates.
              </p>
            </div>
          </div>
        </header>

        <section
          className="mb-8 max-w-full min-w-0 overflow-hidden rounded-3xl border border-border bg-card shadow-ap-soft ring-1 ring-border/50"
          aria-labelledby="action-plan-glance-heading"
        >
          <div className="relative flex flex-wrap items-center justify-between gap-4 border-b border-primary/25 bg-gradient-to-r from-primary via-primary to-chart-5 px-5 py-4 sm:px-6">
            <div
              className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary-foreground/12 via-transparent to-transparent"
              aria-hidden="true"
            />
            <div className="relative">
              <h2
                id="action-plan-glance-heading"
                className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary-foreground/85"
              >
                Overview
              </h2>
              <p className="mt-1 text-sm font-semibold text-primary-foreground">
                Objective execution · weighted actions &amp; tasks
              </p>
            </div>
            <div className="relative flex flex-wrap gap-2">
              <span className="rounded-md bg-primary-foreground/20 px-2.5 py-1 text-xs font-bold tabular-nums text-primary-foreground">
                {actionsData.length === 1 ? "1 action" : `${actionsData.length} actions`}
              </span>
              <span className="rounded-md bg-primary-foreground/20 px-2.5 py-1 text-xs font-bold tabular-nums text-primary-foreground">
                {glance.totalTasks === 1 ? "1 task" : `${glance.totalTasks} tasks`}
              </span>
            </div>
          </div>
          <div className="grid min-w-0 max-w-full divide-y divide-border bg-muted/50 sm:grid-cols-2 xl:grid-cols-4 xl:divide-x xl:divide-y-0">
            <div className="p-5 sm:p-6 xl:col-span-2" role="group" aria-label="Task status">
              <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Task status</p>
              {glance.totalTasks === 0 ? (
                <div className="mt-3 flex h-6 min-h-[1.5rem] items-center justify-center rounded-full bg-muted text-[11px] text-muted-foreground ring-1 ring-border/80">
                  No tasks
                </div>
              ) : (
                <div className="mt-3 h-2 overflow-hidden rounded-full ring-1 ring-border/70">
                  <HorizontalRatioStack
                    segments={glance.order
                      .map((key) => {
                        const n = glance.buckets[key].names.length
                        if (n === 0) return null
                        const fillClass =
                          key === "in_progress"
                            ? TASK_STATUS_BAR_FILLS.in_progress
                            : key === "completed"
                              ? TASK_STATUS_BAR_FILLS.completed
                              : TASK_STATUS_BAR_FILLS.not_started
                        return {
                          ratio: n,
                          className: fillClass,
                          title: `${glance.buckets[key].label}: ${n}`,
                        }
                      })
                      .filter((x): x is NonNullable<typeof x> => x != null)}
                  />
                </div>
              )}
              <div className="mt-4 space-y-4">
                {glance.totalTasks === 0 ? (
                  <p className="mt-2 text-[11px] text-muted-foreground">No tasks in this objective.</p>
                ) : (
                  glance.order.map((key) => {
                    const info = glance.buckets[key]
                    if (!info.names.length) return null
                    return (
                      <div key={key}>
                        <p className="flex flex-wrap items-center gap-2 text-[11px] font-semibold text-foreground">
                          <span
                            className={cn(
                              "h-2 w-2 shrink-0 rounded-sm",
                              key === "in_progress"
                                ? "bg-amber-400"
                                : key === "completed"
                                  ? "bg-emerald-500"
                                  : "bg-slate-300"
                            )}
                          />
                          {info.label}{" "}
                          <span className="font-normal text-muted-foreground">({info.names.length})</span>
                        </p>
                        <ul className="mt-1.5 list-none space-y-1 pl-4 text-[11px] leading-snug text-muted-foreground">
                          {info.names.map((name) => (
                            <li key={name}>· {name}</li>
                          ))}
                        </ul>
                      </div>
                    )
                  })
                )}
              </div>
            </div>
            <div className="p-5 sm:p-6" role="group" aria-label="Total achievement">
              <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Total achievement</p>
              <p className="mt-2 text-4xl font-bold tabular-nums text-emerald-700 dark:text-emerald-400">
                {glance.objAch != null ? `${glance.objAch}%` : "-"}
              </p>
              <div className="mt-2">
                <EmeraldGradientPercentBar percent={glance.objAch != null ? glance.objAch : 0} />
              </div>
              <div className="mt-4 min-w-0">
                {glance.objAch == null ? (
                  <p className="text-xs text-muted-foreground">-</p>
                ) : (
                  <div className="space-y-2.5">
                    {actionsData.map((action, idx) => {
                      const achStr = aggregateActionAchievementPercent(action.tasks || [])
                      const achM = achStr?.match(/(\d+(?:\.\d+)?)/)
                      const achNum = achM ? parseFloat(achM[1]) : null
                      return (
                        <div key={`${action.title}-${idx}`} className={cn("rounded-xl border", ACHIEVEMENT_CARD_SURFACE)}>
                          <div className="flex flex-wrap items-start justify-between gap-1.5 gap-y-0">
                            <div className="min-w-0 flex-1">
                              <p className="text-[10px] font-bold uppercase tracking-wide text-emerald-800/70 dark:text-emerald-300/75">
                                Action {idx + 1}
                              </p>
                              <p className="mt-0.5 line-clamp-2 text-[11px] font-semibold leading-snug text-slate-800 dark:text-foreground">
                                {action.title || "Untitled"}
                              </p>
                            </div>
                            <p className="shrink-0 text-right text-sm font-bold tabular-nums text-emerald-700 dark:text-emerald-400">
                              {achStr || "-"}
                            </p>
                          </div>
                          <div className="mt-2 flex items-center gap-2">
                            <AchievementSolidMiniBar
                              percent={achNum != null ? achNum : 0}
                              shadeIdx={idx}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
            <div className="p-5 sm:p-6" role="group" aria-label="Schedule">
              <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">About to start</p>
              <p className="mt-2 text-2xl font-bold tabular-nums text-foreground">
                {glance.firstStartIso ? formatDate(glance.firstStartIso) : "-"}
              </p>
              <div className="mt-1.5 space-y-1">
                {glance.tasksOnFirstStart.length === 0 ? (
                  <p className="text-sm font-medium text-muted-foreground">-</p>
                ) : (
                  glance.tasksOnFirstStart.map((r, i) => (
                    <p key={r.name} className="flex items-center gap-2 text-sm font-semibold leading-snug text-foreground">
                      <span
                        className={cn("h-1.5 w-1.5 shrink-0 rounded-full", WEIGHT_LEGEND_BG[i % WEIGHT_LEGEND_BG.length])}
                        aria-hidden
                      />
                      <span className="min-w-0">{r.name}</span>
                    </p>
                  ))
                )}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {glance.startRowsLength === 0
                  ? "No tasks will start soon"
                  : glance.tasksOnFirstStart.length === 1
                    ? "Next start date · 1 task"
                    : `Next start date · ${glance.tasksOnFirstStart.length} tasks`}
              </p>
              <p className="mt-3 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">About to end</p>
              <div className="mt-1 space-y-1.5">
                {glance.openEnding.length === 0 ? (
                  <p className="text-[11px] font-medium text-muted-foreground">-</p>
                ) : (
                  glance.openEnding.slice(0, 6).map((x, i) => (
                    <p key={x.name + x.iso} className="flex items-center gap-2 text-[11px] font-medium leading-snug text-foreground">
                      <span
                        className={cn("h-1.5 w-1.5 shrink-0 rounded-full", WEIGHT_LEGEND_BG[i % WEIGHT_LEGEND_BG.length])}
                        aria-hidden
                      />
                      <span className="min-w-0">
                        {x.name} · ends {formatDate(x.iso || "")}
                      </span>
                    </p>
                  ))
                )}
                {glance.openEnding.length > 6 ? (
                  <p className="text-[10px] text-muted-foreground">
                    and {glance.openEnding.length - 6} more open task(s) with end dates…
                  </p>
                ) : null}
              </div>
              
            </div>
            <div
              className="border-t border-border bg-gradient-to-b from-background to-muted/40 px-4 py-3 sm:px-5 sm:py-4 sm:col-span-2 xl:col-span-4 xl:border-t xl:border-border"
              role="group"
              aria-label="Action weight distribution"
            >
              <div className="flex flex-wrap items-end justify-between gap-1.5">
                <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Action weight balance</p>
                <p className="text-[11px] font-medium tabular-nums text-muted-foreground">
                  {actionsData.length > 0
                    ? (() => {
                        const rounded = Math.round(glance.weightSumParsed * 10) / 10
                        return `Declared weights sum to ${rounded % 1 === 0 ? Math.round(rounded) : rounded}% · share of objective`
                      })()
                    : ""}
                </p>
              </div>
              {actionsData.length > 0 ? (
                <>
                  <div
                    className="mt-2 h-2 w-full min-w-0 overflow-hidden rounded-full bg-muted/80 shadow-inner ring-1 ring-border/80"
                    role="img"
                    aria-hidden="true"
                  >
                    <HorizontalRatioStack
                      segments={glance.weightSegs.map((w) => ({
                        ratio: glance.weightSumParsed > 0 ? w.pct : 1,
                        className: WEIGHT_BAR_FILLS[w.i % WEIGHT_BAR_FILLS.length],
                        title: `${w.title} - ${w.pct}%`,
                      }))}
                    />
                  </div>
                  <div className="mt-2 grid gap-2 sm:grid-cols-2">
                    {glance.weightSegs.map((w, idx) => {
                      const bgClass = WEIGHT_LEGEND_BG[w.i % WEIGHT_LEGEND_BG.length]
                      const textClass = WEIGHT_LABEL_TEXT[w.i % WEIGHT_LABEL_TEXT.length]
                      return (
                        <div
                          key={`leg-${w.i}-${idx}`}
                          className="flex min-w-0 gap-2 rounded-xl border border-border bg-card p-2 shadow-sm ring-1 ring-border/60"
                        >
                          <div
                            className={cn("mt-0.5 h-7 w-1 shrink-0 rounded-full shadow-sm", bgClass)}
                            aria-hidden="true"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                              Action {idx + 1}
                            </p>
                            <p className="mt-0.5 text-xs font-semibold leading-snug text-foreground sm:text-sm">{w.title}</p>
                            <p className={cn("mt-1 text-base font-bold leading-none tabular-nums", textClass)}>
                              {w.pct}%
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </>
              ) : null}
            </div>
          </div>
        </section>

        <div className="w-full min-w-0">
          <div
            className="relative overflow-hidden rounded-3xl bg-card shadow-ap-soft ring-1 ring-border/60"
            aria-labelledby="ap-heading"
          >
            <div className="pointer-events-none absolute -right-24 -top-24 h-64 rounded-full bg-primary/12 blur-3xl" aria-hidden="true" />
            <div className="pointer-events-none absolute -bottom-32 -left-20 h-56 rounded-full bg-chart-3/15 blur-3xl" aria-hidden="true" />
            <div className="relative border-b border-border bg-gradient-to-r from-muted/95 via-background to-primary/10 px-6 py-8 sm:px-10 sm:py-10">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between lg:gap-10">
                <div className="flex min-w-0 flex-1 gap-4 sm:gap-5">
                  <div
                    className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-chart-5 text-primary-foreground shadow-lg shadow-primary/25 sm:flex"
                    aria-hidden="true"
                  >
                    <svg className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664v.75h-4.5M4.5 15.75v-2.25m0 0h15m-15 0H3m9.75 0H9m9.75 0H15"
                      />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[oklch(0.70_0.18_47)]">
                      Operational objective
                    </p>
                    <h1
                      id="ap-heading"
                      className="mt-1.5 text-2xl font-bold leading-tight tracking-tight text-foreground sm:text-3xl lg:text-[1.85rem] lg:leading-snug"
                    >
                      {headingText}
                    </h1>
                    <p className="mt-3 max-w-3xl border-l-2 border-[oklch(0.70_0.18_47)] pl-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
                      {objectiveLead}
                    </p>
                    <ProposedByBlock
                      name={resolved?.proposedByName}
                      department={resolved?.proposedByDepartment}
                      subUnit={resolved?.proposedBySubUnit}
                      fullBold
                      className="mt-3 max-w-3xl pl-4"
                    />
                  </div>
                </div>
                <div className="shrink-0 lg:pt-8">
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-wide text-muted-foreground lg:text-right">
                    Objective status
                  </p>
                  <span
                    className={cn(
                      "inline-flex shrink-0 items-center gap-2 rounded-xl border-0 px-3 py-2 text-left text-xs font-semibold leading-snug sm:text-sm",
                      actionPlanObjectiveStatusSurfaceClass(status)
                    )}
                    aria-label={`Objective status: ${status}`}
                  >
                    <span className="mt-0.5 h-2 w-2 shrink-0 self-start rounded-full bg-current opacity-70" aria-hidden />
                    <span className="max-w-[18rem]">{status}</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="relative bg-gradient-to-b from-muted/40 to-background px-6 py-8 sm:px-10 sm:py-10">
              <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-border/60 bg-card/90 p-5 shadow-sm ring-1 ring-border/80 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                <div className="flex min-w-0 flex-1 items-start gap-4">
                  <span
                    className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-foreground text-background shadow-md"
                    aria-hidden="true"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                      />
                    </svg>
                  </span>
                  <div className="min-w-0">
                    <h2 className="text-lg font-bold text-foreground sm:text-xl">Actions &amp; tasks</h2>
                    <p className="mt-1 max-w-xl text-sm leading-relaxed text-muted-foreground">
                      Actions define key initiatives under each objective, and tasks break them down into executable steps with timelines and resources
                    </p>
                  </div>
                </div>
                <div className="flex w-full shrink-0 flex-col gap-2 sm:w-auto sm:flex-row sm:items-center sm:gap-3">
                  <Link
                    to={`${parentPath}/add-action`}
                    className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-xl border border-transparent bg-[oklch(0.22_0.04_265)] px-4 py-2.5 text-sm font-semibold text-[oklch(0.965_0.003_250)] shadow-sm transition hover:bg-[oklch(0.30_0.05_265)] hover:text-[oklch(0.99_0_0)] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/35 focus-visible:ring-offset-2 sm:w-auto dark:border-white/15 dark:bg-[oklch(0.32_0.06_265)] dark:text-[oklch(0.96_0.003_250)] dark:hover:bg-[oklch(0.42_0.07_265)] dark:hover:text-[oklch(0.99_0_0)]"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Add action
                  </Link>
                  <div className="rounded-xl bg-muted/90 px-4 py-2.5 text-center text-sm font-semibold text-foreground ring-1 ring-border/60 sm:text-left">
                    {actionsData.length} actions · {totalTaskCount} tasks
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:gap-8">
                {actionsData.map((action, actionIndex) => (
                  <ActionCard
                    key={`action-${actionIndex}-${action.title}`}
                    action={action}
                    actionIndex={actionIndex}
                    onViewActionDetails={() => openActionDetails(action, actionIndex)}
                    onDeleteAction={() => {
                      if (!confirm("Remove this action and all of its tasks?")) return
                      setActionsData((prev) => prev.filter((_, i) => i !== actionIndex))
                      closeTaskModal()
                      setActionDetails(null)
                    }}
                    onAddTask={() => {
                      navigate(addTaskHref)
                    }}
                    onUpdateActionMetrics={(changes) => {
                      setActionsData((prev) => {
                        const next = structuredClone(prev)
                        const current = next[actionIndex]
                        if (!current) return prev
                        if (typeof changes.totalWeight === "string") current.totalWeight = changes.totalWeight
                        if (typeof changes.totalAchievement === "string") current.totalAchievement = changes.totalAchievement
                        return next
                      })
                    }}
                    onOpenTask={(task, taskIndex) => openTaskModal(task, taskIndex, actionIndex, action)}
                    onDeleteTask={(taskIndex) => {
                      if (!confirm("Remove this task from the action?")) return
                      setActionsData((prev) => {
                        const next = structuredClone(prev)
                        next[actionIndex]?.tasks?.splice(taskIndex, 1)
                        return next
                      })
                      closeTaskModal()
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Dialog
        open={taskModal != null}
        onOpenChange={(open) => {
          if (!open) closeTaskModal()
        }}
      >
        {taskModal ? (
          <DialogContent
            className="flex max-h-[min(90vh,42rem)] w-full max-w-[calc(100%-2rem)] flex-col gap-0 overflow-hidden rounded-2xl bg-white p-0 text-zinc-950 ring-1 ring-border/80 sm:max-w-lg dark:bg-white dark:text-zinc-950"
            showCloseButton
          >
            <DialogHeader className="shrink-0 gap-0 border-b border-border bg-white px-5 py-4 text-left sm:px-6">
              <DialogTitle className="text-base font-bold sm:text-lg">
                Task {taskModal.taskIndex + 1} · Action {taskModal.actionIndex + 1}
                {taskModal.action.title ? ` - ${taskModal.action.title}` : ""}
              </DialogTitle>
            </DialogHeader>
            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4 sm:px-6 sm:py-5">
              <div className="grid min-w-0 grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-x-3 sm:gap-y-2">
                <FieldCell
                  label="Weight"
                  value={taskDraft.weight}
                  mode="metric"
                  editing={taskEditingField === "weight"}
                  editValue={taskDraft.weight}
                  onEditValueChange={(next) => setTaskDraft((prev) => ({ ...prev, weight: next }))}
                  onEdit={() => setTaskEditingField("weight")}
                  onCancelEdit={() => setTaskEditingField(null)}
                />
                <FieldCell
                  label="Start date"
                  value={formatDate(taskDraft.startDate)}
                  editing={taskEditingField === "startDate"}
                  editValue={taskDraft.startDate}
                  onEditValueChange={(next) => setTaskDraft((prev) => ({ ...prev, startDate: next }))}
                  onEdit={() => setTaskEditingField("startDate")}
                  onCancelEdit={() => setTaskEditingField(null)}
                />
                <FieldCell
                  label="Expected end date"
                  value={formatDate(taskDraft.expectedEndDate)}
                  editing={taskEditingField === "expectedEndDate"}
                  editValue={taskDraft.expectedEndDate}
                  onEditValueChange={(next) => setTaskDraft((prev) => ({ ...prev, expectedEndDate: next }))}
                  onEdit={() => setTaskEditingField("expectedEndDate")}
                  onCancelEdit={() => setTaskEditingField(null)}
                />
                <FieldCell
                  label="Performance indicators"
                  value={taskDraft.performanceIndicators}
                  wide
                  multiline
                  editing={taskEditingField === "performanceIndicators"}
                  editValue={taskDraft.performanceIndicators}
                  onEditValueChange={(next) => setTaskDraft((prev) => ({ ...prev, performanceIndicators: next }))}
                  onEdit={() => setTaskEditingField("performanceIndicators")}
                  onCancelEdit={() => setTaskEditingField(null)}
                />
                <FieldCell
                  label="Target value"
                  value={taskDraft.targetValue}
                  editing={taskEditingField === "targetValue"}
                  editValue={taskDraft.targetValue}
                  onEditValueChange={(next) => setTaskDraft((prev) => ({ ...prev, targetValue: next }))}
                  onEdit={() => setTaskEditingField("targetValue")}
                  onCancelEdit={() => setTaskEditingField(null)}
                />
                <FieldCell
                  label="Actual value achieved"
                  value={taskDraft.actualValueAchieved}
                  editing={taskEditingField === "actualValueAchieved"}
                  editValue={taskDraft.actualValueAchieved}
                  onEditValueChange={(next) => setTaskDraft((prev) => ({ ...prev, actualValueAchieved: next }))}
                  onEdit={() => setTaskEditingField("actualValueAchieved")}
                  onCancelEdit={() => setTaskEditingField(null)}
                />
                <FieldCell
                  label="Achievement percentage"
                  value={taskDraft.achievementPercentage}
                  mode="metric"
                  editing={taskEditingField === "achievementPercentage"}
                  editValue={taskDraft.achievementPercentage}
                  onEditValueChange={(next) => setTaskDraft((prev) => ({ ...prev, achievementPercentage: next }))}
                  onEdit={() => setTaskEditingField("achievementPercentage")}
                  onCancelEdit={() => setTaskEditingField(null)}
                />
              </div>
            </div>
            <div className="shrink-0 border-t border-border bg-white px-5 py-3 sm:px-6">
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  className="h-auto min-h-8 flex-1 rounded-xl px-4 py-2 text-xs font-semibold shadow-md sm:flex-none sm:w-24"
                  onClick={saveTaskEdit}
                  disabled={taskEditingField == null}
                >
                  Save
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="h-auto min-h-8 flex-1 rounded-xl border-0 px-4 py-2 text-xs font-semibold shadow-md sm:flex-none sm:w-24"
                  onClick={() => {
                    setTaskEditingField(null)
                    setTaskDraft({
                      weight: taskModal.task.weight || "",
                      startDate: taskModal.task.startDate || "",
                      expectedEndDate: taskModal.task.expectedEndDate || "",
                      performanceIndicators: taskModal.task.performanceIndicators || "",
                      targetValue: taskModal.task.targetValue || "",
                      actualValueAchieved: taskModal.task.actualValueAchieved || "",
                      achievementPercentage: taskModal.task.achievementPercentage || "",
                    })
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        ) : null}
      </Dialog>

      <Dialog
        open={actionDetails != null}
        onOpenChange={(open) => {
          if (!open) {
            setActionDetails(null)
            setActionEditingField(null)
          }
        }}
      >
        {actionDetails ? (
          <DialogContent
            className="flex max-h-[min(90vh,42rem)] w-full max-w-[calc(100%-2rem)] flex-col gap-0 overflow-hidden rounded-2xl bg-white p-0 text-zinc-950 ring-1 ring-border/80 sm:max-w-lg dark:bg-white dark:text-zinc-950"
            showCloseButton
          >
            <DialogHeader className="shrink-0 gap-0 border-b border-border bg-white px-5 py-4 text-left sm:px-6">
              <DialogTitle className="text-base font-bold">
                Action {actionDetails.index + 1} - {actionDetails.action.title || "Untitled action"}
              </DialogTitle>
            </DialogHeader>
            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4 sm:px-6 sm:py-5">
              <div className="grid min-w-0 grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-x-3 sm:gap-y-2">
                <FieldCell label="Action title" value={actionDetailsDraft.actionTitle} editing={actionEditingField === "actionTitle"} editValue={actionDetailsDraft.actionTitle} onEditValueChange={(next) => setActionDetailsDraft((d) => ({ ...d, actionTitle: next }))} onEdit={() => setActionEditingField("actionTitle")} onCancelEdit={() => setActionEditingField(null)} />
                <FieldCell label="Main entity" value={actionDetailsDraft.taskMainEntity} editing={actionEditingField === "taskMainEntity"} editValue={actionDetailsDraft.taskMainEntity} onEditValueChange={(next) => setActionDetailsDraft((d) => ({ ...d, taskMainEntity: next }))} onEdit={() => setActionEditingField("taskMainEntity")} onCancelEdit={() => setActionEditingField(null)} />
                <FieldCell label="Supporting entities" value={actionDetailsDraft.taskSupportingEntities} editing={actionEditingField === "taskSupportingEntities"} editValue={actionDetailsDraft.taskSupportingEntities} onEditValueChange={(next) => setActionDetailsDraft((d) => ({ ...d, taskSupportingEntities: next }))} onEdit={() => setActionEditingField("taskSupportingEntities")} onCancelEdit={() => setActionEditingField(null)} />
                <FieldCell label="Action contribution percentage" value={actionDetailsDraft.taskActionContributionPercentage} editing={actionEditingField === "taskActionContributionPercentage"} editValue={actionDetailsDraft.taskActionContributionPercentage} onEditValueChange={(next) => setActionDetailsDraft((d) => ({ ...d, taskActionContributionPercentage: next }))} onEdit={() => setActionEditingField("taskActionContributionPercentage")} onCancelEdit={() => setActionEditingField(null)} />
                <FieldCell label="Status" value={actionDetailsDraft.taskStatus} editing={actionEditingField === "taskStatus"} editValue={actionDetailsDraft.taskStatus} onEditValueChange={(next) => setActionDetailsDraft((d) => ({ ...d, taskStatus: next }))} onEdit={() => setActionEditingField("taskStatus")} onCancelEdit={() => setActionEditingField(null)} />
                <FieldCell label="Action proposal status" value={actionDetailsDraft.actionProposalStatus} editing={actionEditingField === "actionProposalStatus"} editValue={actionDetailsDraft.actionProposalStatus} onEditValueChange={(next) => setActionDetailsDraft((d) => ({ ...d, actionProposalStatus: next }))} onEdit={() => setActionEditingField("actionProposalStatus")} onCancelEdit={() => setActionEditingField(null)} />
                <FieldCell label="Human resources required" value={actionDetailsDraft.taskHumanResources} wide multiline editing={actionEditingField === "taskHumanResources"} editValue={actionDetailsDraft.taskHumanResources} onEditValueChange={(next) => setActionDetailsDraft((d) => ({ ...d, taskHumanResources: next }))} onEdit={() => setActionEditingField("taskHumanResources")} onCancelEdit={() => setActionEditingField(null)} />
                <FieldCell label="Financial resources required" value={actionDetailsDraft.taskFinancialResources} wide multiline editing={actionEditingField === "taskFinancialResources"} editValue={actionDetailsDraft.taskFinancialResources} onEditValueChange={(next) => setActionDetailsDraft((d) => ({ ...d, taskFinancialResources: next }))} onEdit={() => setActionEditingField("taskFinancialResources")} onCancelEdit={() => setActionEditingField(null)} />
                <FieldCell label="Notes" value={actionDetailsDraft.taskNotes} wide multiline editing={actionEditingField === "taskNotes"} editValue={actionDetailsDraft.taskNotes} onEditValueChange={(next) => setActionDetailsDraft((d) => ({ ...d, taskNotes: next }))} onEdit={() => setActionEditingField("taskNotes")} onCancelEdit={() => setActionEditingField(null)} />
              </div>
            </div>
            <div className="shrink-0 border-t border-border bg-white px-5 py-3 sm:px-6">
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  className="h-auto min-h-8 flex-1 rounded-xl px-4 py-2 text-xs font-semibold shadow-md sm:flex-none sm:w-24"
                  onClick={saveActionDetails}
                  disabled={actionEditingField == null}
                >
                  Save
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="h-auto min-h-8 flex-1 rounded-xl border-0 px-4 py-2 text-xs font-semibold shadow-md sm:flex-none sm:w-24"
                  onClick={() => {
                    if (!actionDetails) return
                    const firstTask = actionDetails.action.tasks?.[0]
                    setActionDetailsDraft({
                      actionTitle: actionDetails.action.title || "",
                      totalWeight: actionDetails.action.totalWeight || "",
                      taskMainEntity: firstTask?.mainEntity || "",
                      taskSupportingEntities: firstTask?.supportingEntities || "",
                      taskHumanResources: firstTask?.humanResources || "",
                      taskFinancialResources: firstTask?.financialResources || "",
                      taskActionContributionPercentage: firstTask?.actionContributionPercentage || "",
                      taskStatus: firstTask?.status || "Not started",
                      taskNotes: firstTask?.notes || "",
                      actionProposalStatus: firstTask?.requestStatus || "-",
                    })
                    setActionEditingField(null)
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        ) : null}
      </Dialog>
    </div>
  )
}

function ActionCard({
  action,
  actionIndex,
  onViewActionDetails,
  onDeleteAction,
  onAddTask,
  onUpdateActionMetrics,
  onOpenTask,
  onDeleteTask,
}: {
  action: ActionPlanAction
  actionIndex: number
  onViewActionDetails: () => void
  onDeleteAction: () => void
  onAddTask: () => void
  onUpdateActionMetrics: (changes: { totalWeight?: string; totalAchievement?: string }) => void
  onOpenTask: (task: ActionPlanTask, taskIndex: number) => void
  onDeleteTask: (taskIndex: number) => void
}) {
  const tasks = action.tasks || []
  const weightDisplay = action.totalWeight || sumTaskWeightsPercent(tasks) || "-"
  const achievementDisplay =
    action.totalAchievement != null && action.totalAchievement !== ""
      ? String(action.totalAchievement)
      : aggregateActionAchievementPercent(tasks) || "-"
  const actionProposalStatus = tasks[0]?.requestStatus?.trim() || "-"
  const [editingMetric, setEditingMetric] = useState<"weight" | "achievement" | null>(null)
  const [metricDraft, setMetricDraft] = useState({ weight: action.totalWeight || "", achievement: String(action.totalAchievement || "") })

  useEffect(() => {
    setMetricDraft({
      weight: action.totalWeight || "",
      achievement: String(action.totalAchievement || ""),
    })
  }, [action.totalWeight, action.totalAchievement])

  const saveMetric = (metric: "weight" | "achievement") => {
    if (metric === "weight") {
      onUpdateActionMetrics({ totalWeight: metricDraft.weight.trim() })
    } else {
      onUpdateActionMetrics({ totalAchievement: metricDraft.achievement.trim() })
    }
    setEditingMetric(null)
  }

  return (
    <section
      className={cn(
        "overflow-hidden rounded-2xl border border-slate-200/70 bg-gradient-to-b from-white via-white to-slate-50/25 shadow-md ring-1 ring-slate-200/35 transition duration-300 hover:shadow-lg"
      )}
      aria-labelledby={`ap-action-${actionIndex}`}
    >
      <div className="flex flex-col items-start gap-3 border-b border-orange-100/60 bg-gradient-to-b from-orange-50/45 via-white to-white px-4 py-4 sm:gap-4 sm:px-6">
        <div className="flex w-full min-w-0 flex-col gap-3 sm:flex-row sm:items-start">
          <span
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-foreground text-sm font-bold text-background shadow-md"
            aria-hidden="true"
          >
            {actionIndex + 1}
          </span>
          <div className="min-w-0 w-full">
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">Action</p>
            <div className="mt-0.5 flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between lg:gap-3">
              <h2 id={`ap-action-${actionIndex}`} className="min-w-0 flex-1 text-base font-bold leading-snug text-foreground sm:text-lg">
                {action.title || "Untitled action"}
              </h2>
              <div className="flex w-full min-w-0 shrink-0 flex-col gap-2 lg:w-auto lg:flex-row lg:flex-wrap lg:items-stretch lg:justify-end lg:gap-2">
                <div className="inline-flex w-full min-w-0 items-center gap-1.5 rounded-xl border-0 proposal-stat-label-bg-chart-4 px-3 py-2 text-xs shadow-sm lg:w-auto lg:py-1.5 lg:text-sm">
                  <span className="font-semibold text-[oklch(0.55_0.015_255)]">Total weight</span>
                  {editingMetric === "weight" ? (
                    <>
                      <Input
                        value={metricDraft.weight}
                        onChange={(e) => setMetricDraft((d) => ({ ...d, weight: e.target.value }))}
                        className="h-7 w-24 border-[oklch(0.55_0.015_255)] px-2 text-[11px] text-[oklch(0.55_0.015_255)] focus-visible:border-[oklch(0.55_0.015_255)] focus-visible:ring-[oklch(0.55_0.015_255)]/35"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-xs"
                        className="text-[oklch(0.55_0.015_255)] hover:bg-muted/50 hover:text-[oklch(0.55_0.015_255)]"
                        onClick={() => saveMetric("weight")}
                        aria-label="Save total weight edit"
                      >
                        <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.704 5.29a1 1 0 010 1.415l-7.37 7.37a1 1 0 01-1.414 0L3.296 9.45a1 1 0 111.415-1.414l3.916 3.915 6.662-6.66a1 1 0 011.415 0z" clipRule="evenodd" /></svg>
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-xs"
                        className="text-[oklch(0.55_0.015_255)] hover:bg-muted/50 hover:text-[oklch(0.55_0.015_255)]"
                        onClick={() => setEditingMetric(null)}
                        aria-label="Cancel total weight edit"
                      >
                        <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                      </Button>
                    </>
                  ) : (
                    <>
                      <span className="font-bold tabular-nums text-[oklch(0.55_0.015_255)]">{weightDisplay}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-xs"
                        className="text-[oklch(0.55_0.015_255)] hover:bg-muted/50 hover:text-[oklch(0.55_0.015_255)]"
                        onClick={() => setEditingMetric("weight")}
                        aria-label="Edit total weight"
                      >
                        <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 010 2.828l-9.9 9.9a1 1 0 01-.39.242l-3 1a1 1 0 01-1.265-1.265l1-3a1 1 0 01.242-.39l9.9-9.9a2 2 0 012.828 0z" /></svg>
                      </Button>
                    </>
                  )}
                </div>
                <div className="inline-flex w-full min-w-0 items-center gap-1.5 rounded-xl border-0 proposal-stat-label-bg-chart-2 px-3 py-2 text-xs shadow-sm lg:w-auto lg:py-1.5 lg:text-sm">
                  <span className="font-semibold text-[oklch(0.55_0.015_255)]">Total achievement</span>
                  {editingMetric === "achievement" ? (
                    <>
                      <Input
                        value={metricDraft.achievement}
                        onChange={(e) => setMetricDraft((d) => ({ ...d, achievement: e.target.value }))}
                        className="h-7 w-24 border-[oklch(0.55_0.015_255)] px-2 text-[11px] text-[oklch(0.55_0.015_255)] focus-visible:border-[oklch(0.55_0.015_255)] focus-visible:ring-[oklch(0.55_0.015_255)]/35"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-xs"
                        className="text-[oklch(0.55_0.015_255)] hover:bg-muted/50 hover:text-[oklch(0.55_0.015_255)]"
                        onClick={() => saveMetric("achievement")}
                        aria-label="Save total achievement edit"
                      >
                        <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.704 5.29a1 1 0 010 1.415l-7.37 7.37a1 1 0 01-1.414 0L3.296 9.45a1 1 0 111.415-1.414l3.916 3.915 6.662-6.66a1 1 0 011.415 0z" clipRule="evenodd" /></svg>
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-xs"
                        className="text-[oklch(0.55_0.015_255)] hover:bg-muted/50 hover:text-[oklch(0.55_0.015_255)]"
                        onClick={() => setEditingMetric(null)}
                        aria-label="Cancel total achievement edit"
                      >
                        <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                      </Button>
                    </>
                  ) : (
                    <>
                      <span className="font-bold tabular-nums text-[oklch(0.55_0.015_255)]">{achievementDisplay}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-xs"
                        className="text-[oklch(0.55_0.015_255)] hover:bg-muted/50 hover:text-[oklch(0.55_0.015_255)]"
                        onClick={() => {
                          // Prefill with the currently visible value (stored or computed).
                          setMetricDraft((d) => ({ ...d, achievement: achievementDisplay === "-" ? "" : achievementDisplay }))
                          setEditingMetric("achievement")
                        }}
                        aria-label="Edit total achievement"
                      >
                        <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 010 2.828l-9.9 9.9a1 1 0 01-.39.242l-3 1a1 1 0 01-1.265-1.265l1-3a1 1 0 01.242-.39l9.9-9.9a2 2 0 012.828 0z" /></svg>
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
            <ProposedByBlock
              density="compact"
              name={action.proposedByName}
              department={action.proposedByDepartment}
              subUnit={action.proposedBySubUnit}
              fullBold
              className="mt-2"
            />
            <p className="mt-1 text-xs font-medium text-muted-foreground">
              {tasks.length === 1 ? "1 task" : `${tasks.length} tasks`}
            </p>
            <div className="mt-2 flex min-w-0 w-full flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
              <span className="shrink-0 pt-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
                Action Proposal status
              </span>
              <div className="min-w-0 flex-1">
                <RequestStatusPill label={actionProposalStatus} />
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                className="h-auto inline-flex w-full items-center justify-center rounded-xl border-0 px-4 py-1.5 text-xs font-semibold shadow-sm transition hover:bg-accent focus-visible:ring-offset-2 sm:w-auto"
                onClick={onViewActionDetails}
              >
                View details
              </Button>
              <Button
                type="button"
                variant="default"
                className="h-auto inline-flex w-full items-center justify-center rounded-xl border-0 bg-[oklch(0.70_0.18_47)] px-3.5 py-1.5 text-xs font-semibold text-[oklch(1_0_0)] shadow-sm transition hover:bg-[oklch(0.62_0.17_47)] hover:text-[oklch(1_0_0)] focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-2 sm:w-auto dark:bg-[oklch(0.72_0.18_47)] dark:hover:bg-[oklch(0.65_0.17_47)] dark:hover:text-[oklch(1_0_0)]"
                onClick={onAddTask}
              >
                Add task
              </Button>
              <Button
                type="button"
                variant="destructive"
                className="h-auto inline-flex w-full items-center justify-center rounded-xl border-0 px-3.5 py-1.5 text-xs font-semibold shadow-sm focus-visible:ring-offset-2 sm:w-auto"
                onClick={onDeleteAction}
              >
                Delete action
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-3 bg-card p-3 lg:grid-cols-2 lg:gap-4 lg:items-start lg:p-4">
        {!tasks.length ? (
          <p className="col-span-full rounded-xl border border-dashed border-border/80 bg-card/80 px-4 py-8 text-center text-sm text-muted-foreground ring-1 ring-border/60">
            No tasks under this action yet.
          </p>
        ) : (
          tasks.map((task, taskIndex) => (
            <article
              key={`${task.name}-${taskIndex}`}
              className="group flex w-full min-w-0 flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm ring-1 ring-border/45 transition duration-300 hover:border-primary/25 hover:shadow-md"
            >
              <div className="flex items-start gap-3 px-3 pb-1 pt-3 sm:gap-3 sm:px-4 sm:pt-4">
                <div className="flex min-w-0 flex-1 items-start gap-3">
                  <span
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[oklch(0.70_0.18_47)] text-sm font-bold text-[oklch(1_0_0)] shadow-md"
                    aria-hidden="true"
                  >
                    {taskIndex + 1}
                  </span>
                  <div className="min-w-0 flex-1 pt-0.5">
                    <p className="text-[11px] font-bold text-muted-foreground">Task {taskIndex + 1}</p>
                    <h3 className="mt-0.5 line-clamp-2 text-sm font-bold text-foreground sm:text-base">
                      {task.name || "-"}
                    </h3>
                  </div>
                </div>
              </div>
              <div className="mt-2 flex min-w-0 flex-col gap-3 border-t border-border bg-card px-3 py-3 sm:mt-3 sm:px-4 sm:py-3.5">
                <div className="flex min-w-0 w-full flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                  <span className="shrink-0 pt-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
                    Task Proposal status
                  </span>
                  <div className="min-w-0 flex-1">
                    <RequestStatusPill label={task.requestStatus} />
                  </div>
                </div>
                <div className="grid min-w-0 w-full grid-cols-1 gap-2 sm:grid-cols-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="h-auto inline-flex w-full items-center justify-center rounded-xl border-0 px-4 py-2.5 text-sm font-semibold shadow-sm transition hover:bg-accent focus-visible:ring-offset-2 sm:w-auto"
                    onClick={() => onOpenTask(task, taskIndex)}
                  >
                    View details
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    className="h-auto inline-flex w-full items-center justify-center rounded-xl border-0 px-4 py-2.5 text-sm font-semibold shadow-sm focus-visible:ring-offset-2 sm:w-auto"
                    onClick={() => onDeleteTask(taskIndex)}
                  >
                    Delete task
                  </Button>
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  )
}
