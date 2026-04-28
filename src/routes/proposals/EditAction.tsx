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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import { Textarea } from "@/components/ui/textarea"
import { formatFieldLabel } from "@/lib/formatFieldLabel"
import { cn } from "@/lib/utils"

/** Original submission snapshot from the auditor review mock (prefilled into the editor). */
const ORIGINAL_ACTION_SUBMISSION = {
  actionTitle: "Faculty KPI mapping and sign-off",
  actionTotalWeight: "50%",
  taskName: "Complete college-level KPI worksheet",
  taskWeight: "50%",
  taskStatus: "In progress",
  taskMainEntity: "College of Science",
  taskSupportingEntities: "",
  taskStartDate: "",
  taskExpectedEndDate: "15 May 2026",
  taskPerformanceIndicators: "",
  taskTargetValue: "",
  taskNotes: "",
} as const

type ActionFormState = {
  actionTitle: string
  actionTotalWeight: string
  taskName: string
  taskWeight: string
  taskStatus: string
  taskMainEntity: string
  taskSupportingEntities: string
  taskStartDate: string
  taskExpectedEndDate: string
  taskPerformanceIndicators: string
  taskTargetValue: string
  taskNotes: string
}

function toFormState(): ActionFormState {
  return { ...ORIGINAL_ACTION_SUBMISSION }
}

function taskSlice(s: ActionFormState): ActionFormState {
  return {
    actionTitle: s.actionTitle,
    actionTotalWeight: s.actionTotalWeight,
    taskName: s.taskName,
    taskWeight: s.taskWeight,
    taskStatus: s.taskStatus,
    taskMainEntity: s.taskMainEntity,
    taskSupportingEntities: s.taskSupportingEntities,
    taskStartDate: s.taskStartDate,
    taskExpectedEndDate: s.taskExpectedEndDate,
    taskPerformanceIndicators: s.taskPerformanceIndicators,
    taskTargetValue: s.taskTargetValue,
    taskNotes: s.taskNotes,
  }
}

