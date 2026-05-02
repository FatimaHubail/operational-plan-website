import { Link, useNavigate } from "react-router-dom"
import {
  ContributorDashboardNotificationRow,
  DashboardNotificationsCard,
  type ContributorPreviewItem,
} from "@/components/dashboard-notification-preview"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
const monthLabelFormatter = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" })

function buildCalendarDays(date: Date) {
  const year = date.getFullYear()
  const month = date.getMonth()
  const firstDayOfWeek = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells: string[] = Array.from({ length: firstDayOfWeek }, () => "")

  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push(String(day))
  }

  const totalCells = cells.length <= 35 ? 35 : 42
  while (cells.length < totalCells) {
    cells.push("")
  }

  return cells
}

const contributorNotificationPreviewItems: ContributorPreviewItem[] = [
  {
    id: "cd-n1",
    title: "Action returned for edits",
    body: "Auditor left notes on REQ-2026-0112 — open My submissions to continue.",
    time: "Just now",
    category: "resubmission",
    entityType: "action",
    strategicPerspective: "beneficiary",
    unread: true,
  },
  {
    id: "cd-n2",
    title: "Operational plan review",
    body: "Provost office requested updates to Q2 milestones.",
    time: "2 min ago",
    category: "calendar",
    entityType: "event",
    strategicPerspective: "stakeholders",
    unread: true,
  },
  {
    id: "cd-n3",
    title: "Submission approved",
    body: "College of Arts plan v3 is approved for publication.",
    time: "1 hour ago",
    category: "lifecycle",
    entityType: "objective",
    strategicPerspective: "catalysts",
    unread: true,
  },
  {
    id: "cd-n4",
    title: "Reminder: budget alignment",
    body: "Link financial targets to initiatives by Friday.",
    time: "Yesterday",
    category: "calendar",
    entityType: "task",
    strategicPerspective: "enablers",
    unread: false,
  },
]

