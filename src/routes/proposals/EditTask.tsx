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
import { proposalStatusToneSurfaceClass } from "@/lib/proposalStatusChip"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

const ORIGINAL_TASK_SUBMISSION = {
  taskName: "Complete college-level KPI worksheet",
  taskWeight: "50%",
  taskStartDate: "2026-04-01",
  taskExpectedEndDate: "2026-05-15",
  taskPerformanceIndicators: "KPI worksheet completion and sign-off ratio.",
  taskTargetValue: "100",
  taskActualValueAchieved: "64",
  taskAchievementPercentage: "64%",
} as const

type TaskFormState = {
  taskName: string
  taskWeight: string
  taskStartDate: string
  taskExpectedEndDate: string
  taskPerformanceIndicators: string
  taskTargetValue: string
  taskActualValueAchieved: string
  taskAchievementPercentage: string
}

const taskFieldLabels: Record<keyof TaskFormState, string> = {
  taskName: "Task name",
  taskWeight: "Task weight",
  taskStartDate: "Start date",
  taskExpectedEndDate: "End date",
  taskPerformanceIndicators: "Performance indicators",
  taskTargetValue: "Target value",
  taskActualValueAchieved: "Number achieved",
  taskAchievementPercentage: "Achievement percentage",
}

export default function EditTask() {
  const location = useLocation()
  const routePrefix = location.pathname.startsWith("/contributor/") ? "/contributor" : ""
  const proposalsStatusHref = `${routePrefix}/proposals-status`
  const dashboardHref = routePrefix ? "/contributor/dashboard" : "/dashboard"
  const isProposalEditTaskRoute = location.pathname.includes("/proposal/edit/task")

  const lastEditedOn = useMemo(() => {
    const d = new Date()
    return { iso: d.toISOString().slice(0, 10), label: new Intl.DateTimeFormat(undefined, { dateStyle: "long" }).format(d) }
  }, [])

  const editRequestedInOn = useMemo(() => {
    const iso = "2026-03-10"
    const [y, m, day] = iso.split("-").map(Number)
    const d = new Date(y, m - 1, day)
    return { iso, label: new Intl.DateTimeFormat(undefined, { dateStyle: "long" }).format(d) }
  }, [])

  const requestId = "REQ-2026-0152"
  const [form, setForm] = useState<TaskFormState>({ ...ORIGINAL_TASK_SUBMISSION })

  const onSubmit = (e: FormEvent) => e.preventDefault()

  return (
    <div className="min-w-0 flex-1 overflow-x-hidden bg-gradient-to-b from-background via-secondary/60 to-chart-5/10 p-4 sm:p-6 lg:p-8">
      <header className="mb-6 sm:mb-8">
        <Breadcrumb className="inline-flex flex-wrap items-center gap-2 rounded-full bg-card/90 px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-sm ring-1 ring-border/70 backdrop-blur-sm sm:text-sm">
          <BreadcrumbList className="flex-wrap">
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

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="font-mono text-xs font-semibold text-muted-foreground">{requestId}</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">Respond to Requested Changes</h1>
            {isProposalEditTaskRoute ? (
              <p className="mt-2 text-sm text-muted-foreground">
                Last edited: <time dateTime={lastEditedOn.iso} className="font-medium text-foreground">{lastEditedOn.label}</time> · Edit requested on:{" "}
                <time dateTime={editRequestedInOn.iso} className="font-medium text-foreground">{editRequestedInOn.label}</time>
              </p>
            ) : null}
          </div>
          <span className={cn("sm:mt-14 inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-semibold text-[oklch(0.55_0.015_255)]", proposalStatusToneSurfaceClass("changes"))}>
            Changes requested
          </span>
        </div>
      </header>

      <div className="space-y-6">
        <section className="overflow-hidden rounded-3xl border border-border bg-card ring-1 ring-border/70 shadow-[0_12px_40px_rgba(0,0,0,0.06),0_4px_12px_rgba(0,0,0,0.04)]">
          <div className="border-b border-border bg-gradient-to-r from-muted/70 via-card to-muted/35 px-4 py-3 sm:px-5">
            <h2 className="text-base font-bold">Requested Edits</h2>
          </div>
          <div className="space-y-3 px-4 py-4 sm:px-5 sm:py-4">
            <div className="rounded-2xl border-2 border-border bg-card p-5 shadow-sm ring-1 ring-border/70 sm:p-6">
              <p className="text-[9px] font-bold uppercase tracking-wide text-muted-foreground">Field</p>
              <p className="mt-1 text-sm font-semibold text-foreground">End date</p>
              <p className="mt-4 text-[9px] font-bold uppercase tracking-wide text-muted-foreground">Requested change</p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                Move the expected end date to 30 June 2026 so Q2 milestones align with reporting window.
              </p>
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-3xl border border-border bg-card ring-1 ring-border/70 shadow-[0_12px_40px_rgba(0,0,0,0.06),0_4px_12px_rgba(0,0,0,0.04)]">
          <div className="border-b border-border bg-gradient-to-r from-muted/70 via-card to-muted/35 px-6 py-5 sm:px-8">
            <h2 className="text-lg font-bold">Edit your Proposal</h2>
          </div>
          <form className="space-y-8 px-6 py-6 sm:px-8 sm:py-8" onSubmit={onSubmit}>
            <Input type="hidden" name="submissionId" value={requestId} />
            <Input type="hidden" name="submissionType" value="task" />

            <div className="grid gap-4 sm:grid-cols-2">
              {(["taskName","taskWeight","taskStartDate","taskExpectedEndDate","taskPerformanceIndicators","taskTargetValue","taskActualValueAchieved","taskAchievementPercentage"] as const).map((k) => (
                <div key={k} className={cn("rounded-xl border border-border bg-muted/40 p-4", (k === "taskName" || k === "taskPerformanceIndicators") && "sm:col-span-2")}>
                  <label className="block text-[10px] font-bold uppercase tracking-wide text-muted-foreground" htmlFor={`edit-${k}`}>
                    {taskFieldLabels[k]}
                  </label>
                  {k === "taskPerformanceIndicators" ? (
                    <Textarea id={`edit-${k}`} rows={3} value={form[k]} onChange={(e) => setForm((p) => ({ ...p, [k]: e.target.value }))} className="mt-2 border-border bg-background" />
                  ) : (
                    <Input id={`edit-${k}`} type={k.includes("Date") ? "date" : "text"} value={form[k]} onChange={(e) => setForm((p) => ({ ...p, [k]: e.target.value }))} className="mt-2 border-border bg-background" />
                  )}
                </div>
              ))}
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:justify-between">
              <Link to={proposalsStatusHref} className={cn(buttonVariants({ variant: "outline" }), "inline-flex h-8 rounded-full px-5 text-sm font-semibold leading-none")}>
                Back to proposals status
              </Link>
              <Button type="submit" className="h-8 rounded-full px-5 text-sm font-semibold">Submit revised proposal</Button>
            </div>
          </form>
        </section>
      </div>
    </div>
  )
}

