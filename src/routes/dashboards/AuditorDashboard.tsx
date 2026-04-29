import { Link } from "react-router-dom"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  CheckCircle2Icon,
  ClipboardCheckIcon,
  ClipboardListIcon,
  TriangleAlertIcon,
} from "lucide-react"

/** Segmented mix bar — same structure as “Objective status” on Catalysts dashboard (flex ratios + legend). */
function SubmissionMixBar({
  objectives,
  actions,
  tasks,
}: {
  objectives: number
  actions: number
  tasks: number
}) {
  const total = objectives + actions + tasks
  if (total <= 0) return null

  return (
    <>
      <div
        className="mt-3 flex h-2 w-full min-w-0 overflow-hidden rounded-full ring-1 ring-slate-200/70 dark:ring-border/70"
        role="img"
        aria-label={`Objectives ${objectives}, actions ${actions}, tasks ${tasks}`}
      >
        {objectives > 0 && <div className="bg-emerald-500" style={{ flex: `${objectives} 1 0%` }} />}
        {actions > 0 && <div className="bg-orange-500" style={{ flex: `${actions} 1 0%` }} />}
        {tasks > 0 && <div className="bg-sky-500" style={{ flex: `${tasks} 1 0%` }} />}
      </div>
      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-0.5 text-[11px] text-slate-600 dark:text-muted-foreground">
        <span>
          <span className="mr-1 inline-block h-2 w-2 rounded-sm bg-emerald-500 align-middle" aria-hidden="true" />
          Objectives {objectives}
        </span>
        <span>
          <span className="mr-1 inline-block h-2 w-2 rounded-sm bg-orange-500 align-middle" aria-hidden="true" />
          Actions {actions}
        </span>
        <span>
          <span className="mr-1 inline-block h-2 w-2 rounded-sm bg-sky-500 align-middle" aria-hidden="true" />
          Tasks {tasks}
        </span>
      </div>
    </>
  )
}

const summaryCards = [
  {
    label: "Waiting proposals",
    value: "7",
    note: "Pending inspection",
    breakdown: { objectives: 2, actions: 2, tasks: 3 },
  },
  {
    label: "Accepted (30 days)",
    value: "18",
    note: "No further edits requested",
    breakdown: { objectives: 5, actions: 6, tasks: 7 },
  },
  {
    label: "Returned for edits",
    value: "6",
    note: "Submitter notified with your notes",
    breakdown: { objectives: 2, actions: 2, tasks: 2 },
  },
]

const notifications = [
  { title: "New action awaiting review", body: "Faculty KPI mapping - A. Khalil", time: "2 hours ago", icon: ClipboardListIcon },
  { title: "New objective submitted", body: "Research visibility - N. Hassan", time: "Today - 09:40", icon: ClipboardCheckIcon },
  { title: "Submission accepted", body: "REQ-2026-0138 - Budget alignment", time: "Yesterday", icon: CheckCircle2Icon },
  { title: "Resubmission received", body: "Digital services uptime - Finance", time: "2 days ago", icon: TriangleAlertIcon },
]

