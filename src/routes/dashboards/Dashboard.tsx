import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Link, useNavigate } from "react-router-dom"
import uobLogo from "@/assets/UOB_LOGO.png"
import { CartesianGrid, Line, LineChart, ReferenceLine, ResponsiveContainer, XAxis, YAxis } from "recharts"

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

const implementationChartData = [
  { year: "2023", implementation: 72, target: 85 },
  { year: "2024", implementation: 78, target: 85 },
  { year: "2025", implementation: 86, target: 85 },
  { year: "2026", implementation: 64, target: 85 },
]

export default function DashboardPage() {
  const navigate = useNavigate()
  const today = new Date()
  const currentDay = String(today.getDate())
  const calendarTitle = monthLabelFormatter.format(today)
  const calendarDays = buildCalendarDays(today)
  return (
    <>
      <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 lg:p-8">
        <header className="flex flex-col gap-4 lg:flex-row lg:items-center">
          <div className="lg:max-w-none">
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Welcome, Juliana</h1>
            <p className="mt-1 whitespace-nowrap text-sm text-muted-foreground sm:text-base">
              Here is a concise overview of your operational plan
            </p>
          </div>
          <div className="flex flex-1 justify-end">
            <img src={uobLogo} alt="University of Bahrain logo" className="h-20 w-20 object-contain" />
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card
            onClick={() => navigate("/calendar")}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault()
                navigate("/calendar")
              }
            }}
            role="button"
            tabIndex={0}
            title="Open calendar to view and manage weekly and monthly schedules."
            className="cursor-pointer transition hover:shadow-md hover:ring-1 hover:ring-border"
          >
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">{calendarTitle}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-7 text-center text-xs font-medium text-muted-foreground">
                <span>SUN</span><span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center">
                {calendarDays.map((day, i) =>
                  day ? (
                    <Button
                      key={`${day}-${i}`}
                      variant={day === currentDay ? "default" : "ghost"}
                      size="icon-sm"
                      className="mx-auto"
                    >
                      {day}
                    </Button>
                  ) : (
                    <span key={`empty-${i}`} />
                  )
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Notifications</CardTitle>
              <Badge variant="secondary">3 new</Badge>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-lg border border-border bg-muted/40 p-3">
                <p className="text-sm font-semibold text-foreground">Action returned for edits</p>
                <p className="text-sm text-muted-foreground">Auditor left notes on REQ-2026-0112.</p>
                <p className="text-xs text-muted-foreground">Just now</p>
              </div>
              <div className="rounded-lg border border-border bg-muted/40 p-3">
                <p className="text-sm font-semibold text-foreground">Operational plan review</p>
                <p className="text-sm text-muted-foreground">Provost office requested updates to Q2 milestones.</p>
                <p className="text-xs text-muted-foreground">2 min ago</p>
              </div>
              <div className="rounded-lg border border-border bg-muted/40 p-3">
                <p className="text-sm font-semibold text-foreground">Submission approved</p>
                <p className="text-sm text-muted-foreground">College of Arts plan v3 is approved for publication.</p>
                <p className="text-xs text-muted-foreground">1 hour ago</p>
              </div>
              <Button variant="outline" className="w-full">View all notifications</Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="grid gap-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Strategic Perspectives</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-2">
                <Link to="/catalysts" className="inline-flex h-8 items-center justify-start rounded-lg bg-secondary px-2.5 text-sm font-medium text-secondary-foreground hover:bg-secondary/80">Catalysts</Link>
                <Link to="/enablers" className="inline-flex h-8 items-center justify-start rounded-lg bg-secondary px-2.5 text-sm font-medium text-secondary-foreground hover:bg-secondary/80">Enablers</Link>
                <Link to="/beneficiary" className="inline-flex h-8 items-center justify-start rounded-lg bg-secondary px-2.5 text-sm font-medium text-secondary-foreground hover:bg-secondary/80">Beneficiary</Link>
                <Link to="/stakeholders" className="inline-flex h-8 items-center justify-start rounded-lg bg-secondary px-2.5 text-sm font-medium text-secondary-foreground hover:bg-secondary/80">Stakeholders</Link>
              </CardContent>
            </Card>

            <Card className="p-0 lg:min-h-[16rem]">
              <CardHeader className="flex flex-row items-end justify-between px-5 pt-5 sm:px-6 sm:pt-6">
                <div className="min-w-0">
                  <CardTitle className="text-lg">Your Proposals</CardTitle>
                  <p className="mt-1 text-sm leading-snug text-muted-foreground">
                    Track the inspection status of your proposed objectives, actions, and tasks
                  </p>
                </div>
                <Link to="/proposals-status" className="shrink-0 text-xs font-semibold text-primary transition hover:underline sm:text-sm">
                  View all
                </Link>
              </CardHeader>
              <CardContent className="px-5 pb-4 sm:px-6 sm:pb-5">
                <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                  <div className="rounded-xl border border-border bg-muted/40 p-2.5 sm:p-3">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground sm:text-xs">Pending</p>
                    <p className="mt-0.5 text-lg font-bold tabular-nums text-foreground sm:text-xl">2</p>
                    <p className="mt-0.5 text-xs leading-tight text-muted-foreground">In queue</p>
                  </div>
                  <div className="rounded-xl border border-border bg-muted/40 p-2.5 sm:p-3">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground sm:text-xs">Awaiting Re-Review</p>
                    <p className="mt-0.5 text-lg font-bold tabular-nums text-foreground sm:text-xl">1</p>
                    <p className="mt-0.5 text-xs leading-tight text-muted-foreground">Edited</p>
                  </div>
                  <div className="rounded-xl border border-border bg-muted/40 p-2.5 sm:p-3">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground sm:text-xs">Change Requested</p>
                    <p className="mt-0.5 text-lg font-bold tabular-nums text-foreground sm:text-xl">1</p>
                    <p className="mt-0.5 text-xs leading-tight text-muted-foreground">Needs fix</p>
                  </div>
                  <div className="rounded-xl border border-border bg-muted/40 p-2.5 sm:p-3">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground sm:text-xs">Accepted</p>
                    <p className="mt-0.5 text-lg font-bold tabular-nums text-foreground sm:text-xl">4</p>
                    <p className="mt-0.5 text-xs leading-tight text-muted-foreground">This cycle</p>
                  </div>
                </div>
                <div className="mt-3 space-y-1 border-t border-border pt-3 sm:mt-4 sm:pt-4">
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

          <Card className="flex h-full min-h-0 flex-col rounded-3xl p-5 ring-1 ring-border/60 sm:p-6 lg:min-h-[22rem]" aria-labelledby="indicator-chart-heading">
            <div className="mb-3 flex shrink-0 flex-col gap-2 sm:mb-4 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
              <div>
                <h2 id="indicator-chart-heading" className="text-base font-bold text-foreground sm:text-lg">
                  Strategic action implementation rate
                </h2>
                <p className="mt-0.5 line-clamp-2 max-w-2xl text-xs leading-snug text-muted-foreground sm:line-clamp-none sm:text-sm">
                  Share of planned operational actions marked complete for the reporting year (university-wide aggregate).
                  Replace values via PHP or your API when connecting live data.
                </p>
              </div>
              <div className="flex shrink-0 flex-wrap items-center gap-2 self-start">
                <Badge className="rounded-full px-3 py-1 text-xs font-semibold" variant="secondary">
                  C1.2
                </Badge>
                <Button
                  type="button"
                  id="indicator-target-btn"
                  size="sm"
                  variant="outline"
                  title="Annual target for this indicator"
                  aria-label="Target completion: 85 percent"
                  className="h-7 rounded-full px-3 text-xs font-semibold shadow-sm"
                >
                  Target <span className="tabular-nums text-foreground">85%</span>
                </Button>
              </div>
            </div>
            <div className="relative min-h-[9rem] w-full flex-1 sm:min-h-[10rem]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={implementationChartData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="4 4" className="stroke-border/60" vertical={false} />
                  <XAxis dataKey="year" axisLine={false} tickLine={false} className="fill-muted-foreground text-xs" />
                  <YAxis
                    domain={[0, 100]}
                    ticks={[0, 20, 40, 60, 80, 100]}
                    axisLine={false}
                    tickLine={false}
                    className="fill-muted-foreground text-xs"
                  />
                  <ReferenceLine y={85} strokeDasharray="5 5" className="stroke-muted-foreground" />
                  <Line
                    type="monotone"
                    dataKey="implementation"
                    strokeWidth={3}
                    className="stroke-primary"
                    dot={{ r: 4, className: "fill-primary" }}
                    activeDot={{ r: 5, className: "fill-primary" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-2 shrink-0 text-center text-[11px] text-muted-foreground sm:mt-2.5 sm:text-xs">
              2026 figure is year-to-date (sample data).
            </p>
          </Card>
        </div>
      </div>
    </>
  )
}