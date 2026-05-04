import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

type ChartKey = 1 | 2 | 3 | 4 | 5

/** Pastel event chips — same color-mix strategy as `.notif-type-badge-chart-*` */
const weekEventChipClass: Record<ChartKey, string> = {
  1: cn(
    "rounded-lg px-2 py-1 text-[11px] font-semibold leading-tight shadow-sm",
    "bg-[color-mix(in_oklch,var(--chart-1)_20%,white)] text-[color-mix(in_oklch,var(--chart-1)_42%,var(--foreground))]",
    "dark:bg-[color-mix(in_oklch,var(--chart-1)_34%,var(--card))] dark:text-[color-mix(in_oklch,var(--chart-1)_58%,var(--foreground))]"
  ),
  2: cn(
    "rounded-lg px-2 py-1 text-[11px] font-semibold leading-tight shadow-sm",
    "bg-[color-mix(in_oklch,var(--chart-2)_20%,white)] text-[color-mix(in_oklch,var(--chart-2)_54%,var(--foreground))]",
    "dark:bg-[color-mix(in_oklch,var(--chart-2)_34%,var(--card))] dark:text-[color-mix(in_oklch,var(--chart-2)_72%,var(--foreground))]"
  ),
  3: cn(
    "rounded-lg px-2 py-1 text-[11px] font-semibold leading-tight shadow-sm",
    "bg-[color-mix(in_oklch,var(--chart-3)_18%,white)] text-[oklch(0.46_0.088_94)]",
    "dark:bg-[color-mix(in_oklch,var(--chart-3)_30%,var(--card))] dark:text-[oklch(0.46_0.088_94)]"
  ),
  4: cn(
    "rounded-lg px-2 py-1 text-[11px] font-semibold leading-tight shadow-sm",
    "bg-[color-mix(in_oklch,var(--chart-4)_20%,white)] text-[color-mix(in_oklch,var(--chart-4)_42%,var(--foreground))]",
    "dark:bg-[color-mix(in_oklch,var(--chart-4)_34%,var(--card))] dark:text-[color-mix(in_oklch,var(--chart-4)_58%,var(--foreground))]"
  ),
  5: cn(
    "rounded-lg px-2 py-1 text-[11px] font-semibold leading-tight shadow-sm text-chart-5",
    "bg-[color-mix(in_oklch,var(--chart-5)_20%,white)]",
    "dark:bg-[color-mix(in_oklch,var(--chart-5)_34%,var(--card))] dark:text-chart-5"
  ),
}

const chartDotClass: Record<ChartKey, string> = {
  1: "bg-chart-1",
  2: "bg-chart-2",
  3: "bg-chart-3",
  4: "bg-chart-4",
  5: "bg-chart-5",
}

const weekEvents: ({ title: string; chart: ChartKey } | null)[][] = [
  [{ title: "Plan review checkpoint", chart: 3 }, null, { title: "Initiative workshop", chart: 4 }, { title: "Steering committee", chart: 2 }, { title: "Metrics data review", chart: 1 }],
  [null, { title: "KPI alignment session", chart: 5 }, { title: "Q2 reporting clinic", chart: 1 }, null, null],
  [null, null, null, null, null],
  [null, { title: "Department milestones", chart: 2 }, null, null, { title: "Planning office 1:1", chart: 5 }],
  [null, null, null, null, null],
  [null, null, null, null, null],
  [null, { title: "Executive briefing prep", chart: 1 }, null, null, { title: "Strategic indicators review", chart: 3 }],
  [null, null, null, null, { title: "Cross-unit actions", chart: 4 }],
  [null, null, { title: "Budget line check", chart: 3 }, null, null],
]

type MonthEventDot = { label: string; chart: ChartKey } | { label: string; neutral: true }

type MonthCell = {
  day: string
  muted?: boolean
  events?: MonthEventDot[]
  moreCount?: number
}