export default function AuditorDashboard() {
  return (
    <div className="min-w-0 flex-1 overflow-x-hidden bg-background p-4 sm:p-6 lg:p-8">
        <header className="mb-6 flex flex-col gap-4 sm:mb-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <Badge variant="outline">Auditor</Badge>
            <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">Welcome, Sara</h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Inspect and approve objectives, actions, and tasks
            </p>
          </div>
          <div className="grid w-full shrink-0 grid-cols-1 gap-2 sm:grid-cols-2 lg:w-auto lg:grid-cols-3">
            <Link
              to="/action-queue"
              className="inline-flex min-w-0 items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90"
            >
              Action queue
            </Link>
            <Link
              to="/objective-queue"
              className="inline-flex min-w-0 items-center justify-center rounded-full border border-border bg-background px-5 py-2.5 text-sm font-semibold text-foreground shadow-sm transition hover:bg-accent"
            >
              Objective queue
            </Link>
            <Link
              to="/task-queue"
              className="inline-flex min-w-0 items-center justify-center rounded-full border border-border bg-background px-5 py-2.5 text-sm font-semibold text-foreground shadow-sm transition hover:bg-accent"
            >
              Task queue
            </Link>
          </div>
        </header>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {summaryCards.map((item) => (
            <Card key={item.label} className="h-full ring-1 ring-border/60">
              <CardContent className="flex min-h-[11rem] flex-col p-5 sm:min-h-[12rem] sm:p-6">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{item.label}</p>
                <p className="mt-2 text-3xl font-bold tabular-nums leading-none text-foreground">{item.value}</p>
                <p className="mt-1 text-xs text-muted-foreground">{item.note}</p>
                <SubmissionMixBar
                  objectives={item.breakdown.objectives}
                  actions={item.breakdown.actions}
                  tasks={item.breakdown.tasks}
                />
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2 lg:items-start">
          <Card className="flex min-h-0 flex-col ring-1 ring-border/60">
            <CardHeader className="flex-row items-center justify-between gap-2 space-y-0">
              <CardTitle className="text-base">Notifications</CardTitle>
              <Badge variant="secondary">4 new</Badge>
            </CardHeader>
            <CardContent className="min-h-0 flex-1 space-y-3">
              {notifications.map((item) => (
                <Link
                  key={item.title}
                  to="/action-queue"
                  className="flex w-full gap-3 rounded-xl border border-border bg-muted/30 p-3 text-left transition hover:bg-muted/60"
                >
                  <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-muted text-foreground">
                    <item.icon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-semibold leading-snug">{item.title}</p>
                    <p className="mt-0.5 text-xs leading-snug text-muted-foreground">{item.body}</p>
                    <p className="mt-1 text-[11px] font-medium text-muted-foreground">{item.time}</p>
                  </div>
                </Link>
              ))}
              <Link
                to="/notifications"
                className="mt-3 inline-flex w-full items-center justify-center rounded-full border border-border bg-background py-2 text-xs font-semibold text-foreground transition hover:bg-accent"
              >
                View all notifications
              </Link>
            </CardContent>
          </Card>

          <Card className="flex min-h-[20rem] flex-col ring-1 ring-border/60 lg:min-h-[28rem]">
            <CardHeader>
              <CardTitle className="text-xl">Latest in queue</CardTitle>
              <CardDescription>Open a proposal to inspect the full submission and record your decision</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col">
              <ul className="flex flex-col gap-4">
                <li>
                  <Link
                    to="/auditor/review-action"
                    className="flex min-h-[7.5rem] flex-col justify-center rounded-2xl border border-border bg-muted/30 p-5 transition hover:bg-accent/40 sm:min-h-[8.5rem] sm:p-6"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="rounded-full bg-secondary px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-secondary-foreground">
                        Action
                      </span>
                      <span className="text-xs font-semibold text-muted-foreground">Pending</span>
                    </div>
                    <p className="mt-3 text-base font-semibold sm:text-lg">Faculty KPI mapping and sign-off</p>
                    <p className="mt-1 text-sm text-muted-foreground">Ahmed Khalil - College of Science - 2 hours ago</p>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/auditor/review-objective"
                    className="flex min-h-[7.5rem] flex-col justify-center rounded-2xl border border-border bg-muted/30 p-5 transition hover:bg-accent/40 sm:min-h-[8.5rem] sm:p-6"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="rounded-full bg-muted px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-foreground">
                        Objective
                      </span>
                      <span className="text-xs font-semibold text-muted-foreground">Pending</span>
                    </div>
                    <p className="mt-3 text-base font-semibold sm:text-lg">Improve research output visibility</p>
                    <p className="mt-1 text-sm text-muted-foreground">Noor Hassan - Planning - Today</p>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/auditor/review-task"
                    className="flex min-h-[7.5rem] flex-col justify-center rounded-2xl border border-border bg-muted/30 p-5 transition hover:bg-accent/40 sm:min-h-[8.5rem] sm:p-6"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-foreground">
                        Task
                      </span>
                      <span className="text-xs font-semibold text-muted-foreground">Pending</span>
                    </div>
                    <p className="mt-3 text-base font-semibold sm:text-lg">Baseline task ownership matrix</p>
                    <p className="mt-1 text-sm text-muted-foreground">Mariam Al-Sayed - Operations - 1 hour ago</p>
                  </Link>
                </li>
              </ul>
              <div className="mt-6 grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-3">
                <Link
                  to="/action-queue"
                  className="inline-flex min-w-0 items-center justify-center rounded-full border border-border px-3 py-2 text-xs font-semibold text-foreground transition hover:bg-accent"
                >
                  View action queue
                </Link>
                <Link
                  to="/objective-queue"
                  className="inline-flex min-w-0 items-center justify-center rounded-full border border-border px-3 py-2 text-xs font-semibold text-foreground transition hover:bg-accent"
                >
                  View objective queue
                </Link>
                <Link
                  to="/task-queue"
                  className="inline-flex min-w-0 items-center justify-center rounded-full border border-border px-3 py-2 text-xs font-semibold text-foreground transition hover:bg-accent"
                >
                  View task queue
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
    </div>
  )
}
