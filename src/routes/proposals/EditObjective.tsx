import { type FormEvent, useMemo, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { formatFieldLabel } from "@/lib/formatFieldLabel"
import { cn } from "@/lib/utils"

const years = ["2023", "2024", "2025", "2026"] as const
type Year = (typeof years)[number]

type AchievementMap = Record<Year, string>

/** Original submission snapshot (prefilled into the editor). */
const ORIGINAL_OBJECTIVE_SUBMISSION = {
  regulatoryEntity: "Ministry of Higher Education",
  objective: "Improve research output visibility",
  objectiveExecutionIndicator:
    "Number of peer-reviewed publications per FTE faculty reported in the national research index.",
  executionIndicatorDescription:
    "Counts Scopus-indexed articles and book chapters attributed to university affiliation; excludes conference abstracts.",
  indicatorOwnerWithinEntity: "Director, Research & Graduate Studies",
  targetValue: "1.4 publications / FTE by 2026",
  achievement: {
    "2023": "1.05",
    "2024": "1.12",
    "2025": "",
    "2026": "",
  } satisfies AchievementMap,
}

export default function EditObjective() {
  const location = useLocation()
  const routePrefix = location.pathname.startsWith("/contributor/") ? "/contributor" : ""
  const proposalsStatusHref = `${routePrefix}/proposals-status`
  const dashboardHref = routePrefix ? "/contributor/dashboard" : "/dashboard"
  const isProposalEditObjectiveRoute = location.pathname.includes("/proposal/edit/objective")

  const lastEditedOn = useMemo(() => {
    const d = new Date()
    return {
      iso: d.toISOString().slice(0, 10),
      label: new Intl.DateTimeFormat(undefined, { dateStyle: "long" }).format(d),
    }
  }, [])

  const editRequestedInOn = useMemo(() => {
    const iso = "2026-03-10"
    const [y, m, day] = iso.split("-").map(Number)
    const d = new Date(y, m - 1, day)
    return {
      iso,
      label: new Intl.DateTimeFormat(undefined, { dateStyle: "long" }).format(d),
    }
  }, [])

  const requestId = "REQ-2026-0105"

  const [regulatoryEntity, setRegulatoryEntity] = useState(ORIGINAL_OBJECTIVE_SUBMISSION.regulatoryEntity)
  const [objective, setObjective] = useState(ORIGINAL_OBJECTIVE_SUBMISSION.objective)
  const [objectiveExecutionIndicator, setObjectiveExecutionIndicator] = useState(
    ORIGINAL_OBJECTIVE_SUBMISSION.objectiveExecutionIndicator
  )
  const [executionIndicatorDescription, setExecutionIndicatorDescription] = useState(
    ORIGINAL_OBJECTIVE_SUBMISSION.executionIndicatorDescription
  )
  const [indicatorOwnerWithinEntity, setIndicatorOwnerWithinEntity] = useState(
    ORIGINAL_OBJECTIVE_SUBMISSION.indicatorOwnerWithinEntity
  )
  const [targetValue, setTargetValue] = useState(ORIGINAL_OBJECTIVE_SUBMISSION.targetValue)
  const [achievement, setAchievement] = useState<AchievementMap>(() => ({
    ...ORIGINAL_OBJECTIVE_SUBMISSION.achievement,
  }))

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
  }

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
              <BreadcrumbPage>Requested Changes</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-mono text-xs font-semibold text-muted-foreground">{requestId}</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Respond to Requested Changes
            </h1>
            {isProposalEditObjectiveRoute ? (
              <p className="mt-2 text-sm text-muted-foreground">
                Last edited:{" "}
                <time dateTime={lastEditedOn.iso} className="font-medium text-foreground">
                  {lastEditedOn.label}
                </time>{" "}
                · Edit requested on:{" "}
                <time dateTime={editRequestedInOn.iso} className="font-medium text-foreground">
                  {editRequestedInOn.label}
                </time>
              </p>
            ) : (
              <p className="mt-2 text-sm text-muted-foreground">
                Original submission · <span className="font-medium text-foreground">Finance unit</span> · Source:{" "}
                <Link to="/catalysts/add-objective" className="font-medium text-primary hover:underline">
                  Add operational objectives
                </Link>{" "}
                · Digital services uptime objective
              </p>
            )}
          </div>
          <span className="inline-flex w-fit items-center rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">
            Changes requested
          </span>
        </div>
      </header>

      <div className="space-y-6">
        <section className="overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm" aria-labelledby="requested-edits-edit-oo-heading">
          <div className="border-b border-border bg-muted/30 px-4 py-3 sm:px-5">
            <h2 id="requested-edits-edit-oo-heading" className="text-base font-bold text-foreground">
              Requested Edits
            </h2>
            {!isProposalEditObjectiveRoute && (
              <p className="mt-0.5 text-xs text-muted-foreground">
                Read-only summary of field-level and general feedback from the auditor.
              </p>
            )}
          </div>
          <div className="space-y-3 px-4 py-4 sm:px-5 sm:py-4">
            {!isProposalEditObjectiveRoute && (
              <p className="text-[11px] text-muted-foreground">
                Logged <span className="font-medium text-foreground">10 Mar 2026 · 11:05</span> · Decision:{" "}
                <span className="font-medium text-foreground">Request changes</span>
              </p>
            )}
            <div className="rounded-xl border border-border bg-background p-3 shadow-sm">
              <p className="text-[8px] font-bold uppercase tracking-wide text-muted-foreground">Field</p>
              <p className="mt-0.5 text-xs font-semibold text-foreground">{formatFieldLabel("targetValue")}</p>
              <p className="mt-2 text-[8px] font-bold uppercase tracking-wide text-muted-foreground">Requested change</p>
              <p className="mt-0.5 text-xs leading-snug text-muted-foreground">
                Express the target as a <span className="font-medium text-foreground">numeric uptime percentage</span> with
                the measurement window (e.g. calendar month), not only narrative text.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-background p-3 shadow-sm">
              <p className="text-[8px] font-bold uppercase tracking-wide text-muted-foreground">Field</p>
              <p className="mt-0.5 text-xs font-semibold text-foreground">{formatFieldLabel("executionIndicatorDescription")}</p>
              <p className="mt-2 text-[8px] font-bold uppercase tracking-wide text-muted-foreground">Requested change</p>
              <p className="mt-0.5 text-xs leading-snug text-muted-foreground">
                Clarify whether planned maintenance windows are <span className="font-medium text-foreground">in or out</span>{" "}
                of the uptime calculation and cite the monitoring tool.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-muted/40 px-3 py-2">
              <p className="text-[8px] font-bold uppercase tracking-wide text-muted-foreground">General notes (sent with request)</p>
              <p className="mt-0.5 text-xs leading-snug text-muted-foreground">
                Align wording with the IT service catalogue entry for “Digital core services” so the objective can be traced to
                a single service line.
              </p>
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm" aria-labelledby="edit-proposal-oo-heading">
          <div className="border-b border-border bg-muted/30 px-6 py-5 sm:px-8">
            <h2 id="edit-proposal-oo-heading" className="text-lg font-bold text-foreground">
              Edit your Proposal
            </h2>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Fields are <span className="font-medium text-foreground">prefilled from your original submission</span>. Update
              what the auditor asked for inline, then submit your revised proposal.
            </p>
          </div>
          <form className="space-y-8 px-6 py-6 sm:px-8 sm:py-8" onSubmit={onSubmit}>
            <Input type="hidden" name="submissionId" value={requestId} />
            <Input type="hidden" name="submissionType" value="operational_objective" />

            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">Operational objective</h3>
              <div className="mt-3 grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-border bg-muted/40 p-4 sm:col-span-2">
                  <label className="block text-[10px] font-bold uppercase tracking-wide text-muted-foreground" htmlFor="edit-regulatoryEntity">
                    {formatFieldLabel("regulatoryEntity")}
                  </label>
                  <Input
                    id="edit-regulatoryEntity"
                    name="regulatoryEntity"
                    value={regulatoryEntity}
                    onChange={(e) => setRegulatoryEntity(e.target.value)}
                    className="mt-2 border-border bg-background"
                  />
                </div>
                <div className="rounded-xl border border-border bg-muted/40 p-4 sm:col-span-2">
                  <label className="block text-[10px] font-bold uppercase tracking-wide text-muted-foreground" htmlFor="edit-objective">
                    {formatFieldLabel("objective")}
                  </label>
                  <Input
                    id="edit-objective"
                    name="objective"
                    value={objective}
                    onChange={(e) => setObjective(e.target.value)}
                    className="mt-2 border-border bg-background"
                  />
                </div>
                <div className="rounded-xl border border-border bg-muted/40 p-4 sm:col-span-2">
                  <label className="block text-[10px] font-bold uppercase tracking-wide text-muted-foreground" htmlFor="edit-objectiveExecutionIndicator">
                    {formatFieldLabel("objectiveExecutionIndicator")}
                  </label>
                  <Textarea
                    id="edit-objectiveExecutionIndicator"
                    name="objectiveExecutionIndicator"
                    value={objectiveExecutionIndicator}
                    onChange={(e) => setObjectiveExecutionIndicator(e.target.value)}
                    rows={3}
                    className="mt-2 border-border bg-background"
                  />
                </div>
                <div className="rounded-xl border border-border bg-muted/40 p-4 sm:col-span-2">
                  <label className="block text-[10px] font-bold uppercase tracking-wide text-muted-foreground" htmlFor="edit-executionIndicatorDescription">
                    {formatFieldLabel("executionIndicatorDescription")}
                  </label>
                  <Textarea
                    id="edit-executionIndicatorDescription"
                    name="executionIndicatorDescription"
                    value={executionIndicatorDescription}
                    onChange={(e) => setExecutionIndicatorDescription(e.target.value)}
                    rows={4}
                    className="mt-2 border-border bg-background"
                  />
                </div>
                <div className="rounded-xl border border-border bg-muted/40 p-4 sm:col-span-2">
                  <label className="block text-[10px] font-bold uppercase tracking-wide text-muted-foreground" htmlFor="edit-indicatorOwnerWithinEntity">
                    {formatFieldLabel("indicatorOwnerWithinEntity")}
                  </label>
                  <Input
                    id="edit-indicatorOwnerWithinEntity"
                    name="indicatorOwnerWithinEntity"
                    value={indicatorOwnerWithinEntity}
                    onChange={(e) => setIndicatorOwnerWithinEntity(e.target.value)}
                    className="mt-2 border-border bg-background"
                  />
                </div>
                <div className="rounded-xl border border-border bg-muted/40 p-4 sm:col-span-2 sm:max-w-none">
                  <label className="block text-[10px] font-bold uppercase tracking-wide text-muted-foreground" htmlFor="edit-targetValue">
                    {formatFieldLabel("targetValue")}
                  </label>
                  <Input
                    id="edit-targetValue"
                    name="targetValue"
                    value={targetValue}
                    onChange={(e) => setTargetValue(e.target.value)}
                    className="mt-2 border-border bg-background"
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">Achievement (by year)</h3>
              <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {years.map((year) => {
                  const fieldKey = `achievement_${year}`
                  return (
                    <div key={year} className="rounded-xl border border-border bg-muted/40 p-4">
                      <label
                        className="block text-[10px] font-bold uppercase tracking-wide text-muted-foreground"
                        htmlFor={`edit-${fieldKey}`}
                      >
                        {formatFieldLabel(fieldKey)}
                      </label>
                      <Input
                        id={`edit-${fieldKey}`}
                        name={fieldKey}
                        type="text"
                        value={achievement[year]}
                        onChange={(e) =>
                          setAchievement((prev) => ({
                            ...prev,
                            [year]: e.target.value,
                          }))
                        }
                        className="mt-2 border-border bg-background"
                        autoComplete="off"
                      />
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:justify-between">
              <Link
                to={proposalsStatusHref}
                className={cn(buttonVariants({ variant: "outline" }), "rounded-full px-5")}
              >
                Back to proposals status
              </Link>
              <Button type="submit" className="rounded-full">
                Submit revised proposal
              </Button>
            </div>
          </form>
        </section>
      </div>
    </div>
  )
}
