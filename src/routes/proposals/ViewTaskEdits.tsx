import { useMemo } from "react"
import { Link, useLocation } from "react-router-dom"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

const requestedFieldKeys = ["taskExpectedEndDate"] as const

const requestedEdits = [
  {
    field: "taskExpectedEndDate",
    requestedChange: "Move the expected end date to 30 June 2026 so Q2 milestones align with reporting window.",
  },
]

const yourModificationsByField = {
  taskExpectedEndDate: {
    previousValue: "15 May 2026",
    updatedValue: "30 June 2026",
  },
}

const taskFieldLabels: Record<string, string> = {
  taskName: "Task name",
  taskWeight: "Task weight",
  taskStartDate: "Start date",
  taskExpectedEndDate: "End date",
  taskPerformanceIndicators: "Performance indicators",
  taskTargetValue: "Target value",
  taskActualValueAchieved: "Number achieved",
  taskAchievementPercentage: "Achievement percentage",
}

export default function ViewTaskEdits() {
  const location = useLocation()
  const routePrefix = location.pathname.startsWith("/contributor/") ? "/contributor" : ""
  const proposalsStatusHref = `${routePrefix}/proposals-status`
  const dashboardHref = routePrefix ? "/contributor/dashboard" : "/dashboard"
  const requestId = "REQ-2026-0153"

  const editedOn = useMemo(() => {
    const d = new Date()
    return { iso: d.toISOString().slice(0, 10), label: new Intl.DateTimeFormat(undefined, { dateStyle: "long" }).format(d) }
  }, [])

  return (
    <div className="min-w-0 flex-1 overflow-x-hidden bg-background p-4 sm:p-6 lg:p-8">
      <header className="mb-6 sm:mb-8">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem><BreadcrumbLink render={<Link to={dashboardHref} />}>Dashboard</BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbLink render={<Link to={proposalsStatusHref} />}>Proposals Status</BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbPage>Review Edits</BreadcrumbPage></BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-mono text-xs font-semibold text-muted-foreground">{requestId}</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">Review Edited Task Submission</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Edited on: <time dateTime={editedOn.iso} className="font-medium text-foreground">{editedOn.label}</time>
            </p>
          </div>
          <span className="inline-flex w-fit items-center rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
            Edited — awaiting re-review
          </span>
        </div>
      </header>

      <div className="space-y-6">
        <section className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
          <div className="border-b border-border bg-muted/30 px-6 py-5 sm:px-8"><h2 className="text-lg font-bold">Old Submission</h2></div>
          <div className="px-6 py-6 sm:px-8 sm:py-8">
            <dl className="mt-3 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-border bg-muted/40 p-4 sm:col-span-2"><dt className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">{taskFieldLabels.taskName}</dt><dd className="mt-1 text-sm">Complete college-level KPI worksheet</dd></div>
              <div className="rounded-xl border border-border bg-muted/40 p-4"><dt className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">{taskFieldLabels.taskWeight}</dt><dd className="mt-1 text-sm">50%</dd></div>
              <div className="rounded-xl border border-border bg-muted/40 p-4"><dt className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">{taskFieldLabels.taskStartDate}</dt><dd className="mt-1 text-sm">01 Apr 2026</dd></div>
              <div className="rounded-xl border border-border bg-muted/40 p-4"><dt className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">{taskFieldLabels.taskExpectedEndDate}</dt><dd className="mt-1 text-sm font-medium">{yourModificationsByField.taskExpectedEndDate.updatedValue}</dd></div>
              <div className="rounded-xl border border-border bg-muted/40 p-4 sm:col-span-2"><dt className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">{taskFieldLabels.taskPerformanceIndicators}</dt><dd className="mt-1 text-sm">KPI worksheet completion and sign-off ratio.</dd></div>
              <div className="rounded-xl border border-border bg-muted/40 p-4"><dt className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">{taskFieldLabels.taskTargetValue}</dt><dd className="mt-1 text-sm">100</dd></div>
              <div className="rounded-xl border border-border bg-muted/40 p-4"><dt className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">{taskFieldLabels.taskActualValueAchieved}</dt><dd className="mt-1 text-sm">64</dd></div>
              <div className="rounded-xl border border-border bg-muted/40 p-4 sm:col-span-2"><dt className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">{taskFieldLabels.taskAchievementPercentage}</dt><dd className="mt-1 text-sm font-semibold">64%</dd></div>
            </dl>
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm">
          <div className="border-b border-border bg-muted/30 px-4 py-3 sm:px-5"><h2 className="text-base font-bold">Requested Edits</h2></div>
          <div className="space-y-3 px-4 py-4 sm:px-5 sm:py-4">
            {requestedEdits.map((item) => (
              <div key={item.field} className="rounded-xl border border-border bg-background p-3 shadow-sm">
                <p className="text-[8px] font-bold uppercase tracking-wide text-muted-foreground">Field</p>
                <p className="mt-0.5 text-xs font-semibold text-foreground">{taskFieldLabels[item.field] ?? item.field}</p>
                <p className="mt-2 text-[8px] font-bold uppercase tracking-wide text-muted-foreground">Requested change</p>
                <p className="mt-0.5 text-xs leading-snug text-muted-foreground">{item.requestedChange}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
          <div className="border-b border-border bg-muted/30 px-6 py-5 sm:px-8"><h2 className="text-lg font-bold">Your Modifications</h2></div>
          <div className="space-y-5 px-6 py-6 sm:px-8 sm:py-8">
            {requestedFieldKeys.map((key) => {
              const mod = yourModificationsByField[key]
              return (
                <div key={key} className="rounded-2xl border-2 border-border bg-background p-5 shadow-sm sm:p-6">
                  <p className="text-[9px] font-bold uppercase tracking-wide text-muted-foreground">Field</p>
                  <p className="mt-1 text-sm font-semibold text-foreground">{taskFieldLabels[key] ?? key}</p>
                  <p className="mt-4 text-[9px] font-bold uppercase tracking-wide text-muted-foreground">Previous value</p>
                  <p className="mt-1 text-sm text-muted-foreground">{mod.previousValue}</p>
                  <p className="mt-4 text-[9px] font-bold uppercase tracking-wide text-muted-foreground">Updated value</p>
                  <p className="mt-1 text-sm font-medium text-foreground">{mod.updatedValue}</p>
                </div>
              )
            })}
          </div>
        </section>

        <div className="flex justify-start border-t border-border pt-6">
          <Link to={proposalsStatusHref} className={cn(buttonVariants({ variant: "outline" }), "rounded-full px-5")}>
            Back to proposals status
          </Link>
        </div>
      </div>
    </div>
  )
}

