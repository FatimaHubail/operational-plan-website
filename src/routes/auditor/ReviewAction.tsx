import { useMemo } from "react"
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
import { formatFieldLabel } from "@/lib/formatFieldLabel"

const fieldOptions = [
  "actionTitle",
  "actionTotalWeight",
  "taskName",
  "taskWeight",
  "taskStatus",
  "taskMainEntity",
  "taskSupportingEntities",
  "taskStartDate",
  "taskExpectedEndDate",
  "taskPerformanceIndicators",
  "taskTargetValue",
  "taskNotes",
]

export default function ReviewAction() {
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

  const requestId = isEdited ? "REQ-2026-0131" : isChangesRequested ? "REQ-2026-0129" : "REQ-2026-0142"
  const badgeText = isEdited
    ? "Edited - awaiting re-review"
    : isChangesRequested
      ? "Changes requested"
      : isAccepted
        ? "Accepted"
        : "Pending auditor review"

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
                  <BreadcrumbLink render={<Link to="/action-queue" />}>Action queue</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
              </>
            )}
            <BreadcrumbItem>
              <BreadcrumbPage>{isProposalContext ? "Review action" : "Action"}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-mono text-xs font-semibold text-muted-foreground">{requestId}</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
              {isEdited ? "Review edited action submission" : isChangesRequested ? "Review requested edits" : "Review action submission"}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {isChangesRequested ? (
                <>
                  Original submission · <span className="font-medium text-foreground">College of Science</span> · Source:{" "}
                  <Link to="/add-action" className="font-medium text-primary hover:underline">
                    Add action
                  </Link>{" "}
                  · Faculty KPI mapping rollout
                </>
              ) : isEdited ? (
                <>
                  Submitted by <span className="font-medium text-foreground">IT and Operations</span> · Source:{" "}
                  <Link to="/add-action" className="font-medium text-primary hover:underline">
                    Add action
                  </Link>{" "}
                  · Resubmitted yesterday after changes requested
                </>
              ) : isProposalContext ? (
                <>
                  Submitted on:{" "}
                  <time dateTime={submissionSubmittedOn.iso} className="font-medium text-foreground">
                    {submissionSubmittedOn.label}
                  </time>
                </>
              ) : (
                <>
                  Submitted by <span className="font-medium text-foreground">Ahmed Khalil</span> · Source:{" "}
                  <Link to="/add-action" className="font-medium text-primary hover:underline">
                    Add action
                  </Link>{" "}
                  · 2 hours ago
                </>
              )}
            </p>
          </div>
          <span className="inline-flex w-fit items-center rounded-full bg-muted px-3 py-1 text-xs font-semibold text-foreground">
            {badgeText}
          </span>
        </div>
      </header>

      {isEdited && (
        <div className="mb-6 rounded-2xl border border-border bg-accent/40 px-4 py-3 text-sm text-foreground shadow-sm">
          <p className="font-semibold">Edited resubmission</p>
          <p className="mt-1 text-muted-foreground">
            The submitter updated this record after you requested changes. What you see below is the latest version.
          </p>
        </div>
      )}

      <div className="space-y-6">
        <section className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
          <div className="border-b border-border bg-muted/30 px-6 py-5 sm:px-8">
            <h2 className="text-lg font-bold">Submitted Content</h2>
          </div>
          <div className="px-6 py-6 sm:px-8 sm:py-8">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">Action</h3>
            <dl className="mt-3 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-border bg-muted/40 p-4 sm:col-span-2">
                <dt className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                  {formatFieldLabel("actionTitle")}
                </dt>
                <dd className="mt-1 text-sm font-medium">Faculty KPI mapping and sign-off</dd>
              </div>
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <dt className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                  {formatFieldLabel("actionTotalWeight")}
                </dt>
                <dd className="mt-1 text-sm font-semibold">50%</dd>
              </div>
            </dl>

            <h3 className="mt-8 text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">Task</h3>
            <dl className="mt-3 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-border bg-muted/40 p-4 sm:col-span-2">
                <dt className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                  {formatFieldLabel("taskName")}
                </dt>
                <dd className="mt-1 text-sm">Complete college-level KPI worksheet</dd>
              </div>
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <dt className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                  {formatFieldLabel("taskWeight")}
                </dt>
                <dd className="mt-1 text-sm">50%</dd>
              </div>
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <dt className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                  {formatFieldLabel("taskStatus")}
                </dt>
                <dd className="mt-1 text-sm">In progress</dd>
              </div>
              <div className="rounded-xl border border-border bg-muted/40 p-4 sm:col-span-2">
                <dt className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                  {formatFieldLabel("taskMainEntity")}
                </dt>
                <dd className="mt-1 text-sm">College of Science</dd>
              </div>
            </dl>
          </div>
        </section>

        {showRequestedEdits && (
          <section className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
            <div className="border-b border-border bg-muted/30 px-6 py-5 sm:px-8">
              <h2 className="text-lg font-bold">Requested edits</h2>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Read-only record of what was asked from submitter before resubmission.
              </p>
            </div>
            <div className="space-y-5 px-6 py-6 sm:px-8 sm:py-8">
              <div className="rounded-2xl border border-border bg-background p-5 shadow-sm sm:p-6">
                <p className="text-[9px] font-bold uppercase tracking-wide text-muted-foreground">Field</p>
                <p className="mt-1 text-sm font-semibold text-foreground">{formatFieldLabel("taskExpectedEndDate")}</p>
                <p className="mt-4 text-[9px] font-bold uppercase tracking-wide text-muted-foreground">Requested change</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  Move the expected end date to 30 June 2026 so Q2 milestones align with reporting window.
                </p>
              </div>
            </div>
            <div className="border-t border-border bg-muted/30 px-6 py-5 sm:px-8">
              <Link
                to="/action-queue"
                className="inline-flex items-center justify-center rounded-full border border-border bg-background px-5 py-2.5 text-sm font-semibold text-foreground shadow-sm transition hover:bg-accent"
              >
                Back to action queue
              </Link>
            </div>
          </section>
        )}

        {!isProposalContext && !isAccepted && !isChangesRequested && (
          <section className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
            <div className="border-b border-border bg-muted/30 px-6 py-5 sm:px-8">
              <h2 className="text-lg font-bold">Your notes</h2>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Add field-level modifications with separate notes for each field.
              </p>
            </div>
            <form className="space-y-6 px-6 py-6 sm:px-8 sm:py-8">
              <Input type="hidden" name="submissionId" value={requestId} />
              <Input type="hidden" name="submissionType" value="action" />
              <div className="space-y-4 rounded-2xl border border-border bg-background p-5 shadow-sm sm:p-6">
                <div>
                  <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Field</label>
                  <NativeSelect name="auditorModificationField[]">
                    <NativeSelectOption value="">Select field...</NativeSelectOption>
                    {fieldOptions.map((field) => (
                      <NativeSelectOption key={field} value={field}>
                        {formatFieldLabel(field)}
                      </NativeSelectOption>
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
                  />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted-foreground">General notes</label>
                <Textarea
                  name="auditorGeneralNote"
                  rows={4}
                  placeholder="Overall feedback not tied to a single field."
                />
              </div>
              <div className="flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:justify-between">
                <Link
                  to="/action-queue"
                  className="inline-flex items-center justify-center rounded-full border border-border bg-background px-5 py-2.5 text-sm font-semibold text-foreground shadow-sm transition hover:bg-accent"
                >
                  Back to action queue
                </Link>
                <div className="flex flex-col gap-3 sm:flex-row sm:gap-3">
                  <Button type="submit" variant="outline">
                    Request changes
                  </Button>
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
