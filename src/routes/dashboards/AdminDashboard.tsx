import { Link } from "react-router-dom"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ClipboardListIcon,
  MailIcon,
  ShieldCheckIcon,
  UserCogIcon,
  UserPlusIcon,
  UserCheckIcon,
} from "lucide-react"

const adminStats = [
  { label: "Total users", value: "24", note: "Accounts in this application" },
  { label: "Active", value: "21", note: "Signed in at least once" },
  { label: "Pending invites", value: "3", note: "Awaiting email confirmation" },
  { label: "Auditors", value: "5", note: "Inspection and approval access" },
]

const recentActivity = [
  {
    title: "Invitation sent",
    desc: "Sara Al-Najjar - Auditor, Finance",
    time: "Today - 09:14",
    icon: MailIcon,
  },
  {
    title: "Role updated",
    desc: "Ahmed Khalil promoted to Contributor",
    time: "Yesterday",
    icon: UserCogIcon,
  },
  {
    title: "Account activated",
    desc: "Omar Haddad completed sign-up",
    time: "3 days ago",
    icon: ShieldCheckIcon,
  },
]

export default function AdminDashboard() {
  return (
    <div className="min-w-0 flex-1 overflow-x-hidden bg-background p-4 sm:p-6 lg:p-8">
        <header className="mb-6 flex flex-col gap-4 sm:mb-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <Badge variant="outline">Administration</Badge>
            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Overview</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">Welcome, Juliana</h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              You manage who can access the operational plan workspace, their roles, and invitation lifecycle.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3">
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
              className="inline-flex items-center justify-center rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground shadow-xs transition hover:bg-accent"
            >
              View directory
            </Link>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-4">
          {adminStats.map((item) => (
            <Card key={item.label} className="ring-1 ring-border/60">
              <CardContent className="p-6 sm:p-7">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{item.label}</p>
                <p className="mt-2 text-3xl font-bold tabular-nums">{item.value}</p>
                <p className="mt-1 text-xs text-muted-foreground">{item.note}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-3 lg:items-start">
          <Card className="overflow-hidden lg:col-span-2 ring-1 ring-border/60">
            <CardHeader className="border-b border-border bg-muted/30">
              <CardTitle>Recent access activity</CardTitle>
              <CardDescription>Invitations and role changes (demo data)</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <ul className="divide-y divide-border">
                {recentActivity.map((item) => (
                  <li key={item.title} className="flex gap-4 px-6 py-4 sm:px-8">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-muted text-foreground">
                      <item.icon className="h-5 w-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold">{item.title}</p>
                      <p className="mt-0.5 text-sm text-muted-foreground">{item.desc}</p>
                      <p className="mt-1 text-xs font-medium text-muted-foreground">{item.time}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="ring-1 ring-border/60">
            <CardHeader>
              <CardTitle>Roles at a glance</CardTitle>
              <CardDescription>What each access level can do in the workspace</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="rounded-2xl border border-border bg-muted/50 p-4">
                <p className="font-semibold">Administrator</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  Add users, assign roles, and manage access.
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-muted/50 p-4">
                <p className="font-semibold">Contributor</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  Edit operational plans they are assigned to.
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-accent/50 p-4 ring-1 ring-border/60">
                <p className="font-semibold">Auditor</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  Inspect actions and participate in approval workflows.
                </p>
              </div>
              <Link
                to="/proposals-status"
                className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground shadow-xs transition hover:bg-accent"
              >
                <ClipboardListIcon className="h-4 w-4" />
                Open request statuses
              </Link>
              <Link
                to="/users"
                className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground shadow-xs transition hover:bg-secondary/80"
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
