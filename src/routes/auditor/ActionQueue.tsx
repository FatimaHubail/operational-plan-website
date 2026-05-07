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
import { proposalStatusToneSurfaceClass } from "@/lib/proposalStatusChip"
import { cn } from "@/lib/utils"

type ActionRequest = {
  requestId: string
  title: string
  submittedBy: string
  entity: string
  strategicPerspective: string
  status: "Pending" | "Edited" | "Accepted" | "Changes requested"
  actionLabel: "Open" | "View"
}

const requests: ActionRequest[] = [
  {
    requestId: "REQ-2026-0142",
    title: "Faculty KPI mapping and sign-off",
    submittedBy: "Ahmed Khalil",
    entity: "College of Science",
    strategicPerspective: "Beneficiary - B1.4",
    status: "Pending",
    actionLabel: "Open",
  },
  {
    requestId: "REQ-2026-0131",
    title: "Cross-unit handover checklist",
    submittedBy: "IT and Operations",
    entity: "IT and Operations",
    strategicPerspective: "Catalysts - C1.1",
    status: "Edited",
    actionLabel: "Open",
  },
  {
    requestId: "REQ-2026-0138",
    title: "Budget alignment checkpoint",
    submittedBy: "Juliana Rahman",
    entity: "Finance Unit",
    strategicPerspective: "Stakeholders - S2.1",
    status: "Accepted",
    actionLabel: "View",
  },
  {
    requestId: "REQ-2026-0129",
    title: "Q2 milestone consolidation",
    submittedBy: "Planning office",
    entity: "Planning Office",
    strategicPerspective: "Enablers - E3.2",
    status: "Changes requested",
    actionLabel: "View",
  },
]

function statusClass(status: ActionRequest["status"]) {
  if (status === "Pending") return "pending"
  if (status === "Edited") return "review"
  if (status === "Accepted") return "accepted"
  return "changes"
}

function perspectiveStrategicClass(perspective: string) {
  switch (perspective) {
    case "Catalysts":
      return "strategic-perspective-bg-chart-1"
    case "Enablers":
      return "strategic-perspective-bg-chart-2"
    case "Beneficiary":
      return "strategic-perspective-bg-chart-4"
    case "Stakeholders":
      return "strategic-perspective-bg-chart-5"
    default:
      return "strategic-perspective-bg-chart-1"
  }
}

function renderStrategicPerspective(value: string) {
  const [perspective, section] = value.split(" - ")
  return (
    <Badge
      className={cn(
        "inline-flex max-w-full flex-wrap items-center gap-x-1.5 gap-y-0.5 rounded-full border-0 px-2.5 py-0.5 text-xs font-semibold leading-snug text-[oklch(0.55_0.015_255)]",
        perspectiveStrategicClass(perspective ?? value)
      )}
    >
      <span>{perspective ?? value}</span>
      {section ? (
        <>
          <span className="shrink-0">-</span>
          <span className="font-mono font-semibold tabular-nums">{section}</span>
        </>
      ) : null}
    </Badge>
  )
}

export default function ActionQueue() {
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
                <BreadcrumbPage>Action queue</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">Action Queue</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Inspect actions proposed by contributors
          </p>
        </header>

        <nav aria-label="Queue type" className="mb-6 flex flex-wrap items-center gap-2 border-b border-border pb-4">
          <Link
            to="/objective-queue"
            className="inline-flex rounded-full border border-border bg-background px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-accent"
          >
            Objective queue
          </Link>
          <Button
            type="button"
            className="inline-flex h-auto rounded-full border border-transparent bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
          >
            Action queue
          </Button>
          <Link
            to="/task-queue"
            className="inline-flex rounded-full border border-border bg-background px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-accent"
          >
            Task queue
          </Link>
        </nav>

        <Card className="gap-0 overflow-hidden rounded-3xl bg-card py-0 shadow-[0_12px_40px_rgba(0,0,0,0.06),0_4px_12px_rgba(0,0,0,0.04)] ring-1 ring-border/60">
          <CardHeader className="flex flex-col gap-4 border-b border-border bg-muted/30 px-6 py-5 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:px-8">
            <div>
              <CardTitle className="text-lg font-bold">Action Proposals</CardTitle>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button type="button" size="sm" className="rounded-full">
                Pending
              </Button>
              <Button type="button" size="sm" variant="outline" className="rounded-full">
                Accepted
              </Button>
              <Button type="button" size="sm" variant="outline" className="rounded-full">
                Changes requested
              </Button>
              <Button type="button" size="sm" variant="outline" className="rounded-full">
                Edited
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <div className="max-h-[22rem] overflow-x-auto overflow-y-auto">
            <Table className="min-w-[720px]">
              <TableHeader>
                <TableRow className="border-b border-border bg-muted/80 hover:bg-muted/80">
                  <TableHead className="whitespace-nowrap px-4 py-3 text-[10px] font-bold uppercase tracking-wide text-muted-foreground sm:px-6 lg:pl-8">
                    Request
                  </TableHead>
                  <TableHead className="whitespace-nowrap px-4 py-3 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                    Submitted by
                  </TableHead>
                  <TableHead className="whitespace-nowrap px-4 py-3 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                    Entity
                  </TableHead>
                  <TableHead className="whitespace-nowrap px-4 py-3 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                    Strategic perspective
                  </TableHead>
                  <TableHead className="whitespace-nowrap px-4 py-3 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                    Name
                  </TableHead>
                  <TableHead className="whitespace-nowrap px-4 py-3 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                    Status
                  </TableHead>
                  <TableHead className="whitespace-nowrap px-4 py-3 text-right text-[10px] font-bold uppercase tracking-wide text-muted-foreground lg:pr-8">
                    Review
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-border">
                {requests.map((row) => (
                  <TableRow key={row.requestId} className="border-0 transition hover:bg-muted/50">
                    <TableCell className="px-4 py-4 sm:px-6 lg:pl-8">
                      <p className="font-mono text-xs font-semibold text-black">{row.requestId}</p>
                    </TableCell>
                    <TableCell className="px-4 py-4 text-black">{row.submittedBy}</TableCell>
                    <TableCell className="px-4 py-4 text-black">{row.entity}</TableCell>
                    <TableCell className="px-4 py-4 text-muted-foreground">{renderStrategicPerspective(row.strategicPerspective)}</TableCell>
                    <TableCell className="px-4 py-4">{row.title}</TableCell>
                    <TableCell className="px-4 py-4">
                      <span
                        className={cn(
                          "inline-flex max-w-full min-w-0 flex-wrap items-center gap-x-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold text-[oklch(0.55_0.015_255)] transition",
                          proposalStatusToneSurfaceClass(statusClass(row.status))
                        )}
                      >
                        {row.status}
                      </span>
                    </TableCell>
                    <TableCell className="px-4 py-4 text-right lg:pr-8">
                      <Link
                        to={
                          row.status === "Edited"
                            ? "/review-action?edited=1"
                            : row.status === "Accepted"
                              ? "/review-action?status=accepted"
                              : row.status === "Changes requested"
                                ? "/review-action?status=changes_requested"
                                : "/review-action"
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
