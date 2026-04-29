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
            {isProposalEditTaskRoute ? (
              <p className="mt-2 text-sm text-muted-foreground">
                Last edited: <time dateTime={lastEditedOn.iso} className="font-medium text-foreground">{lastEditedOn.label}</time> · Edit requested on:{" "}
                <time dateTime={editRequestedInOn.iso} className="font-medium text-foreground">{editRequestedInOn.label}</time>
              </p>
            ) : null}
          </div>
          <span className="inline-flex w-fit items-center rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">
            Changes requested
          </span>
        </div>
      </header>

      <div className="space-y-6">
        <section className="overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm">
          <div className="border-b border-border bg-muted/30 px-4 py-3 sm:px-5">
            <h2 className="text-base font-bold">Requested Edits</h2>
          </div>
          <div className="space-y-3 px-4 py-4 sm:px-5 sm:py-4">
            <div className="rounded-xl border border-border bg-background p-3 shadow-sm">
              <p className="text-[8px] font-bold uppercase tracking-wide text-muted-foreground">Field</p>
              <p className="mt-0.5 text-xs font-semibold text-foreground">End date</p>
              <p className="mt-2 text-[8px] font-bold uppercase tracking-wide text-muted-foreground">Requested change</p>
              <p className="mt-0.5 text-xs leading-snug text-muted-foreground">
                Move the expected end date to 30 June 2026 so Q2 milestones align with reporting window.
              </p>
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
          <div className="border-b border-border bg-muted/30 px-6 py-5 sm:px-8">
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
              <Link to={proposalsStatusHref} className={cn(buttonVariants({ variant: "outline" }), "rounded-full px-5")}>
                Back to proposals status
              </Link>
              <Button type="submit" className="rounded-full">Submit revised proposal</Button>
            </div>
          </form>
        </section>
      </div>
    </div>
  )
}

