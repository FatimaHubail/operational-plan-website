import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

const GMT_PLUS_3_TIMEZONE = "Etc/GMT-3"

export default function Calendar() {
  const [isWeekView, setIsWeekView] = useState(true)
  const now = new Date()
  const zonedNow = new Date(now.toLocaleString("en-US", { timeZone: GMT_PLUS_3_TIMEZONE }))
  const [displayedMonth, setDisplayedMonth] = useState(() => new Date(zonedNow.getFullYear(), zonedNow.getMonth(), 1))

  const currentDateLabel = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: GMT_PLUS_3_TIMEZONE,
  }).format(now)

  const monthTitle = new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
    timeZone: GMT_PLUS_3_TIMEZONE,
  }).format(displayedMonth)

  const firstDayOfMonth = new Date(displayedMonth.getFullYear(), displayedMonth.getMonth(), 1)
  const monthGridStart = new Date(firstDayOfMonth)
  monthGridStart.setDate(1 - firstDayOfMonth.getDay())

  const monthDays = Array.from({ length: 42 }, (_, index) => {
    const date = new Date(monthGridStart)
    date.setDate(monthGridStart.getDate() + index)
    return {
      key: `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`,
      dayNumber: date.getDate(),
      isCurrentMonth: date.getMonth() === displayedMonth.getMonth(),
      isToday:
        date.getDate() === zonedNow.getDate() &&
        date.getMonth() === zonedNow.getMonth() &&
        date.getFullYear() === zonedNow.getFullYear(),
    }
  })

  return (
    <div className="min-w-0 flex-1 bg-background p-4 sm:p-6 lg:p-8">
      <header className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Calendar</h1>
          <p className="mt-1 text-sm text-muted-foreground sm:text-base">{currentDateLabel}</p>
        </div>
        <Tabs value={isWeekView ? "week" : "month"} className="w-auto">
          <TabsList>
            <TabsTrigger value="week" onClick={() => setIsWeekView(true)}>
              Week
            </TabsTrigger>
            <TabsTrigger value="month" onClick={() => setIsWeekView(false)}>
              Month
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </header>

      {isWeekView ? (
        <Card>
          <CardHeader>
            <CardTitle>Week schedule</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              "Plan review checkpoint",
              "KPI alignment session",
              "Department milestones",
              "Executive briefing prep",
              "Initiative workshop",
            ].map((item) => (
              <div key={item} className="rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm text-foreground">
                {item}
              </div>
            ))}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{monthTitle}</CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDisplayedMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDisplayedMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))}
              >
                Next
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2">
              {monthDays.map((day) => (
                <div
                  key={day.key}
                  className={`rounded-md border px-2 py-3 text-center text-xs ${
                    day.isToday
                      ? "border-primary bg-primary text-primary-foreground"
                      : day.isCurrentMonth
                        ? "border-border bg-card text-foreground"
                        : "border-border bg-muted/40 text-muted-foreground"
                  }`}
                >
                  {day.dayNumber}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}