import { useEffect, useMemo, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  chartSlotForAuditor,
  NOTIF_ICON_WRAP_CLASS,
  notifIconChartClass,
  notifTypeBadgeClass,
} from "@/lib/notificationIconChart"
import { cn } from "@/lib/utils"

type NotificationCategory = "new_proposal" | "proposal_update" | "queue_aging" | "rereview_aging"

type NotificationItem = {
  id: string
  title: string
  time: string
  body: string
  category: NotificationCategory
  entityType: "objective" | "action" | "task"
  strategicPerspective: "catalysts" | "enablers" | "beneficiary" | "stakeholders"
  unread: boolean
  group: "today" | "earlier"
}

const notifications: NotificationItem[] = [
  {
    id: "AN-001",
    title: "New action proposal received",
    time: "Just now",
    body: "REQ-2026-0142 was submitted to Action queue by Ahmed Khalil (College of Science).",
    category: "new_proposal",
    entityType: "action",
    strategicPerspective: "beneficiary",
    unread: true,
    group: "today",
  },
  {
    id: "AN-002",
    title: "New objective proposal received",
    time: "12 min ago",
    body: "REQ-2026-0141 was added to Objective queue and is ready for initial inspection.",
    category: "new_proposal",
    entityType: "objective",
    strategicPerspective: "catalysts",
    unread: true,
    group: "today",
  },
  {
    id: "AN-003",
    title: "Proposal update received (Edited)",
    time: "41 min ago",
    body: "REQ-2026-0148 was edited by submitter and is back in Task queue for re-review.",
    category: "proposal_update",
    entityType: "task",
    strategicPerspective: "enablers",
    unread: true,
    group: "today",
  },
  {
    id: "AN-004",
    title: "Queue aging alert",
    time: "1 hour ago",
    body: "Action queue has 3 pending proposals older than 48 hours. Review to keep SLA on track.",
    category: "queue_aging",
    entityType: "action",
    strategicPerspective: "stakeholders",
    unread: true,
    group: "today",
  },
  {
    id: "AN-005",
    title: "Re-review aging alert",
    time: "2 hours ago",
    body: "REQ-2026-0131 has been in Edited state for 2 days without final decision.",
    category: "rereview_aging",
    entityType: "action",
    strategicPerspective: "catalysts",
    unread: false,
    group: "earlier",
  },
  {
    id: "AN-006",
    title: "Queue aging alert",
    time: "Yesterday",
    body: "Objective queue contains 2 pending items older than 72 hours.",
    category: "queue_aging",
    entityType: "objective",
    strategicPerspective: "beneficiary",
    unread: false,
    group: "earlier",
  },
]

const filterOptions = [
  { key: "all", label: "All" },
  { key: "unread", label: "Unread" },
  { key: "new_proposal", label: "New proposal" },
  { key: "proposal_update", label: "Edited proposal" },
  { key: "queue_aging", label: "Queue aging / SLA" },
  { key: "rereview_aging", label: "Re-review aging" },
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
    case "new_proposal":
      return "New proposal"
    case "proposal_update":
      return "Edited proposal"
    case "queue_aging":
      return "Queue aging / SLA alert"
    case "rereview_aging":
      return "Re-review aging alert"
    default:
      return "Update"
  }
}

export default function AuditorNotifications() {
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

  const auditorIconClass = (category: NotificationCategory) =>
    notifIconChartClass(chartSlotForAuditor(category))

  const renderCategoryIcon = (category: NotificationCategory) => {
    switch (category) {
      case "new_proposal":
        return (
          <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9z" />
          </svg>
        )
      case "proposal_update":
        return (
          <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
        )
      case "queue_aging":
        return (
          <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 7.5h.008v.008H12v-.008Z" />
          </svg>
        )
      case "rereview_aging":
        return (
          <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2m5-2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        )
      default:
        return null
    }
  }

  const renderNotificationRow = (item: NotificationItem) => (
    <li key={item.id}>
      <div className="flex w-full gap-4 px-5 py-4 text-left transition hover:bg-muted/40 sm:px-6 sm:py-5">
        <span
          className={cn("relative", NOTIF_ICON_WRAP_CLASS, auditorIconClass(item.category))}
        >
          {renderCategoryIcon(item.category)}
          {item.unread ? (
            <span
              className="absolute -right-px -top-px h-2 w-2 rounded-full bg-primary ring-1 ring-background"
              aria-hidden="true"
            />
          ) : null}
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex items-start justify-between gap-2">
            <span className="text-sm font-semibold text-foreground">{item.title}</span>
            <span className="shrink-0 text-xs font-medium text-muted-foreground">{item.time}</span>
          </span>
          <span className="mt-0.5 block text-sm text-muted-foreground">{item.body}</span>
          <span className="mt-2 flex flex-wrap gap-2">
            <Badge
              variant="outline"
              className={cn("font-medium", notifTypeBadgeClass(chartSlotForAuditor(item.category)))}
            >
              {categoryLabel(item.category)}
            </Badge>
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
            New proposals, edited proposals, and queue aging alerts for your inspection workflows
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
                    <Badge variant="secondary" className="notif-new-badge rounded-full px-3">
                      {unreadCount} new
                    </Badge>
                  </div>
                  <ul className="divide-y divide-border">{visibleTodayNotifications.map((item) => renderNotificationRow(item))}</ul>
                  {canLoadMoreToday ? (
                    <div className="border-t border-border px-5 py-4 sm:px-6">
                      <Button
                        type="button"
                        variant="secondary"
                        className="notif-secondary-action w-full"
                        onClick={() => setVisibleTodayCount((prev) => prev + 3)}
                      >
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
                      <Button
                        type="button"
                        variant="secondary"
                        className="notif-secondary-action w-full"
                        onClick={() => setVisibleEarlierCount((prev) => prev + 3)}
                      >
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
