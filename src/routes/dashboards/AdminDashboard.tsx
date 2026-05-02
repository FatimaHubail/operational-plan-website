import { Link } from "react-router-dom"
import {
  AdminDashboardNotificationRow,
  DashboardNotificationsCard,
  type AdminPreviewItem,
} from "@/components/dashboard-notification-preview"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UserCheckIcon, UserPlusIcon } from "lucide-react"

const adminStats = [
  {
    label: "Total users",
    value: "24",
    note: "Accounts in this application",
    valueClassName: "proposal-stat-num-chart-3",
  },
  {
    label: "Active",
    value: "21",
    note: "Signed in at least once",
    valueClassName: "proposal-stat-num-pending",
  },
  {
    label: "Pending invites",
    value: "3",
    note: "Awaiting email confirmation",
    valueClassName: "proposal-stat-num-chart-4",
  },
  {
    label: "Auditors",
    value: "5",
    note: "Inspection and approval access",
    valueClassName: "proposal-stat-num-chart-2",
  },
]

const adminNotificationPreviewItems: AdminPreviewItem[] = [
  {
    id: "adm-n1",
    title: "Invitation sent",
    body: "Sara Al-Najjar - Auditor, Finance",
    time: "Today - 09:14",
    category: "invite_delivery",
    role: "auditor",
    department: "Finance & Budget Directorate",
    unread: true,
  },
  {
    id: "adm-n2",
    title: "Role updated",
    body: "Ahmed Khalil promoted to Contributor",
    time: "Yesterday",
    category: "account_access",
    role: "contributor",
    department: "College of Science",
    unread: false,
  },
  {
    id: "adm-n3",
    title: "Account activated",
    body: "Omar Haddad completed sign-up",
    time: "3 days ago",
    category: "account_access",
    role: "contributor",
    department: "Deanship of Admission & Registration",
    unread: false,
  },
]

export default function AdminDashboard() {
  return (
    <div className="min-w-0 flex-1 overflow-x-hidden bg-background p-4 sm:p-6 lg:p-8">
        <header className="mb-6 flex flex-col gap-4 sm:mb-8 lg:flex-row lg:items-center lg:justify-between lg:pr-20">
          <div>
            <Badge
              variant="outline"
              className={cn(
                "h-auto min-h-8 border-border/30 bg-[oklch(0.985_0_0)] px-3 py-1.5 text-xs font-semibold shadow-[0_1px_8px_rgba(0,0,0,0.045)] dark:border-border/40 dark:bg-card dark:shadow-[0_2px_10px_rgba(0,0,0,0.28)]",
              )}
            >
              Administration
            </Badge>
            <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">Welcome, Juliana</h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Manage who can access the operational plan workspace, their roles, and invitation lifecycle
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-3 lg:gap-4">
            <Link
              to="/add-user"
              state={{ from: "dashboard-admin" }}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-xs transition hover:bg-primary/90"
            >
              <UserPlusIcon className="h-4 w-4" />
              Add user
            </Link>
            <Link
              to="/users"
              className="inline-flex items-center justify-center rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground shadow-xs transition hover:border-transparent hover:bg-[oklch(0.22_0.04_265)] hover:text-primary-foreground"
            >
              View users directory
            </Link>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-4">
          {adminStats.map((item) => (
            <Card key={item.label} className="ring-1 ring-border/60">
              <CardContent className="p-6 sm:p-7">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{item.label}</p>
                <p className={cn("mt-2 text-3xl font-bold tabular-nums", item.valueClassName)}>
                  {item.value}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">{item.note}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-3 lg:items-start">
          <DashboardNotificationsCard
            className="lg:col-span-2 lg:min-h-0"
            description="Recent access activity"
            newCountLabel={`${adminNotificationPreviewItems.filter((n) => n.unread).length} new`}
            footer={
              <Link
                to="/admin/notifications"
                className="notif-secondary-action inline-flex w-full items-center justify-center rounded-md border border-transparent bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground shadow-xs transition-colors"
              >
                View all notifications
              </Link>
            }
          >
            {adminNotificationPreviewItems.map((item) => (
              <AdminDashboardNotificationRow key={item.id} item={item} />
            ))}
          </DashboardNotificationsCard>

          <Card className="ring-1 ring-border/60">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Roles at a Glance</CardTitle>
              <CardDescription>What each access level can do in the workspace</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="strategic-perspective-bg-chart-1 rounded-2xl p-4">
                <p className="font-semibold text-secondary-foreground">Administrator</p>
                <p className="mt-1 text-xs leading-relaxed text-secondary-foreground/85">
                  Add users, assign roles, and manage access.
                </p>
              </div>
              <div className="strategic-perspective-bg-chart-2 rounded-2xl p-4">
                <p className="font-semibold text-secondary-foreground">Auditor</p>
                <p className="mt-1 text-xs leading-relaxed text-secondary-foreground/85">
                  Inspect actions and participate in approval workflows.
                </p>
              </div>
              <div className="strategic-perspective-bg-chart-4 rounded-2xl p-4">
                <p className="font-semibold text-secondary-foreground">Indicator Owner</p>
                <p className="mt-1 text-xs leading-relaxed text-secondary-foreground/85">
                  Lead indicator governance as the unit chief, approve metric targets, and oversee performance accountability, also edit operational plans.
                </p>
              </div>
              <div className="strategic-perspective-bg-chart-5 rounded-2xl p-4">
                <p className="font-semibold text-secondary-foreground">Contributor</p>
                <p className="mt-1 text-xs leading-relaxed text-secondary-foreground/85">
                  Edit operational plans they are assigned to.
                </p>
              </div>
              <Link
                to="/users"
                className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground shadow-xs transition hover:bg-[oklch(0.22_0.04_265)] hover:text-primary-foreground"
              >
                <UserCheckIcon className="h-4 w-4" />
                Manage users
              </Link>
            </CardContent>
          </Card>
        </div>
    </div>
  )
}
