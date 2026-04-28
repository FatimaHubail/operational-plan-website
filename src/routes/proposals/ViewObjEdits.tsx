import { useMemo } from "react"
import { Link, useLocation } from "react-router-dom"
import { buttonVariants } from "@/components/ui/button"
import { formatFieldLabel } from "@/lib/formatFieldLabel"
import { cn } from "@/lib/utils"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

/** Field-level requests only (matches RequestObjective requested-edits blocks). */
const requestedEditFields = ["targetValue", "executionIndicatorDescription"] as const

type RequestedEditItem = {
  field: string
  requestedChange: string
}

const requestedEdits: RequestedEditItem[] = [
  {
    field: "targetValue",
    requestedChange:
      "Express the target as a numeric uptime percentage with the measurement window (e.g. calendar month), not only narrative text.",
  },
  {
    field: "executionIndicatorDescription",
    requestedChange:
      "Clarify whether planned maintenance windows are in or out of the uptime calculation and cite the monitoring tool.",
  },
]

const generalNotesSent =
  'Align wording with the IT service catalogue entry for “Digital core services” so the objective can be traced to a single service line.'

/** Updates only for keys in requestedEditFields */
const yourModificationsByField: Record<
  (typeof requestedEditFields)[number],
  { previousValue: string; updatedValue: string }
> = {
  targetValue: {
    previousValue: "1.4 publications / FTE by 2026",
    updatedValue: "99.7% monthly uptime for digital core services (calendar month rolling), excluding planned maintenance windows listed in the service catalogue.",
  },
  executionIndicatorDescription: {
    previousValue:
      "Counts Scopus-indexed articles and book chapters attributed to university affiliation; excludes conference abstracts.",
    updatedValue:
      "Uptime of production API and authentication services as measured by the campus NMS; planned maintenance windows defined in the IT catalogue are excluded from the denominator.",
  },
}

