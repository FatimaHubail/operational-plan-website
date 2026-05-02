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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

/** Original submission snapshot from the auditor review mock (prefilled into the editor). */
const ORIGINAL_ACTION_SUBMISSION = {
  actionTitle: "Faculty KPI mapping and sign-off",
  actionTotalWeight: "50%",
  actionTotalAchievement: "61%",
  taskMainEntity: "College of Science",
  taskSupportingEntities: "Quality Assurance Office",
  taskHumanResources: "2 analysts, 1 coordinator",
  taskFinancialResources: "BHD 4,500 for workshops and tooling",
  taskActionContributionPercentage: "40%",
  taskStatus: "In progress",
  taskNotes: "",
} as const

type ActionFormState = {
  actionTitle: string
  actionTotalWeight: string
  actionTotalAchievement: string
  taskMainEntity: string
  taskSupportingEntities: string
  taskHumanResources: string
  taskFinancialResources: string
  taskActionContributionPercentage: string
  taskStatus: string
  taskNotes: string
}

function toFormState(): ActionFormState {
  return { ...ORIGINAL_ACTION_SUBMISSION }
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
                · Edit requested on:{" "}
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
              <p className="mt-0.5 text-xs text-muted-foreground">Read-only summary of requested changes for this action.</p>
            )}
          </div>
          <div className="space-y-3 px-4 py-4 sm:px-5 sm:py-4">
            <div className="rounded-xl border border-border bg-background p-3 shadow-sm">
              <p className="text-[8px] font-bold uppercase tracking-wide text-muted-foreground">Field</p>
              <p className="mt-0.5 text-xs font-semibold text-foreground">Total achievement</p>
              <p className="mt-2 text-[8px] font-bold uppercase tracking-wide text-muted-foreground">Requested change</p>
              <p className="mt-0.5 text-xs leading-snug text-muted-foreground">
                Provide a measurable total achievement value to summarize action-level progress.
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

            <div className="mt-3 grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-border bg-muted/40 p-4 sm:col-span-2">
                  <label className="block text-[10px] font-bold uppercase tracking-wide text-muted-foreground" htmlFor="edit-actionTitle">
                    Action title
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
                    Total weight
                  </label>
                  <Input
                    id="edit-actionTotalWeight"
                    name="actionTotalWeight"
                    value={form.actionTotalWeight}
                    onChange={(e) => setForm((p) => ({ ...p, actionTotalWeight: e.target.value }))}
                    className="mt-2 border-border bg-background"
                  />
                </div>
                <div className="rounded-xl border border-border bg-muted/40 p-4">
                  <label className="block text-[10px] font-bold uppercase tracking-wide text-muted-foreground" htmlFor="edit-actionTotalAchievement">
                    Total achievement
                  </label>
                  <Input
                    id="edit-actionTotalAchievement"
                    name="actionTotalAchievement"
                    value={form.actionTotalAchievement}
                    onChange={(e) => setForm((p) => ({ ...p, actionTotalAchievement: e.target.value }))}
                    className="mt-2 border-border bg-background"
                  />
                </div>
                <div className="rounded-xl border border-border bg-muted/40 p-4 sm:col-span-2">
                  <label className="block text-[10px] font-bold uppercase tracking-wide text-muted-foreground" htmlFor="edit-taskMainEntity">
                    Main entity
                  </label>
                  <Input id="edit-taskMainEntity" name="taskMainEntity" value={form.taskMainEntity} onChange={(e) => setForm((p) => ({ ...p, taskMainEntity: e.target.value }))} className="mt-2 border-border bg-background" />
                </div>
                <div className="rounded-xl border border-border bg-muted/40 p-4 sm:col-span-2">
                  <label className="block text-[10px] font-bold uppercase tracking-wide text-muted-foreground" htmlFor="edit-taskSupportingEntities">
                    Supporting entities
                  </label>
                  <Input id="edit-taskSupportingEntities" name="taskSupportingEntities" value={form.taskSupportingEntities} onChange={(e) => setForm((p) => ({ ...p, taskSupportingEntities: e.target.value }))} className="mt-2 border-border bg-background" />
                </div>
                <div className="rounded-xl border border-border bg-muted/40 p-4 sm:col-span-2">
                  <label className="block text-[10px] font-bold uppercase tracking-wide text-muted-foreground" htmlFor="edit-taskHumanResources">
                    Human resources required
                  </label>
                  <Textarea id="edit-taskHumanResources" name="taskHumanResources" rows={3} value={form.taskHumanResources} onChange={(e) => setForm((p) => ({ ...p, taskHumanResources: e.target.value }))} className="mt-2 border-border bg-background" />
                </div>
                <div className="rounded-xl border border-border bg-muted/40 p-4 sm:col-span-2">
                  <label className="block text-[10px] font-bold uppercase tracking-wide text-muted-foreground" htmlFor="edit-taskFinancialResources">
                    Financial resources required
                  </label>
                  <Textarea id="edit-taskFinancialResources" name="taskFinancialResources" rows={3} value={form.taskFinancialResources} onChange={(e) => setForm((p) => ({ ...p, taskFinancialResources: e.target.value }))} className="mt-2 border-border bg-background" />
                </div>
                <div className="rounded-xl border border-border bg-muted/40 p-4 sm:col-span-2">
                  <label className="block text-[10px] font-bold uppercase tracking-wide text-muted-foreground" htmlFor="edit-taskActionContributionPercentage">
                    Action contribution percentage
                  </label>
                  <Input id="edit-taskActionContributionPercentage" name="taskActionContributionPercentage" value={form.taskActionContributionPercentage} onChange={(e) => setForm((p) => ({ ...p, taskActionContributionPercentage: e.target.value }))} className="mt-2 border-border bg-background" />
                </div>
                <div className="rounded-xl border border-border bg-muted/40 p-4 sm:col-span-2">
                  <label className="block text-[10px] font-bold uppercase tracking-wide text-muted-foreground" htmlFor="edit-taskStatus">
                    Status
                  </label>
                  <Select value={form.taskStatus} onValueChange={(v) => setForm((p) => ({ ...p, taskStatus: v }))}>
                    <SelectTrigger id="edit-taskStatus" className="mt-2 w-full border-border bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Not started">Not started</SelectItem>
                      <SelectItem value="In progress">In progress</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="rounded-xl border border-border bg-muted/40 p-4 sm:col-span-2">
                  <label className="block text-[10px] font-bold uppercase tracking-wide text-muted-foreground" htmlFor="edit-taskNotes">
                    Notes
                  </label>
                  <Textarea id="edit-taskNotes" name="taskNotes" rows={3} value={form.taskNotes} onChange={(e) => setForm((p) => ({ ...p, taskNotes: e.target.value }))} className="mt-2 border-border bg-background" />
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
