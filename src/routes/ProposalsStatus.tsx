import { useMemo, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SidebarTrigger } from "@/components/ui/sidebar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

type SubmissionFilter = "all" | "action" | "objective" | "task"
type ProposalType = Exclude<SubmissionFilter, "all">
type StatusTone = "pending" | "review" | "changes" | "accepted"

type SubmissionRow = {
  id: string
  submissionType: ProposalType
  perspective: string
  summary: string
  status: string
  statusTone: StatusTone
  followUpLabel: string
  followUpTo: string
}

const rows: SubmissionRow[] = [
  {
    id: "REQ-2026-0141",
    submissionType: "objective",
    perspective: "Catalysts",
    summary: "Improve research output visibility",
    status: "Pending auditor review",
    statusTone: "pending",
    followUpLabel: "View",
    followUpTo: "/notifications",
  },
  {
    id: "REQ-2026-0130",
    submissionType: "objective",
    perspective: "Enablers",
    summary: "Facilities — digital core uptime",
    status: "Edited - awaiting re-review",
    statusTone: "review",
    followUpLabel: "View edits",
    followUpTo: "/notifications",
  },
  {
    id: "REQ-2026-0112",
    submissionType: "action",
    perspective: "Beneficiary",
    summary: "KPI mapping workshop rollout",
    status: "Changes requested",
    statusTone: "changes",
    followUpLabel: "Edit",
    followUpTo: "/beneficiary/add-action",
  },
  {
    id: "REQ-2026-0098",
    submissionType: "objective",
    perspective: "Stakeholders",
    summary: "Cross-unit reporting dashboard",
    status: "Accepted",
    statusTone: "accepted",
    followUpLabel: "View in Catalysts",
    followUpTo: "/catalysts",
  },
  {
    id: "REQ-2026-0150",
    submissionType: "task",
    perspective: "Catalysts",
    summary: "Baseline task ownership matrix",
    status: "Pending auditor review",
    statusTone: "pending",
    followUpLabel: "View",
    followUpTo: "/notifications",
  },
  {
    id: "REQ-2026-0148",
    submissionType: "task",
    perspective: "Enablers",
    summary: "Data collection task timeline",
    status: "Edited - awaiting re-review",
    statusTone: "review",
    followUpLabel: "View edits",
    followUpTo: "/notifications",
  },
  {
    id: "REQ-2026-0143",
    submissionType: "task",
    perspective: "Beneficiary",
    summary: "Department rollout checklist",
    status: "Changes requested",
    statusTone: "changes",
    followUpLabel: "Edit",
    followUpTo: "/beneficiary/add-action",
  },
  {
    id: "REQ-2026-0139",
    submissionType: "task",
    perspective: "Stakeholders",
    summary: "Quarterly stakeholder outreach tasks",
    status: "Accepted",
    statusTone: "accepted",
    followUpLabel: "View in Stakeholders",
    followUpTo: "/stakeholders",
  },
]

function statusBadgeClass(tone: SubmissionRow["statusTone"]) {
  switch (tone) {
    case "pending":
      return "border-border bg-muted text-foreground"
    case "review":
      return "border-border bg-accent text-accent-foreground"
    case "changes":
      return "border-border bg-secondary text-secondary-foreground"
    case "accepted":
      return "border-border bg-primary/10 text-foreground"
    default:
      return ""
  }
}

const statusRows: { tone: StatusTone; label: string }[] = [
  { tone: "pending", label: "Pending auditor review" },
  { tone: "review", label: "Edited - awaiting re-review" },
  { tone: "changes", label: "Changes requested" },
  { tone: "accepted", label: "Accepted" },
]

