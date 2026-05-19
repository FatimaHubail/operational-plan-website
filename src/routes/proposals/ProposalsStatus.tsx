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
import { proposalStatusToneSurfaceClass } from "@/lib/proposalStatusChip"
import { perspectiveStrategicClass } from "@/lib/proposalStatPalette"
import { cn } from "@/lib/utils"

/** Hover treatment aligned with Latest in Queue links (`AuditorDashboard.tsx` → `latestQueueEntryLinkClassName`). */
const statusOverviewCardHoverClassName =
  "border border-border transition-colors hover:border-[oklch(0.72_0.145_48)] hover:bg-[color-mix(in_oklch,oklch(0.7_0.2_25)_5%,white)]"

/** Active filter: same border/background as hover (no primary ring). */
const statusOverviewCardActiveClassName =
  "border-[oklch(0.72_0.145_48)] bg-[color-mix(in_oklch,oklch(0.7_0.2_25)_5%,white)]"

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
    summary: "Facilities - digital core uptime",
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

  const followUpClassName = (row: SubmissionRow) =>
    row.followUpLabel === "Edit"
      ? "inline-flex rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition hover:bg-primary/90"
      : "inline-flex rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-foreground transition hover:bg-accent"

  return (
    <>
      <header className="mt-6 mb-0 flex shrink-0 items-center gap-2 pt-0 pb-0 bg-background px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:pt-2">
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
          <h1 className="mt-0.5 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Proposals Status</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Track the inspection status of your proposed objectives, actions, and tasks
          </p>
        </header>

        <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4 xl:gap-6">
          {statusOverview.map((row) => {
            const isActive = toneFilter === row.tone
            return (
              <Card
                key={row.tone}
                role="button"
                tabIndex={0}
                aria-pressed={isActive}
                aria-label={`Filter table by ${row.label}`}
                onClick={() => toggleToneCard(row.tone)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault()
                    toggleToneCard(row.tone)
                  }
                }}
                className={cn(
                  "h-full cursor-pointer py-0 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  statusOverviewCardHoverClassName,
                  isActive && statusOverviewCardActiveClassName
                )}
              >
                <CardContent className="p-3">
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <p className="text-xs font-semibold text-muted-foreground">{row.label}</p>
                    <span
                      className={cn(
                        "inline-flex max-w-full flex-wrap items-center gap-x-1.5 rounded-lg px-2.5 py-1 text-sm font-medium tabular-nums text-secondary-foreground transition",
                        proposalStatusToneSurfaceClass(row.tone)
                      )}
                    >
                      {row.total}
                    </span>
                  </div>
                  <p className="flex items-center gap-1.5 text-xs leading-tight text-muted-foreground">
                    <span
                      className="proposal-stat-swatch-pending size-1.5 shrink-0 rounded-full"
                      aria-hidden="true"
                    />
                    <span>
                      Objectives: <span className="font-semibold text-foreground">{row.objectives}</span>
                    </span>
                  </p>
                  <p className="flex items-center gap-1.5 text-xs leading-tight text-muted-foreground">
                    <span
                      className="proposal-stat-swatch-chart-4 size-1.5 shrink-0 rounded-full"
                      aria-hidden="true"
                    />
                    <span>
                      Actions: <span className="font-semibold text-foreground">{row.actions}</span>
                    </span>
                  </p>
                  <p className="flex items-center gap-1.5 text-xs leading-tight text-muted-foreground">
                    <span
                      className="proposal-stat-swatch-chart-2 size-1.5 shrink-0 rounded-full"
                      aria-hidden="true"
                    />
                    <span>
                      Tasks: <span className="font-semibold text-foreground">{row.tasks}</span>
                    </span>
                  </p>
                  <p className="mt-2 text-[11px] font-medium text-primary">Click to filter table</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {toneFilter !== "all" && (
          <p className="mb-4 text-sm text-muted-foreground">
            Showing proposals in:{" "}
            <span className="font-semibold text-foreground">{statusRows.find((s) => s.tone === toneFilter)?.label}</span>
            .{" "}
            <Button
              type="button"
              variant="link"
              className="h-auto p-0 font-medium text-primary decoration-primary/60 underline-offset-4"
              onClick={() => setToneFilter("all")}
            >
              Clear status filter
            </Button>
          </p>
        )}

        <Card className="gap-0 overflow-hidden rounded-3xl bg-card py-0 shadow-[0_12px_40px_rgba(0,0,0,0.06),0_4px_12px_rgba(0,0,0,0.04)] ring-1 ring-border/60">
          <CardHeader className="border-b border-border bg-muted/30 px-6 py-5 sm:px-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
              <div className="min-w-0">
                <CardTitle id="submissions-table-heading" className="text-lg font-bold text-foreground">
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
                <TableRow className="border-b border-border bg-muted/80 hover:bg-muted/80">
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
                  <TableHead className="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-wide text-muted-foreground sm:px-6">
                    Follow-up
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-border">
                {limitedRows.map((row) => (
                  <TableRow
                    key={row.id}
                    className="border-0 hover:bg-muted/50"
                    data-submission-type={row.submissionType}
                  >
                    <TableCell className="whitespace-nowrap px-4 py-4 font-mono text-xs font-semibold text-foreground/90 sm:px-6">
                      {row.id}
                    </TableCell>
                    <TableCell className="px-4 py-4 text-foreground">
                      {row.submissionType === "objective"
                        ? "Objective"
                        : row.submissionType === "action"
                          ? "Action"
                          : "Task"}
                    </TableCell>
                    <TableCell className="min-w-[10rem] max-w-[18rem] px-4 py-4 align-middle lg:min-w-[12rem]">
                      <span
                        className={cn(
                          "inline-flex max-w-full flex-wrap items-center gap-x-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold text-[oklch(0.55_0.015_255)] transition",
                          perspectiveStrategicClass(row.perspective)
                        )}
                      >
                        <span>{row.perspective}</span>
                        <span className="select-none text-[oklch(0.55_0.015_255)]/70" aria-hidden="true">
                          ·
                        </span>
                        <span className="font-mono font-semibold tabular-nums">{row.perspectiveSection}</span>
                      </span>
                    </TableCell>
                    <TableCell className="max-w-xs whitespace-normal px-4 py-4 text-black">{row.summary}</TableCell>
                    <TableCell className="px-4 py-4">
                      <span
                        className={cn(
                          "inline-flex max-w-full min-w-0 flex-wrap items-center gap-x-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold text-[oklch(0.55_0.015_255)] transition",
                          proposalStatusToneSurfaceClass(row.statusTone)
                        )}
                      >
                        {row.status}
                      </span>
                    </TableCell>
                    <TableCell className="px-4 py-4 text-center sm:px-6">
                      <Link
                        to={followUpHref(row)}
                        className={followUpClassName(row)}
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
