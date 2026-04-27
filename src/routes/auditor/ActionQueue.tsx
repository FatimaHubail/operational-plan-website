import { Link } from "react-router-dom"
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type ActionRequest = {
  requestId: string
  title: string
  submittedBy: string
  status: "Pending" | "Edited" | "Accepted" | "Changes requested"
  actionLabel: "Open" | "View"
}

const requests: ActionRequest[] = [
  {
    requestId: "REQ-2026-0142",
    title: "Faculty KPI mapping and sign-off",
    submittedBy: "Ahmed Khalil",
    status: "Pending",
    actionLabel: "Open",
  },
  {
    requestId: "REQ-2026-0131",
    title: "Cross-unit handover checklist",
    submittedBy: "IT and Operations",
    status: "Edited",
    actionLabel: "Open",
  },
  {
    requestId: "REQ-2026-0138",
    title: "Budget alignment checkpoint",
    submittedBy: "Juliana Rahman",
    status: "Accepted",
    actionLabel: "View",
  },
  {
    requestId: "REQ-2026-0129",
    title: "Q2 milestone consolidation",
    submittedBy: "Planning office",
    status: "Changes requested",
    actionLabel: "View",
  },
]

function statusClass(status: ActionRequest["status"]) {
  if (status === "Pending") return "text-muted-foreground"
  if (status === "Edited") return "text-accent-foreground"
  if (status === "Accepted") return "text-secondary-foreground"
  return "text-foreground"
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
          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Add action</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">Action queue</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Submissions created when contributors save the Add action form. Only action-type requests appear here.
          </p>
        </header>

        <nav aria-label="Queue type" className="mb-6 flex flex-wrap items-center gap-2 border-b border-border pb-4">
          <Button type="button" size="sm">
            Action queue
          </Button>
          <Link
            to="/objective-queue"
            className="inline-flex rounded-full border border-border bg-background px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-accent"
          >
            Objective queue
          </Link>
        </nav>

        <Card className="overflow-hidden ring-1 ring-border/60">
          <CardHeader className="flex flex-col gap-4 border-b border-border bg-muted/30 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-lg">Action requests</CardTitle>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Source: Add action - filter chips are static until backend is wired
              </p>
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
                      <p className="mt-0.5 font-semibold">{row.title}</p>
                    </TableCell>
                    <TableCell className="px-4 py-4 text-muted-foreground">{row.submittedBy}</TableCell>
                    <TableCell className="px-4 py-4">
                      <span className={`text-xs font-semibold ${statusClass(row.status)}`}>{row.status}</span>
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
          </CardContent>
        </Card>
    </div>
  )
}
