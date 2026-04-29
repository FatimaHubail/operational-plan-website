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

/** Fields that appeared in the auditor’s “requested edits”; show matching updates only here. */
const requestedFieldKeys = ["actionTotalAchievement"] as const

type RequestedEditItem = {
  field: string
  requestedChange: string
}

const requestedEdits: RequestedEditItem[] = [
  {
    field: "actionTotalAchievement",
    requestedChange:
      "Provide a measurable total achievement value to summarize action-level progress.",
  },
]

/** Latest values after resubmit — only keys listed in requested edits / requestedFieldKeys. */
const yourModificationsByField: Record<(typeof requestedFieldKeys)[number], { previousValue: string; updatedValue: string }> =
  {
    actionTotalAchievement: {
      previousValue: "—",
      updatedValue: "61%",
    },
  }

const actionFieldLabels: Record<string, string> = {
  actionTitle: "Action title",
  actionTotalWeight: "Total weight",
  actionTotalAchievement: "Total achievement",
  taskMainEntity: "Main entity",
  taskSupportingEntities: "Supporting entities",
  taskHumanResources: "Human resources required",
  taskFinancialResources: "Financial resources required",
  taskActionContributionPercentage: "Action contribution percentage",
  taskStatus: "Status",
  taskNotes: "Notes",
}

export default function ViewActionEdits() {
  const location = useLocation()
  const routePrefix = location.pathname.startsWith("/contributor/") ? "/contributor" : ""
  const proposalsStatusHref = `${routePrefix}/proposals-status`
  const dashboardHref = routePrefix ? "/contributor/dashboard" : "/dashboard"

  const requestId = "REQ-2026-0148"

  const editedOn = useMemo(() => {
    const d = new Date()
    return {
      iso: d.toISOString().slice(0, 10),
      label: new Intl.DateTimeFormat(undefined, { dateStyle: "long" }).format(d),
    }
  }, [])

  return (
    <div className="min-w-0 flex-1 overflow-x-hidden bg-background p-4 sm:p-6 lg:p-8">
      <header className="mb-6 sm:mb-8">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link to={dashboardHref} />}>Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link to={proposalsStatusHref} />}>Proposals Status</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Review Edits</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-mono text-xs font-semibold text-muted-foreground">{requestId}</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">Review Edited Action Submission</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Edited on:{" "}
              <time dateTime={editedOn.iso} className="font-medium text-foreground">
                {editedOn.label}
              </time>
            </p>
          </div>
          <span className="inline-flex w-fit items-center rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
            Edited — awaiting re-review
          </span>
        </div>
      </header>

      <div className="mb-6 rounded-2xl border border-border bg-accent/40 px-4 py-3 text-sm text-foreground shadow-sm">
        <p className="font-semibold">Edited Resubmission</p>
        <p className="mt-1 text-muted-foreground">
          Check your old submission, auditor's requested changes, and your modifications based on those requests
        </p>
      </div>

      <div className="space-y-6">
        <section className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm" aria-labelledby="old-submission-action-heading">
          <div className="border-b border-border bg-muted/30 px-6 py-5 sm:px-8">
            <h2 id="old-submission-action-heading" className="text-lg font-bold">
              Old Submission
            </h2>
          </div>
          <div className="px-6 py-6 sm:px-8 sm:py-8">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">Action</h3>
            <dl className="mt-3 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-border bg-muted/40 p-4 sm:col-span-2">
                <dt className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">{actionFieldLabels.actionTitle}</dt>
                <dd className="mt-1 text-sm font-medium">Faculty KPI mapping and sign-off</dd>
              </div>
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <dt className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">{actionFieldLabels.actionTotalWeight}</dt>
                <dd className="mt-1 text-sm font-semibold">50%</dd>
              </div>
              <div className="rounded-xl border border-border bg-muted/40 p-4 sm:col-span-2">
                <dt className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">{actionFieldLabels.actionTotalAchievement}</dt>
                <dd className="mt-1 text-sm font-semibold">61%</dd>
              </div>
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <dt className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">{actionFieldLabels.taskStatus}</dt>
                <dd className="mt-1 text-sm">In progress</dd>
              </div>
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <dt className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">{actionFieldLabels.taskActionContributionPercentage}</dt>
                <dd className="mt-1 text-sm">40%</dd>
              </div>
              <div className="rounded-xl border border-border bg-muted/40 p-4 sm:col-span-2">
                <dt className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">{actionFieldLabels.taskMainEntity}</dt>
                <dd className="mt-1 text-sm">College of Science</dd>
              </div>
              <div className="rounded-xl border border-border bg-muted/40 p-4 sm:col-span-2">
                <dt className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">{actionFieldLabels.taskSupportingEntities}</dt>
                <dd className="mt-1 text-sm">Quality Assurance Office</dd>
              </div>
              <div className="rounded-xl border border-border bg-muted/40 p-4 sm:col-span-2">
                <dt className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">{actionFieldLabels.taskHumanResources}</dt>
                <dd className="mt-1 text-sm">2 analysts, 1 coordinator</dd>
              </div>
              <div className="rounded-xl border border-border bg-muted/40 p-4 sm:col-span-2">
                <dt className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">{actionFieldLabels.taskFinancialResources}</dt>
                <dd className="mt-1 text-sm">BHD 4,500 for workshops and tooling</dd>
              </div>
              <div className="rounded-xl border border-border bg-muted/40 p-4 sm:col-span-2">
                <dt className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">{actionFieldLabels.taskNotes}</dt>
                <dd className="mt-1 text-sm">Monthly governance review cadence defined with stakeholders.</dd>
              </div>
            </dl>
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm">
          <div className="border-b border-border bg-muted/30 px-4 py-3 sm:px-5">
            <h2 className="text-base font-bold text-foreground">Requested Edits</h2>
          </div>
          <div className="space-y-3 px-4 py-4 sm:px-5 sm:py-4">
            {requestedEdits.map((item) => (
              <div key={item.field} className="rounded-xl border border-border bg-background p-3 shadow-sm">
                <p className="text-[8px] font-bold uppercase tracking-wide text-muted-foreground">Field</p>
                <p className="mt-0.5 text-xs font-semibold text-foreground">{actionFieldLabels[item.field] ?? item.field}</p>
                <p className="mt-2 text-[8px] font-bold uppercase tracking-wide text-muted-foreground">Requested change</p>
                <p className="mt-0.5 text-xs leading-snug text-muted-foreground">{item.requestedChange}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm" aria-labelledby="your-mod-action-heading">
          <div className="border-b border-border bg-muted/30 px-6 py-5 sm:px-8">
            <h2 id="your-mod-action-heading" className="text-lg font-bold text-foreground">
              Your Modifications
            </h2>
          </div>
          <div className="space-y-5 px-6 py-6 sm:px-8 sm:py-8">
            {requestedFieldKeys.map((key) => {
              const mod = yourModificationsByField[key]
              return (
                <div key={key} className="rounded-2xl border-2 border-border bg-background p-5 shadow-sm sm:p-6">
                  <p className="text-[9px] font-bold uppercase tracking-wide text-muted-foreground">Field</p>
                  <p className="mt-1 text-sm font-semibold text-foreground">{actionFieldLabels[key] ?? key}</p>
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
          <Link
            to={proposalsStatusHref}
            className={cn(buttonVariants({ variant: "outline" }), "rounded-full px-5")}
          >
            Back to proposals status
          </Link>
        </div>
      </div>
    </div>
  )
}