export default function SubmissionStatus() {
  const location = useLocation()
  const routePrefix = location.pathname.startsWith("/contributor/") ? "/contributor" : ""
  const dashboardHref = routePrefix ? "/contributor/dashboard" : "/dashboard"

  const [filter, setFilter] = useState<SubmissionFilter>("all")

  const visibleRows = useMemo(() => {
    if (filter === "all") return rows
    return rows.filter((r) => r.submissionType === filter)
  }, [filter])
  const limitedRows = useMemo(() => visibleRows.slice(0, 5), [visibleRows])
  const statusOverview = useMemo(
    () =>
      statusRows.map((status) => {
        const objectives = rows.filter((r) => r.statusTone === status.tone && r.submissionType === "objective").length
        const actions = rows.filter((r) => r.statusTone === status.tone && r.submissionType === "action").length
        const tasks = rows.filter((r) => r.statusTone === status.tone && r.submissionType === "task").length
        return {
          tone: status.tone,
          label: status.label,
          objectives,
          actions,
          tasks,
          total: objectives + actions + tasks,
        }
      }),
    []
  )

  const resolveFollowUp = (path: string) => {
    if (!path.startsWith("/")) return path
    return `${routePrefix}${path}`
  }

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border/60 bg-background px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <SidebarTrigger className="md:hidden" />
        <Breadcrumb className="min-w-0">
          <BreadcrumbList className="min-w-0 flex-wrap">
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link to={dashboardHref} />}>Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>My proposals</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="min-w-0 flex-1 overflow-x-hidden bg-background p-4 sm:p-6 lg:p-8">
        <header className="mb-8">
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Proposals Status</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Track the inspection status of your proposed objectives, actions, and tasks
          </p>
        </header>

        <div className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {statusOverview.map((row) => (
            <div key={row.tone} className="min-h-[8.5rem] rounded-xl border border-border bg-background p-3">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-xs font-semibold text-muted-foreground">{row.label}</p>
                <Badge variant="outline" className={cn("rounded-full px-2 font-bold tabular-nums", statusBadgeClass(row.tone))}>
                  {row.total}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Objectives: <span className="font-semibold text-foreground">{row.objectives}</span>
              </p>
              <p className="text-xs text-muted-foreground">
                Actions: <span className="font-semibold text-foreground">{row.actions}</span>
              </p>
              <p className="text-xs text-muted-foreground">
                Tasks: <span className="font-semibold text-foreground">{row.tasks}</span>
              </p>
            </div>
          ))}
        </div>

        <Card className="overflow-hidden shadow-sm ring-1 ring-border/60">
          <CardHeader className="border-b border-border bg-muted/30 px-6 py-5 sm:px-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
              <div className="min-w-0">
                <CardTitle id="submissions-table-heading" className="text-lg">
                  Your recent proposals
                </CardTitle>
              </div>
              <div className="flex flex-wrap gap-2" role="group" aria-label="Filter proposals by type">
                {(
                  [
                    { key: "all" as const, label: "All" },
                    { key: "action" as const, label: "Actions" },
                    { key: "objective" as const, label: "Objectives" },
                        { key: "task" as const, label: "Tasks" },
                  ] as const
                ).map(({ key, label }) => (
                  <Button
                    key={key}
                    type="button"
                    size="sm"
                    variant={filter === key ? "default" : "outline"}
                    className={cn("rounded-full px-4 text-xs font-semibold")}
                    aria-pressed={filter === key}
                    onClick={() => setFilter(key)}
                  >
                    {label}
                  </Button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0 sm:p-0">
            <div className="max-h-[23rem] overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border bg-muted/50 hover:bg-muted/50">
                  <TableHead className="px-4 py-3 text-[10px] font-bold uppercase tracking-wide text-muted-foreground sm:px-6">
                    Request
                  </TableHead>
                  <TableHead className="px-4 py-3 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                    Type
                  </TableHead>
                  <TableHead className="px-4 py-3 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                    Strategic perspective
                  </TableHead>
                  <TableHead className="max-w-xs px-4 py-3 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                    Name
                  </TableHead>
                  <TableHead className="px-4 py-3 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                    Status
                  </TableHead>
                  <TableHead className="px-4 py-3 text-[10px] font-bold uppercase tracking-wide text-muted-foreground sm:px-6">
                    Follow-up
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {limitedRows.map((row) => (
                  <TableRow key={row.id} className="border-border" data-submission-type={row.submissionType}>
                    <TableCell className="px-4 py-4 font-mono text-xs font-semibold text-foreground sm:px-6">
                      {row.id}
                    </TableCell>
                    <TableCell className="px-4 py-4 text-foreground">
                      {row.submissionType === "objective"
                        ? "Objective"
                        : row.submissionType === "action"
                          ? "Action"
                          : "Task"}
                    </TableCell>
                    <TableCell className="px-4 py-4">
                      <Badge variant="outline" className="font-semibold">
                        {row.perspective}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs whitespace-normal px-4 py-4 text-muted-foreground">{row.summary}</TableCell>
                    <TableCell className="px-4 py-4">
                      <Badge variant="outline" className={cn("font-semibold", statusBadgeClass(row.statusTone))}>
                        {row.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-4 py-4 sm:px-6">
                      <Link
                        to={resolveFollowUp(row.followUpTo)}
                        className="text-sm font-medium text-primary underline-offset-4 hover:underline"
                      >
                        {row.followUpLabel}
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
