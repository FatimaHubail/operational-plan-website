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
  /** Strategic perspective label (e.g. Catalysts). */
  perspective: string
  /** Section code within that perspective (e.g. C1.1, E3.2). */
  perspectiveSection: string
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
    perspectiveSection: "C1.1",
    summary: "Improve research output visibility",
    status: "Pending auditor review",
    statusTone: "pending",
    followUpLabel: "View",
    followUpTo: "/notifications",
  },
  {
    id: "REQ-2026-0105",
    submissionType: "objective",
    perspective: "Catalysts",
    perspectiveSection: "C2.3",
    summary: "Digital services uptime target",
    status: "Changes requested",
    statusTone: "changes",
    followUpLabel: "Edit",
    followUpTo: "/catalysts/add-objective",
  },
  {
    id: "REQ-2026-0130",
    submissionType: "objective",
    perspective: "Enablers",
    perspectiveSection: "E3.2",
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
    perspectiveSection: "B1.4",
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
    perspectiveSection: "S2.1",
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
    perspectiveSection: "C4.0",
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
    perspectiveSection: "E1.2",
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
    perspectiveSection: "B3.1",
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
    perspectiveSection: "S4.2",
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

  const objectiveEditsHref = `${routePrefix}/proposal/view/objective-edits`
  const actionEditsHref = `${routePrefix}/proposal/view/action-edits`
  const taskEditsHref = `${routePrefix}/proposal/view/task-edits`
  const editObjectiveHref = `${routePrefix}/proposal/edit/objective`
  const editActionHref = `${routePrefix}/proposal/edit/action`
  const editTaskHref = `${routePrefix}/proposal/edit/task`

  const [filter, setFilter] = useState<SubmissionFilter>("all")
  /** When set, table shows only proposals in this lifecycle tone (e.g. Edited). */
  const [toneFilter, setToneFilter] = useState<StatusTone | "all">("all")

  const visibleRows = useMemo(() => {
    let list = rows
    if (filter !== "all") list = list.filter((r) => r.submissionType === filter)
    if (toneFilter !== "all") list = list.filter((r) => r.statusTone === toneFilter)
    return list
  }, [filter, toneFilter])
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

  const followUpHref = (row: SubmissionRow) => {
    if (row.statusTone === "pending" && row.followUpLabel === "View") {
      const path =
        row.submissionType === "objective"
          ? `${routePrefix}/proposal/review/objective`
          : row.submissionType === "action"
            ? `${routePrefix}/proposal/review/action`
            : `${routePrefix}/proposal/review/task`
      return `${path}?context=proposal`
    }
    // Edited - awaiting re-review → view-edits detail pages
    if (row.statusTone === "review" && row.followUpLabel === "View edits") {
      const path =
        row.submissionType === "objective"
          ? objectiveEditsHref
          : row.submissionType === "action"
            ? actionEditsHref
            : taskEditsHref
      return path
    }
    // Changes requested → contributor edit flow
    if (row.statusTone === "changes" && row.followUpLabel === "Edit") {
      return row.submissionType === "objective" ? editObjectiveHref : row.submissionType === "action" ? editActionHref : editTaskHref
    }
    return resolveFollowUp(row.followUpTo)
  }

  const toggleToneCard = (tone: StatusTone) => {
    setToneFilter((prev) => (prev === tone ? "all" : tone))
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
          {statusOverview.map((row) => {
            const isActive = toneFilter === row.tone
            return (
              <button
                key={row.tone}
                type="button"
                onClick={() => toggleToneCard(row.tone)}
                className={cn(
                  "min-h-[8.5rem] cursor-pointer rounded-xl border bg-background p-3 text-left transition hover:bg-muted/40",
                  isActive ? "border-primary ring-2 ring-primary/30" : "border-border"
                )}
                aria-pressed={isActive}
                aria-label={`Filter table by ${row.label}`}
              >
                <div className="mb-2 flex items-center justify-between gap-2">
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
                <p className="mt-2 text-[11px] font-medium text-primary">Click to filter table</p>
              </button>
            )
          })}
        </div>

        {toneFilter !== "all" && (
          <p className="mb-4 text-sm text-muted-foreground">
            Showing proposals in:{" "}
            <span className="font-semibold text-foreground">{statusRows.find((s) => s.tone === toneFilter)?.label}</span>
            .{" "}
            <button
              type="button"
              className="font-medium text-primary decoration-primary/60 underline-offset-4 hover:underline"
              onClick={() => setToneFilter("all")}
            >
              Clear status filter
            </button>
          </p>
        )}

        <Card className="overflow-hidden shadow-sm ring-1 ring-border/60">
          <CardHeader className="border-b border-border bg-muted/30 px-6 py-5 sm:px-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
              <div className="min-w-0">
                <CardTitle id="submissions-table-heading" className="text-lg">
                  Your Recent Proposals
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
            <div className="max-h-[23rem] overflow-x-auto overflow-y-auto">
            <Table className="min-w-[720px]">
              <TableHeader>
                <TableRow className="border-border bg-muted/50 hover:bg-muted/50">
                  <TableHead className="px-4 py-3 text-[10px] font-bold uppercase tracking-wide text-muted-foreground sm:px-6">
                    Request
                  </TableHead>
                  <TableHead className="px-4 py-3 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                    Type
                  </TableHead>
                  <TableHead className="min-w-[10rem] whitespace-nowrap px-4 py-3 text-[10px] font-bold uppercase tracking-wide text-muted-foreground lg:min-w-[12rem]">
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
                    <TableCell className="min-w-[10rem] max-w-[18rem] px-4 py-3 align-middle lg:min-w-[12rem]">
                      <Badge
                        variant="outline"
                        className="inline-flex max-w-full flex-wrap items-center gap-x-1.5 gap-y-0.5 rounded-lg px-2 py-1 text-[11px] font-normal leading-snug"
                      >
                        <span className="font-semibold text-foreground">{row.perspective}</span>
                        <span className="shrink-0 text-muted-foreground">-</span>
                        <span className="font-mono font-semibold tabular-nums text-foreground">{row.perspectiveSection}</span>
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
                        to={followUpHref(row)}
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
