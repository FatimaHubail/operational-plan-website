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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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

type SubmissionFilter = "all" | "action" | "objective"

type SubmissionRow = {
  id: string
  submissionType: "objective" | "action"
  perspective: string
  summary: string
  status: string
  statusTone: "pending" | "review" | "changes" | "accepted"
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
    status: "Edited — awaiting re-review",
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

export default function SubmissionStatus() {
  const location = useLocation()
  const routePrefix = location.pathname.startsWith("/contributor/") ? "/contributor" : ""
  const dashboardHref = routePrefix ? "/contributor/dashboard" : "/dashboard"
  const addObjectiveHref = `${routePrefix}/catalysts/add-objective`
  const addActionHref = `${routePrefix}/catalysts/add-action`

  const [filter, setFilter] = useState<SubmissionFilter>("all")

  const visibleRows = useMemo(() => {
    if (filter === "all") return rows
    return rows.filter((r) => r.submissionType === filter)
  }, [filter])

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
              <BreadcrumbPage>My submissions</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="min-w-0 flex-1 overflow-x-hidden bg-background p-4 sm:p-6 lg:p-8">
        <header className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Inspection &amp; approval</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Submission status</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Objectives and actions you create through{" "}
            <Link to={addObjectiveHref} className="font-medium text-primary underline-offset-4 hover:underline">
              Add operational objectives
            </Link>{" "}
            or{" "}
            <Link to={addActionHref} className="font-medium text-primary underline-offset-4 hover:underline">
              Add action
            </Link>{" "}
            enter the same workflow auditors use: <span className="font-medium text-foreground">inspect</span> the
            payload, then <span className="font-medium text-foreground">Accept submission</span> or{" "}
            <span className="font-medium text-foreground">Request changes</span> with field-level notes. Resubmissions
            show as <span className="font-medium text-foreground">Edited — awaiting re-review</span>.
          </p>
        </header>

        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <Card className="shadow-sm ring-1 ring-border/60">
            <CardContent className="p-4">
              <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Pending review</p>
              <p className="mt-1 text-2xl font-bold tabular-nums text-foreground">2</p>
              <p className="mt-1 text-xs text-muted-foreground">In auditor queues</p>
            </CardContent>
          </Card>
          <Card className="shadow-sm ring-1 ring-border/60">
            <CardContent className="p-4">
              <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Awaiting re-review</p>
              <p className="mt-1 text-2xl font-bold tabular-nums text-foreground">1</p>
              <p className="mt-1 text-xs text-muted-foreground">After you applied edits</p>
            </CardContent>
          </Card>
          <Card className="shadow-sm ring-1 ring-border/60">
            <CardContent className="p-4">
              <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Accepted</p>
              <p className="mt-1 text-2xl font-bold tabular-nums text-foreground">4</p>
              <p className="mt-1 text-xs text-muted-foreground">This planning cycle</p>
            </CardContent>
          </Card>
        </div>

        <Card className="overflow-hidden shadow-sm ring-1 ring-border/60">
          <CardHeader className="border-b border-border bg-muted/30 px-6 py-5 sm:px-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
              <div className="min-w-0">
                <CardTitle id="submissions-table-heading" className="text-lg">
                  Your recent submissions
                </CardTitle>
                <CardDescription className="mt-0.5 text-sm">
                  Demo rows mirror statuses on objective and action auditor queues.
                </CardDescription>
              </div>
              <div className="flex flex-wrap gap-2" role="group" aria-label="Filter submissions by type">
                {(
                  [
                    { key: "all" as const, label: "All" },
                    { key: "action" as const, label: "Actions" },
                    { key: "objective" as const, label: "Objectives" },
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
                    Summary
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
                {visibleRows.map((row) => (
                  <TableRow key={row.id} className="border-border" data-submission-type={row.submissionType}>
                    <TableCell className="px-4 py-4 font-mono text-xs font-semibold text-foreground sm:px-6">
                      {row.id}
                    </TableCell>
                    <TableCell className="px-4 py-4 text-foreground">
                      {row.submissionType === "objective" ? "Objective" : "Action"}
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
          </CardContent>
        </Card>
      </div>
    </>
  )
}