export default function EditAction() {
  const location = useLocation()
  const routePrefix = location.pathname.startsWith("/contributor/") ? "/contributor" : ""
  const proposalsStatusHref = `${routePrefix}/proposals-status`
  const dashboardHref = routePrefix ? "/contributor/dashboard" : "/dashboard"
  const isProposalEditActionRoute = location.pathname.includes("/proposal/edit/action")

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

  const requestId = "REQ-2026-0112"

  const [form, setForm] = useState<ActionFormState>(toFormState)
  const [taskModalOpen, setTaskModalOpen] = useState(false)
  const [taskDraft, setTaskDraft] = useState<ActionFormState>(() => toFormState())

  const openTaskEditor = () => {
    setTaskDraft(taskSlice(form))
    setTaskModalOpen(true)
  }

  const saveTaskDraft = () => {
    setForm((prev) => ({
      ...prev,
      taskName: taskDraft.taskName,
      taskWeight: taskDraft.taskWeight,
      taskStatus: taskDraft.taskStatus,
      taskMainEntity: taskDraft.taskMainEntity,
      taskSupportingEntities: taskDraft.taskSupportingEntities,
      taskStartDate: taskDraft.taskStartDate,
      taskExpectedEndDate: taskDraft.taskExpectedEndDate,
      taskPerformanceIndicators: taskDraft.taskPerformanceIndicators,
      taskTargetValue: taskDraft.taskTargetValue,
      taskNotes: taskDraft.taskNotes,
    }))
    setTaskModalOpen(false)
  }

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
            <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">Respond to Requested Changes</h1>
            {isProposalEditActionRoute ? (
              <p className="mt-2 text-sm text-muted-foreground">
                Last edited:{" "}
                <time dateTime={lastEditedOn.iso} className="font-medium text-foreground">
                  {lastEditedOn.label}
                </time>{" "}
                · Edit requested in:{" "}
                <time dateTime={editRequestedInOn.iso} className="font-medium text-foreground">
                  {editRequestedInOn.label}
                </time>
              </p>
            ) : (
              <p className="mt-2 text-sm text-muted-foreground">
                Review the auditor feedback below, then update your action and task fields and submit your revised proposal.
              </p>
            )}
          </div>
          <span className="inline-flex w-fit items-center rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">
            Changes requested
          </span>
        </div>
      </header>

      <div className="space-y-6">
        <section className="overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm" aria-labelledby="requested-edits-edit-action-heading">
          <div className="border-b border-border bg-muted/30 px-4 py-3 sm:px-5">
            <h2 id="requested-edits-edit-action-heading" className="text-base font-bold">
              Requested Edits
            </h2>
            {!isProposalEditActionRoute && (
              <p className="mt-0.5 text-xs text-muted-foreground">
                Read-only summary of what the auditor asked you to change.
              </p>
            )}
          </div>
          <div className="space-y-3 px-4 py-4 sm:px-5 sm:py-4">
            <div className="rounded-xl border border-border bg-background p-3 shadow-sm">
              <p className="text-[8px] font-bold uppercase tracking-wide text-muted-foreground">Field</p>
              <p className="mt-0.5 text-xs font-semibold text-foreground">{formatFieldLabel("taskExpectedEndDate")}</p>
              <p className="mt-2 text-[8px] font-bold uppercase tracking-wide text-muted-foreground">Requested change</p>
              <p className="mt-0.5 text-xs leading-snug text-muted-foreground">
                Move the expected end date to 30 June 2026 so Q2 milestones align with reporting window.
              </p>
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm" aria-labelledby="edit-proposal-action-heading">
          <div className="border-b border-border bg-muted/30 px-6 py-5 sm:px-8">
            <h2 id="edit-proposal-action-heading" className="text-lg font-bold">
              Edit your Proposal
            </h2>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Fields are <span className="font-medium text-foreground">prefilled from your original submission</span>. Update
              what the auditor asked for, then submit your revised proposal
            </p>
          </div>
          <form className="space-y-8 px-6 py-6 sm:px-8 sm:py-8" onSubmit={onSubmit}>
            <Input type="hidden" name="submissionId" value={requestId} />
            <Input type="hidden" name="submissionType" value="action" />

            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">Action</h3>
              <div className="mt-3 grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-border bg-muted/40 p-4 sm:col-span-2">
                  <label className="block text-[10px] font-bold uppercase tracking-wide text-muted-foreground" htmlFor="edit-actionTitle">
                    {formatFieldLabel("actionTitle")}
                  </label>
                  <Input
                    id="edit-actionTitle"
                    name="actionTitle"
                    value={form.actionTitle}
                    onChange={(e) => setForm((p) => ({ ...p, actionTitle: e.target.value }))}
                    className="mt-2 border-border bg-background"
                  />
                </div>
                <div className="rounded-xl border border-border bg-muted/40 p-4">
                  <label className="block text-[10px] font-bold uppercase tracking-wide text-muted-foreground" htmlFor="edit-actionTotalWeight">
                    {formatFieldLabel("actionTotalWeight")}
                  </label>
                  <Input
                    id="edit-actionTotalWeight"
                    name="actionTotalWeight"
                    value={form.actionTotalWeight}
                    onChange={(e) => setForm((p) => ({ ...p, actionTotalWeight: e.target.value }))}
                    className="mt-2 border-border bg-background"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-muted/30 p-4 ring-1 ring-border/60">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">Task</h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Review the submitted task below, then open the editor to change any field (including dates the auditor
                    flagged).
                  </p>
                </div>
                <Button type="button" variant="outline" size="sm" className="shrink-0 rounded-full" onClick={openTaskEditor}>
                  Edit task fields
                </Button>
              </div>
              <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                <div className="rounded-lg border border-border bg-background p-3 sm:col-span-2">
                  <dt className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">{formatFieldLabel("taskName")}</dt>
                  <dd className="mt-0.5 font-medium text-foreground">{form.taskName}</dd>
                </div>
                <div className="rounded-lg border border-border bg-background p-3">
                  <dt className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">{formatFieldLabel("taskWeight")}</dt>
                  <dd className="mt-0.5">{form.taskWeight}</dd>
                </div>
                <div className="rounded-lg border border-border bg-background p-3">
                  <dt className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">{formatFieldLabel("taskStatus")}</dt>
                  <dd className="mt-0.5">{form.taskStatus}</dd>
                </div>
                <div className="rounded-lg border border-border bg-background p-3 sm:col-span-2">
                  <dt className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">{formatFieldLabel("taskMainEntity")}</dt>
                  <dd className="mt-0.5">{form.taskMainEntity}</dd>
                </div>
                <div className="rounded-lg border border-border bg-background p-3 sm:col-span-2">
                  <dt className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">{formatFieldLabel("taskExpectedEndDate")}</dt>
                  <dd className="mt-0.5 font-medium text-foreground">{form.taskExpectedEndDate}</dd>
                </div>
              </dl>
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

      <Dialog open={taskModalOpen} onOpenChange={setTaskModalOpen}>
        <DialogContent className="max-h-[min(90vh,36rem)] gap-0 overflow-hidden p-0 sm:max-w-lg" showCloseButton>
          <DialogHeader className="border-b border-border px-5 py-4">
            <DialogTitle>Edit task fields</DialogTitle>
          </DialogHeader>
          <form
            className="flex max-h-[min(75vh,28rem)] flex-col overflow-hidden"
            onSubmit={(e) => {
              e.preventDefault()
              saveTaskDraft()
            }}
          >
            <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <label className="block text-[10px] font-bold uppercase tracking-wide text-muted-foreground" htmlFor="modal-taskName">
                  {formatFieldLabel("taskName")}
                </label>
                <Input
                  id="modal-taskName"
                  value={taskDraft.taskName}
                  onChange={(e) => setTaskDraft((p) => ({ ...p, taskName: e.target.value }))}
                  className="mt-2 border-border bg-background"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-border bg-muted/40 p-4">
                  <label className="block text-[10px] font-bold uppercase tracking-wide text-muted-foreground" htmlFor="modal-taskWeight">
                    {formatFieldLabel("taskWeight")}
                  </label>
                  <Input
                    id="modal-taskWeight"
                    value={taskDraft.taskWeight}
                    onChange={(e) => setTaskDraft((p) => ({ ...p, taskWeight: e.target.value }))}
                    className="mt-2 border-border bg-background"
                  />
                </div>
                <div className="rounded-xl border border-border bg-muted/40 p-4">
                  <label className="block text-[10px] font-bold uppercase tracking-wide text-muted-foreground" htmlFor="modal-taskStatus">
                    {formatFieldLabel("taskStatus")}
                  </label>
                  <NativeSelect
                    id="modal-taskStatus"
                    value={taskDraft.taskStatus}
                    onChange={(e) => setTaskDraft((p) => ({ ...p, taskStatus: e.target.value }))}
                    className="mt-2 w-full min-w-0 border-border bg-background"
                  >
                    <NativeSelectOption value="Not started">Not started</NativeSelectOption>
                    <NativeSelectOption value="In progress">In progress</NativeSelectOption>
                    <NativeSelectOption value="Done">Done</NativeSelectOption>
                  </NativeSelect>
                </div>
              </div>
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <label className="block text-[10px] font-bold uppercase tracking-wide text-muted-foreground" htmlFor="modal-taskMainEntity">
                  {formatFieldLabel("taskMainEntity")}
                </label>
                <Input
                  id="modal-taskMainEntity"
                  value={taskDraft.taskMainEntity}
                  onChange={(e) => setTaskDraft((p) => ({ ...p, taskMainEntity: e.target.value }))}
                  className="mt-2 border-border bg-background"
                />
              </div>
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <label className="block text-[10px] font-bold uppercase tracking-wide text-muted-foreground" htmlFor="modal-taskSupportingEntities">
                  {formatFieldLabel("taskSupportingEntities")}
                </label>
                <Input
                  id="modal-taskSupportingEntities"
                  value={taskDraft.taskSupportingEntities}
                  onChange={(e) => setTaskDraft((p) => ({ ...p, taskSupportingEntities: e.target.value }))}
                  className="mt-2 border-border bg-background"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-border bg-muted/40 p-4">
                  <label className="block text-[10px] font-bold uppercase tracking-wide text-muted-foreground" htmlFor="modal-taskStartDate">
                    {formatFieldLabel("taskStartDate")}
                  </label>
                  <Input
                    id="modal-taskStartDate"
                    type="date"
                    value={taskDraft.taskStartDate}
                    onChange={(e) => setTaskDraft((p) => ({ ...p, taskStartDate: e.target.value }))}
                    className="mt-2 border-border bg-background"
                  />
                </div>
                <div className="rounded-xl border border-border bg-muted/40 p-4">
                  <label className="block text-[10px] font-bold uppercase tracking-wide text-muted-foreground" htmlFor="modal-taskExpectedEndDate">
                    {formatFieldLabel("taskExpectedEndDate")}
                  </label>
                  <Input
                    id="modal-taskExpectedEndDate"
                    value={taskDraft.taskExpectedEndDate}
                    onChange={(e) => setTaskDraft((p) => ({ ...p, taskExpectedEndDate: e.target.value }))}
                    className="mt-2 border-border bg-background"
                  />
                </div>
              </div>
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <label className="block text-[10px] font-bold uppercase tracking-wide text-muted-foreground" htmlFor="modal-taskPerformanceIndicators">
                  {formatFieldLabel("taskPerformanceIndicators")}
                </label>
                <Textarea
                  id="modal-taskPerformanceIndicators"
                  value={taskDraft.taskPerformanceIndicators}
                  onChange={(e) => setTaskDraft((p) => ({ ...p, taskPerformanceIndicators: e.target.value }))}
                  rows={3}
                  className="mt-2 border-border bg-background"
                />
              </div>
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <label className="block text-[10px] font-bold uppercase tracking-wide text-muted-foreground" htmlFor="modal-taskTargetValue">
                  {formatFieldLabel("taskTargetValue")}
                </label>
                <Input
                  id="modal-taskTargetValue"
                  value={taskDraft.taskTargetValue}
                  onChange={(e) => setTaskDraft((p) => ({ ...p, taskTargetValue: e.target.value }))}
                  className="mt-2 border-border bg-background"
                />
              </div>
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <label className="block text-[10px] font-bold uppercase tracking-wide text-muted-foreground" htmlFor="modal-taskNotes">
                  {formatFieldLabel("taskNotes")}
                </label>
                <Textarea
                  id="modal-taskNotes"
                  value={taskDraft.taskNotes}
                  onChange={(e) => setTaskDraft((p) => ({ ...p, taskNotes: e.target.value }))}
                  rows={3}
                  className="mt-2 border-border bg-background"
                />
              </div>
            </div>
            <div className="flex flex-col-reverse gap-2 border-t border-border bg-muted/30 px-5 py-4 sm:flex-row sm:justify-end">
              <Button type="button" variant="outline" onClick={() => setTaskModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
