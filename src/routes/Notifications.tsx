import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

const notifications = [
  {
    title: "Operational plan review requested",
    time: "2 min ago",
    body: "Provost office asked for Q2 milestone updates in the consolidated plan.",
    tag: "Planning",
  },
  {
    title: "Auditor requested changes",
    time: "25 min ago",
    body: "REQ-2026-0112 requires an updated action entry and resubmission.",
    tag: "Inspection",
  },
  {
    title: "Objective submission accepted",
    time: "1 hour ago",
    body: "Cross-unit reporting dashboard submission was accepted.",
    tag: "Accepted",
  },
]

export default function Notifications() {
  return (
    <div className="min-w-0 flex-1 bg-background p-4 sm:p-6 lg:p-8">
      <header className="mb-6 flex flex-col gap-4 sm:mb-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">University administration</p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Notifications</h1>
          <p className="mt-1 max-w-xl text-sm text-muted-foreground">
            Updates on plans, milestones, submissions, and task reviews across the operational planning workspace.
          </p>
        </div>
        <Button variant="outline">Mark all as read</Button>
      </header>

      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Tabs value="all" className="w-auto">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">Unread</TabsTrigger>
            <TabsTrigger value="planning">Planning</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="w-full max-w-md sm:max-w-sm">
          <Input type="search" placeholder="Search notifications" />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {notifications.map((item) => (
            <div key={item.title} className="rounded-lg border border-border bg-card p-3">
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-semibold text-foreground">{item.title}</p>
                <span className="text-xs text-muted-foreground">{item.time}</span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{item.body}</p>
              <Badge variant="secondary" className="mt-2">
                {item.tag}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}