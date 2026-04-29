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
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

const fieldOptions = [
  "taskName",
  "taskWeight",
  "taskStartDate",
  "taskExpectedEndDate",
  "taskPerformanceIndicators",
  "taskTargetValue",
  "taskActualValueAchieved",
  "taskAchievementPercentage",
]

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

type FieldModRow = { id: string; field: string; note: string }

export default function ReviewTask() {
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

  const requestId = isEdited ? "REQ-2026-0157" : isChangesRequested ? "REQ-2026-0154" : "REQ-2026-0150"
  const badgeText = isEdited
    ? "Edited - awaiting re-review"
    : isChangesRequested
      ? "Changes requested"
      : isAccepted
        ? "Accepted"
        : "Pending auditor review"
  const breadcrumbStatus = isEdited ? "Edited" : isChangesRequested ? "Changes requested" : isAccepted ? "Accepted" : "Pending"
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
                  <BreadcrumbLink render={<Link to="/task-queue" />}>Task queue</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
              </>
            )}
            <BreadcrumbItem>
              <BreadcrumbPage>{`${breadcrumbStatus} task`}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-mono text-xs font-semibold text-muted-foreground">{requestId}</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
              {isEdited ? "Review Edited Task Submission" : isChangesRequested ? "Review Requested Edits" : "Review Task Submission"}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {isChangesRequested ? (
                <>
                  Submitted by <span className="font-medium text-foreground">Ahmed Khalil</span> -{" "}
                  <span className="font-medium text-foreground">College of Science</span> · Edit requested on{" "}
                  <time dateTime={editedTimeline.editRequested.iso} className="font-medium text-foreground">
                    {editedTimeline.editRequested.label}
                  </time>
                </>
              ) : isEdited ? (
                <>
                  Submitted by <span className="font-medium text-foreground">Ahmed Khalil</span> -{" "}
                  <span className="font-medium text-foreground">IT and Operations</span> · Edit requested on{" "}
                  <time dateTime={editedTimeline.editRequested.iso} className="font-medium text-foreground">
                    {editedTimeline.editRequested.label}
                  </time>{" "}
                  · Last edited{" "}
                  <time dateTime={editedTimeline.lastEdited.iso} className="font-medium text-foreground">
                    {editedTimeline.lastEdited.label}
                  </time>
                </>
              ) : isProposalContext ? (
                <>Submitted on {" "} <time dateTime={submissionSubmittedOn.iso} className="font-medium text-foreground">{submissionSubmittedOn.label}</time></>
              ) : (
                <>
                  Submitted by <span className="font-medium text-foreground">Ahmed Khalil</span> -{" "}
                  <span className="font-medium text-foreground">College of Science</span> · submitted on:{" "}
                  <time dateTime={submissionSubmittedOn.iso} className="font-medium text-foreground">
                    {submissionSubmittedOn.label}
                  </time>
                </>
              )}
            </p>
          </div>
          <span className="inline-flex w-fit items-center rounded-full bg-muted px-3 py-1 text-xs font-semibold text-foreground">{badgeText}</span>
        </div>
      </header>

      <div className="space-y-6">
        {isEdited && !isProposalContext && (
          <section className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
            <div className="border-b border-border bg-muted/30 px-6 py-5 sm:px-8">
              <h2 className="text-lg font-bold">Requested Edits</h2>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Previously requested changes shown for reference before reviewing this edited resubmission.
              </p>
            </div>
            <div className="space-y-5 px-6 py-6 sm:px-8 sm:py-8">
              <div className="rounded-2xl border border-border bg-background p-5 shadow-sm sm:p-6">
                <p className="text-[9px] font-bold uppercase tracking-wide text-muted-foreground">Field</p>
                <p className="mt-1 text-sm font-semibold text-foreground">{taskFieldLabels.taskExpectedEndDate}</p>
                <p className="mt-4 text-[9px] font-bold uppercase tracking-wide text-muted-foreground">Previous value</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">15 May 2026</p>
                <p className="mt-4 text-[9px] font-bold uppercase tracking-wide text-muted-foreground">Requested change</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  Move the expected end date to 30 June 2026 so Q2 milestones align with reporting window.
                </p>
              </div>
            </div>
          </section>
        )}

        <section className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
          <div className="border-b border-border bg-muted/30 px-6 py-5 sm:px-8">
            <h2 className="text-lg font-bold">Submitted Content</h2>
          </div>
          <div className="px-6 py-6 sm:px-8 sm:py-8">
            <dl className="mt-3 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-border bg-muted/40 p-4 sm:col-span-2"><dt className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">{taskFieldLabels.taskName}</dt><dd className="mt-1 text-sm">Complete college-level KPI worksheet</dd></div>
              <div className="rounded-xl border border-border bg-muted/40 p-4"><dt className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">{taskFieldLabels.taskWeight}</dt><dd className="mt-1 text-sm">50%</dd></div>
              <div className="rounded-xl border border-border bg-muted/40 p-4"><dt className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">{taskFieldLabels.taskStartDate}</dt><dd className="mt-1 text-sm">01 Apr 2026</dd></div>
              <div className="rounded-xl border border-border bg-muted/40 p-4"><dt className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">{taskFieldLabels.taskExpectedEndDate}</dt><dd className="mt-1 text-sm">15 May 2026</dd></div>
              <div className="rounded-xl border border-border bg-muted/40 p-4 sm:col-span-2"><dt className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">{taskFieldLabels.taskPerformanceIndicators}</dt><dd className="mt-1 text-sm">KPI worksheet completion and sign-off ratio.</dd></div>
              <div className="rounded-xl border border-border bg-muted/40 p-4"><dt className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">{taskFieldLabels.taskTargetValue}</dt><dd className="mt-1 text-sm">100</dd></div>
              <div className="rounded-xl border border-border bg-muted/40 p-4"><dt className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">{taskFieldLabels.taskActualValueAchieved}</dt><dd className="mt-1 text-sm">64</dd></div>
              <div className="rounded-xl border border-border bg-muted/40 p-4 sm:col-span-2"><dt className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">{taskFieldLabels.taskAchievementPercentage}</dt><dd className="mt-1 text-sm">64%</dd></div>
            </dl>
          </div>
        </section>

        {showRequestedEdits && (
          <section className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
            <div className="border-b border-border bg-muted/30 px-6 py-5 sm:px-8">
              <h2 className="text-lg font-bold">Requested Edits</h2>
              <p className="mt-0.5 text-sm text-muted-foreground">Overview of feedback already sent to the submitter. After they resubmit,open the proposal to continue inspection</p>
            </div>
            <div className="space-y-5 px-6 py-6 sm:px-8 sm:py-8">
              <div className="rounded-2xl border border-border bg-background p-5 shadow-sm sm:p-6">
                <p className="text-[9px] font-bold uppercase tracking-wide text-muted-foreground">Field</p>
                <p className="mt-1 text-sm font-semibold text-foreground">{taskFieldLabels.taskExpectedEndDate}</p>
                <p className="mt-4 text-[9px] font-bold uppercase tracking-wide text-muted-foreground">Previous value</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">15 May 2026</p>
                <p className="mt-4 text-[9px] font-bold uppercase tracking-wide text-muted-foreground">Requested change</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  Move the expected end date to 30 June 2026 so Q2 milestones align with reporting window.
                </p>
              </div>
            </div>
          </section>
        )}

        {!isProposalContext && !isAccepted && !isChangesRequested && (
          <section className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
            <div className="border-b border-border bg-muted/30 px-6 py-5 sm:px-8">
              <h2 className="text-lg font-bold">Your Notes</h2>
              <p className="mt-0.5 text-sm text-muted-foreground">Select a field, then specify your modifications</p>
            </div>
            <form className="space-y-6 px-6 py-6 sm:px-8 sm:py-8">
              <Input type="hidden" name="submissionId" value={requestId} />
              <Input type="hidden" name="submissionType" value="task" />
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
                    <div key={row.id} className="rounded-2xl border border-border bg-background p-5 shadow-sm sm:p-6">
                      <div className="mb-4 flex items-center justify-between gap-3 border-b border-border pb-3">
                        <span className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                          Field modification {index + 1}
                        </span>
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
                      <div className="space-y-4">
                        <div>
                          <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Field</label>
                          <NativeSelect
                            name="auditorModificationField[]"
                            value={row.field}
                            onChange={(e) => updateFieldRow(row.id, { field: e.target.value })}
                          >
                            <NativeSelectOption value="">Select field...</NativeSelectOption>
                            {fieldOptions.map((field) => (
                              <NativeSelectOption key={field} value={field}>{taskFieldLabels[field] ?? field}</NativeSelectOption>
                            ))}
                          </NativeSelect>
                        </div>
                        <div>
                          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted-foreground">Requested change</label>
                          <Textarea
                            name="auditorModificationNote[]"
                            rows={3}
                            placeholder="Describe the modification for this field only."
                            className="bg-muted/40"
                            value={row.note}
                            onChange={(e) => updateFieldRow(row.id, { note: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted-foreground">Additional notes</label>
                <Textarea name="auditorGeneralNote" rows={4} />
              </div>    
              <div className="flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:justify-between">
                <Link to="/task-queue" className="inline-flex items-center justify-center rounded-full border border-border bg-background px-5 py-2.5 text-sm font-semibold text-foreground shadow-sm transition hover:bg-accent">
                  Back to task queue
                </Link>
                <div className="flex flex-col gap-3 sm:flex-row sm:gap-3">
                  <Button type="submit" variant="outline">Request changes</Button>
                  <Button type="submit">Accept submission</Button>
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

