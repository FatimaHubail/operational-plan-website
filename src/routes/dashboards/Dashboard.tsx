import {
  ContributorDashboardNotificationRow,
  DashboardNotificationsCard,
  type ContributorPreviewItem,
} from "@/components/dashboard-notification-preview"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Link, useNavigate } from "react-router-dom"
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import {
  ChartContainer,
  type ChartConfig,
} from "@/components/ui/chart"

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

const implementationRateChartConfig = {
  implementation: {
    label: "Implementation rate",
    color: "oklch(0.72 0.18 47)",
  },
} satisfies ChartConfig

const implementationLineColor = "oklch(0.72 0.18 47)"

/** Y-axis / dashed reference — annual completion target (%) */
const IMPLEMENTATION_TARGET_Y = 85

const notificationPreviewItems: ContributorPreviewItem[] = [
  {
    id: "dash-n1",
    title: "Action returned for edits",
    body: "Auditor left notes on REQ-2026-0112.",
    time: "Just now",
    category: "resubmission",
    entityType: "action",
    strategicPerspective: "beneficiary",
    unread: true,
  },
  {
    id: "dash-n2",
    title: "Operational plan review",
    body: "Provost office requested updates to Q2 milestones.",
    time: "2 min ago",
    category: "calendar",
    entityType: "event",
    strategicPerspective: "stakeholders",
    unread: true,
  },
  {
    id: "dash-n3",
    title: "Submission approved",
    body: "College of Arts plan v3 is approved for publication.",
    time: "1 hour ago",
    category: "lifecycle",
    entityType: "objective",
    strategicPerspective: "catalysts",
    unread: true,
  },
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
              <CardTitle className="text-lg font-bold">{calendarTitle}</CardTitle>
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

          <DashboardNotificationsCard
            className="lg:min-h-0"
            newCountLabel={`${notificationPreviewItems.filter((n) => n.unread).length} new`}
            footer={
              <Link
                to="/notifications"
                className={cn(
                  "notif-secondary-action inline-flex w-full items-center justify-center rounded-md border border-transparent bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground shadow-xs transition-colors",
                )}
              >
                View all notifications
              </Link>
            }
          >
            {notificationPreviewItems.map((item) => (
              <ContributorDashboardNotificationRow key={item.id} item={item} />
            ))}
          </DashboardNotificationsCard>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="grid gap-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-bold">Strategic Perspectives</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-2">
                <Link
                  to="/catalysts"
                  className="strategic-perspective-bg-chart-1 inline-flex h-8 items-center justify-start rounded-lg px-2.5 text-sm font-medium text-secondary-foreground transition"
                >
                  Catalysts
                </Link>
                <Link
                  to="/enablers"
                  className="strategic-perspective-bg-chart-2 inline-flex h-8 items-center justify-start rounded-lg px-2.5 text-sm font-medium text-secondary-foreground transition"
                >
                  Enablers
                </Link>
                <Link
                  to="/beneficiary"
                  className="strategic-perspective-bg-chart-4 inline-flex h-8 items-center justify-start rounded-lg px-2.5 text-sm font-medium text-secondary-foreground transition"
                >
                  Beneficiary
                </Link>
                <Link
                  to="/stakeholders"
                  className="strategic-perspective-bg-chart-5 inline-flex h-8 items-center justify-start rounded-lg px-2.5 text-sm font-medium text-secondary-foreground transition"
                >
                  Stakeholders
                </Link>
              </CardContent>
            </Card>

            <Card className="p-0 lg:min-h-[16rem]">
              <CardHeader className="flex flex-row items-end justify-between px-5 pt-5 sm:px-6 sm:pt-6">
                <div className="min-w-0">
                  <CardTitle className="text-lg font-bold">Your Proposals</CardTitle>
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
                    <p className="proposal-stat-num-pending mt-0.5 text-lg font-bold tabular-nums sm:text-xl">2</p>
                    <p className="mt-0.5 text-xs leading-tight text-muted-foreground">In queue</p>
                  </div>
                  <div className="rounded-xl border border-border bg-muted/40 p-2.5 sm:p-3">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground sm:text-xs">Awaiting Re-Review</p>
                    <p className="proposal-stat-num-chart-2 mt-0.5 text-lg font-bold tabular-nums sm:text-xl">1</p>
                    <p className="mt-0.5 text-xs leading-tight text-muted-foreground">Edited</p>
                  </div>
                  <div className="rounded-xl border border-border bg-muted/40 p-2.5 sm:p-3">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground sm:text-xs">Change Requested</p>
                    <p className="proposal-stat-num-chart-3 mt-0.5 text-lg font-bold tabular-nums sm:text-xl">1</p>
                    <p className="mt-0.5 text-xs leading-tight text-muted-foreground">Needs fix</p>
                  </div>
                  <div className="rounded-xl border border-border bg-muted/40 p-2.5 sm:p-3">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground sm:text-xs">Accepted</p>
                    <p className="proposal-stat-num-chart-4 mt-0.5 text-lg font-bold tabular-nums sm:text-xl">4</p>
                    <p className="mt-0.5 text-xs leading-tight text-muted-foreground">This cycle</p>
                  </div>
                </div>
                <div className="mt-3 space-y-1 border-t border-border pt-3 sm:mt-4 sm:pt-4">
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

          <Card className="flex h-full min-h-0 flex-col rounded-3xl p-5 ring-1 ring-border/60 sm:p-6 lg:min-h-[22rem]" aria-labelledby="indicator-chart-heading">
            <div className="mb-3 flex shrink-0 flex-col gap-2 sm:mb-4 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
              <div>
                <h2 id="indicator-chart-heading" className="text-base font-bold text-foreground sm:text-lg">
                  Strategic action implementation rate
                </h2>
                <p className="mt-0.5 line-clamp-2 max-w-2xl text-xs leading-snug text-muted-foreground sm:line-clamp-none sm:text-sm">
                  Overview of implementation progress for perspectives indicators under your responsibility over years
                </p>
              </div>
              <div className="flex shrink-0 flex-wrap items-center gap-2 self-start">
                <Badge className="notif-new-badge rounded-full px-3 py-1 text-xs font-semibold" variant="secondary">
                  C1.2
                </Badge>
                <Button
                  type="button"
                  id="indicator-target-btn"
                  size="sm"
                  variant="outline"
                  title="Annual target for this indicator"
                  aria-label={`Target completion: ${IMPLEMENTATION_TARGET_Y} percent`}
                  className="h-7 rounded-full px-3 text-xs font-semibold shadow-sm"
                >
                  Target{" "}
                  <span className="tabular-nums text-foreground">{IMPLEMENTATION_TARGET_Y}%</span>
                </Button>
              </div>
            </div>
            <ChartContainer
              config={implementationRateChartConfig}
              className="relative aspect-auto min-h-[9rem] w-full flex-1 sm:min-h-[10rem] [&_.recharts-wrapper]:outline-none"
              initialDimension={{ width: 560, height: 220 }}
            >
              <LineChart data={implementationChartData} margin={{ top: 8, right: 8, left: 4, bottom: 0 }}>
                <CartesianGrid strokeDasharray="4 4" className="stroke-border/60" vertical={false} />
                <XAxis dataKey="year" axisLine={false} tickLine={false} className="fill-muted-foreground text-xs" />
                <YAxis
                  domain={[0, 100]}
                  ticks={[0, 20, 40, 60, 80, IMPLEMENTATION_TARGET_Y, 100]}
                  axisLine={false}
                  tickLine={false}
                  className="fill-muted-foreground text-xs"
                  width={44}
                />
                <Tooltip
                  cursor={{
                    stroke: "color-mix(in oklch, oklch(0.72 0.18 47) 28%, transparent)",
                    strokeWidth: 1,
                  }}
                  content={({ active, payload, label }) => {
                    if (!active || !payload?.length) return null
                    const row = payload[0]
                    const v = row?.value
                    const point = row?.payload as
                      | { year?: string; implementation?: number; target?: number }
                      | undefined
                    const targetVal = point?.target
                    return (
                      <div className="grid min-w-[10.5rem] gap-1.5 rounded-lg border border-border/60 bg-popover px-3 py-2 text-xs text-popover-foreground shadow-lg">
                        <p className="font-semibold leading-none text-foreground">{label}</p>
                        <div className="flex items-center gap-2 leading-none">
                          <span
                            className="size-2 shrink-0 rounded-full ring-2 ring-background"
                            style={{ backgroundColor: implementationLineColor }}
                            aria-hidden
                          />
                          <span className="text-muted-foreground">{implementationRateChartConfig.implementation.label}</span>
                          <span className="ml-auto font-mono font-semibold tabular-nums text-foreground">
                            {typeof v === "number" ? `${v}%` : v}
                          </span>
                        </div>
                        {targetVal != null ? (
                          <div className="flex items-center justify-between gap-2 border-t border-border/50 pt-1.5 leading-none">
                            <span className="text-muted-foreground">Target value</span>
                            <span className="font-mono font-semibold tabular-nums text-foreground">
                              {typeof targetVal === "number" ? `${targetVal}%` : targetVal}
                            </span>
                          </div>
                        ) : null}
                      </div>
                    )
                  }}
                />
                <ReferenceLine
                  y={IMPLEMENTATION_TARGET_Y}
                  strokeDasharray="6 5"
                  strokeWidth={3.5}
                  className="stroke-muted-foreground"
                  label={{
                    value: "Target",
                    position: "insideLeft",
                    fill: "var(--muted-foreground)",
                    fontSize: 10,
                    fontWeight: 600,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="implementation"
                  stroke="var(--color-implementation)"
                  strokeWidth={3}
                  dot={{
                    r: 5,
                    fill: "var(--color-implementation)",
                    stroke: "var(--card)",
                    strokeWidth: 2,
                  }}
                  activeDot={{
                    r: 9,
                    strokeWidth: 3,
                    stroke: "var(--card)",
                    fill: "var(--color-implementation)",
                    className: "drop-shadow-[0_2px_8px_rgba(0,0,0,0.18)]",
                  }}
                />
              </LineChart>
            </ChartContainer>
            <p className="mt-2 shrink-0 text-center text-[11px] text-muted-foreground sm:mt-2.5 sm:text-xs">
              2026 figure is year-to-date (sample data).
            </p>
          </Card>
        </div>
      </div>
    </>
  )
}