import { Link } from "react-router-dom"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

const calendarDays = [
  "", "", "", "", "", "1", "2",
  "3", "4", "5", "6", "7", "8", "9",
  "10", "11", "12", "13", "14", "15", "16",
  "17", "18", "19", "20", "21", "22", "23",
  "24", "25", "26", "27", "28", "29", "30",
]

export default function ContributerDashboard() {
  return (
    <div className="min-w-0 flex-1 overflow-x-hidden bg-background p-4 sm:p-6 lg:p-8">
      <header className="mb-6 flex flex-col gap-5 lg:mb-8 lg:flex-row lg:items-center lg:gap-6">
        <div className="shrink-0 lg:max-w-xs">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Welcome, Juliana</h1>
          <p className="mt-1 text-sm text-muted-foreground sm:text-base">
            Here is a concise overview of your operational plan
          </p>
        </div>
        <div className="flex flex-1 flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:justify-center">
          <div className="w-full max-w-xl">
            <Input type="search" placeholder="Search" className="h-11 rounded-full" />
          </div>
        </div>
        <div className="flex shrink-0 justify-end">
          <Avatar className="h-11 w-11">
            <AvatarImage src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop&crop=face" />
            <AvatarFallback>JU</AvatarFallback>
          </Avatar>
        </div>
      </header>

      <div className="mb-6 grid gap-6 lg:grid-cols-2 lg:items-stretch">
        <Card className="p-0">
          <CardHeader className="flex flex-row items-center justify-between px-6 pt-6 sm:px-8 sm:pt-8">
            <CardTitle className="text-lg">April 2026</CardTitle>
            <div className="flex gap-1">
              <Button type="button" size="icon-sm" variant="ghost" aria-label="Previous month">{"<"}</Button>
              <Button type="button" size="icon-sm" variant="ghost" aria-label="Next month">{">"}</Button>
            </div>
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
                    variant={day === "8" ? "default" : "ghost"}
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
            <CardTitle className="text-lg">Strategic perspectives</CardTitle>
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
              <CardTitle className="text-lg">Your submissions</CardTitle>
              <p className="mt-1 text-sm leading-snug text-muted-foreground">
                Auditor queue for objectives and actions you filed.
              </p>
            </div>
              <Link to="/contributor/submission-status" className="shrink-0 text-xs font-semibold text-primary transition hover:underline sm:text-sm">
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
                <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground sm:text-xs">Re-review</p>
                <p className="mt-1 text-xl font-bold tabular-nums text-foreground sm:text-2xl">1</p>
                <p className="mt-0.5 text-xs leading-tight text-muted-foreground">Edited</p>
              </div>
              <div className="rounded-xl border border-border bg-muted/40 p-3 sm:p-4">
                <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground sm:text-xs">Returned</p>
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
                <span className="font-semibold text-foreground">5</span> actions
              </p>
              <Link to="/contributor/calendar" className="inline-flex text-xs font-semibold text-primary transition hover:underline sm:text-sm">
                Auditor workspace
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
