import { useEffect, useMemo, useState } from "react"
import { Link, Navigate, useLocation, useParams } from "react-router-dom"
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
  ACH_COLORS,
  BAR_COLORS,
  aggregateActionAchievementPercent,
  computeObjectiveAchievementPercent,
  flattenTasksFromActions,
  formatDate,
  initialActionsData,
  newTaskTemplate,
  normalizeStatus,
  parseISODate,
  sumTaskWeightsPercent,
  taskBucket,
  taskStatusPillClass,
} from "@/routes/actionPlanModel"
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
  const { planSection } = useParams<{ planSection: string }>()
  const { state } = location
  const isContributorArea = location.pathname.startsWith("/contributor/")
  const dashboardHref = isContributorArea ? "/contributor/dashboard" : "/dashboard"
  const nav = state as ActionPlanLocationState | undefined

  const isValidSection = (s: string | undefined): s is PlanSection =>
    !!s && (PLAN_SECTIONS as readonly string[]).includes(s)

  const parentPath = (`/${planSection ?? ""}` as keyof typeof SECTION_LABELS) as `/${PlanSection}`
  const sectionHref = isContributorArea ? `/contributor${parentPath}` : parentPath
  const parentLabel = isValidSection(planSection) ? SECTION_LABELS[parentPath] ?? "Planning" : "Planning"

  const resolved = useMemo(() => {
    if (!planSection || !isValidSection(planSection) || !nav?.p) return null
    const { p, si, oi } = nav
    if (!Number.isFinite(si) || !Number.isFinite(oi)) return null
    return resolveActionPlanContext(planSection, p, si, oi)
  }, [planSection, nav])

  const sub = resolved?.subLabel ?? "C1.1"
  const perspective = resolved?.perspectiveTitle ?? "Institutional direction"
  const obj = resolved?.objDisplay ?? "1"
  const objectiveLead =
    resolved?.objectiveLead ?? "Align institutional KPIs with national quality benchmarks"
  const status = resolved?.status ?? "In progress"

  const headingText = `${sub}: ${perspective} Objective ${obj}`
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

  const [actionEdit, setActionEdit] = useState<{
    action: ActionPlanAction
    index: number
  } | null>(null)

  const [actionEditDraft, setActionEditDraft] = useState({
    actionTitle: "",
    totalWeight: "",
    totalAchievement: "",
  })

  const glance = useMemo(() => {
    const actions = actionsData
    const tasks = flattenTasksFromActions(actions)
    const totalTasks = tasks.length

    const buckets = {
      in_progress: { label: "In progress", color: "bg-amber-400", names: [] as string[] },
      completed: { label: "Completed", color: "bg-emerald-500", names: [] as string[] },
      not_started: { label: "Not started", color: "bg-slate-300", names: [] as string[] },
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

  const openActionEdit = (action: ActionPlanAction, index: number) => {
    setActionEdit({ action, index })
    setActionEditDraft({
      actionTitle: action.title || "",
      totalWeight: action.totalWeight || "",
      totalAchievement: action.totalAchievement != null ? String(action.totalAchievement) : "",
    })
  }

  const saveActionEdit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!actionEdit) return
    setActionsData((prev) => {
      const next = structuredClone(prev)
      const act = next[actionEdit.index]
      if (!act) return prev
      act.title = actionEditDraft.actionTitle.trim() || "Untitled action"
      act.totalWeight = actionEditDraft.totalWeight.trim() || "0%"
      const ta = actionEditDraft.totalAchievement.trim()
      if (ta === "") delete act.totalAchievement
      else act.totalAchievement = ta
      return next
    })
    setActionEdit(null)
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
      mainEntity: val("mainEntity"),
      supportingEntities: val("supportingEntities"),
      humanResources: val("humanResources"),
      financialResources: val("financialResources"),
      startDate: val("startDate"),
      expectedEndDate: val("expectedEndDate"),
      performanceIndicators: val("performanceIndicators"),
      targetValue: val("targetValue"),
      actualValueAchieved: val("actualValueAchieved"),
      achievementPercentage: val("achievementPercentage"),
      actionContributionPercentage: val("actionContributionPercentage"),
      status: val("status") || "Not started",
      requestStatus: val("requestStatus") || "—",
      notes: val("notes"),
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

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return
      if (actionEdit) setActionEdit(null)
      else if (taskModal) closeTaskModal()
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [actionEdit, taskModal])

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
            className="mb-5 inline-flex flex-wrap items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm ring-1 ring-slate-200/70 backdrop-blur-sm sm:hidden sm:text-sm"
          >
            <Link to={dashboardHref} className="text-orange-600 transition hover:text-orange-700">
              Dashboard
            </Link>
            <span className="text-slate-300" aria-hidden="true">
              /
            </span>
            <Link to={sectionHref} className="text-orange-600 transition hover:text-orange-700">
              {parentLabel}
            </Link>
            <span className="text-slate-300" aria-hidden="true">
              /
            </span>
            <span className="text-slate-800">Action plan</span>
          </nav>
          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Action Plan</p>
          <p className="mt-1 text-sm text-muted-foreground">Plan and track actions, tasks, their resources, and due dates</p>
        </header>

        <section
          className={cn("mb-8 max-w-full min-w-0 overflow-hidden rounded-3xl border border-border bg-card ring-1 ring-border/40", shadowLift)}
          aria-labelledby="action-plan-glance-heading"
        >
          <div className="relative flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 px-5 py-4 sm:px-6">
            <div
              className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2760%27%20height%3D%2760%27%20viewBox%3D%270%200%2060%2060%27%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%3E%3Cg%20fill%3D%27none%27%20fill-rule%3D%27evenodd%27%3E%3Cg%20fill%3D%27%23ffffff%27%20fill-opacity%3D%270.06%27%3E%3Cpath%20d%3D%27M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%27%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-90"
              aria-hidden="true"
            />
            <div className="relative">
              <h2 id="action-plan-glance-heading" className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/80">
                Plan Overview
              </h2>
              <p className="mt-1 text-sm font-semibold text-white">Actions and tasks execution progress and achievement rates</p>
            </div>
            <div className="relative flex flex-wrap gap-2">
              <span className="rounded-md bg-black/20 px-2.5 py-1 text-xs font-bold tabular-nums text-white">
                {actionsData.length === 1 ? "1 action" : `${actionsData.length} actions`}
              </span>
              <span className="rounded-md bg-black/20 px-2.5 py-1 text-xs font-bold tabular-nums text-white">
                {glance.totalTasks === 1 ? "1 task" : `${glance.totalTasks} tasks`}
              </span>
            </div>
          </div>
          <div className="grid min-w-0 max-w-full divide-y divide-slate-100 bg-slate-50/50 sm:grid-cols-2 xl:grid-cols-4 xl:divide-x xl:divide-y-0">
            <div className="p-5 sm:p-6 xl:col-span-2" role="group" aria-label="Task status">
              <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">Task status</p>
              {glance.totalTasks === 0 ? (
                <div className="mt-3 flex h-6 min-h-[1.5rem] items-center justify-center rounded-full bg-slate-100 text-[11px] text-slate-500 ring-1 ring-slate-200/80">
                  No tasks
                </div>
              ) : (
                <div className="mt-3 flex h-2 overflow-hidden rounded-full ring-1 ring-slate-200/70">
                  {glance.order.map((key) => {
                    const n = glance.buckets[key].names.length
                    if (n === 0) return null
                    return (
                      <div
                        key={key}
                        className={glance.buckets[key].color}
                        style={{ width: `${(n / glance.totalTasks) * 100}%` }}
                        title={`${glance.buckets[key].label}: ${n}`}
                      />
                    )
                  })}
                </div>
              )}
              <div className="mt-4 space-y-4">
                {glance.totalTasks === 0 ? (
                  <p className="mt-2 text-[11px] text-slate-500">No tasks in this objective.</p>
                ) : (
                  glance.order.map((key) => {
                    const info = glance.buckets[key]
                    if (!info.names.length) return null
                    return (
                      <div key={key}>
                        <p className="flex flex-wrap items-center gap-2 text-[11px] font-semibold text-slate-700">
                          <span
                            className={cn(
                              "h-2 w-2 shrink-0 rounded-sm",
                              key === "in_progress" ? "bg-amber-400" : key === "completed" ? "bg-emerald-500" : "bg-slate-300"
                            )}
                          />
                          {info.label}{" "}
                          <span className="font-normal text-slate-500">({info.names.length})</span>
                        </p>
                        <ul className="mt-1.5 list-none space-y-1 pl-4 text-[11px] leading-snug text-slate-600">
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
              <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">Total achievement</p>
              <p className="mt-2 text-4xl font-bold tabular-nums text-emerald-700">
                {glance.objAch != null ? `${glance.objAch}%` : "—"}
              </p>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 transition-all"
                  style={{ width: `${glance.objAch != null ? Math.min(100, Math.max(0, glance.objAch)) : 0}%` }}
                />
              </div>
              <div className="mt-4 min-w-0">
                {glance.objAch == null ? (
                  <p className="text-xs text-slate-500">—</p>
                ) : (
                  <div className="space-y-2.5">
                    {actionsData.map((action, idx) => {
                      const achStr = aggregateActionAchievementPercent(action.tasks || [])
                      const achM = achStr?.match(/(\d+(?:\.\d+)?)/)
                      const achNum = achM ? parseFloat(achM[1]) : null
                      return (
                        <div
                          key={`${action.title}-${idx}`}
                          className="rounded-xl border border-emerald-100/90 bg-gradient-to-br from-emerald-50/50 to-white p-2.5 ring-1 ring-emerald-100/40"
                        >
                          <div className="flex flex-wrap items-start justify-between gap-1.5 gap-y-0">
                            <div className="min-w-0 flex-1">
                              <p className="text-[10px] font-bold uppercase tracking-wide text-emerald-800/70">
                                Action {idx + 1}
                              </p>
                              <p className="mt-0.5 line-clamp-2 text-[11px] font-semibold leading-snug text-slate-800">
                                {action.title || "Untitled"}
                              </p>
                            </div>
                            <p className="shrink-0 text-right text-sm font-bold tabular-nums text-emerald-700">
                              {achStr || "—"}
                            </p>
                          </div>
                          <div className="mt-2 flex items-center gap-2">
                            <div className="h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-slate-200/90">
                              <div
                                className="h-full rounded-full transition-all"
                                style={{
                                  width: `${achNum != null ? Math.min(100, Math.max(0, achNum)) : 0}%`,
                                  backgroundColor: ACH_COLORS[idx % ACH_COLORS.length],
                                }}
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
              <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">About to start</p>
              <p className="mt-2 text-2xl font-bold tabular-nums text-slate-900">
                {glance.firstStartIso ? formatDate(glance.firstStartIso) : "—"}
              </p>
              <div className="mt-1.5 space-y-1">
                {glance.tasksOnFirstStart.length === 0 ? (
                  <p className="text-sm font-medium text-slate-500">—</p>
                ) : (
                  glance.tasksOnFirstStart.map((r) => (
                    <p key={r.name} className="text-sm font-semibold leading-snug text-slate-800">
                      {r.name}
                    </p>
                  ))
                )}
              </div>
              <p className="mt-1 text-xs text-slate-600">
                {glance.startRowsLength === 0
                  ? "No open tasks with a start date on or after today."
                  : glance.tasksOnFirstStart.length === 1
                    ? "Next start date · 1 task"
                    : `Next start date · ${glance.tasksOnFirstStart.length} tasks`}
              </p>
              <p className="mt-3 text-[10px] font-bold uppercase tracking-wide text-slate-500">About to end</p>
              <div className="mt-1 space-y-1.5">
                {glance.openEnding.length === 0 ? (
                  <p className="text-[11px] font-medium text-slate-500">—</p>
                ) : (
                  glance.openEnding.slice(0, 6).map((x) => (
                    <p key={x.name + x.iso} className="text-[11px] font-medium leading-snug text-slate-700">
                      {x.name} · ends {formatDate(x.iso || "")}
                    </p>
                  ))
                )}
                {glance.openEnding.length > 6 ? (
                  <p className="text-[10px] text-slate-500">
                    and {glance.openEnding.length - 6} more open task(s) with end dates…
                  </p>
                ) : null}
              </div>
              <p
                className={cn(
                  "mt-3 font-mono text-[11px] font-semibold",
                  glance.overdueCount === 0 ? "text-slate-600" : "text-amber-800"
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
              className="border-t border-slate-100 bg-gradient-to-b from-white to-slate-50/40 px-4 py-3 sm:px-5 sm:py-4 sm:col-span-2 xl:col-span-4 xl:border-t xl:border-slate-100"
              role="group"
              aria-label="Action weight distribution"
            >
              <div className="flex flex-wrap items-end justify-between gap-1.5">
                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">Action weight balance</p>
                <p className="text-[11px] font-medium tabular-nums text-slate-500">
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
                    className="mt-2 flex h-2 w-full min-w-0 overflow-hidden rounded-full bg-slate-200/90 shadow-inner ring-1 ring-slate-200/80"
                    role="img"
                    aria-hidden="true"
                  >
                    {glance.weightSegs.map((w, idx, arr) => {
                      const scale = glance.weightSumParsed > 0 ? glance.weightSumParsed : 0
                      const flexGrow = scale > 0 ? w.pct : 100 / arr.length
                      return (
                        <div
                          key={`${w.i}-${idx}`}
                          className="min-w-0"
                          style={{
                            flex: `${flexGrow} 1 0%`,
                            backgroundColor: BAR_COLORS[w.i % BAR_COLORS.length],
                            borderTopLeftRadius: idx === 0 ? 9999 : 0,
                            borderBottomLeftRadius: idx === 0 ? 9999 : 0,
                            borderTopRightRadius: idx === arr.length - 1 ? 9999 : 0,
                            borderBottomRightRadius: idx === arr.length - 1 ? 9999 : 0,
                          }}
                          title={`${w.title} — ${w.pct}%`}
                        />
                      )
                    })}
                  </div>
                  <div className="mt-2 grid gap-2 sm:grid-cols-2">
                    {glance.weightSegs.map((w, idx) => {
                      const color = BAR_COLORS[w.i % BAR_COLORS.length]
                      return (
                        <div
                          key={`leg-${w.i}-${idx}`}
                          className="flex min-w-0 gap-2 rounded-xl border border-slate-200/80 bg-white p-2 shadow-sm ring-1 ring-slate-100/60"
                        >
                          <div
                            className="mt-0.5 h-7 w-1 shrink-0 rounded-full shadow-sm"
                            style={{ backgroundColor: color }}
                            aria-hidden="true"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
                              Action {idx + 1}
                            </p>
                            <p className="mt-0.5 text-xs font-semibold leading-snug text-slate-900 sm:text-sm">{w.title}</p>
                            <p className="mt-1 text-base font-bold leading-none tabular-nums" style={{ color }}>
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
          <div className={cn("relative overflow-hidden rounded-3xl bg-white ring-1 ring-slate-200/60", shadowLift)} aria-labelledby="ap-heading">
            <div className="pointer-events-none absolute -right-24 -top-24 h-64 rounded-full bg-orange-300/15 blur-3xl" aria-hidden="true" />
            <div className="pointer-events-none absolute -bottom-32 -left-20 h-56 rounded-full bg-amber-200/20 blur-3xl" aria-hidden="true" />
            <div className="relative border-b border-slate-100 bg-gradient-to-r from-slate-50/95 via-white to-orange-50/30 px-6 py-8 sm:px-10 sm:py-10">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between lg:gap-10">
                <div className="flex min-w-0 flex-1 gap-4 sm:gap-5">
                  <div
                    className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 text-white shadow-lg shadow-orange-500/30 sm:flex"
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
                    <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-orange-800/60">
                      Operational objective
                    </p>
                    <h1
                      id="ap-heading"
                      className="mt-1.5 text-2xl font-bold leading-tight tracking-tight text-slate-900 sm:text-3xl lg:text-[1.85rem] lg:leading-snug"
                    >
                      {headingText}
                    </h1>
                    <p className="mt-3 max-w-3xl border-l-2 border-orange-300/80 pl-4 text-base leading-relaxed text-slate-600 sm:text-lg">
                      {objectiveLead}
                    </p>
                  </div>
                </div>
                <div className="shrink-0 lg:pt-8">
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-wide text-slate-400 lg:text-right">
                    Objective status
                  </p>
                  <button
                    type="button"
                    disabled
                    className={statusStyles.btn}
                    aria-label={`Objective status: ${status}`}
                  >
                    <span className={statusStyles.dot} aria-hidden="true" />
                    <span>{status}</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="relative bg-gradient-to-b from-slate-50/40 to-white px-6 py-8 sm:px-10 sm:py-10">
              <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-slate-200/60 bg-white/90 p-5 shadow-sm ring-1 ring-slate-100/80 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                <div className="flex min-w-0 flex-1 items-start gap-4">
                  <span
                    className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white shadow-md"
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
                    <h2 className="text-lg font-bold text-slate-900 sm:text-xl">Actions &amp; tasks</h2>
                    <p className="mt-1 max-w-xl text-sm leading-relaxed text-slate-500">
                      Actions group related work. Each task captures resources, dates, KPIs, and contribution to the action.
                    </p>
                  </div>
                </div>
                <div className="flex w-full shrink-0 flex-col gap-2 sm:w-auto sm:flex-row sm:items-center sm:gap-3">
                  <Link
                    to={`${parentPath}/add-action`}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-orange-200 bg-orange-50/90 px-4 py-2.5 text-sm font-semibold text-orange-800 shadow-sm transition hover:border-orange-300 hover:bg-orange-100/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/45 focus-visible:ring-offset-2 sm:w-auto"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Add action
                  </Link>
                  <div className="rounded-xl bg-slate-100/90 px-4 py-2.5 text-center text-sm font-semibold text-slate-700 ring-1 ring-slate-200/60 sm:text-left">
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
                    onEditAction={() => openActionEdit(action, actionIndex)}
                    onDeleteAction={() => {
                      if (!confirm("Remove this action and all of its tasks?")) return
                      setActionsData((prev) => prev.filter((_, i) => i !== actionIndex))
                      closeTaskModal()
                      setActionEdit(null)
                    }}
                    onAddTask={() => {
                      setActionsData((prev) => {
                        const next = structuredClone(prev)
                        const a = next[actionIndex]
                        if (!a.tasks) a.tasks = []
                        a.tasks.push(newTaskTemplate())
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

      {taskModal ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6" role="dialog" aria-modal="true">
          <button
            type="button"
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-[2px] transition hover:bg-slate-900/55"
            aria-label="Close task details"
            onClick={closeTaskModal}
          />
          <div className="relative z-10 flex max-h-[min(90vh,42rem)] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200/80 shadow-[0_12px_40px_rgba(0,0,0,0.06),0_4px_12px_rgba(0,0,0,0.04)]">
            <div className="flex shrink-0 items-start justify-between gap-3 border-b border-slate-100 bg-gradient-to-r from-slate-50/90 to-white px-5 py-4 sm:px-6">
              <h2 className="text-base font-bold text-slate-900 sm:text-lg">
                Task {taskModal.taskIndex + 1} · Action {taskModal.actionIndex + 1}
                {taskModal.action.title ? ` — ${taskModal.action.title}` : ""}
              </h2>
              <button
                type="button"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/40"
                aria-label="Close"
                onClick={closeTaskModal}
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4 sm:px-6 sm:py-5">
              {!taskEditMode ? (
                <div className="grid min-w-0 grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-x-3 sm:gap-y-2">
                  <FieldCell label="Weight" value={taskModal.task.weight} mode="metric" />
                  <FieldCell label="Main entity" value={taskModal.task.mainEntity} />
                  <FieldCell label="Supporting entity/s" value={taskModal.task.supportingEntities} />
                  <FieldCell label="Human resources required" value={taskModal.task.humanResources} />
                  <FieldCell label="Financial resources required" value={taskModal.task.financialResources} />
                  <FieldCell label="Start date" value={formatDate(taskModal.task.startDate)} />
                  <FieldCell label="Expected end date" value={formatDate(taskModal.task.expectedEndDate)} />
                  <FieldCell label="Performance indicators" value={taskModal.task.performanceIndicators} wide />
                  <FieldCell label="Target value" value={taskModal.task.targetValue} />
                  <FieldCell label="Actual value achieved" value={taskModal.task.actualValueAchieved} />
                  <FieldCell label="Achievement percentage" value={taskModal.task.achievementPercentage} mode="metric" />
                  <FieldCell
                    label="Action contribution percentage"
                    value={taskModal.task.actionContributionPercentage}
                    mode="metric"
                  />
                  <FieldCell label="Status" value={taskModal.task.status} mode="status" />
                  <FieldCell label="Request status" value={taskModal.task.requestStatus} />
                  <FieldCell label="Notes" value={taskModal.task.notes} wide />
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
            <div className="shrink-0 border-t border-slate-100 bg-slate-50/80 px-5 py-3 sm:px-6">
              {!taskEditMode ? (
                <button
                  type="button"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/40 focus-visible:ring-offset-2 sm:w-auto"
                  onClick={() => setTaskEditMode(true)}
                >
                  Edit details
                </button>
              ) : (
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="inline-flex flex-1 items-center justify-center rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-orange-500/25 transition hover:from-orange-600 hover:to-orange-700 sm:flex-none sm:px-6"
                    onClick={saveTaskEdit}
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    className="inline-flex flex-1 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50 sm:flex-none"
                    onClick={() => {
                      setTaskEditMode(false)
                    }}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}

      {actionEdit ? (
        <div className="fixed inset-0 z-[105] flex items-center justify-center p-4 sm:p-6" role="dialog" aria-modal="true">
          <button
            type="button"
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-[2px] transition hover:bg-slate-900/55"
            aria-label="Close action editor"
            onClick={() => setActionEdit(null)}
          />
          <div className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200/80 shadow-[0_12px_40px_rgba(0,0,0,0.06),0_4px_12px_rgba(0,0,0,0.04)]">
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 bg-gradient-to-r from-slate-50/90 to-white px-5 py-4 sm:px-6">
              <h2 className="text-base font-bold text-slate-900">Edit action</h2>
              <button
                type="button"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/40"
                aria-label="Close"
                onClick={() => setActionEdit(null)}
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={saveActionEdit} className="space-y-3 px-5 py-4 sm:px-6 sm:py-5">
              <label className="block">
                <span className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Action title</span>
                <input
                  name="actionTitle"
                  required
                  value={actionEditDraft.actionTitle}
                  onChange={(e) => setActionEditDraft((d) => ({ ...d, actionTitle: e.target.value }))}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400/25"
                />
              </label>
              <label className="block">
                <span className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Total weight</span>
                <input
                  name="totalWeight"
                  placeholder="e.g. 50%"
                  value={actionEditDraft.totalWeight}
                  onChange={(e) => setActionEditDraft((d) => ({ ...d, totalWeight: e.target.value }))}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400/25"
                />
              </label>
              <label className="block">
                <span className="text-[11px] font-bold uppercase tracking-wide text-slate-500">
                  Total achievement (optional)
                </span>
                <input
                  name="totalAchievement"
                  placeholder="Leave blank to calculate from tasks"
                  value={actionEditDraft.totalAchievement}
                  onChange={(e) => setActionEditDraft((d) => ({ ...d, totalAchievement: e.target.value }))}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400/25"
                />
              </label>
              <div className="flex flex-wrap gap-2 border-t border-slate-100 pt-4">
                <button
                  type="submit"
                  className="inline-flex flex-1 items-center justify-center rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-orange-500/25 transition hover:from-orange-600 hover:to-orange-700 sm:flex-none sm:px-6"
                >
                  Save
                </button>
                <button
                  type="button"
                  className="inline-flex flex-1 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50 sm:flex-none"
                  onClick={() => setActionEdit(null)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
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
      <span className="text-[11px] font-bold uppercase tracking-wide text-slate-500">{label}</span>
      {multiline ? (
        <textarea
          name={name}
          rows={3}
          defaultValue={task[name] as string}
          className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400/25"
        />
      ) : (
        <input
          name={name}
          type="text"
          defaultValue={task[name] as string}
          className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400/25"
        />
      )}
    </label>
  )
  return (
    <>
      {field("name", "Task name")}
      {field("weight", "Weight")}
      {field("mainEntity", "Main entity")}
      {field("supportingEntities", "Supporting entity/s")}
      {field("humanResources", "Human resources required", true, true)}
      {field("financialResources", "Financial resources required", true, true)}
      {field("startDate", "Start date (YYYY-MM-DD)")}
      {field("expectedEndDate", "Expected end date (YYYY-MM-DD)")}
      {field("performanceIndicators", "Performance indicators", true, true)}
      {field("targetValue", "Target value")}
      {field("actualValueAchieved", "Actual value achieved", true, true)}
      {field("achievementPercentage", "Achievement percentage")}
      {field("actionContributionPercentage", "Action contribution percentage")}
      {field("status", "Status")}
      {field("requestStatus", "Request status")}
      {field("notes", "Notes", true, true)}
    </>
  )
}

function ActionCard({
  action,
  actionIndex,
  onEditAction,
  onDeleteAction,
  onAddTask,
  onOpenTask,
  onDeleteTask,
}: {
  action: ActionPlanAction
  actionIndex: number
  onEditAction: () => void
  onDeleteAction: () => void
  onAddTask: () => void
  onOpenTask: (task: ActionPlanTask, taskIndex: number) => void
  onDeleteTask: (taskIndex: number) => void
}) {
  const tasks = action.tasks || []
  const weightDisplay = action.totalWeight || sumTaskWeightsPercent(tasks) || "—"
  const achievementDisplay =
    action.totalAchievement != null && action.totalAchievement !== ""
      ? String(action.totalAchievement)
      : aggregateActionAchievementPercent(tasks) || "—"

  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white/80 shadow-[0_8px_30px_rgba(0,0,0,0.04),0_2px_8px_rgba(0,0,0,0.03)] ring-1 ring-slate-200/50 backdrop-blur-sm transition duration-300 hover:shadow-[0_12px_40px_rgba(0,0,0,0.06),0_4px_12px_rgba(0,0,0,0.04)]"
      )}
      aria-labelledby={`ap-action-${actionIndex}`}
    >
      <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-orange-400 to-amber-500" aria-hidden="true" />
      <div className="pl-3 sm:pl-4">
      <div className="flex flex-col items-start gap-3 border-b border-orange-100/60 bg-gradient-to-b from-orange-50/45 via-white to-white px-4 py-4 sm:gap-4 sm:px-6">
        <div className="flex w-full min-w-0 flex-col gap-3 sm:flex-row sm:items-start">
          <span
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-sm font-bold text-white shadow-md"
            aria-hidden="true"
          >
            {actionIndex + 1}
          </span>
          <div className="min-w-0 w-full">
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-orange-800/55">Action</p>
            <div className="mt-0.5 flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between lg:gap-3">
              <h2 id={`ap-action-${actionIndex}`} className="min-w-0 flex-1 text-base font-bold leading-snug text-slate-900 sm:text-lg">
                {action.title || "Untitled action"}
              </h2>
              <div className="flex w-full min-w-0 shrink-0 flex-col gap-2 lg:w-auto lg:flex-row lg:flex-wrap lg:items-stretch lg:justify-end lg:gap-2">
                <button
                  type="button"
                  disabled
                  className="inline-flex w-full min-w-0 cursor-not-allowed items-center gap-1.5 rounded-lg border border-sky-200/90 bg-gradient-to-b from-sky-50/90 to-white px-3 py-2 text-xs shadow-sm ring-1 ring-sky-100/70 select-none disabled:pointer-events-none disabled:opacity-100 lg:w-auto lg:py-1.5 lg:text-sm"
                  aria-label={`Total weight ${weightDisplay}`}
                >
                  <span className="font-semibold text-sky-800/70">Total weight</span>
                  <span className="font-bold tabular-nums text-sky-700">{weightDisplay}</span>
                </button>
                <button
                  type="button"
                  disabled
                  className="inline-flex w-full min-w-0 cursor-not-allowed items-center gap-1.5 rounded-lg border border-emerald-200/90 bg-gradient-to-b from-emerald-50/90 to-white px-3 py-2 text-xs shadow-sm ring-1 ring-emerald-100/70 select-none disabled:pointer-events-none disabled:opacity-100 lg:w-auto lg:py-1.5 lg:text-sm"
                  aria-label={`Total achievement ${achievementDisplay}`}
                >
                  <span className="font-semibold text-emerald-800/70">Total achievement</span>
                  <span className="font-bold tabular-nums text-emerald-700">{achievementDisplay}</span>
                </button>
              </div>
            </div>
            <p className="mt-1 text-xs font-medium text-slate-500">
              {tasks.length === 1 ? "1 task" : `${tasks.length} tasks`}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/40 sm:text-sm"
                onClick={onEditAction}
              >
                Edit action
              </button>
              <button
                type="button"
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-orange-200 bg-orange-50/90 px-3 py-2 text-xs font-semibold text-orange-800 shadow-sm transition hover:border-orange-300 hover:bg-orange-100/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/40 sm:text-sm"
                onClick={onAddTask}
              >
                Add task
              </button>
              <button
                type="button"
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50/80 px-3 py-2 text-xs font-semibold text-rose-800 shadow-sm transition hover:border-rose-300 hover:bg-rose-100/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400/40 sm:text-sm"
                onClick={onDeleteAction}
              >
                Delete action
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-3 bg-slate-50/20 p-3 lg:grid-cols-2 lg:gap-4 lg:items-start lg:p-4">
        {!tasks.length ? (
          <p className="col-span-full rounded-xl border border-dashed border-slate-200/80 bg-white/80 px-4 py-8 text-center text-sm text-slate-500 ring-1 ring-slate-100/60">
            No tasks under this action yet.
          </p>
        ) : (
          tasks.map((task, taskIndex) => (
            <article
              key={`${task.name}-${taskIndex}`}
              className="group flex w-full min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-200/65 bg-white shadow-sm ring-1 ring-slate-100/45 transition duration-300 hover:border-orange-200/50 hover:shadow-md"
            >
              <div className="flex items-start gap-3 px-3 pb-1 pt-3 sm:gap-3 sm:px-4 sm:pt-4">
                <div className="flex min-w-0 flex-1 items-start gap-3">
                  <span
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 text-sm font-bold text-white shadow-md shadow-orange-500/25"
                    aria-hidden="true"
                  >
                    {taskIndex + 1}
                  </span>
                  <div className="min-w-0 flex-1 pt-0.5">
                    <p className="text-[11px] font-bold text-slate-600">Task {taskIndex + 1}</p>
                    <h3 className="mt-0.5 line-clamp-2 text-sm font-bold text-slate-900 sm:text-base">
                      {task.name || "—"}
                    </h3>
                  </div>
                </div>
              </div>
              <div className="mt-2 flex min-w-0 flex-col gap-3 border-t border-slate-100 bg-gradient-to-br from-slate-50/95 via-white to-orange-50/25 px-3 py-3 sm:mt-3 sm:px-4 sm:py-3.5">
                <div className="flex min-w-0 w-full flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                  <span className="shrink-0 pt-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">
                    Request status
                  </span>
                  <div className="min-w-0 flex-1">
                    <RequestStatusPill label={task.requestStatus} />
                  </div>
                </div>
                <div className="grid min-w-0 w-full grid-cols-1 gap-2 sm:grid-cols-2">
                  <button
                    type="button"
                    className="inline-flex min-h-[2.5rem] w-full min-w-0 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/40 focus-visible:ring-offset-2"
                    onClick={() => onOpenTask(task, taskIndex)}
                  >
                    View details
                  </button>
                  <button
                    type="button"
                    className="inline-flex min-h-[2.5rem] w-full min-w-0 items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50/80 px-4 py-2.5 text-sm font-semibold text-rose-800 shadow-sm transition hover:border-rose-300 hover:bg-rose-100/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400/40 focus-visible:ring-offset-2"
                    onClick={() => onDeleteTask(taskIndex)}
                  >
                    Delete task
                  </button>
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
