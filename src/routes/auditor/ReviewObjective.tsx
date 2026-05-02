import { useMemo, useState } from "react"
import { Link, useLocation, useSearchParams } from "react-router-dom"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { formatFieldLabel } from "@/lib/formatFieldLabel"
import { cn } from "@/lib/utils"

const fieldOptions = [
  "regulatoryEntity",
  "objective",
  "objectiveExecutionIndicator",
  "executionIndicatorDescription",
  "indicatorOwnerWithinEntity",
  "targetValue",
  "achievement_2023",
  "achievement_2024",
  "achievement_2025",
  "achievement_2026",
]

type FieldModRow = { id: string; field: string; note: string }

export default function ReviewObjective() {
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const status = searchParams.get("status")
  const isEdited = searchParams.get("edited") === "1"
  const isChangesRequested = status === "changes_requested"
  const isAccepted = status === "accepted"
  const isProposalContext =
    searchParams.get("context") === "proposal" || location.pathname.includes("/proposal/review/")
  const routePrefix = location.pathname.startsWith("/contributor/") ? "/contributor" : ""
  const proposalsStatusHref = `${routePrefix}/proposals-status`
  const dashboardHref = routePrefix ? "/contributor/dashboard" : "/dashboard"

  const showRequestedEdits = isChangesRequested && !isProposalContext

  const requestId = isEdited ? "REQ-2026-0130" : isChangesRequested ? "REQ-2026-0135" : isAccepted ? "REQ-2026-0124" : "REQ-2026-0141"

  const pageTitle = useMemo(() => {
    if (isEdited) return "Review Edited Objective Submission"
    if (isChangesRequested) return "Review Requested Edits"
    return "Review Operational Objective Submission"
  }, [isEdited, isChangesRequested])

  const badgeText = isEdited
    ? "Edited — awaiting re-review"
    : isChangesRequested
      ? "Changes requested"
      : isAccepted
        ? "Accepted"
        : "Pending auditor review"
  const breadcrumbStatus = isEdited ? "Edited" : isChangesRequested ? "Changes requested" : isAccepted ? "Accepted" : "Pending"

  const badgeClass = cn(
    "inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-semibold",
    isEdited && "bg-accent text-accent-foreground",
    isChangesRequested && "bg-muted text-foreground",
    isAccepted && "bg-secondary text-secondary-foreground",
    !isEdited && !isChangesRequested && !isAccepted && "bg-muted text-foreground"
  )

  const [fieldRows, setFieldRows] = useState<FieldModRow[]>([{ id: "0", field: "", note: "" }])

  const addFieldRow = () => {
    setFieldRows((prev) => [...prev, { id: String(Date.now()), field: "", note: "" }])
  }

  const removeFieldRow = (id: string) => {
    setFieldRows((prev) => (prev.length <= 1 ? prev : prev.filter((r) => r.id !== id)))
  }

  const updateFieldRow = (id: string, patch: Partial<Pick<FieldModRow, "field" | "note">>) => {
    setFieldRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)))
  }

  const showNotesSection = !isProposalContext && !isAccepted && !isChangesRequested

  const submissionSubmittedOn = useMemo(() => {
    const d = new Date()
    return {
      iso: d.toISOString().slice(0, 10),
      label: new Intl.DateTimeFormat(undefined, { dateStyle: "long" }).format(d),
    }
  }, [])
  const editedTimeline = useMemo(() => {
    const lastEdited = new Date()
    const editRequested = new Date()
    editRequested.setDate(editRequested.getDate() - 1)
    return {
      lastEdited: {
        iso: lastEdited.toISOString().slice(0, 10),
        label: new Intl.DateTimeFormat(undefined, { dateStyle: "long" }).format(lastEdited),
      },
      editRequested: {
        iso: editRequested.toISOString().slice(0, 10),
        label: new Intl.DateTimeFormat(undefined, { dateStyle: "long" }).format(editRequested),
      },
    }
  }, [])

  const decisionHelpText = isEdited
    ? "This is a revised version. Accept if it resolves your prior comments; otherwise add your additional modifications"
    : "Select a field, then specify your modifications"

  return (
    <div className="min-w-0 flex-1 overflow-x-hidden bg-background p-4 sm:p-6 lg:p-8">
      <header className="mb-6 sm:mb-8">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link to={isProposalContext ? dashboardHref : "/dashboard-auditor"} />}>
                Dashboard
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            {isProposalContext ? (
              <>
                <BreadcrumbItem>
                  <BreadcrumbLink render={<Link to={proposalsStatusHref} />}>Proposals Status</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
              </>
            ) : (
              <>
                <BreadcrumbItem>
                  <BreadcrumbLink render={<Link to="/objective-queue" />}>Objective queue</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
              </>
            )}
            <BreadcrumbItem>
              <BreadcrumbPage>{`${breadcrumbStatus} objective`}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-mono text-xs font-semibold text-muted-foreground">{requestId}</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">{pageTitle}</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {isChangesRequested ? (
                <>
                  Submitted by <span className="font-medium text-foreground">Noor Hassan</span> -{" "}
                  <span className="font-medium text-foreground">Finance Unit</span> · Edit requested on{" "}
                  <time dateTime={editedTimeline.editRequested.iso} className="font-medium text-foreground">
                    {editedTimeline.editRequested.label}
                  </time>
                </>
              ) : isEdited ? (
                <>
                  Submitted by <span className="font-medium text-foreground">Noor Hassan</span> -{" "}
                  <span className="font-medium text-foreground">Facilities Planning</span> · Edit requested on{" "}
                  <time dateTime={editedTimeline.editRequested.iso} className="font-medium text-foreground">
                    {editedTimeline.editRequested.label}
                  </time>{" "}
                  · Last edited{" "}
                  <time dateTime={editedTimeline.lastEdited.iso} className="font-medium text-foreground">
                    {editedTimeline.lastEdited.label}
                  </time>
                </>
              ) : isProposalContext ? (
                <>
                  Submitted on {" "}
                  <time dateTime={submissionSubmittedOn.iso} className="font-medium text-foreground">
                    {submissionSubmittedOn.label}
                  </time>
                </>
              ) : (
                <>
                  Submitted by <span className="font-medium text-foreground">Noor Hassan</span> -{" "}
                  <span className="font-medium text-foreground">Planning Office</span> · submitted on:{" "}
                  <time dateTime={submissionSubmittedOn.iso} className="font-medium text-foreground">
                    {submissionSubmittedOn.label}
                  </time>
                </>
              )}
            </p>
          </div>
          <span className={badgeClass}>{badgeText}</span>
        </div>
      </header>

      {isEdited && (
        <div className="mb-6 rounded-2xl border border-border bg-accent/40 px-4 py-3 text-sm shadow-sm" role="status">
          <p className="font-semibold text-foreground">Edited Resubmission</p>
          <p className="mt-1 text-muted-foreground">
            The submitter revised this objective after your change request. Review the updated fields below, then accept
            or request further edits.
          </p>
        </div>
      )}

      <div className="space-y-6">
        {isEdited && !isProposalContext && (
          <section className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm" aria-labelledby="requested-edits-edited-oo-heading">
            <div className="border-b border-border bg-muted/30 px-6 py-5 sm:px-8">
              <h2 id="requested-edits-edited-oo-heading" className="text-lg font-bold text-foreground">
                Requested Edits
              </h2>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Previously requested changes shown for reference before reviewing this edited resubmission.
              </p>
            </div>
            <div className="space-y-5 px-6 py-6 sm:px-8 sm:py-8">
              <div className="rounded-2xl border-2 border-border bg-background p-5 shadow-sm sm:p-6">
                <p className="text-[9px] font-bold uppercase tracking-wide text-muted-foreground">Field</p>
                <p className="mt-1 text-sm font-semibold text-foreground">{formatFieldLabel("targetValue")}</p>
                <p className="mt-4 text-[9px] font-bold uppercase tracking-wide text-muted-foreground">Previous value</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">Service uptime objective text only (no numeric percentage)</p>
                <p className="mt-4 text-[9px] font-bold uppercase tracking-wide text-muted-foreground">Requested change</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  Express the target as a <span className="font-medium text-foreground">numeric uptime percentage</span> with
                  the measurement window (e.g. calendar month), not only narrative text.
                </p>
              </div>
            </div>
          </section>
        )}

        <section className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm" aria-labelledby="submitted-oo-heading">
          <div className="border-b border-border bg-muted/30 px-6 py-5 sm:px-8">
            <h2 id="submitted-oo-heading" className="text-lg font-bold text-foreground">
              Submitted Content
            </h2>
          </div>
          <div className="px-6 py-6 sm:px-8 sm:py-8">
            <dl className="mt-3 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-border bg-muted/40 p-4 sm:col-span-2">
                <dt className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                  {formatFieldLabel("regulatoryEntity")}
                </dt>
                <dd className="mt-1 text-sm text-foreground">Ministry of Higher Education</dd>
              </div>
              <div className="rounded-xl border border-border bg-muted/40 p-4 sm:col-span-2">
                <dt className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                  {formatFieldLabel("objective")}
                </dt>
                <dd className="mt-1 text-sm font-medium text-foreground">Improve research output visibility</dd>
              </div>
              <div className="rounded-xl border border-border bg-muted/40 p-4 sm:col-span-2">
                <dt className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                  {formatFieldLabel("objectiveExecutionIndicator")}
                </dt>
                <dd className="mt-1 text-sm leading-relaxed text-foreground">
                  Number of peer-reviewed publications per FTE faculty reported in the national research index.
                </dd>
              </div>
              <div className="rounded-xl border border-border bg-muted/40 p-4 sm:col-span-2">
                <dt className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                  {formatFieldLabel("executionIndicatorDescription")}
                </dt>
                <dd className="mt-1 text-sm leading-relaxed text-foreground">
                  Counts Scopus-indexed articles and book chapters attributed to university affiliation; excludes conference
                  abstracts.
                </dd>
              </div>
              <div className="rounded-xl border border-border bg-muted/40 p-4 sm:col-span-2">
                <dt className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                  {formatFieldLabel("indicatorOwnerWithinEntity")}
                </dt>
                <dd className="mt-1 text-sm text-foreground">Director, Research &amp; Graduate Studies</dd>
              </div>
              <div className="rounded-xl border border-border bg-muted/40 p-4 sm:col-span-2 sm:max-w-md">
                <dt className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                  {formatFieldLabel("targetValue")}
                </dt>
                <dd className="mt-1 text-sm font-semibold text-foreground">1.4 publications / FTE by 2026</dd>
              </div>
            </dl>

            <h3 className="mt-8 text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">Achievement rate (by year)</h3>
            <dl className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {(["2023", "2024", "2025", "2026"] as const).map((year, i) => (
                <div key={year} className="rounded-xl border border-border bg-background p-4 ring-1 ring-border/60">
                  <dt className="text-[11px] font-bold uppercase text-muted-foreground">
                    {formatFieldLabel(`achievement_${year}`)}
                  </dt>
                  <dd className="mt-1 text-sm font-bold tabular-nums text-foreground">{i < 2 ? (i === 0 ? "1.05" : "1.12") : "—"}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {showRequestedEdits && (
          <section className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm" aria-labelledby="requested-edits-oo-heading">
            <div className="border-b border-border bg-muted/30 px-6 py-5 sm:px-8">
              <h2 id="requested-edits-oo-heading" className="text-lg font-bold text-foreground">
                Requested Edits
              </h2>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Overview of feedback already sent to the submitter. After they resubmit,open the proposal to continue inspection
              </p>
            </div>
            <div className="space-y-5 px-6 py-6 sm:px-8 sm:py-8">
              <div className="rounded-2xl border-2 border-border bg-background p-5 shadow-sm sm:p-6">
                <p className="text-[9px] font-bold uppercase tracking-wide text-muted-foreground">Field</p>
                <p className="mt-1 text-sm font-semibold text-foreground">{formatFieldLabel("targetValue")}</p>
                <p className="mt-4 text-[9px] font-bold uppercase tracking-wide text-muted-foreground">Previous value</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">Service uptime objective text only (no numeric percentage)</p>
                <p className="mt-4 text-[9px] font-bold uppercase tracking-wide text-muted-foreground">Requested change</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  Express the target as a <span className="font-medium text-foreground">numeric uptime percentage</span> with
                  the measurement window (e.g. calendar month), not only narrative text.
                </p>
              </div>
              <div className="rounded-2xl border-2 border-border bg-background p-5 shadow-sm sm:p-6">
                <p className="text-[9px] font-bold uppercase tracking-wide text-muted-foreground">Field</p>
                <p className="mt-1 font-mono text-sm font-semibold text-foreground">executionIndicatorDescription</p>
                <p className="mt-4 text-[9px] font-bold uppercase tracking-wide text-muted-foreground">Previous value</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  Description did not clarify whether planned maintenance windows are included in uptime.
                </p>
                <p className="mt-4 text-[9px] font-bold uppercase tracking-wide text-muted-foreground">Requested change</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  Clarify whether planned maintenance windows are <span className="font-medium text-foreground">in or out</span>{" "}
                  of the uptime calculation and cite the monitoring tool.
                </p>
              </div>
              <div className="rounded-xl border border-border bg-muted/40 px-4 py-3">
                <p className="text-[9px] font-bold uppercase tracking-wide text-muted-foreground">Additional notes</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  Align wording with the IT service catalogue entry for “Digital core services” so the objective can be traced to
                  a single service line.
                </p>
              </div>
            </div>
            <div className="border-t border-border bg-muted/30 px-6 py-5 sm:px-8">
              <Link
                to="/objective-queue"
                className="inline-flex items-center justify-center rounded-full border border-border bg-background px-5 py-2.5 text-sm font-semibold text-foreground shadow-sm transition hover:bg-accent"
              >
                Back to objective queue
              </Link>
            </div>
          </section>
        )}

        {showNotesSection && (
          <section className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm" aria-labelledby="auditor-notes-oo-heading">
            <div className="border-b border-border bg-muted/30 px-6 py-5 sm:px-8">
              <h2 id="auditor-notes-oo-heading" className="text-lg font-bold text-foreground">
                Your Notes
              </h2>
              <p className="mt-0.5 text-sm text-muted-foreground">{decisionHelpText}</p>
            </div>
            <form className="space-y-6 px-6 py-6 sm:px-8 sm:py-8" action="#" method="post" onSubmit={(e) => e.preventDefault()}>
              <Input type="hidden" name="submissionId" value={requestId} />
              <Input type="hidden" name="submissionType" value="operational_objective" />
              <Input type="hidden" name="auditorReviewStatus" value={isEdited ? "edited" : "pending"} />

              <div>
                <div className="mb-3 flex items-center justify-between gap-3">
                  <span />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-primary text-xl leading-none"
                    title="Add field modification"
                    aria-label="Add another field modification"
                    onClick={addFieldRow}
                  >
                    +
                  </Button>
                </div>
                <div className="flex flex-col gap-6">
                  {fieldRows.map((row, index) => (
                    <div
                      key={row.id}
                      className="rounded-2xl border-2 border-border bg-background p-5 shadow-sm ring-1 ring-border/60 sm:p-6"
                    >
                      <div className="mb-4 flex items-center justify-between gap-3 border-b border-border pb-3">
                        <span className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                          Field modification {index + 1}
                        </span>
                        <div className="flex shrink-0 items-center gap-0.5">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            className={cn("text-xl leading-none", index === 0 && "invisible")}
                            aria-label="Remove this field modification"
                            onClick={() => removeFieldRow(row.id)}
                          >
                            -
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="mb-1.5 block text-[9px] font-bold uppercase tracking-wide text-muted-foreground">
                            Field
                          </label>
                          <input type="hidden" name="auditorModificationField[]" value={row.field} />
                          <Select
                            value={row.field || undefined}
                            onValueChange={(v) => updateFieldRow(row.id, { field: v })}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select field…" />
                            </SelectTrigger>
                            <SelectContent>
                              {fieldOptions.map((f) => (
                                <SelectItem key={f} value={f}>
                                  {formatFieldLabel(f)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label
                            className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted-foreground"
                            htmlFor={`objective-mod-note-${row.id}`}
                          >
                            Requested change
                          </label>
                          <Textarea
                            id={`objective-mod-note-${row.id}`}
                            name="auditorModificationNote[]"
                            rows={3}
                            placeholder="Describe the modification for this field only."
                            value={row.note}
                            onChange={(e) => updateFieldRow(row.id, { note: e.target.value })}
                            className="bg-muted/40"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label
                  htmlFor="auditor-general-note-objective"
                  className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted-foreground"
                >
                  Additional notes
                </label>
                <Textarea
                  id="auditor-general-note-objective"
                  name="auditorGeneralNote"
                  rows={4}
                />
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:justify-between">
                <Link
                  to="/objective-queue"
                  className="inline-flex items-center justify-center rounded-full border border-border bg-background px-5 py-2.5 text-sm font-semibold text-foreground shadow-sm transition hover:bg-accent"
                >
                  Back to objective queue
                </Link>
                <div className="flex flex-col gap-3 sm:flex-row sm:gap-3">
                  <Button type="submit" name="decision" value="request_changes" variant="outline">
                    Request changes
                  </Button>
                  <Button type="submit" name="decision" value="accept">
                    Accept submission
                  </Button>
                </div>
              </div>
            </form>
          </section>
        )}

        {isProposalContext && (
          <div className="flex justify-start">
            <Link
              to={proposalsStatusHref}
              className="inline-flex items-center justify-center rounded-full border border-border bg-background px-5 py-2.5 text-sm font-semibold text-foreground shadow-sm transition hover:bg-accent"
            >
              Back to proposals status
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
