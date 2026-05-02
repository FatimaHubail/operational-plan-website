import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  chartSlotForAdmin,
  chartSlotForAuditor,
  chartSlotForContributor,
  NOTIF_ICON_WRAP_CLASS,
  notifIconChartClass,
  notifTypeBadgeClass,
} from "@/lib/notificationIconChart"
import { cn } from "@/lib/utils"

/** Contributor / main Notifications.tsx categories */
export type ContributorPreviewCategory =
  | "lifecycle"
  | "resubmission"
  | "calendar"
  | "perspective"
  | "performance"

export type ContributorPreviewItem = {
  id: string
  title: string
  time: string
  body: string
  category: ContributorPreviewCategory
  entityType: "objective" | "action" | "task" | "event" | "indicator"
  strategicPerspective: "catalysts" | "enablers" | "beneficiary" | "stakeholders"
  unread: boolean
}

export type AuditorPreviewCategory = "new_proposal" | "proposal_update" | "queue_aging" | "rereview_aging"

export type AuditorPreviewItem = {
  id: string
  title: string
  time: string
  body: string
  category: AuditorPreviewCategory
  entityType: "objective" | "action" | "task"
  strategicPerspective: "catalysts" | "enablers" | "beneficiary" | "stakeholders"
  unread: boolean
}

export type AdminPreviewCategory = "invite_delivery" | "invite_expired" | "account_access" | "validation_alert"

export type AdminPreviewItem = {
  id: string
  title: string
  time: string
  body: string
  category: AdminPreviewCategory
  role: "administrator" | "auditor" | "contributor" | "indicator_owner"
  department: string
  unread: boolean
}

function contributorCategoryLabel(category: ContributorPreviewCategory) {
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

function ContributorCategoryIcon({ category }: { category: ContributorPreviewCategory }) {
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
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
          />
        </svg>
      )
    case "calendar":
      return (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24" aria-hidden="true">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25M3 18.75A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75M3 18.75v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
          />
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
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 13.125c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v6.75c0 .621-.504 1.125-1.125 1.125h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"
          />
        </svg>
      )
    default:
      return null
  }
}

function auditorCategoryLabel(category: AuditorPreviewCategory) {
  switch (category) {
    case "new_proposal":
      return "New proposal received"
    case "proposal_update":
      return "Proposal update received (Edited)"
    case "queue_aging":
      return "Queue aging / SLA alert"
    case "rereview_aging":
      return "Re-review aging alert"
    default:
      return "Update"
  }
}

