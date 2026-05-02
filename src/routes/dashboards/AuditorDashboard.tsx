import { Link } from "react-router-dom"
import {
  AuditorDashboardNotificationRow,
  DashboardNotificationsCard,
  type AuditorPreviewItem,
} from "@/components/dashboard-notification-preview"
import { HorizontalRatioStack } from "@/components/ratio-bars"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

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
      <div className="mt-3 h-2 w-full min-w-0 overflow-hidden rounded-full ring-1 ring-border/70">
        <HorizontalRatioStack
          role="img"
          aria-label={`Objectives ${objectives}, actions ${actions}, tasks ${tasks}`}
          segments={[
            { ratio: objectives, className: "proposal-stat-bar-pending", title: `Objectives ${objectives}` },
            { ratio: actions, className: "proposal-stat-bar-chart-4", title: `Actions ${actions}` },
            { ratio: tasks, className: "proposal-stat-bar-chart-2", title: `Tasks ${tasks}` },
          ]}
        />
      </div>
      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-0.5 text-[11px]">
        <span className="text-foreground">
          <span
            className="proposal-stat-swatch-pending mr-1 inline-block h-2 w-2 rounded-sm align-middle"
            aria-hidden="true"
          />
          Objectives {objectives}
        </span>
        <span className="text-secondary-foreground">
          <span
            className="proposal-stat-swatch-chart-4 mr-1 inline-block h-2 w-2 rounded-sm align-middle"
            aria-hidden="true"
          />
          Actions {actions}
        </span>
        <span className="text-foreground">
          <span
            className="proposal-stat-swatch-chart-2 mr-1 inline-block h-2 w-2 rounded-sm align-middle"
            aria-hidden="true"
          />
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
    valueClassName: "proposal-stat-num-pending",
    breakdown: { objectives: 2, actions: 2, tasks: 3 },
  },
  {
    label: "Accepted (30 days)",
    value: "18",
    note: "No further edits requested",
    valueClassName: "proposal-stat-num-chart-4",
    breakdown: { objectives: 5, actions: 6, tasks: 7 },
  },
  {
    label: "Returned for edits",
    value: "6",
    note: "Submitter notified with your notes",
    valueClassName: "proposal-stat-num-chart-2",
    breakdown: { objectives: 2, actions: 2, tasks: 2 },
  },
]

const auditorNotificationPreviewItems: AuditorPreviewItem[] = [
  {
    id: "aud-n1",
    title: "New action awaiting review",
    body: "Faculty KPI mapping - A. Khalil",
    time: "2 hours ago",
    category: "new_proposal",
    entityType: "action",
    strategicPerspective: "beneficiary",
    unread: true,
  },
  {
    id: "aud-n2",
    title: "New objective submitted",
    body: "Research visibility - N. Hassan",
    time: "Today - 09:40",
    category: "new_proposal",
    entityType: "objective",
    strategicPerspective: "catalysts",
    unread: true,
  },
  {
    id: "aud-n3",
    title: "Submission accepted",
    body: "REQ-2026-0138 - Budget alignment",
    time: "Yesterday",
    category: "proposal_update",
    entityType: "action",
    strategicPerspective: "stakeholders",
    unread: false,
  },
  {
    id: "aud-n4",
    title: "Resubmission received",
    body: "Digital services uptime - Finance",
    time: "2 days ago",
    category: "proposal_update",
    entityType: "task",
    strategicPerspective: "enablers",
    unread: false,
  },
]

const latestQueueEntryLinkClassName =
  "flex min-h-[7.5rem] flex-col justify-center rounded-2xl border border-border bg-muted/30 p-5 transition-colors hover:border-[oklch(0.72_0.145_48)] hover:bg-[color-mix(in_oklch,oklch(0.7_0.2_25)_5%,white)] sm:min-h-[8.5rem] sm:p-6"

const auditorQueueHeaderLinksClassName =
  "notif-secondary-action inline-flex min-w-0 items-center justify-center rounded-md border border-transparent bg-[oklch(0.945_0.01_255)] px-4 py-2 text-sm font-medium text-foreground shadow-sm transition-colors"

