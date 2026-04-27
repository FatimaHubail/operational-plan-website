import { Link, useNavigate } from "react-router-dom"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import uobLogo from "@/assets/UOB_LOGO.png"

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
        <div className="flex flex-1 justify-end">
          <img src={uobLogo} alt="University of Bahrain logo" className="h-20 w-20 object-contain" />
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
            <CardTitle className="text-lg">{calendarTitle}</CardTitle>
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

        <Card className="p-0 lg:min-h-[28rem]">
          <CardHeader className="flex flex-row items-center justify-between gap-3 px-6 pt-6 sm:px-8 sm:pt-8">
            <CardTitle className="text-lg">Notifications</CardTitle>
            <Badge variant="secondary">4 new</Badge>
          </CardHeader>
          <CardContent className="space-y-3 px-6 pb-6 sm:px-8 sm:pb-8">
            <article className="rounded-2xl border border-border bg-muted/40 p-3">
              <p className="text-sm font-semibold text-foreground">Action returned for edits</p>
              <p className="mt-0.5 text-sm text-muted-foreground">Auditor left notes on REQ-2026-0112 — open My submissions to continue.</p>
              <p className="mt-1.5 text-xs font-medium text-muted-foreground">Just now</p>
            </article>
            <article className="rounded-2xl border border-border bg-muted/40 p-3">
              <p className="text-sm font-semibold text-foreground">Operational plan review</p>
              <p className="mt-0.5 text-sm text-muted-foreground">Provost office requested updates to Q2 milestones.</p>
              <p className="mt-1.5 text-xs font-medium text-muted-foreground">2 min ago</p>
            </article>
            <article className="rounded-2xl border border-border bg-muted/40 p-3">
              <p className="text-sm font-semibold text-foreground">Submission approved</p>
              <p className="mt-0.5 text-sm text-muted-foreground">College of Arts plan v3 is approved for publication.</p>
              <p className="mt-1.5 text-xs font-medium text-muted-foreground">1 hour ago</p>
            </article>
            <article className="rounded-2xl border border-border bg-muted/40 p-3">
              <p className="text-sm font-semibold text-foreground">Reminder: budget alignment</p>
              <p className="mt-0.5 text-sm text-muted-foreground">Link financial targets to initiatives by Friday.</p>
              <p className="mt-1.5 text-xs font-medium text-muted-foreground">Yesterday</p>
            </article>
            <Link
              to="/contributor/notifications"
              className="inline-flex w-full items-center justify-center rounded-full border border-border bg-background py-2.5 text-sm font-semibold text-foreground transition hover:bg-muted"
            >
              View all notifications
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 lg:items-stretch">
        <Card className="p-0 lg:min-h-[26rem]">
          <CardHeader className="px-6 pt-6 sm:px-8 sm:pt-8">
            <CardTitle className="text-lg">Strategic Perspectives</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 px-6 pb-6 sm:gap-4 sm:px-8 sm:pb-8">
            <Link
              to="/contributor/catalysts"
              className="inline-flex h-auto items-center justify-start rounded-[18px] bg-secondary p-4 text-base font-semibold text-secondary-foreground transition hover:bg-secondary/80"
            >
              Catalysts
            </Link>
            <Link
              to="/contributor/enablers"
              className="inline-flex h-auto items-center justify-start rounded-[18px] bg-secondary p-4 text-base font-semibold text-secondary-foreground transition hover:bg-secondary/80"
            >
              Enablers
            </Link>
            <Link
              to="/contributor/beneficiary"
              className="inline-flex h-auto items-center justify-start rounded-[18px] bg-secondary p-4 text-base font-semibold text-secondary-foreground transition hover:bg-secondary/80"
            >
              Beneficiary
            </Link>
            <Link
              to="/contributor/stakeholders"
              className="inline-flex h-auto items-center justify-start rounded-[18px] bg-secondary p-4 text-base font-semibold text-secondary-foreground transition hover:bg-secondary/80"
            >
              Stakeholders
            </Link>
          </CardContent>
        </Card>

        <Card className="p-0 lg:min-h-[26rem]">
          <CardHeader className="flex flex-row items-end justify-between px-6 pt-6 sm:px-8 sm:pt-8">
            <div className="min-w-0">
              <CardTitle className="text-lg">Your Proposals</CardTitle>
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
                <p className="mt-1 text-xl font-bold tabular-nums text-foreground sm:text-2xl">2</p>
                <p className="mt-0.5 text-xs leading-tight text-muted-foreground">In queue</p>
              </div>
              <div className="rounded-xl border border-border bg-muted/40 p-3 sm:p-4">
                <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground sm:text-xs">Awaiting Re-Review</p>
                <p className="mt-1 text-xl font-bold tabular-nums text-foreground sm:text-2xl">1</p>
                <p className="mt-0.5 text-xs leading-tight text-muted-foreground">Edited</p>
              </div>
              <div className="rounded-xl border border-border bg-muted/40 p-3 sm:p-4">
                <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground sm:text-xs">Change Requested</p>
                <p className="mt-1 text-xl font-bold tabular-nums text-foreground sm:text-2xl">1</p>
                <p className="mt-0.5 text-xs leading-tight text-muted-foreground">Needs fix</p>
              </div>
              <div className="rounded-xl border border-border bg-muted/40 p-3 sm:p-4">
                <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground sm:text-xs">Accepted</p>
                <p className="mt-1 text-xl font-bold tabular-nums text-foreground sm:text-2xl">4</p>
                <p className="mt-0.5 text-xs leading-tight text-muted-foreground">This cycle</p>
              </div>
            </div>
            <div className="mt-4 space-y-2 border-t border-border pt-4 sm:mt-5 sm:pt-5">
              <p className="text-xs leading-snug text-muted-foreground sm:text-sm">
                <span className="font-semibold text-foreground">12</span> filed ·{" "}
                <span className="font-semibold text-foreground">7</span> objectives ·{" "}
                <span className="font-semibold text-foreground">5</span> actions ·{" "}
                <span className="font-semibold text-foreground">14</span> tasks
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