/** Demo month grid aligned with OperationalPlan/calender.html (April 2026); dots use --chart-* */
const monthCells: MonthCell[] = [
  { day: "27", muted: true },
  { day: "28", muted: true },
  { day: "29", muted: true },
  { day: "30", muted: true },
  { day: "31", muted: true },
  { day: "1", events: [{ label: "10:00 am Plan intake call", neutral: true }] },
  { day: "2" },
  { day: "3" },
  {
    day: "4",
    events: [{ label: "2:00 pm Milestone check-in", neutral: true }],
  },
  {
    day: "5",
    events: [
      { label: "8:50 am KPI alignment rev…", chart: 5 },
      { label: "1:30 pm Department mileston…", chart: 2 },
      { label: "2:45 pm Executive briefing…", chart: 1 },
    ],
  },
  {
    day: "6",
    events: [
      { label: "10:30 am Initiative scoping…", chart: 4 },
      { label: "11:20 am Q2 reporting worksh…", chart: 1 },
      { label: "4:15 pm Budget line review", chart: 3 },
    ],
  },
  {
    day: "7",
    events: [{ label: "11:00 am Steering sync", chart: 2 }],
  },
  {
    day: "8",
    events: [
      { label: "9:30 am Metrics data review", chart: 1 },
      { label: "12:00 pm Planning office 1:1", chart: 5 },
      { label: "3:00 pm Strategic indicators…", chart: 2 },
    ],
    moreCount: 1,
  },
  { day: "9" },
  { day: "10" },
  {
    day: "11",
    events: [{ label: "9:00 am Unit plan workshop", chart: 4 }],
  },
  { day: "12" },
  { day: "13" },
  { day: "14" },
  { day: "15" },
  { day: "16" },
  { day: "17" },
  { day: "18" },
  { day: "19" },
  { day: "20" },
  { day: "21" },
  { day: "22" },
  { day: "23" },
  { day: "24" },
  { day: "25" },
  { day: "26" },
  { day: "27" },
  { day: "28" },
  { day: "29" },
  {
    day: "30",
    events: [{ label: "4:00 pm Quarter close-out", chart: 5 }],
  },
]

/** ~13:00 indicator — 9:00 origin, 48px/h → 4 × 48px (matches static HTML reference) */
const NOW_LINE_TOP_PX = 192