export default function ViewObjEdits() {
  const location = useLocation()
  const routePrefix = location.pathname.startsWith("/contributor/") ? "/contributor" : ""
  const proposalsStatusHref = `${routePrefix}/proposals-status`
  const dashboardHref = routePrefix ? "/contributor/dashboard" : "/dashboard"

  const requestId = "REQ-2026-0130"

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
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Review Edited Operational Objective
            </h1>
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

      <div className="mb-6 rounded-2xl border border-border bg-accent/40 px-4 py-3 text-sm shadow-sm" role="status">
        <p className="font-semibold text-foreground">Edited Resubmission</p>
        <p className="mt-1 text-muted-foreground">
          Check your old submission, auditor's requested changes, and your modifications based on those requests
        </p>
      </div>

      <div className="space-y-6">
        <section className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm" aria-labelledby="old-submission-oo-heading">
          <div className="border-b border-border bg-muted/30 px-6 py-5 sm:px-8">
            <h2 id="old-submission-oo-heading" className="text-lg font-bold text-foreground">
              Old Submission
            </h2>
          </div>
          <div className="px-6 py-6 sm:px-8 sm:py-8">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">Operational objective</h3>
            <dl className="mt-3 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-border bg-muted/40 p-4 sm:col-span-2">
                <dt className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">{formatFieldLabel("regulatoryEntity")}</dt>
                <dd className="mt-1 text-sm text-foreground">Ministry of Higher Education</dd>
              </div>
              <div className="rounded-xl border border-border bg-muted/40 p-4 sm:col-span-2">
                <dt className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">{formatFieldLabel("objective")}</dt>
                <dd className="mt-1 text-sm font-medium text-foreground">Improve research output visibility</dd>
              </div>
              <div className="rounded-xl border border-border bg-muted/40 p-4 sm:col-span-2">
                <dt className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">{formatFieldLabel("objectiveExecutionIndicator")}</dt>
                <dd className="mt-1 text-sm leading-relaxed text-foreground">
                  Core digital services availability vs. institutional target.
                </dd>
              </div>
              <div className="rounded-xl border border-border bg-muted/40 p-4 sm:col-span-2">
                <dt className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">{formatFieldLabel("executionIndicatorDescription")}</dt>
                <dd className="mt-1 text-sm leading-relaxed text-foreground">
                  {yourModificationsByField.executionIndicatorDescription.updatedValue}
                </dd>
              </div>
              <div className="rounded-xl border border-border bg-muted/40 p-4 sm:col-span-2">
                <dt className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">{formatFieldLabel("indicatorOwnerWithinEntity")}</dt>
                <dd className="mt-1 text-sm text-foreground">Director, Research &amp; Graduate Studies</dd>
              </div>
              <div className="rounded-xl border border-border bg-muted/40 p-4 sm:col-span-2 sm:max-w-none">
                <dt className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">{formatFieldLabel("targetValue")}</dt>
                <dd className="mt-1 text-sm font-semibold text-foreground">
                  {yourModificationsByField.targetValue.updatedValue}
                </dd>
              </div>
            </dl>

            <h3 className="mt-8 text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">Achievement rate (by year)</h3>
            <dl className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {(["2023", "2024", "2025", "2026"] as const).map((year, i) => (
                <div key={year} className="rounded-xl border border-border bg-background p-4 ring-1 ring-border/60">
                  <dt className="text-[11px] font-bold uppercase text-muted-foreground">{formatFieldLabel(`achievement_${year}`)}</dt>
                  <dd className="mt-1 text-sm font-bold tabular-nums text-foreground">{i < 2 ? (i === 0 ? "1.05" : "1.12") : "—"}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm" aria-labelledby="requested-edits-view-heading">
          <div className="border-b border-border bg-muted/30 px-4 py-3 sm:px-5">
            <h2 id="requested-edits-view-heading" className="text-base font-bold text-foreground">
              Requested Edits
            </h2>
          </div>
          <div className="space-y-3 px-4 py-4 sm:px-5 sm:py-4">
            {requestedEdits.map((item) => (
              <div key={item.field} className="rounded-xl border border-border bg-background p-3 shadow-sm">
                <p className="text-[8px] font-bold uppercase tracking-wide text-muted-foreground">Field</p>
                <p className="mt-0.5 text-xs font-semibold text-foreground">{formatFieldLabel(item.field)}</p>
                <p className="mt-2 text-[8px] font-bold uppercase tracking-wide text-muted-foreground">Requested change</p>
                <p className="mt-0.5 text-xs leading-snug text-muted-foreground">{item.requestedChange}</p>
              </div>
            ))}
            <div className="rounded-lg border border-border bg-muted/40 px-3 py-2">
              <p className="text-[8px] font-bold uppercase tracking-wide text-muted-foreground">General notes (sent with request)</p>
              <p className="mt-0.5 text-xs leading-snug text-muted-foreground">{generalNotesSent}</p>
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm" aria-labelledby="your-mod-obj-heading">
          <div className="border-b border-border bg-muted/30 px-6 py-5 sm:px-8">
            <h2 id="your-mod-obj-heading" className="text-lg font-bold text-foreground">
              Your Modifications
            </h2>
          </div>
          <div className="space-y-5 px-6 py-6 sm:px-8 sm:py-8">
            {requestedEditFields.map((key) => {
              const mod = yourModificationsByField[key]
              return (
                <div key={key} className="rounded-2xl border-2 border-border bg-background p-5 shadow-sm sm:p-6">
                  <p className="text-[9px] font-bold uppercase tracking-wide text-muted-foreground">Field</p>
                  <p className="mt-1 text-sm font-semibold text-foreground">{formatFieldLabel(key)}</p>
                  <p className="mt-4 text-[9px] font-bold uppercase tracking-wide text-muted-foreground">Previous value</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{mod.previousValue}</p>
                  <p className="mt-4 text-[9px] font-bold uppercase tracking-wide text-muted-foreground">Updated value</p>
                  <p className="mt-1 text-sm font-medium leading-relaxed text-foreground">{mod.updatedValue}</p>
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