export default function ContributerDashboard() {
  const navigate = useNavigate()
  const today = new Date()
  const currentDay = String(today.getDate())
  const calendarTitle = monthLabelFormatter.format(today)
  const calendarDays = buildCalendarDays(today)
  return (
    <div className="min-w-0 flex-1 overflow-x-hidden bg-background p-4 sm:p-6 lg:p-8">
      <header className="mb-6 flex flex-col gap-5 lg:mb-8 lg:flex-row lg:items-center lg:gap-6">
        <div className="shrink-0 lg:max-w-none">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Welcome, Juliana</h1>
          <p className="mt-1 whitespace-nowrap text-sm text-muted-foreground sm:text-base">
            Here is a concise overview of your operational plan
          </p>
        </div>
      </header>

      <div className="mb-6 grid gap-6 lg:grid-cols-2 lg:items-stretch">
        <Card
          className="cursor-pointer p-0 transition hover:shadow-md hover:ring-1 hover:ring-border"
          title="Open calendar to view and manage weekly and monthly schedules."
          onClick={() => navigate("/calendar")}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault()
              navigate("/calendar")
            }
          }}
          role="button"
          tabIndex={0}
        >
          <CardHeader className="flex flex-row items-center justify-between px-6 pt-6 sm:px-8 sm:pt-8">
            <CardTitle className="text-lg font-bold">{calendarTitle}</CardTitle>
          </CardHeader>
          <CardContent className="px-6 pb-6 sm:px-8 sm:pb-8">
            <div className="grid grid-cols-7 gap-y-2 text-center text-xs font-medium text-muted-foreground">
              <span>SUN</span><span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span>
            </div>
            <div className="mt-3 grid grid-cols-7 gap-y-1 text-center text-sm">
              {calendarDays.map((day, idx) =>
                day ? (
                  <Button
                    key={`${day}-${idx}`}
                    type="button"
                    size="icon-sm"
                    variant={day === currentDay ? "default" : "ghost"}
                    className="mx-auto"
                  >
                    {day}
                  </Button>
                ) : (
                  <span key={`empty-${idx}`} />
                )
              )}
            </div>
          </CardContent>
        </Card>

        <DashboardNotificationsCard
          className="p-0 lg:min-h-[28rem]"
          newCountLabel={`${contributorNotificationPreviewItems.filter((n) => n.unread).length} new`}
          footer={
            <Link
              to="/contributor/notifications"
              className={cn(
                "notif-secondary-action inline-flex w-full items-center justify-center rounded-md border border-transparent bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground shadow-xs transition-colors",
              )}
            >
              View all notifications
            </Link>
          }
        >
          {contributorNotificationPreviewItems.map((item) => (
            <ContributorDashboardNotificationRow key={item.id} item={item} />
          ))}
        </DashboardNotificationsCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 lg:items-stretch">
        <Card className="p-0 lg:min-h-[26rem]">
          <CardHeader className="px-6 pt-6 sm:px-8 sm:pt-8">
            <CardTitle className="text-lg font-bold">Strategic Perspectives</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 px-6 pb-6 sm:gap-4 sm:px-8 sm:pb-8">
            <Link
              to="/contributor/catalysts"
              className="strategic-perspective-bg-chart-1 inline-flex h-auto items-center justify-start rounded-[18px] p-4 text-base font-semibold text-secondary-foreground transition"
            >
              Catalysts
            </Link>
            <Link
              to="/contributor/enablers"
              className="strategic-perspective-bg-chart-2 inline-flex h-auto items-center justify-start rounded-[18px] p-4 text-base font-semibold text-secondary-foreground transition"
            >
              Enablers
            </Link>
            <Link
              to="/contributor/beneficiary"
              className="strategic-perspective-bg-chart-4 inline-flex h-auto items-center justify-start rounded-[18px] p-4 text-base font-semibold text-secondary-foreground transition"
            >
              Beneficiary
            </Link>
            <Link
              to="/contributor/stakeholders"
              className="strategic-perspective-bg-chart-5 inline-flex h-auto items-center justify-start rounded-[18px] p-4 text-base font-semibold text-secondary-foreground transition"
            >
              Stakeholders
            </Link>
          </CardContent>
        </Card>

        <Card className="p-0 lg:min-h-[26rem]">
          <CardHeader className="flex flex-row items-end justify-between px-6 pt-6 sm:px-8 sm:pt-8">
            <div className="min-w-0">
              <CardTitle className="text-lg font-bold">Your Proposals</CardTitle>
              <p className="mt-1 text-sm leading-snug text-muted-foreground">
              Track the inspection status of your proposed objectives, actions, and tasks
              </p>
            </div>
              <Link to="/contributor/proposals-status" className="shrink-0 text-xs font-semibold text-primary transition hover:underline sm:text-sm">
              View all
            </Link>
          </CardHeader>
          <CardContent className="px-6 pb-6 sm:px-8 sm:pb-8">
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="rounded-xl border border-border bg-muted/40 p-3 sm:p-4">
                <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground sm:text-xs">Pending</p>
                <p className="proposal-stat-num-pending mt-1 text-xl font-bold tabular-nums sm:text-2xl">2</p>
                <p className="mt-0.5 text-xs leading-tight text-muted-foreground">In queue</p>
              </div>
              <div className="rounded-xl border border-border bg-muted/40 p-3 sm:p-4">
                <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground sm:text-xs">Awaiting Re-Review</p>
                <p className="proposal-stat-num-chart-2 mt-1 text-xl font-bold tabular-nums sm:text-2xl">1</p>
                <p className="mt-0.5 text-xs leading-tight text-muted-foreground">Edited</p>
              </div>
              <div className="rounded-xl border border-border bg-muted/40 p-3 sm:p-4">
                <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground sm:text-xs">Change Requested</p>
                <p className="proposal-stat-num-chart-3 mt-1 text-xl font-bold tabular-nums sm:text-2xl">1</p>
                <p className="mt-0.5 text-xs leading-tight text-muted-foreground">Needs fix</p>
              </div>
              <div className="rounded-xl border border-border bg-muted/40 p-3 sm:p-4">
                <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground sm:text-xs">Accepted</p>
                <p className="proposal-stat-num-chart-4 mt-1 text-xl font-bold tabular-nums sm:text-2xl">4</p>
                <p className="mt-0.5 text-xs leading-tight text-muted-foreground">This cycle</p>
              </div>
            </div>
            <div className="mt-4 space-y-2 border-t border-border pt-4 sm:mt-5 sm:pt-5">
              <p className="text-xs leading-snug text-muted-foreground sm:text-sm">
                <span className="proposal-stat-num-filed font-semibold">12</span> filed ·{" "}
                <span className="proposal-stat-num-summary font-semibold">7</span> objectives ·{" "}
                <span className="proposal-stat-num-summary font-semibold">5</span> actions ·{" "}
                <span className="proposal-stat-num-summary font-semibold">14</span> tasks
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
