import { useEffect, useMemo, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

type NotificationCategory =
  | "lifecycle"
  | "resubmission"
  | "calendar"
  | "perspective"
  | "performance"

type NotificationItem = {
  id: string
  title: string
  time: string
  body: string
  category: NotificationCategory
  entityType: "objective" | "action" | "task" | "event" | "indicator"
  strategicPerspective: "catalysts" | "enablers" | "beneficiary" | "stakeholders"
  unread: boolean
  group: "today" | "earlier"
}

const notifications: NotificationItem[] = [
  {
    id: "N-001",
    title: "Objective moved to pending auditor review",
    time: "Just now",
    body: "REQ-2026-0141 in Catalysts (C1.1) is now queued for auditor review.",
    category: "lifecycle",
    entityType: "objective",
    strategicPerspective: "catalysts",
    unread: true,
    group: "today",
  },
  {
    id: "N-002",
    title: "Action changes requested",
    time: "8 min ago",
    body: "REQ-2026-0112 (Beneficiary B1.4) was returned with comments. Update and resubmit.",
    category: "resubmission",
    entityType: "action",
    strategicPerspective: "beneficiary",
    unread: true,
    group: "today",
  },
  {
    id: "N-003",
    title: "Task awaiting re-review reminder",
    time: "27 min ago",
    body: "REQ-2026-0148 has been in edited state for 3 days. Submit for re-review to avoid cycle delay.",
    category: "resubmission",
    entityType: "task",
    strategicPerspective: "enablers",
    unread: true,
    group: "today",
  },
  {
    id: "N-004",
    title: "Steering committee starts in 1 hour",
    time: "44 min ago",
    body: "Calendar reminder for today's strategic steering committee session at 12:00.",
    category: "calendar",
    entityType: "event",
    strategicPerspective: "stakeholders",
    unread: true,
    group: "today",
  },
  {
    id: "N-005",
    title: "Milestone due tomorrow",
    time: "1 hour ago",
    body: "Q2 KPI alignment milestone closes tomorrow. Link remaining actions and tasks before deadline.",
    category: "calendar",
    entityType: "event",
    strategicPerspective: "beneficiary",
    unread: false,
    group: "today",
  },
  {
    id: "N-006",
    title: "Catalysts content updated",
    time: "2 hours ago",
    body: "C1.2 received an objective update and two new tasks were added to the linked action plan.",
    category: "perspective",
    entityType: "task",
    strategicPerspective: "catalysts",
    unread: false,
    group: "earlier",
  },
  {
    id: "N-007",
    title: "Stakeholders action edited",
    time: "3 hours ago",
    body: "Action timeline in Stakeholders S4.2 was updated and now requires alignment with quarterly outreach tasks.",
    category: "perspective",
    entityType: "action",
    strategicPerspective: "stakeholders",
    unread: false,
    group: "earlier",
  },
  {
    id: "N-008",
    title: "Indicator fell below threshold",
    time: "5 hours ago",
    body: "Digital adoption indicator (C5.1) is 74% vs target 90%. Review action/task execution blockers.",
    category: "performance",
    entityType: "indicator",
    strategicPerspective: "catalysts",
    unread: true,
    group: "earlier",
  },
  {
    id: "N-009",
    title: "Objective accepted for publication",
    time: "Yesterday",
    body: "REQ-2026-0098 (Stakeholders S2.1) was accepted and marked ready for publication.",
    category: "lifecycle",
    entityType: "objective",
    strategicPerspective: "stakeholders",
    unread: false,
    group: "earlier",
  },
]

const filterOptions = [
  { key: "all", label: "All" },
  { key: "unread", label: "Unread" },
  { key: "lifecycle", label: "Proposal Lifecycle" },
  { key: "resubmission", label: "Resubmission" },
  { key: "calendar", label: "Calendar" },
  { key: "perspective", label: "Perspective updates" },
  { key: "performance", label: "Performance" },
  { key: "objective", label: "Objective" },
  { key: "action", label: "Action" },
  { key: "task", label: "Task" },
  { key: "catalysts", label: "Catalysts" },
  { key: "enablers", label: "Enablers" },
  { key: "beneficiary", label: "Beneficiary" },
  { key: "stakeholders", label: "Stakeholders" },
] as const

type FilterKey = (typeof filterOptions)[number]["key"]

function categoryLabel(category: NotificationCategory) {
  switch (category) {
    case "lifecycle":
      return "Proposal lifecycle"
    case "resubmission":
      return "Re-review / resubmission"
    case "calendar":
      return "Calendar & milestones"
    case "perspective":
      return "Strategic perspective"
    case "performance":
      return "Performance threshold"
    default:
      return "Update"
  }
}

export default function Notifications() {
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all")
  const [showFilters, setShowFilters] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [visibleTodayCount, setVisibleTodayCount] = useState(3)
  const [visibleEarlierCount, setVisibleEarlierCount] = useState(3)

  const filteredNotifications = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()
    return notifications.filter((item) => {
      const matchesCategoryFilter =
        activeFilter === "all"
          ? true
          : activeFilter === "unread"
            ? item.unread
            : activeFilter === "objective" || activeFilter === "action" || activeFilter === "task"
              ? item.entityType === activeFilter
              : activeFilter === "catalysts" || activeFilter === "enablers" || activeFilter === "beneficiary" || activeFilter === "stakeholders"
                ? item.strategicPerspective === activeFilter
              : item.category === activeFilter
      const matchesSearch =
        !query ||
        item.title.toLowerCase().includes(query) ||
        item.body.toLowerCase().includes(query) ||
        item.entityType.toLowerCase().includes(query) ||
        item.strategicPerspective.toLowerCase().includes(query)
      return matchesCategoryFilter && matchesSearch
    })
  }, [activeFilter, searchTerm])

  useEffect(() => {
    setVisibleTodayCount(3)
    setVisibleEarlierCount(3)
  }, [activeFilter, searchTerm])

  const unreadCount = notifications.filter((item) => item.unread).length
  const todayNotifications = filteredNotifications.filter((item) => item.group === "today")
  const earlierNotifications = filteredNotifications.filter((item) => item.group === "earlier")
  const visibleTodayNotifications = todayNotifications.slice(0, visibleTodayCount)
  const visibleEarlierNotifications = earlierNotifications.slice(0, visibleEarlierCount)
  const canLoadMoreToday = visibleTodayCount < todayNotifications.length
  const canLoadMoreEarlier = visibleEarlierCount < earlierNotifications.length

  const iconToneClass = (category: NotificationCategory) => {
    switch (category) {
      case "lifecycle":
        return "bg-secondary text-secondary-foreground"
      case "resubmission":
        return "bg-accent text-accent-foreground"
      case "calendar":
        return "bg-muted text-foreground"
      case "perspective":
        return "bg-secondary text-secondary-foreground"
      case "performance":
        return "bg-accent text-accent-foreground"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const renderCategoryIcon = (category: NotificationCategory) => {
    switch (category) {
      case "lifecycle":
        return (
          <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        )
      case "resubmission":
        return (
          <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
        )
      case "calendar":
        return (
          <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25M3 18.75A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75M3 18.75v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
          </svg>
        )
      case "perspective":
        return (
          <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5 10.5 6.75l2.25 2.25 7.5-7.5M19.5 6.75h-4.5m4.5 0v4.5" />
          </svg>
        )
      case "performance":
        return (
          <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v6.75c0 .621-.504 1.125-1.125 1.125h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
          </svg>
        )
      default:
        return null
    }
  }

  const renderNotificationRow = (item: NotificationItem) => (
    <li key={item.id}>
      <div className="flex w-full gap-4 px-5 py-4 text-left transition hover:bg-muted/40 sm:px-6 sm:py-5">
        <span className={`relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${iconToneClass(item.category)}`}>
          {renderCategoryIcon(item.category)}
          {item.unread ? <span className="absolute right-0 top-0 h-2.5 w-2.5 rounded-full bg-primary ring-2 ring-background" aria-hidden="true" /> : null}
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex items-start justify-between gap-2">
            <span className="text-sm font-semibold text-foreground">{item.title}</span>
            <span className="shrink-0 text-xs font-medium text-muted-foreground">{item.time}</span>
          </span>
          <span className="mt-0.5 block text-sm text-muted-foreground">{item.body}</span>
          <span className="mt-2 flex flex-wrap gap-2">
            <Badge variant="secondary">{categoryLabel(item.category)}</Badge>
            <Badge variant="outline" className="capitalize">
              {item.entityType}
            </Badge>
            <Badge variant="outline" className="capitalize">
              {item.strategicPerspective}
            </Badge>
            {item.unread ? <Badge>Unread</Badge> : null}
          </span>
        </span>
      </div>
    </li>
  )

  return (
    <div className="min-w-0 flex-1 bg-background p-4 sm:p-6 lg:p-8">
      <header className="mb-6 flex flex-col gap-4 sm:mb-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Notifications</h1>
          <p className="mt-1 max-w-xl text-sm text-muted-foreground">
            Updates on proposal lifecycle, reminders, milestones, perspective changes, and performance thresholds
          </p>
        </div>
        <Button variant="outline">Mark all as read</Button>
      </header>

      <div className="mb-5 space-y-4">
        <div className="flex w-full max-w-3xl flex-wrap items-center gap-2">
          <div className="relative min-w-[17rem] flex-1">
            <Input
              type="search"
              placeholder="Search notifications"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="rounded-full pr-10"
            />
            <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-muted-foreground" aria-hidden="true">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
            </span>
          </div>
          <Button
            type="button"
            variant={showFilters ? "default" : "outline"}
            className="rounded-full"
            onClick={() => setShowFilters((prev) => !prev)}
          >
            Filter
            <svg className="ml-1 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 4.5h18M6.75 12h10.5M10.5 19.5h3" />
            </svg>
          </Button>
        </div>

        {showFilters ? (
          <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-border bg-card p-3">
            {filterOptions.map((option) => (
              <Button
                key={option.key}
                type="button"
                size="sm"
                variant={activeFilter === option.key ? "default" : "outline"}
                className="rounded-full"
                onClick={() => setActiveFilter(option.key)}
              >
                {option.label}
              </Button>
            ))}
          </div>
        ) : null}
        </div>

      <Card className="overflow-hidden rounded-3xl ring-1 ring-border/60">
        <div className="p-0">
          {filteredNotifications.length ? (
            <>
              {todayNotifications.length ? (
                <>
                  <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-3 sm:px-6">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Today</p>
                    <Badge variant="secondary" className="rounded-full px-3">
                      {unreadCount} new
                    </Badge>
                  </div>
                  <ul className="divide-y divide-border">{visibleTodayNotifications.map((item) => renderNotificationRow(item))}</ul>
                  {canLoadMoreToday ? (
                    <div className="border-t border-border px-5 py-4 sm:px-6">
                      <Button type="button" variant="outline" className="w-full" onClick={() => setVisibleTodayCount((prev) => prev + 3)}>
                        Load more
                      </Button>
                    </div>
                  ) : null}
                </>
              ) : null}

              {earlierNotifications.length ? (
                <>
                  <div className="border-y border-border px-5 py-3 sm:px-6">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Earlier</p>
                  </div>
                  <ul className="divide-y divide-border">{visibleEarlierNotifications.map((item) => renderNotificationRow(item))}</ul>
                  {canLoadMoreEarlier ? (
                    <div className="border-t border-border px-5 py-4 sm:px-6">
                      <Button type="button" variant="outline" className="w-full" onClick={() => setVisibleEarlierCount((prev) => prev + 3)}>
                        Load more
                      </Button>
                    </div>
                  ) : null}
                </>
              ) : null}
            </>
          ) : (
            <div className="p-6 text-center">
              <p className="text-sm font-medium text-foreground">No notifications match this filter.</p>
              <p className="mt-1 text-xs text-muted-foreground">Try switching filter tabs or clearing the search input.</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}