function AuditorCategoryIcon({ category }: { category: AuditorPreviewCategory }) {
  switch (category) {
    case "new_proposal":
      return (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24" aria-hidden="true">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9z"
          />
        </svg>
      )
    case "proposal_update":
      return (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24" aria-hidden="true">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
          />
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

function adminCategoryLabel(category: AdminPreviewCategory) {
  switch (category) {
    case "invite_delivery":
      return "Invitation delivery"
    case "invite_expired":
      return "Invitation expiration"
    case "account_access":
      return "Account activation & access"
    case "validation_alert":
      return "Data validation"
    default:
      return "Update"
  }
}

function adminRoleLabel(role: AdminPreviewItem["role"]) {
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

function AdminCategoryIcon({ category }: { category: AdminPreviewCategory }) {
  switch (category) {
    case "invite_delivery":
      return (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24" aria-hidden="true">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21.75 8.25v8.25A2.25 2.25 0 0 1 19.5 18.75h-15A2.25 2.25 0 0 1 2.25 16.5V8.25m19.5 0A2.25 2.25 0 0 0 19.5 6h-15A2.25 2.25 0 0 0 2.25 8.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0l-7.5-4.615A2.25 2.25 0 0 1 2.25 8.493V8.25"
          />
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

function NotificationRowShell({
  title,
  time,
  body,
  unread,
  iconToneClass,
  icon,
  badges,
}: {
  title: string
  time: string
  body: string
  unread: boolean
  iconToneClass: string
  icon: React.ReactNode
  badges: React.ReactNode
}) {
  return (
    <li>
      <div className="flex w-full gap-4 px-5 py-4 text-left transition hover:bg-muted/40 sm:px-6 sm:py-5">
        <span className={cn("relative", NOTIF_ICON_WRAP_CLASS, iconToneClass)}>
          {icon}
          {unread ? (
            <span
              className="absolute -right-px -top-px h-2 w-2 rounded-full bg-primary ring-1 ring-background"
              aria-hidden="true"
            />
          ) : null}
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex items-start justify-between gap-2">
            <span className="text-sm font-semibold text-foreground">{title}</span>
            <span className="shrink-0 text-xs font-medium text-muted-foreground">{time}</span>
          </span>
          <span className="mt-0.5 block text-sm text-muted-foreground">{body}</span>
          <span className="mt-2 flex flex-wrap gap-2">{badges}</span>
        </span>
      </div>
    </li>
  )
}

export function ContributorDashboardNotificationRow({ item }: { item: ContributorPreviewItem }) {
  return (
    <NotificationRowShell
      title={item.title}
      time={item.time}
      body={item.body}
      unread={item.unread}
      iconToneClass={notifIconChartClass(chartSlotForContributor(item.category))}
      icon={<ContributorCategoryIcon category={item.category} />}
      badges={
        <>
          <Badge
            variant="outline"
            className={cn("font-medium", notifTypeBadgeClass(chartSlotForContributor(item.category)))}
          >
            {contributorCategoryLabel(item.category)}
          </Badge>
          <Badge variant="outline" className="capitalize">
            {item.entityType}
          </Badge>
          <Badge variant="outline" className="capitalize">
            {item.strategicPerspective}
          </Badge>
          {item.unread ? <Badge>Unread</Badge> : null}
        </>
      }
    />
  )
}

export function AuditorDashboardNotificationRow({ item }: { item: AuditorPreviewItem }) {
  return (
    <NotificationRowShell
      title={item.title}
      time={item.time}
      body={item.body}
      unread={item.unread}
      iconToneClass={notifIconChartClass(chartSlotForAuditor(item.category))}
      icon={<AuditorCategoryIcon category={item.category} />}
      badges={
        <>
          <Badge
            variant="outline"
            className={cn("font-medium", notifTypeBadgeClass(chartSlotForAuditor(item.category)))}
          >
            {auditorCategoryLabel(item.category)}
          </Badge>
          <Badge variant="outline" className="capitalize">
            {item.entityType}
          </Badge>
          <Badge variant="outline" className="capitalize">
            {item.strategicPerspective}
          </Badge>
          {item.unread ? <Badge>Unread</Badge> : null}
        </>
      }
    />
  )
}

export function AdminDashboardNotificationRow({ item }: { item: AdminPreviewItem }) {
  return (
    <NotificationRowShell
      title={item.title}
      time={item.time}
      body={item.body}
      unread={item.unread}
      iconToneClass={notifIconChartClass(chartSlotForAdmin(item.category))}
      icon={<AdminCategoryIcon category={item.category} />}
      badges={
        <>
          <Badge
            variant="outline"
            className={cn("font-medium", notifTypeBadgeClass(chartSlotForAdmin(item.category)))}
          >
            {adminCategoryLabel(item.category)}
          </Badge>
          <Badge variant="outline" className="capitalize">
            {adminRoleLabel(item.role)}
          </Badge>
          <Badge variant="outline" className="capitalize">
            {item.department}
          </Badge>
          {item.unread ? <Badge>Unread</Badge> : null}
        </>
      }
    />
  )
}

type DashboardNotificationsCardProps = {
  title?: string
  description?: string
  newCountLabel?: string
  children: React.ReactNode
  footer: React.ReactNode
  className?: string
  headerClassName?: string
}

export function DashboardNotificationsCard({
  title = "Notifications",
  description,
  newCountLabel,
  children,
  footer,
  className,
  headerClassName,
}: DashboardNotificationsCardProps) {
  return (
    <Card
      className={cn(
        "flex min-h-0 flex-col overflow-hidden rounded-3xl ring-1 ring-border/60 lg:min-h-[28rem]",
        className,
      )}
    >
      <CardHeader
        className={cn(
          "border-b border-border px-5 py-3 sm:px-6",
          description
            ? "flex flex-col items-stretch gap-1 sm:flex-row sm:items-start sm:justify-between"
            : "flex flex-row items-center justify-between gap-2 space-y-0",
          headerClassName,
        )}
      >
        <div className="min-w-0 space-y-0.5">
          <CardTitle className="text-lg font-bold">{title}</CardTitle>
          {description ? <CardDescription>{description}</CardDescription> : null}
        </div>
        {newCountLabel ? (
          <Badge variant="secondary" className="notif-new-badge shrink-0 self-start sm:mt-0.5">
            {newCountLabel}
          </Badge>
        ) : null}
      </CardHeader>
      <CardContent className="min-h-0 flex-1 p-0">
        <ul className="divide-y divide-border">{children}</ul>
      </CardContent>
      <div className="border-t border-border px-5 py-4 sm:px-6">{footer}</div>
    </Card>
  )
}
