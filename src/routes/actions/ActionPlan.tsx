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
import type { ActionPlanLocationState } from "@/lib/buildActionPlanHref"
import { resolveActionPlanContext } from "@/lib/actionPlanResolve"
import {
  type ActionPlanAction,
  type ActionPlanTask,
  CHART_LABEL_TEXT,
  CHART_LEGEND_BG,
  CHART_SEGMENT_FILL,
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
import { HorizontalPercentFill, HorizontalRatioStack } from "@/components/ratio-bars"
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

const shadowLift = "shadow-sm"

function objectiveStatusButtonClass(status: string): { btn: string; dot: string } {
  const t = normalizeStatus(status)
  const base =
    "inline-flex cursor-not-allowed items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-semibold shadow-sm select-none transition disabled:opacity-100 "
  if (t.includes("not start")) {
    return {
      btn:
        base +
        "border-border bg-muted text-foreground ring-1 ring-border/60",
      dot: "h-2 w-2 shrink-0 rounded-full bg-muted-foreground ring-2 ring-border/60",
    }
  }
  if (t.includes("complete")) {
    return {
      btn:
        base +
        "border-border bg-secondary text-secondary-foreground ring-1 ring-border/60",
      dot: "h-2 w-2 shrink-0 rounded-full bg-foreground ring-2 ring-border/60",
    }
  }
  return {
    btn:
      base +
      "border-border bg-accent text-accent-foreground ring-1 ring-border/60",
    dot: "h-2 w-2 shrink-0 rounded-full bg-foreground ring-2 ring-border/60",
  }
}

function RequestStatusPill({ label }: { label: string }) {
  const text = label?.trim() ? label.trim() : "—"
  return (
    <span className="inline-flex max-w-full min-w-0 items-center rounded-xl border border-border bg-muted px-2.5 py-1.5 text-[10px] font-semibold leading-snug text-foreground ring-1 ring-border/60">
      <span className="min-w-0 break-words">{text}</span>
    </span>
  )
}

function FieldCell({
  label,
  value,
  wide,
  mode,
}: {
  label: string
  value: string
  wide?: boolean
  mode?: "default" | "metric" | "status"
}) {
  const display = value != null && value !== "" ? String(value) : "—"
  const base =
    "min-w-0 rounded-lg border px-2.5 py-2 transition duration-150 sm:px-3 sm:py-2" +
    (wide ? " sm:col-span-2" : "")
  const borderClass =
    mode === "metric"
      ? " border-border bg-accent/40 ring-1 ring-border/60 hover:border-border hover:shadow-sm"
      : " border-border bg-card ring-1 ring-border/40 hover:border-border hover:bg-muted/40 hover:shadow-sm"
  return (
    <div className={cn(base, borderClass)}>
      <p className="text-[9px] font-bold uppercase leading-tight tracking-wide text-muted-foreground">{label}</p>
      <div className="mt-1 break-words text-xs leading-snug whitespace-pre-wrap text-foreground sm:text-[13px] sm:leading-snug">
        {mode === "status" && value ? (
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
  const isContributorArea = location.pathname.startsWith("/contributor/")
  const dashboardHref = isContributorArea ? "/contributor/dashboard" : "/dashboard"
  const nav = state as ActionPlanLocationState | undefined

  const isValidSection = (s: string | undefined): s is PlanSection =>
    !!s && (PLAN_SECTIONS as readonly string[]).includes(s)

  const parentPath = (`/${planSection ?? ""}` as keyof typeof SECTION_LABELS) as `/${PlanSection}`
  const sectionHref = isContributorArea ? `/contributor${parentPath}` : parentPath
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
  const statusStyles = objectiveStatusButtonClass(status)

  const [actionsData, setActionsData] = useState<ActionPlanAction[]>(() =>
    structuredClone(initialActionsData)
  )

  const [taskModal, setTaskModal] = useState<{
    task: ActionPlanTask
    taskIndex: number
    actionIndex: number
    action: ActionPlanAction
  } | null>(null)

  const [taskEditMode, setTaskEditMode] = useState(false)

  const [actionDetails, setActionDetails] = useState<{
    action: ActionPlanAction
    index: number
  } | null>(null)

  const [actionDetailsEditMode, setActionDetailsEditMode] = useState(false)
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
      in_progress: { label: "In progress", color: "bg-muted-foreground", names: [] as string[] },
      completed: { label: "Completed", color: "bg-primary", names: [] as string[] },
      not_started: { label: "Not started", color: "bg-muted", names: [] as string[] },
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
    setTaskEditMode(false)
    setTaskModal({ task, taskIndex, actionIndex, action })
  }

  const closeTaskModal = () => {
    setTaskModal(null)
    setTaskEditMode(false)
  }

  const openActionDetails = (action: ActionPlanAction, index: number) => {
    const firstTask = action.tasks?.[0]
    setActionDetailsEditMode(false)
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
      actionProposalStatus: firstTask?.requestStatus || "—",
    })
  }

  const saveActionDetails = (e: React.FormEvent) => {
    e.preventDefault()
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
        firstTask.requestStatus = actionDetailsDraft.actionProposalStatus.trim() || "—"
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
    setActionDetailsEditMode(false)
  }

  const saveTaskEdit = () => {
    if (!taskModal) return
    const form = document.getElementById("task-inline-edit-fields") as HTMLFormElement | null
    if (!form) return
    const val = (name: string) =>
      (form.querySelector(`[name="${name}"]`) as HTMLInputElement | HTMLTextAreaElement | null)?.value.trim() ?? ""

    const updatedTask: ActionPlanTask = {
      ...taskModal.task,
      name: val("name"),
      weight: val("weight"),
      startDate: val("startDate"),
      expectedEndDate: val("expectedEndDate"),
      performanceIndicators: val("performanceIndicators"),
      targetValue: val("targetValue"),
      actualValueAchieved: val("actualValueAchieved"),
      achievementPercentage: val("achievementPercentage"),
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
    setTaskEditMode(false)
  }

  if (!isValidSection(planSection)) {
    return <Navigate to={isContributorArea ? "/contributor/catalysts/action-plan" : "/catalysts/action-plan"} replace />
  }

  return (
    <div className="flex min-h-0 min-w-0 w-full max-w-full flex-1 flex-col overflow-x-hidden">
      <header className="flex h-16 min-w-0 shrink-0 items-center gap-2 border-b border-border/60 bg-background px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
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

      <div className="min-h-0 min-w-0 flex-1 overflow-x-hidden bg-background p-4 sm:p-6 lg:p-8">
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
          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Action Plan</p>
          <p className="mt-1 text-sm text-muted-foreground">Plan and track actions, tasks, their resources, and due dates</p>
        </header>

        <section
          className={cn("mb-8 max-w-full min-w-0 overflow-hidden rounded-3xl border border-border bg-card ring-1 ring-border/40", shadowLift)}
          aria-labelledby="action-plan-glance-heading"
        >
          <div className="relative flex flex-wrap items-center justify-between gap-4 border-b border-border bg-primary px-5 py-4 sm:px-6">
            <div
              className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2760%27%20height%3D%2760%27%20viewBox%3D%270%200%2060%2060%27%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%3E%3Cg%20fill%3D%27none%27%20fill-rule%3D%27evenodd%27%3E%3Cg%20fill%3D%27%23ffffff%27%20fill-opacity%3D%270.06%27%3E%3Cpath%20d%3D%27M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%27%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-90"
              aria-hidden="true"
            />
            <div className="relative">
              <h2 id="action-plan-glance-heading" className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary-foreground/80">
                Plan Overview
              </h2>
              <p className="mt-1 text-sm font-semibold text-primary-foreground">Actions and tasks execution progress and achievement rates</p>
            </div>
            <div className="relative flex flex-wrap gap-2">
              <span className="rounded-md bg-primary-foreground/15 px-2.5 py-1 text-xs font-bold tabular-nums text-primary-foreground">
                {actionsData.length === 1 ? "1 action" : `${actionsData.length} actions`}
              </span>
              <span className="rounded-md bg-primary-foreground/15 px-2.5 py-1 text-xs font-bold tabular-nums text-primary-foreground">
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
                            ? "fill-muted-foreground"
                            : key === "completed"
                              ? "fill-primary"
                              : "fill-muted"
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
                              key === "in_progress" ? "bg-muted-foreground" : key === "completed" ? "bg-primary" : "bg-muted"
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
              <p className="mt-2 text-4xl font-bold tabular-nums text-foreground">
                {glance.objAch != null ? `${glance.objAch}%` : "—"}
              </p>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                <HorizontalPercentFill
                  percent={glance.objAch != null ? Math.min(100, Math.max(0, glance.objAch)) : 0}
                  fillClassName="fill-primary"
                  trackClassName="fill-muted"
                  className="h-full"
                />
              </div>
              <div className="mt-4 min-w-0">
                {glance.objAch == null ? (
                  <p className="text-xs text-muted-foreground">—</p>
                ) : (
                  <div className="space-y-2.5">
                    {actionsData.map((action, idx) => {
                      const achStr = aggregateActionAchievementPercent(action.tasks || [])
                      const achM = achStr?.match(/(\d+(?:\.\d+)?)/)
                      const achNum = achM ? parseFloat(achM[1]) : null
                      return (
                        <div
                          key={`${action.title}-${idx}`}
                          className="rounded-xl border border-border bg-gradient-to-br from-muted/50 to-card p-2.5 ring-1 ring-border/40"
                        >
                          <div className="flex flex-wrap items-start justify-between gap-1.5 gap-y-0">
                            <div className="min-w-0 flex-1">
                              <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                                Action {idx + 1}
                              </p>
                              <p className="mt-0.5 line-clamp-2 text-[11px] font-semibold leading-snug text-foreground">
                                {action.title || "Untitled"}
                              </p>
                            </div>
                            <p className="shrink-0 text-right text-sm font-bold tabular-nums text-foreground">
                              {achStr || "—"}
                            </p>
                          </div>
                          <div className="mt-2 flex items-center gap-2">
                            <div className="h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-muted/80">
                              <HorizontalPercentFill
                                percent={achNum != null ? Math.min(100, Math.max(0, achNum)) : 0}
                                fillClassName={CHART_SEGMENT_FILL[idx % CHART_SEGMENT_FILL.length]}
                                trackClassName="fill-muted/80"
                                className="h-full"
                              />
                            </div>
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
                {glance.firstStartIso ? formatDate(glance.firstStartIso) : "—"}
              </p>
              <div className="mt-1.5 space-y-1">
                {glance.tasksOnFirstStart.length === 0 ? (
                  <p className="text-sm font-medium text-muted-foreground">—</p>
                ) : (
                  glance.tasksOnFirstStart.map((r) => (
                    <p key={r.name} className="text-sm font-semibold leading-snug text-foreground">
                      {r.name}
                    </p>
                  ))
                )}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {glance.startRowsLength === 0
                  ? "No open tasks with a start date on or after today."
                  : glance.tasksOnFirstStart.length === 1
                    ? "Next start date · 1 task"
                    : `Next start date · ${glance.tasksOnFirstStart.length} tasks`}
              </p>
              <p className="mt-3 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">About to end</p>
              <div className="mt-1 space-y-1.5">
                {glance.openEnding.length === 0 ? (
                  <p className="text-[11px] font-medium text-muted-foreground">—</p>
                ) : (
                  glance.openEnding.slice(0, 6).map((x) => (
                    <p key={x.name + x.iso} className="text-[11px] font-medium leading-snug text-foreground">
                      {x.name} · ends {formatDate(x.iso || "")}
                    </p>
                  ))
                )}
                {glance.openEnding.length > 6 ? (
                  <p className="text-[10px] text-muted-foreground">
                    and {glance.openEnding.length - 6} more open task(s) with end dates…
                  </p>
                ) : null}
              </div>
              <p
                className={cn(
                  "mt-3 font-mono text-[11px] font-semibold",
                  glance.overdueCount === 0 ? "text-muted-foreground" : "text-destructive"
                )}
              >
                {glance.overdueCount === 0
                  ? "No overdue open tasks"
                  : glance.overdueCount === 1
                    ? "1 open task past end date"
                    : `${glance.overdueCount} open tasks past end date`}
              </p>
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
                        className: CHART_SEGMENT_FILL[w.i % CHART_SEGMENT_FILL.length],
                        title: `${w.title} — ${w.pct}%`,
                      }))}
                    />
                  </div>
                  <div className="mt-2 grid gap-2 sm:grid-cols-2">
                    {glance.weightSegs.map((w, idx) => {
                      const bgClass = CHART_LEGEND_BG[w.i % CHART_LEGEND_BG.length]
                      const textClass = CHART_LABEL_TEXT[w.i % CHART_LABEL_TEXT.length]
                      return (
                        <div
                          key={`leg-${w.i}-${idx}`}
                          className="flex min-w-0 gap-2 rounded-xl border border-border/80 bg-card p-2 shadow-sm ring-1 ring-border/60"
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
          <div className={cn("relative overflow-hidden rounded-3xl bg-card ring-1 ring-border/60", shadowLift)} aria-labelledby="ap-heading">
            <div className="pointer-events-none absolute -right-24 -top-24 h-64 rounded-full bg-primary/10 blur-3xl" aria-hidden="true" />
            <div className="pointer-events-none absolute -bottom-32 -left-20 h-56 rounded-full bg-muted/30 blur-3xl" aria-hidden="true" />
            <div className="relative border-b border-border bg-gradient-to-r from-muted/95 via-background to-muted/30 px-6 py-8 sm:px-10 sm:py-10">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between lg:gap-10">
                <div className="flex min-w-0 flex-1 gap-4 sm:gap-5">
                  <div
                    className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg sm:flex"
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
                    <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
                      Operational objective
                    </p>
                    <h1
                      id="ap-heading"
                      className="mt-1.5 text-2xl font-bold leading-tight tracking-tight text-foreground sm:text-3xl lg:text-[1.85rem] lg:leading-snug"
                    >
                      {headingText}
                    </h1>
                    <p className="mt-3 max-w-3xl border-l-2 border-primary/25 pl-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
                      {objectiveLead}
                    </p>
                    <ProposedByBlock
                      name={resolved?.proposedByName}
                      department={resolved?.proposedByDepartment}
                      subUnit={resolved?.proposedBySubUnit}
                      className="mt-3 max-w-3xl pl-4"
                    />
                  </div>
                </div>
                <div className="shrink-0 lg:pt-8">
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-wide text-muted-foreground lg:text-right">
                    Objective status
                  </p>
                  <Button
                    type="button"
                    variant="ghost"
                    disabled
                    className={statusStyles.btn}
                    aria-label={`Objective status: ${status}`}
                  >
                    <span className={statusStyles.dot} aria-hidden="true" />
                    <span>{status}</span>
                  </Button>
                </div>
              </div>
            </div>

            <div className="relative bg-gradient-to-b from-muted/40 to-background px-6 py-8 sm:px-10 sm:py-10">
              <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-border/60 bg-card/90 p-5 shadow-sm ring-1 ring-border/80 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                <div className="flex min-w-0 flex-1 items-start gap-4">
                  <span
                    className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md"
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
                    <h2 className="text-lg font-bold text-foreground sm:text-xl">Actions &amp; Tasks</h2>
                    <p className="mt-1 max-w-xl text-sm leading-relaxed text-muted-foreground">
                      Actions define key initiatives under each objective, and tasks break them down into executable steps with timelines and resources
                    </p>
                  </div>
                </div>
                <div className="flex w-full shrink-0 flex-col gap-2 sm:w-auto sm:flex-row sm:items-center sm:gap-3">
                  <Link
                    to={`${parentPath}/add-action`}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-secondary px-4 py-2.5 text-sm font-semibold text-secondary-foreground shadow-sm transition hover:bg-secondary/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/45 focus-visible:ring-offset-2 sm:w-auto"
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
            className="flex max-h-[min(90vh,42rem)] w-full max-w-[calc(100%-2rem)] flex-col gap-0 overflow-hidden rounded-2xl border-0 bg-card p-0 text-foreground shadow-lg ring-1 ring-border/80 sm:max-w-lg"
            showCloseButton
          >
            <DialogHeader className="shrink-0 gap-0 border-b border-border bg-gradient-to-r from-muted/90 to-background px-5 py-4 text-left sm:px-6">
              <DialogTitle className="text-base font-bold sm:text-lg">
                Task {taskModal.taskIndex + 1} · Action {taskModal.actionIndex + 1}
                {taskModal.action.title ? ` — ${taskModal.action.title}` : ""}
              </DialogTitle>
            </DialogHeader>
            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4 sm:px-6 sm:py-5">
              {!taskEditMode ? (
                <div className="grid min-w-0 grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-x-3 sm:gap-y-2">
                  <FieldCell label="Weight" value={taskModal.task.weight} mode="metric" />
                  <FieldCell label="Start date" value={formatDate(taskModal.task.startDate)} />
                  <FieldCell label="Expected end date" value={formatDate(taskModal.task.expectedEndDate)} />
                  <FieldCell label="Performance indicators" value={taskModal.task.performanceIndicators} wide />
                  <FieldCell label="Target value" value={taskModal.task.targetValue} />
                  <FieldCell label="Actual value achieved" value={taskModal.task.actualValueAchieved} />
                  <FieldCell label="Achievement percentage" value={taskModal.task.achievementPercentage} mode="metric" />
                </div>
              ) : (
                <form
                  key={`${taskModal.actionIndex}-${taskModal.taskIndex}-${taskModal.task.name}`}
                  id="task-inline-edit-fields"
                  className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2"
                >
                  <TaskEditFields task={taskModal.task} />
                </form>
              )}
            </div>
            <div className="shrink-0 border-t border-border bg-muted/80 px-5 py-3 sm:px-6">
              {!taskEditMode ? (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full rounded-xl px-4 py-2.5 text-sm font-semibold shadow-sm sm:w-auto"
                  onClick={() => setTaskEditMode(true)}
                >
                  Edit details
                </Button>
              ) : (
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    className="flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold shadow-md sm:flex-none sm:px-6"
                    onClick={saveTaskEdit}
                  >
                    Save
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold shadow-sm sm:flex-none"
                    onClick={() => {
                      setTaskEditMode(false)
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </DialogContent>
        ) : null}
      </Dialog>

      <Dialog
        open={actionDetails != null}
        onOpenChange={(open) => {
          if (!open) {
            setActionDetails(null)
            setActionDetailsEditMode(false)
          }
        }}
      >
        {actionDetails ? (
          <DialogContent
            className="flex max-h-[min(90vh,42rem)] w-full max-w-[calc(100%-2rem)] flex-col gap-0 overflow-hidden rounded-2xl border-0 bg-card p-0 text-foreground shadow-lg ring-1 ring-border/80 sm:max-w-lg"
            showCloseButton
          >
            <DialogHeader className="shrink-0 gap-0 border-b border-border bg-gradient-to-r from-muted/90 to-background px-5 py-4 text-left sm:px-6">
              <DialogTitle className="text-base font-bold">
                Action {actionDetails.index + 1} - {actionDetails.action.title || "Untitled action"}
              </DialogTitle>
            </DialogHeader>
            <form id="action-details-edit-fields" onSubmit={saveActionDetails} className="min-h-0 flex-1 space-y-3 overflow-y-auto px-5 py-4 sm:px-6 sm:py-5">
              <label className="block">
                <span className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">Action title</span>
                <Input
                  name="actionTitle"
                  value={actionDetailsDraft.actionTitle}
                  disabled={!actionDetailsEditMode}
                  onChange={(e) => setActionDetailsDraft((d) => ({ ...d, actionTitle: e.target.value }))}
                  className="mt-1 h-auto min-h-9 w-full py-2 text-sm shadow-sm"
                />
              </label>
              <label className="block">
                <span className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">Main entity</span>
                <Input
                  name="taskMainEntity"
                  value={actionDetailsDraft.taskMainEntity}
                  disabled={!actionDetailsEditMode}
                  onChange={(e) => setActionDetailsDraft((d) => ({ ...d, taskMainEntity: e.target.value }))}
                  className="mt-1 h-auto min-h-9 w-full py-2 text-sm shadow-sm"
                />
              </label>
              <label className="block">
                <span className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">Supporting entities</span>
                <Input
                  name="taskSupportingEntities"
                  value={actionDetailsDraft.taskSupportingEntities}
                  disabled={!actionDetailsEditMode}
                  onChange={(e) => setActionDetailsDraft((d) => ({ ...d, taskSupportingEntities: e.target.value }))}
                  className="mt-1 h-auto min-h-9 w-full py-2 text-sm shadow-sm"
                />
              </label>
              <label className="block">
                <span className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">Human resources required</span>
                <Textarea
                  name="taskHumanResources"
                  rows={3}
                  value={actionDetailsDraft.taskHumanResources}
                  disabled={!actionDetailsEditMode}
                  onChange={(e) => setActionDetailsDraft((d) => ({ ...d, taskHumanResources: e.target.value }))}
                  className="mt-1 min-h-[4.5rem] text-sm shadow-sm"
                />
              </label>
              <label className="block">
                <span className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">Financial resources required</span>
                <Textarea
                  name="taskFinancialResources"
                  rows={3}
                  value={actionDetailsDraft.taskFinancialResources}
                  disabled={!actionDetailsEditMode}
                  onChange={(e) => setActionDetailsDraft((d) => ({ ...d, taskFinancialResources: e.target.value }))}
                  className="mt-1 min-h-[4.5rem] text-sm shadow-sm"
                />
              </label>
              <label className="block">
                <span className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">Action contribution percentage</span>
                <Input
                  name="taskActionContributionPercentage"
                  value={actionDetailsDraft.taskActionContributionPercentage}
                  disabled={!actionDetailsEditMode}
                  onChange={(e) => setActionDetailsDraft((d) => ({ ...d, taskActionContributionPercentage: e.target.value }))}
                  className="mt-1 h-auto min-h-9 w-full py-2 text-sm shadow-sm"
                />
              </label>
              <label className="block">
                <span className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">Status</span>
                <Input
                  name="taskStatus"
                  value={actionDetailsDraft.taskStatus}
                  disabled={!actionDetailsEditMode}
                  onChange={(e) => setActionDetailsDraft((d) => ({ ...d, taskStatus: e.target.value }))}
                  className="mt-1 h-auto min-h-9 w-full py-2 text-sm shadow-sm"
                />
              </label>
              <label className="block">
                <span className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">Action proposal status</span>
                <Input
                  name="actionProposalStatus"
                  value={actionDetailsDraft.actionProposalStatus}
                  disabled={!actionDetailsEditMode}
                  onChange={(e) => setActionDetailsDraft((d) => ({ ...d, actionProposalStatus: e.target.value }))}
                  className="mt-1 h-auto min-h-9 w-full py-2 text-sm shadow-sm"
                />
              </label>
              <label className="block">
                <span className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">Notes</span>
                <Textarea
                  name="taskNotes"
                  rows={3}
                  value={actionDetailsDraft.taskNotes}
                  disabled={!actionDetailsEditMode}
                  onChange={(e) => setActionDetailsDraft((d) => ({ ...d, taskNotes: e.target.value }))}
                  className="mt-1 min-h-[4.5rem] text-sm shadow-sm"
                />
              </label>
            </form>
            <div className="shrink-0 border-t border-border bg-muted/80 px-5 py-3 sm:px-6">
              {!actionDetailsEditMode ? (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full rounded-xl px-4 py-2.5 text-sm font-semibold shadow-sm sm:w-auto"
                  onClick={() => setActionDetailsEditMode(true)}
                >
                  Edit details
                </Button>
              ) : (
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="submit"
                    form="action-details-edit-fields"
                    className="flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold shadow-md sm:flex-none sm:px-6"
                  >
                    Save
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold shadow-sm sm:flex-none"
                    onClick={() => setActionDetailsEditMode(false)}
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </DialogContent>
        ) : null}
      </Dialog>
    </div>
  )
}

function TaskEditFields({ task }: { task: ActionPlanTask }) {
  const field = (
    name: keyof ActionPlanTask,
    label: string,
    wide?: boolean,
    multiline?: boolean
  ) => (
    <label key={name} className={cn("block", wide && "sm:col-span-2")}>
      <span className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">{label}</span>
      {multiline ? (
        <Textarea
          name={name}
          rows={3}
          defaultValue={task[name] as string}
          className="mt-1 min-h-[4.5rem] text-sm shadow-sm"
        />
      ) : (
        <Input
          name={name}
          type="text"
          defaultValue={task[name] as string}
          className="mt-1 h-auto min-h-9 w-full py-2 text-sm shadow-sm"
        />
      )}
    </label>
  )
  return (
    <>
      {field("name", "Task name")}
      {field("weight", "Weight")}
      {field("startDate", "Start date (YYYY-MM-DD)")}
      {field("expectedEndDate", "Expected end date (YYYY-MM-DD)")}
      {field("performanceIndicators", "Performance indicators", true, true)}
      {field("targetValue", "Target value")}
      {field("actualValueAchieved", "Actual value achieved")}
      {field("achievementPercentage", "Achievement percentage")}
    </>
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
  const weightDisplay = action.totalWeight || sumTaskWeightsPercent(tasks) || "—"
  const achievementDisplay =
    action.totalAchievement != null && action.totalAchievement !== ""
      ? String(action.totalAchievement)
      : aggregateActionAchievementPercent(tasks) || "—"
  const actionProposalStatus = tasks[0]?.requestStatus?.trim() || "—"
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
        "relative overflow-hidden rounded-2xl border border-border/80 bg-card/80 shadow-md ring-1 ring-border/50 backdrop-blur-sm transition duration-300 hover:shadow-lg"
      )}
      aria-labelledby={`ap-action-${actionIndex}`}
    >
      <div className="absolute left-0 top-0 h-full w-1 bg-primary" aria-hidden="true" />
      <div className="pl-3 sm:pl-4">
      <div className="flex flex-col items-start gap-3 border-b border-border bg-gradient-to-b from-muted/45 via-background to-background px-4 py-4 sm:gap-4 sm:px-6">
        <div className="flex w-full min-w-0 flex-col gap-3 sm:flex-row sm:items-start">
          <span
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground shadow-md"
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
                <div className="inline-flex w-full min-w-0 items-center gap-1.5 rounded-lg border border-border bg-gradient-to-b from-muted/90 to-background px-3 py-2 text-xs shadow-sm ring-1 ring-border/70 lg:w-auto lg:py-1.5 lg:text-sm">
                  <span className="font-semibold text-muted-foreground">Total weight</span>
                  {editingMetric === "weight" ? (
                    <>
                      <Input
                        value={metricDraft.weight}
                        onChange={(e) => setMetricDraft((d) => ({ ...d, weight: e.target.value }))}
                        className="h-7 w-24 px-2 text-xs"
                      />
                      <Button type="button" variant="ghost" size="icon-xs" onClick={() => saveMetric("weight")} aria-label="Save total weight edit">
                        <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.704 5.29a1 1 0 010 1.415l-7.37 7.37a1 1 0 01-1.414 0L3.296 9.45a1 1 0 111.415-1.414l3.916 3.915 6.662-6.66a1 1 0 011.415 0z" clipRule="evenodd" /></svg>
                      </Button>
                      <Button type="button" variant="ghost" size="icon-xs" onClick={() => setEditingMetric(null)} aria-label="Cancel total weight edit">
                        <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                      </Button>
                    </>
                  ) : (
                    <>
                      <span className="font-bold tabular-nums text-foreground">{weightDisplay}</span>
                      <Button type="button" variant="ghost" size="icon-xs" onClick={() => setEditingMetric("weight")} aria-label="Edit total weight">
                        <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 010 2.828l-9.9 9.9a1 1 0 01-.39.242l-3 1a1 1 0 01-1.265-1.265l1-3a1 1 0 01.242-.39l9.9-9.9a2 2 0 012.828 0z" /></svg>
                      </Button>
                    </>
                  )}
                </div>
                <div className="inline-flex w-full min-w-0 items-center gap-1.5 rounded-lg border border-border bg-gradient-to-b from-muted/90 to-background px-3 py-2 text-xs shadow-sm ring-1 ring-border/70 lg:w-auto lg:py-1.5 lg:text-sm">
                  <span className="font-semibold text-muted-foreground">Total achievement</span>
                  {editingMetric === "achievement" ? (
                    <>
                      <Input
                        value={metricDraft.achievement}
                        onChange={(e) => setMetricDraft((d) => ({ ...d, achievement: e.target.value }))}
                        className="h-7 w-24 px-2 text-xs"
                      />
                      <Button type="button" variant="ghost" size="icon-xs" onClick={() => saveMetric("achievement")} aria-label="Save total achievement edit">
                        <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.704 5.29a1 1 0 010 1.415l-7.37 7.37a1 1 0 01-1.414 0L3.296 9.45a1 1 0 111.415-1.414l3.916 3.915 6.662-6.66a1 1 0 011.415 0z" clipRule="evenodd" /></svg>
                      </Button>
                      <Button type="button" variant="ghost" size="icon-xs" onClick={() => setEditingMetric(null)} aria-label="Cancel total achievement edit">
                        <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                      </Button>
                    </>
                  ) : (
                    <>
                      <span className="font-bold tabular-nums text-foreground">{achievementDisplay}</span>
                      <Button type="button" variant="ghost" size="icon-xs" onClick={() => setEditingMetric("achievement")} aria-label="Edit total achievement">
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
              <Button type="button" variant="outline" className="rounded-xl px-3 py-2 text-xs font-semibold shadow-sm sm:text-sm" onClick={onViewActionDetails}>
                View details
              </Button>
              <Button type="button" variant="secondary" className="rounded-xl px-3 py-2 text-xs font-semibold shadow-sm sm:text-sm" onClick={onAddTask}>
                Add task
              </Button>
              <Button type="button" variant="destructive" className="rounded-xl px-3 py-2 text-xs font-semibold shadow-sm sm:text-sm" onClick={onDeleteAction}>
                Delete action
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-3 bg-muted/20 p-3 lg:grid-cols-2 lg:gap-4 lg:items-start lg:p-4">
        {!tasks.length ? (
          <p className="col-span-full rounded-xl border border-dashed border-border/80 bg-card/80 px-4 py-8 text-center text-sm text-muted-foreground ring-1 ring-border/60">
            No tasks under this action yet.
          </p>
        ) : (
          tasks.map((task, taskIndex) => (
            <article
              key={`${task.name}-${taskIndex}`}
              className="group flex w-full min-w-0 flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm ring-1 ring-border/45 transition duration-300 hover:border-primary/30 hover:shadow-md"
            >
              <div className="flex items-start gap-3 px-3 pb-1 pt-3 sm:gap-3 sm:px-4 sm:pt-4">
                <div className="flex min-w-0 flex-1 items-start gap-3">
                  <span
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground shadow-md"
                    aria-hidden="true"
                  >
                    {taskIndex + 1}
                  </span>
                  <div className="min-w-0 flex-1 pt-0.5">
                    <p className="text-[11px] font-bold text-muted-foreground">Task {taskIndex + 1}</p>
                    <h3 className="mt-0.5 line-clamp-2 text-sm font-bold text-foreground sm:text-base">
                      {task.name || "—"}
                    </h3>
                  </div>
                </div>
              </div>
              <div className="mt-2 flex min-w-0 flex-col gap-3 border-t border-border bg-gradient-to-br from-muted/95 via-background to-muted/25 px-3 py-3 sm:mt-3 sm:px-4 sm:py-3.5">
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
                    className="min-h-[2.5rem] w-full rounded-xl px-4 py-2.5 text-sm font-semibold shadow-sm focus-visible:ring-offset-2"
                    onClick={() => onOpenTask(task, taskIndex)}
                  >
                    View details
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    className="min-h-[2.5rem] w-full rounded-xl px-4 py-2.5 text-sm font-semibold shadow-sm focus-visible:ring-offset-2"
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
      </div>
    </section>
  )
}