export default function Calendar() {
  const [view, setView] = useState<"week" | "month">("week")
  const [monthOffset, setMonthOffset] = useState(0)
  const today = useMemo(() => new Date(), [])

  const weekHeaders = useMemo(() => {
    const start = new Date(today)
    start.setHours(0, 0, 0, 0)
    start.setDate(today.getDate() - today.getDay()) // Sunday
    return Array.from({ length: 5 }, (_, idx) => {
      const d = new Date(start)
      d.setDate(start.getDate() + idx)
      const isToday = d.toDateString() === today.toDateString()
      return {
        key: d.toISOString(),
        day: d.toLocaleDateString("en-US", { weekday: "long" }),
        date: String(d.getDate()),
        isToday,
      }
    })
  }, [today])

  const todayLabel = useMemo(
    () =>
      new Intl.DateTimeFormat("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }).format(new Date()),
    []
  )

  const monthTitle = useMemo(() => {
    const base = new Date()
    base.setMonth(base.getMonth() + monthOffset, 1)
    return new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(base)
  }, [monthOffset])

  return (
    <div className="min-w-0 flex-1 overflow-x-hidden bg-background p-4 sm:p-6 lg:p-8">
      <header className="mb-5 flex h-11 items-center gap-2">
        <SidebarTrigger className="md:hidden" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link to="/dashboard" />}>Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Calendar</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <header className="mb-4 sm:mb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Calendar</h1>
          <p className="mt-1 text-sm font-medium text-muted-foreground sm:text-base">{todayLabel}</p>
        </div>
      </header>

      <div className="mb-3 flex justify-start sm:justify-end">
        <Tabs value={view} onValueChange={(v) => setView(v as "week" | "month")} className="w-auto">
          <TabsList className="h-auto gap-0 rounded-full bg-muted/80 p-1">
            <TabsTrigger
              value="week"
              className="rounded-full px-5 py-2 text-sm font-semibold text-muted-foreground data-active:shadow-sm data-active:!bg-[oklch(0.70_0.18_47)] data-active:!text-[oklch(1_0_0)] dark:data-active:!bg-[oklch(0.70_0.18_47)] dark:data-active:!text-[oklch(1_0_0)]"
            >
              Week
            </TabsTrigger>
            <TabsTrigger
              value="month"
              className="rounded-full px-5 py-2 text-sm font-semibold text-muted-foreground data-active:shadow-sm data-active:!bg-[oklch(0.70_0.18_47)] data-active:!text-[oklch(1_0_0)] dark:data-active:!bg-[oklch(0.70_0.18_47)] dark:data-active:!text-[oklch(1_0_0)]"
            >
              Month
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {view === "week" ? (
        <Card className="rounded-3xl border border-border bg-card shadow-sm ring-1 ring-border/60">
          <CardContent className="p-4 sm:p-6 lg:p-8">
            <div className="overflow-x-auto">
              <div className="min-w-[580px] w-full max-w-full">
                <div className="mb-2 grid grid-cols-5 gap-0 border-b border-border pb-3">
                  {weekHeaders.map((d) => (
                    <div key={d.key} className="text-center">
                      {d.isToday ? (
                        <p className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">{d.date}</p>
                      ) : (
                        <p className="text-xs font-medium text-muted-foreground">{d.date}</p>
                      )}
                      <p className={cn("mt-0.5 text-sm font-semibold text-foreground", d.isToday && "text-primary")}>{d.day}</p>
                    </div>
                  ))}
                </div>

                <div className="relative grid grid-cols-5 gap-0 border-l border-border">
                    {[0, 1, 2, 3, 4].map((col) => {
                      const isTodayCol = weekHeaders[col]?.isToday
                      return (
                        <div
                          key={`col-${col}`}
                          className={cn(
                            "relative h-[432px] bg-[linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[length:100%_3rem] bg-[position:0_0]",
                            col < 4 ? "border-r border-border/50" : ""
                          )}
                        >
                          {isTodayCol ? (
                            <div
                              className="pointer-events-none absolute inset-x-0 z-20 flex items-center"
                              style={{ top: NOW_LINE_TOP_PX }}
                              aria-hidden="true"
                            >
                              <div className="h-0.5 w-full bg-primary/90" />
                              <span className="absolute -left-1 h-2 w-2 rounded-full bg-primary" />
                            </div>
                          ) : null}
                          <div className="absolute inset-0 grid grid-rows-9">
                            {weekEvents.map((row, idx) => (
                              <div key={`cell-${col}-${idx}`} className="border-b border-border/35 px-1 py-1">
                                {row[col] ? (
                                  <div className={cn("h-full min-h-0", weekEventChipClass[row[col]!.chart])}>{row[col]!.title}</div>
                                ) : null}
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="rounded-3xl border border-border bg-card shadow-sm ring-1 ring-border/60">
          <CardContent className="p-4 sm:p-6 lg:p-8">
            <div className="mb-4 flex items-center justify-between sm:mb-5">
              <h2 className="text-lg font-bold text-foreground sm:text-xl">{monthTitle}</h2>
              <div className="flex gap-1">
                <Button type="button" variant="ghost" size="icon-sm" aria-label="Previous month" onClick={() => setMonthOffset((v) => v - 1)}>
                  <ChevronLeftIcon className="size-4" />
                </Button>
                <Button type="button" variant="ghost" size="icon-sm" aria-label="Next month" onClick={() => setMonthOffset((v) => v + 1)}>
                  <ChevronRightIcon className="size-4" />
                </Button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <div className="min-w-[640px] rounded-xl border border-border bg-card">
                <div className="grid grid-cols-7 border-b border-border">
                  {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((day) => (
                    <div key={day} className="border-r border-border/50 py-2.5 text-center text-[11px] font-semibold tracking-wide text-muted-foreground last:border-r-0">
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7">
                  {monthCells.map((cell, idx) => (
                    <div
                      key={`${cell.day}-${idx}`}
                      className="min-h-[6.5rem] border-b border-r border-border/50 p-1.5 sm:min-h-[7.5rem] sm:p-2 [&:nth-child(7n)]:border-r-0"
                    >
                      <p
                        className={cn(
                          "text-center text-xs font-semibold",
                          cell.muted ? "font-medium text-muted-foreground/45" : "text-foreground"
                        )}
                      >
                        {cell.day}
                      </p>
                      {cell.events?.length ? (
                        <ul className="mt-1 space-y-0.5">
                          {cell.events.map((ev) => (
                            <li key={ev.label} className="flex gap-1.5 text-[10px] leading-tight text-foreground">
                              <span
                                className={cn(
                                  "mt-0.5 size-1.5 shrink-0 rounded-full",
                                  "neutral" in ev ? "bg-muted-foreground/55" : chartDotClass[ev.chart]
                                )}
                                aria-hidden="true"
                              />
                              <span className="min-w-0 truncate">{ev.label}</span>
                            </li>
                          ))}
                          {cell.moreCount != null ? (
                            <li className="pt-0.5 text-[10px] font-medium text-muted-foreground">{cell.moreCount} more</li>
                          ) : null}
                        </ul>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
