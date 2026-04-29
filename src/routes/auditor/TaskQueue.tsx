import { Link } from "react-router-dom"
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type TaskRequest = {
  requestId: string
  title: string
  submittedBy: string
  entity: string
  strategicPerspective: string
  status: "Pending" | "Edited" | "Accepted" | "Changes requested"
  actionLabel: "Open" | "View"
}

const requests: TaskRequest[] = [
  {
    requestId: "REQ-2026-0150",
    title: "Baseline task ownership matrix",
    submittedBy: "Mariam Al-Sayed",
    entity: "Operations",
    strategicPerspective: "Catalysts - C4.0",
    status: "Pending",
    actionLabel: "Open",
  },
  {
    requestId: "REQ-2026-0148",
    title: "Data collection task timeline",
    submittedBy: "IT and Operations",
    entity: "IT and Operations",
    strategicPerspective: "Enablers - E1.2",
    status: "Edited",
    actionLabel: "Open",
  },
  {
    requestId: "REQ-2026-0143",
    title: "Department rollout checklist",
    submittedBy: "Planning Office",
    entity: "Planning Office",
    strategicPerspective: "Beneficiary - B3.1",
    status: "Changes requested",
    actionLabel: "View",
  },
  {
    requestId: "REQ-2026-0139",
    title: "Quarterly stakeholder outreach tasks",
    submittedBy: "Quality Assurance",
    entity: "Quality Assurance",
    strategicPerspective: "Stakeholders - S4.2",
    status: "Accepted",
    actionLabel: "View",
  },
]

function statusClass(status: TaskRequest["status"]) {
  if (status === "Pending") return "text-muted-foreground"
  if (status === "Edited") return "text-accent-foreground"
  if (status === "Accepted") return "text-secondary-foreground"
  return "text-foreground"
}

function renderStrategicPerspective(value: string) {
  const [perspective, section] = value.split(" - ")
  return (
    <Badge
      variant="outline"
      className="inline-flex max-w-full flex-wrap items-center gap-x-1.5 gap-y-0.5 rounded-lg px-2 py-1 text-[11px] font-normal leading-snug"
    >
      <span className="font-semibold text-foreground">{perspective ?? value}</span>
      {section ? (
        <>
          <span className="shrink-0 text-muted-foreground">-</span>
          <span className="font-mono font-semibold tabular-nums text-foreground">{section}</span>
        </>
      ) : null}
    </Badge>
  )
}

export default function TaskQueue() {
  return (
    <div className="min-w-0 flex-1 overflow-x-hidden bg-background p-4 sm:p-6 lg:p-8">
      <header className="mb-4 sm:mb-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link to="/dashboard-auditor" />}>Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Task queue</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">Task Queue</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Inspect tasks proposed by contributors
        </p>
      </header>

      <nav aria-label="Queue type" className="mb-6 flex flex-wrap items-center gap-2 border-b border-border pb-4">
        <Link
          to="/action-queue"
          className="inline-flex rounded-full border border-border bg-background px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-accent"
        >
          Action queue
        </Link>
        <Link
          to="/objective-queue"
          className="inline-flex rounded-full border border-border bg-background px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-accent"
        >
          Objective queue
        </Link>
        <Button type="button" size="sm">
          Task queue
        </Button>
      </nav>

      <Card className="overflow-hidden ring-1 ring-border/60">
        <CardHeader className="flex flex-col gap-4 border-b border-border bg-muted/30 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-lg">Task Proposals</CardTitle>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" size="sm">
              Pending
            </Button>
            <Button type="button" size="sm" variant="outline">
              Accepted
            </Button>
            <Button type="button" size="sm" variant="outline">
              Changes requested
            </Button>
            <Button type="button" size="sm" variant="outline">
              Edited
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="max-h-[22rem] overflow-x-auto overflow-y-auto">
            <Table className="min-w-[640px]">
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="whitespace-nowrap px-4 py-3 text-[11px] font-bold uppercase tracking-wide text-muted-foreground sm:px-6 lg:pl-8">
                    Request
                  </TableHead>
                  <TableHead className="whitespace-nowrap px-4 py-3 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                    Submitted by
                  </TableHead>
                  <TableHead className="whitespace-nowrap px-4 py-3 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                    Entity
                  </TableHead>
                  <TableHead className="whitespace-nowrap px-4 py-3 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                    Strategic perspective
                  </TableHead>
                  <TableHead className="whitespace-nowrap px-4 py-3 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                    Name
                  </TableHead>
                  <TableHead className="whitespace-nowrap px-4 py-3 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                    Status
                  </TableHead>
                  <TableHead className="whitespace-nowrap px-4 py-3 text-right text-[11px] font-bold uppercase tracking-wide text-muted-foreground lg:pr-8">
                    Review
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((row) => (
                  <TableRow key={row.requestId} className="transition hover:bg-muted/30">
                    <TableCell className="px-4 py-4 sm:px-6 lg:pl-8">
                      <p className="font-mono text-xs font-semibold text-muted-foreground">{row.requestId}</p>
                    </TableCell>
                    <TableCell className="px-4 py-4 text-muted-foreground">{row.submittedBy}</TableCell>
                    <TableCell className="px-4 py-4 text-muted-foreground">{row.entity}</TableCell>
                    <TableCell className="px-4 py-4 text-muted-foreground">{renderStrategicPerspective(row.strategicPerspective)}</TableCell>
                    <TableCell className="px-4 py-4 font-semibold">{row.title}</TableCell>
                    <TableCell className="px-4 py-4">
                      <span className={`text-xs font-semibold ${statusClass(row.status)}`}>{row.status}</span>
                    </TableCell>
                    <TableCell className="px-4 py-4 text-right lg:pr-8">
                      <Link
                        to={
                          row.status === "Edited"
                            ? "/review-task?edited=1"
                            : row.status === "Accepted"
                              ? "/review-task?status=accepted"
                              : row.status === "Changes requested"
                                ? "/review-task?status=changes_requested"
                                : "/review-task"
                        }
                        className={
                          row.actionLabel === "Open"
                            ? "inline-flex rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition hover:bg-primary/90"
                            : "inline-flex rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-foreground transition hover:bg-accent"
                        }
                      >
                        {row.actionLabel}
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
  )
}