export default function AuditorDashboard() {
  return (
    <div className="min-w-0 flex-1 bg-background">
        {/* Top-right, flush left of UOB logo (AppLayout: right-4/6/8 + w-20 + gap); sibling of padded scroll area avoids overflow-x clip */}
        <div className="pointer-events-auto absolute right-[6.75rem] top-12 z-20 flex max-w-[calc(100%-7rem)] flex-wrap items-center justify-end gap-3 sm:right-[7.25rem] sm:top-14 lg:right-[7.75rem] lg:top-16 lg:gap-4">
          <Link to="/action-queue" className={auditorQueueHeaderLinksClassName}>
            Action queue
          </Link>
          <Link to="/objective-queue" className={auditorQueueHeaderLinksClassName}>
            Objective queue
          </Link>
          <Link to="/task-queue" className={auditorQueueHeaderLinksClassName}>
            Task queue
          </Link>
        </div>

        <div className="overflow-x-hidden p-4 sm:p-6 lg:p-8">
        <header className="mb-6 sm:mb-8 lg:pr-[7.5rem]">
          <div>
            <Badge
              variant="outline"
              className={cn(
                "h-auto min-h-8 border-border/30 bg-[oklch(0.985_0_0)] px-3 py-1.5 text-xs font-semibold shadow-[0_1px_8px_rgba(0,0,0,0.045)] dark:border-border/40 dark:bg-card dark:shadow-[0_2px_10px_rgba(0,0,0,0.28)]",
              )}
            >
              Auditor
            </Badge>
            <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">Welcome, Sara</h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Inspect and approve objectives, actions, and tasks
            </p>
          </div>
        </header>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {summaryCards.map((item) => (
            <Card key={item.label} className="h-full ring-1 ring-border/60">
              <CardContent className="flex min-h-[11rem] flex-col p-5 sm:min-h-[12rem] sm:p-6">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{item.label}</p>
                <p className={cn("mt-2 text-3xl font-bold tabular-nums leading-none", item.valueClassName)}>
                  {item.value}
                </p>
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
          <DashboardNotificationsCard
            className="lg:min-h-0"
            newCountLabel={`${auditorNotificationPreviewItems.filter((n) => n.unread).length} new`}
            footer={
              <Link
                to="/auditor/notifications"
                className={cn(
                  "notif-secondary-action inline-flex w-full items-center justify-center rounded-md border border-transparent bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground shadow-xs transition-colors",
                )}
              >
                View all notifications
              </Link>
            }
          >
            {auditorNotificationPreviewItems.map((item) => (
              <AuditorDashboardNotificationRow key={item.id} item={item} />
            ))}
          </DashboardNotificationsCard>

          <Card className="flex min-h-[20rem] flex-col ring-1 ring-border/60 lg:min-h-[28rem]">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Latest in Queue</CardTitle>
              <CardDescription>Open a proposal to inspect the full submission and record your decision</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col">
              <ul className="flex flex-col gap-4">
                <li>
                  <Link
                    to="/auditor/review-action"
                    className={latestQueueEntryLinkClassName}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="proposal-stat-label-bg-chart-4 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide proposal-stat-label-text-chart-4">
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
                    className={latestQueueEntryLinkClassName}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="notif-type-badge-chart-5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide">
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
                    className={latestQueueEntryLinkClassName}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="proposal-stat-label-bg-chart-2 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide proposal-stat-label-text-chart-2">
                        Task
                      </span>
                      <span className="text-xs font-semibold text-muted-foreground">Pending</span>
                    </div>
                    <p className="mt-3 text-base font-semibold sm:text-lg">Baseline task ownership matrix</p>
                    <p className="mt-1 text-sm text-muted-foreground">Mariam Al-Sayed - Operations - 1 hour ago</p>
                  </Link>
                </li>
              </ul>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3 lg:gap-4">
                <Link
                  to="/action-queue"
                  className="notif-secondary-action inline-flex min-w-0 items-center justify-center rounded-md border border-transparent bg-[oklch(0.945_0.01_255)] px-4 py-2 text-sm font-medium text-foreground shadow-xs transition-colors"
                >
                  View action queue
                </Link>
                <Link
                  to="/objective-queue"
                  className="notif-secondary-action inline-flex min-w-0 items-center justify-center rounded-md border border-transparent bg-[oklch(0.945_0.01_255)] px-4 py-2 text-sm font-medium text-foreground shadow-xs transition-colors"
                >
                  View objective queue
                </Link>
                <Link
                  to="/task-queue"
                  className="notif-secondary-action inline-flex min-w-0 items-center justify-center rounded-md border border-transparent bg-[oklch(0.945_0.01_255)] px-4 py-2 text-sm font-medium text-foreground shadow-xs transition-colors"
                >
                  View task queue
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
        </div>
    </div>
  )
}
