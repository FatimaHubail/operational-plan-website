import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
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

const timeLabels = ["9:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"]

const weekEvents = [
  ["Plan review checkpoint", "", "Initiative workshop", "Steering committee", "Metrics data review"],
  ["", "KPI alignment session", "Q2 reporting clinic", "", ""],
  ["", "", "", "", ""],
  ["", "Department milestones", "", "", "Planning office 1:1"],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "Executive briefing prep", "", "", "Strategic indicators review"],
  ["", "", "", "", "Cross-unit actions"],
  ["", "", "Budget line check", "", ""],
]

const monthCells = [
  "27", "28", "29", "30", "31", "1", "2",
  "3", "4", "5", "6", "7", "8", "9",
  "10", "11", "12", "13", "14", "15", "16",
  "17", "18", "19", "20", "21", "22", "23",
  "24", "25", "26", "27", "28", "29", "30",
]

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

      <header className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Calendar</h1>
          <p className="mt-1 text-sm font-medium text-muted-foreground sm:text-base">{todayLabel}</p>
        </div>
        <Tabs value={view} className="w-auto">
          <TabsList>
            <TabsTrigger value="week" onClick={() => setView("week")}>
              Week
            </TabsTrigger>
            <TabsTrigger value="month" onClick={() => setView("month")}>
              Month
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </header>

      {view === "week" ? (
        <Card className="rounded-3xl border border-border bg-card shadow-sm">
          <CardContent className="p-4 sm:p-6 lg:p-8">
            <div className="overflow-x-auto">
              <div className="min-w-[640px]">
                <div className="mb-2 grid grid-cols-[3.5rem_repeat(5,minmax(0,1fr))] border-b border-border pb-3">
                  <div />
                  {weekHeaders.map((d) => (
                    <div key={d.day} className="text-center">
                      <p className={cn("text-xs font-medium text-muted-foreground", d.isToday && "text-primary")}>{d.date}</p>
                      <p className={cn("text-sm font-semibold text-foreground", d.isToday && "text-primary")}>{d.day}</p>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-[3.5rem_repeat(5,minmax(0,1fr))]">
                  <div className="pr-2 text-right text-xs font-medium leading-12 text-muted-foreground">
                    {timeLabels.map((t) => (
                      <div key={t}>{t}</div>
                    ))}
                  </div>
                  <div className="col-span-5 grid grid-cols-5 border-l border-border">
                    {[0, 1, 2, 3, 4].map((col) => (
                      <div key={`col-${col}`} className="border-r border-border/60">
                        {weekEvents.map((row, idx) => (
                          <div key={`cell-${col}-${idx}`} className="h-12 border-b border-border/40 px-1 py-1">
                            {row[col] ? (
                              <div className="h-full rounded-md border border-border bg-muted/50 px-2 py-1 text-[11px] font-semibold text-foreground">
                                {row[col]}
                              </div>
                            ) : null}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="rounded-3xl border border-border bg-card shadow-sm">
          <CardContent className="p-4 sm:p-6 lg:p-8">
            <div className="mb-4 flex items-center justify-between sm:mb-5">
              <h2 className="text-lg font-bold text-foreground sm:text-xl">{monthTitle}</h2>
              <div className="flex gap-1">
                <Button type="button" variant="ghost" size="icon-sm" aria-label="Previous month" onClick={() => setMonthOffset((v) => v - 1)}>
                  {"<"}
                </Button>
                <Button type="button" variant="ghost" size="icon-sm" aria-label="Next month" onClick={() => setMonthOffset((v) => v + 1)}>
                  {">"}
                </Button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <div className="min-w-[640px] rounded-xl border border-border bg-card">
                <div className="grid grid-cols-7 border-b border-border">
                  {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((day) => (
                    <div key={day} className="border-r border-border/60 py-2.5 text-center text-[11px] font-semibold tracking-wide text-muted-foreground last:border-r-0">
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7">
                  {monthCells.map((cell, idx) => (
                    <div key={`${cell}-${idx}`} className="min-h-[6.5rem] border-r border-b border-border/60 p-1.5 sm:min-h-[7.5rem] sm:p-2 [&:nth-child(7n)]:border-r-0">
                      <p className="text-center text-xs font-semibold text-foreground">{cell}</p>
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