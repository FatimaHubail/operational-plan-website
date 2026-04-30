import { useEffect, useMemo, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

type NotificationCategory =
  | "invite_delivery"
  | "invite_expired"
  | "account_access"
  | "validation_alert"

type NotificationItem = {
  id: string
  title: string
  time: string
  body: string
  category: NotificationCategory
  role: "administrator" | "auditor" | "contributor" | "indicator_owner"
  department: string
  unread: boolean
  group: "today" | "earlier"
}

const UNIT_DEPARTMENT_OPTIONS = [
  "President's Office",
  "VP Office for Partnerships & Development",
  "VP Office for Academic Affairs",
  "General Director of Administrative Services Office",
  "Deanship of Graduate Studies & Scientific Research",
  "Deanship of Student Affairs",
  "Deanship of Admission & Registration",
  "University Rankings Committee",
  "Governance Committee (Policies & Procedures)",
  "Quality Assurance & Accreditation Center",
  "Business Incubator Center",
  "IT & Digital Learning Directorate",
  "English Language Center",
  "Media Center",
  "Community Service & Continuing Education Center",
  "Teaching Excellence & Leadership Unit",
  "Human Resources Directorate",
  "Public Relations & Media Directorate",
  "General Services Directorate",
  "Library & Information Services Directorate",
  "Security & Safety Directorate",
  "Finance & Budget Directorate",
  "Procurement Directorate",
  "Assets & Stores Directorate",
  "Buildings & Maintenance Directorate",
  "Alumni Affairs Directorate",
  "College of Arts",
  "College of Science",
  "College of Business Administration",
  "Bahrain Teachers College (BTC)",
  "College of Applied Studies",
  "College of Information Technology",
  "College of Law",
  "College of Health & Sport Sciences",
  "College of Engineering",
] as const

const SORTED_DEPARTMENT_OPTIONS = [...UNIT_DEPARTMENT_OPTIONS].sort((a, b) => a.localeCompare(b))

const notifications: NotificationItem[] = [
  {
    id: "ADN-001",
    title: "Invitation delivery failed",
    time: "Just now",
    body: "Invite to sara.alnajjar@uob.edu.bh bounced. Verify email and resend.",
    category: "invite_delivery",
    role: "auditor",
    department: "Finance & Budget Directorate",
    unread: true,
    group: "today",
  },
  {
    id: "ADN-002",
    title: "Invitation delivered",
    time: "18 min ago",
    body: "Invitation was successfully delivered to omar.haddad@uob.edu.bh.",
    category: "invite_delivery",
    role: "contributor",
    department: "Deanship of Admission & Registration",
    unread: true,
    group: "today",
  },
  {
    id: "ADN-003",
    title: "Account activated",
    time: "42 min ago",
    body: "Omar Haddad completed first sign-in and account activation.",
    category: "account_access",
    role: "contributor",
    department: "Deanship of Admission & Registration",
    unread: true,
    group: "today",
  },
  {
    id: "ADN-004",
    title: "Account deactivated",
    time: "1 hour ago",
    body: "Contributor access for user A. Khalil was deactivated by an administrator.",
    category: "account_access",
    role: "contributor",
    department: "College of Science",
    unread: false,
    group: "today",
  },
  {
    id: "ADN-005",
    title: "Account reactivated",
    time: "2 hours ago",
    body: "Auditor account for Sara Al-Najjar was reactivated after profile review.",
    category: "account_access",
    role: "auditor",
    department: "Finance & Budget Directorate",
    unread: false,
    group: "earlier",
  },
  {
    id: "ADN-006",
    title: "Invitation expired",
    time: "Yesterday",
    body: "Invitation for f.almansoori@uob.edu.bh expired after 7 days.",
    category: "invite_expired",
    role: "indicator_owner",
    department: "College of Engineering",
    unread: true,
    group: "earlier",
  },
  {
    id: "ADN-007",
    title: "Missing mandatory user fields",
    time: "Yesterday",
    body: "A new user draft is missing required department and role fields.",
    category: "validation_alert",
    role: "administrator",
    department: "General Director of Administrative Services Office",
    unread: true,
    group: "earlier",
  },
  {
    id: "ADN-008",
    title: "Duplicate email attempted",
    time: "2 days ago",
    body: "Cannot create user: juliana.rahman@uob.edu.bh already exists in directory.",
    category: "validation_alert",
    role: "administrator",
    department: "IT & Digital Learning Directorate",
    unread: false,
    group: "earlier",
  },
]

const filterOptions = [
  { key: "all", label: "All" },
  { key: "unread", label: "Unread" },
  { key: "invite_delivery", label: "Invitation delivered/failed" },
  { key: "invite_expired", label: "Invitation expired" },
  { key: "account_access", label: "Account activation & access" },
  { key: "validation_alert", label: "Validation alerts" },
  { key: "administrator", label: "Administrator" },
  { key: "auditor", label: "Auditor" },
  { key: "contributor", label: "Contributor" },
  { key: "indicator_owner", label: "Indicator Owner" },
] as const

type FilterKey = (typeof filterOptions)[number]["key"]

function categoryLabel(category: NotificationCategory) {
  switch (category) {
    case "invite_delivery":
      return "Invitation delivered/failed"
    case "invite_expired":
      return "Invitation expired"
    case "account_access":
      return "Account activation & access"
    case "validation_alert":
      return "Data quality / validation alert"
    default:
      return "Update"
  }
}

function roleLabel(role: NotificationItem["role"]) {
  switch (role) {
    case "administrator":
      return "Administrator"
    case "auditor":
      return "Auditor"
    case "contributor":
      return "Contributor"
    case "indicator_owner":
      return "Indicator Owner"
    default:
      return "Role"
  }
}

export default function AdminNotifications() {
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all")
  const [showFilters, setShowFilters] = useState(false)
  const [showDepartmentList, setShowDepartmentList] = useState(false)
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all")
  const [departmentSearchTerm, setDepartmentSearchTerm] = useState("")
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
            : activeFilter === "administrator" || activeFilter === "auditor" || activeFilter === "contributor" || activeFilter === "indicator_owner"
              ? item.role === activeFilter
              : item.category === activeFilter
      const matchesDepartment = selectedDepartment === "all" ? true : item.department === selectedDepartment
      const matchesSearch =
        !query ||
        item.title.toLowerCase().includes(query) ||
        item.body.toLowerCase().includes(query) ||
        roleLabel(item.role).toLowerCase().includes(query) ||
        item.department.toLowerCase().includes(query)
      return matchesCategoryFilter && matchesDepartment && matchesSearch
    })
  }, [activeFilter, selectedDepartment, searchTerm])

  useEffect(() => {
    setVisibleTodayCount(3)
    setVisibleEarlierCount(3)
  }, [activeFilter, selectedDepartment, searchTerm])

  const unreadCount = notifications.filter((item) => item.unread).length
  const todayNotifications = filteredNotifications.filter((item) => item.group === "today")
  const earlierNotifications = filteredNotifications.filter((item) => item.group === "earlier")
  const visibleTodayNotifications = todayNotifications.slice(0, visibleTodayCount)
  const visibleEarlierNotifications = earlierNotifications.slice(0, visibleEarlierCount)
  const canLoadMoreToday = visibleTodayCount < todayNotifications.length
  const canLoadMoreEarlier = visibleEarlierCount < earlierNotifications.length
  const visibleDepartmentOptions = useMemo(() => {
    const query = departmentSearchTerm.trim().toLowerCase()
    if (!query) return SORTED_DEPARTMENT_OPTIONS
    return SORTED_DEPARTMENT_OPTIONS.filter((department) => department.toLowerCase().includes(query))
  }, [departmentSearchTerm])

  const iconToneClass = (category: NotificationCategory) => {
    switch (category) {
      case "invite_delivery":
        return "bg-secondary text-secondary-foreground"
      case "invite_expired":
        return "bg-accent text-accent-foreground"
      case "account_access":
        return "bg-muted text-foreground"
      case "validation_alert":
        return "bg-accent text-accent-foreground"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const renderCategoryIcon = (category: NotificationCategory) => {
    switch (category) {
      case "invite_delivery":
        return (
          <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 8.25v8.25A2.25 2.25 0 0 1 19.5 18.75h-15A2.25 2.25 0 0 1 2.25 16.5V8.25m19.5 0A2.25 2.25 0 0 0 19.5 6h-15A2.25 2.25 0 0 0 2.25 8.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0l-7.5-4.615A2.25 2.25 0 0 1 2.25 8.493V8.25" />
          </svg>
        )
      case "invite_expired":
        return (
          <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2m5-2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        )
      case "account_access":
        return (
          <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25A3.75 3.75 0 1 1 8.25 5.25a3.75 3.75 0 0 1 7.5 0ZM4.5 20.118a7.5 7.5 0 0 1 15 0A17.933 17.933 0 0 1 12 21.75a17.933 17.933 0 0 1-7.5-1.632Z" />
          </svg>
        )
      case "validation_alert":
        return (
          <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 7.5h.008v.008H12v-.008Z" />
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
              {roleLabel(item.role)}
            </Badge>
            <Badge variant="outline" className="capitalize">
              {item.department}
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
            Invitation lifecycle, account access updates, and user data validation alerts
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
            <Button
              type="button"
              size="sm"
              variant={showDepartmentList || selectedDepartment !== "all" ? "default" : "outline"}
              className="rounded-full"
              onClick={() => setShowDepartmentList((prev) => !prev)}
            >
              Department
            </Button>
            {selectedDepartment !== "all" ? (
              <Button type="button" size="sm" variant="ghost" className="rounded-full" onClick={() => setSelectedDepartment("all")}>
                Clear department
              </Button>
            ) : null}
            {showDepartmentList ? (
              <div className="w-full rounded-xl border border-border bg-background p-2">
                <div className="max-h-56 overflow-y-auto">
                  <div className="mb-2">
                    <Input
                      type="search"
                      placeholder="Search departments"
                      value={departmentSearchTerm}
                      onChange={(event) => setDepartmentSearchTerm(event.target.value)}
                      className="h-8 rounded-full text-xs"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant={selectedDepartment === "all" ? "default" : "outline"}
                      className="rounded-full"
                      onClick={() => setSelectedDepartment("all")}
                    >
                      All departments
                    </Button>
                    {visibleDepartmentOptions.map((department) => (
                      <Button
                        key={department}
                        type="button"
                        size="sm"
                        variant={selectedDepartment === department ? "default" : "outline"}
                        className="rounded-full"
                        onClick={() => setSelectedDepartment(department)}
                      >
                        {department}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}
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
