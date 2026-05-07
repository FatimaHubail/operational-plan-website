import { type FormEvent, useState } from "react"
import { Link, Navigate, useLocation, useParams } from "react-router-dom"
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
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

const PLAN_SECTIONS = ["catalysts", "enablers", "beneficiary", "stakeholders"] as const
type PlanSection = (typeof PLAN_SECTIONS)[number]

const SECTION_LABELS: Record<`/${PlanSection}`, string> = {
  "/catalysts": "Catalysts",
  "/enablers": "Enablers",
  "/beneficiary": "Beneficiary",
  "/stakeholders": "Stakeholders",
}

function SparklesIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
      />
    </svg>
  )
}

function AiSuggestionBlock({ fieldId, minHeightClass }: { fieldId: string; minHeightClass: string }) {
  return (
    <div className="mt-2 rounded-xl border border-chart-1/25 bg-gradient-to-br from-chart-1/12 to-card p-3 ring-1 ring-chart-1/20">
      <div className="flex items-start gap-2.5">
        <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-chart-1/20 text-chart-1" aria-hidden="true">
          <SparklesIcon className="h-4 w-4" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-wide text-foreground">Suggested text</p>
          <p className={`ai-suggestion-body mt-1 text-xs leading-relaxed text-muted-foreground italic ${minHeightClass}`} data-ai-for={fieldId}>
            Connect an assistant to show suggestions here.
          </p>
        </div>
      </div>
      <div className="mt-2 flex justify-end border-t border-chart-1/20 pt-2">
        <Button type="button" variant="outline" size="sm" disabled className="h-7 border-chart-1/40 bg-card text-xs text-chart-1 hover:bg-chart-1/10">
          Apply to field
        </Button>
      </div>
    </div>
  )
}

export default function AddTask() {
  const location = useLocation()
  const { planSection } = useParams<{ planSection: string }>()
  const isContributorArea = location.pathname.startsWith("/contributor/")
  const dashboardHref = isContributorArea ? "/contributor/dashboard" : "/dashboard"
  const proposalsStatusHref = isContributorArea ? "/contributor/proposals-status" : "/proposals-status"
  const isValidSection = (s: string | undefined): s is PlanSection =>
    !!s && (PLAN_SECTIONS as readonly string[]).includes(s)

  if (!isValidSection(planSection)) {
    return <Navigate to={isContributorArea ? "/contributor/catalysts/add-task" : "/catalysts/add-task"} replace />
  }

  const parentPath = `/${planSection}` as `/${PlanSection}`
  const sectionHref = isContributorArea ? `/contributor${parentPath}` : parentPath
  const parentLabel = SECTION_LABELS[parentPath] ?? "Planning"
  const actionPlanHref = `${sectionHref}/action-plan`
  const [taskStartDate, setTaskStartDate] = useState<Date | undefined>(undefined)
  const [taskExpectedEndDate, setTaskExpectedEndDate] = useState<Date | undefined>(undefined)

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
  }
  const inputClass = "h-9 w-full border-border/80 bg-card text-foreground shadow-sm focus-visible:border-primary/70 focus-visible:ring-primary/25"
  const dateLabel = (value?: Date) => {
    if (!value) return "Select date"
    return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(value)
  }
  const toIsoDate = (value?: Date) => {
    if (!value) return ""
    const y = value.getFullYear()
    const m = `${value.getMonth() + 1}`.padStart(2, "0")
    const d = `${value.getDate()}`.padStart(2, "0")
    return `${y}-${m}-${d}`
  }

  return (
    <>
      <header className="mt-6 mb-0 flex shrink-0 items-center gap-2 pt-0 pb-0 bg-background px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:pt-2">
        <SidebarTrigger className="md:hidden" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link to={dashboardHref} />}>Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link to={sectionHref} />}>{parentLabel}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link to={actionPlanHref} />}>Action plan</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Add task</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="min-w-0 flex-1 overflow-x-hidden bg-gradient-to-b from-background via-secondary/60 to-chart-5/10 p-4 sm:p-6 lg:p-8">
        <header className="mb-8 w-full min-w-0">
          <h1 className="mt-0.5 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Add task</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Add one task based on the selected action. Each save creates a new task with all required details
          </p>
        </header>

        <div
          className="mb-8 rounded-2xl border border-chart-3/30 bg-[color-mix(in_oklch,var(--chart-3)_12%,white)] p-4 shadow-sm ring-1 ring-chart-3/18 sm:p-5"
          role="note"
        >
          <p className="text-xs font-bold uppercase tracking-wide text-foreground/70">After you submit</p>
          <p className="mt-1 text-sm text-muted-foreground">
            This task enters the auditor queue for inspection. The auditor may Accept your proposal or Request changes with notes on specific fields. Monitor status on{" "}
            <Link to={proposalsStatusHref} className="font-medium text-primary underline-offset-4 hover:underline">
              Proposals Status
            </Link>
            .
          </p>
        </div>

        <form
          id="add-task-form"
          className="relative overflow-hidden rounded-3xl border border-border/80 bg-card text-card-foreground shadow-md ring-1 ring-border/40"
          onSubmit={onSubmit}
        >
          <div className="relative border-b border-border/70 bg-card px-6 py-6 sm:px-10 sm:py-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg sm:h-14 sm:w-14">
                <svg className="h-6 w-6 sm:h-7 sm:w-7" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"
                  />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-primary">New task</p>
                <p className="mt-1 text-xs text-muted-foreground">Fill in the required fields to define a task</p>
              </div>
            </div>
          </div>

          <div className="relative mx-6 mb-2 mt-4 rounded-2xl border border-chart-1/25 bg-gradient-to-r from-chart-1/12 to-card px-4 py-3.5 shadow-sm ring-1 ring-chart-1/20 sm:mx-10">
            <div className="flex gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-chart-1/20 text-chart-1">
                <SparklesIcon className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground">Assistant-ready fields</p>
                <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                  AI-generated suggestions are provided to help you draft the task details. Review and edit the text as needed to ensure it fits your institution's context.
                </p>
              </div>
            </div>
          </div>

          <div className="relative space-y-10 px-6 py-8 sm:px-10 sm:py-10">
            <fieldset className="min-w-0 space-y-4 border-0 p-0">
              <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-x-4 sm:gap-y-5">
                <div className="min-w-0 sm:col-span-2">
                  <label htmlFor="task-name" className="mb-1.5 flex flex-wrap items-center gap-x-2 text-[9px] font-bold uppercase tracking-wide text-muted-foreground">
                    <span>Task name <span className="text-primary">*</span></span>
                    <span className="rounded bg-chart-1/20 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wide text-chart-1">AI</span>
                  </label>
                  <Input
                    id="task-name"
                    name="taskName"
                    placeholder="Short title to define the task"
                    className={inputClass}
                  />
                  <AiSuggestionBlock fieldId="task-name" minHeightClass="min-h-[2.75rem]" />
                </div>

                <div className="min-w-0">
                  <label htmlFor="task-weight" className="mb-1.5 block text-[9px] font-bold uppercase tracking-wide text-muted-foreground">
                    Task weight <span className="text-primary">*</span>
                  </label>
                  <Input
                    id="task-weight"
                    name="taskWeight"
                    placeholder="Enter this task's weight"
                    className={inputClass}
                  />
                </div>

                <div className="min-w-0 sm:col-span-1">
                  <label className="mb-1.5 block text-[9px] font-bold uppercase tracking-wide text-muted-foreground">
                    Start date <span className="text-primary">*</span>
                  </label>
                  <input type="hidden" name="taskStartDate" value={toIsoDate(taskStartDate)} />
                  <Popover>
                    <PopoverTrigger
                      render={
                        <Button
                          type="button"
                          variant="outline"
                          className="h-9 w-full justify-start border-border/80 bg-card text-left text-sm font-normal text-foreground shadow-sm hover:bg-muted"
                        />
                      }
                    >
                      {dateLabel(taskStartDate)}
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={taskStartDate}
                        onSelect={(date) => {
                          setTaskStartDate(date)
                          if (date && taskExpectedEndDate && taskExpectedEndDate < date) {
                            setTaskExpectedEndDate(date)
                          }
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="min-w-0 sm:col-span-1">
                  <label className="mb-1.5 block text-[9px] font-bold uppercase tracking-wide text-muted-foreground">
                    End date <span className="text-primary">*</span>
                  </label>
                  <input type="hidden" name="taskExpectedEndDate" value={toIsoDate(taskExpectedEndDate)} />
                  <Popover>
                    <PopoverTrigger
                      render={
                        <Button
                          type="button"
                          variant="outline"
                          className="h-9 w-full justify-start border-border/80 bg-card text-left text-sm font-normal text-foreground shadow-sm hover:bg-muted"
                        />
                      }
                    >
                      {dateLabel(taskExpectedEndDate)}
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={taskExpectedEndDate}
                        onSelect={(date) => setTaskExpectedEndDate(date)}
                        disabled={(date) => (taskStartDate ? date < taskStartDate : false)}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="min-w-0 sm:col-span-2">
                  <label
                    htmlFor="task-performance-indicators"
                    className="mb-1.5 block text-[9px] font-bold uppercase tracking-wide text-muted-foreground"
                  >
                    Performance indicators <span className="text-primary">*</span>
                  </label>
                  <Textarea
                    id="task-performance-indicators"
                    name="taskPerformanceIndicators"
                    rows={4}
                    placeholder="KPI or measure used to judge execution"
                    className="min-h-[6rem] resize-y border-border/80 bg-card shadow-sm focus-visible:border-primary/70 focus-visible:ring-primary/25"
                  />
                  <AiSuggestionBlock fieldId="task-performance-indicators" minHeightClass="min-h-[5rem]" />
                </div>

                <div className="min-w-0">
                  <label htmlFor="task-target-value" className="mb-1.5 block text-[9px] font-bold uppercase tracking-wide text-muted-foreground">
                    Target value <span className="text-primary">*</span>
                  </label>
                  <Input
                    id="task-target-value"
                    name="taskTargetValue"
                    type="number"
                    placeholder="Planned percentage or number the indicator must reach"
                    className={inputClass}
                  />
                </div>
                <div className="min-w-0">
                  <label htmlFor="task-actual-value-achieved" className="mb-1.5 block text-[9px] font-bold uppercase tracking-wide text-muted-foreground">
                    Number achieved
                  </label>
                  <Input
                    id="task-actual-value-achieved"
                    name="taskActualValueAchieved"
                    type="number"
                    placeholder="Current achieved value"
                    className={inputClass}
                  />
                </div>
                <div className="min-w-0 sm:col-span-2">
                  <label htmlFor="task-achievement-percentage" className="mb-1.5 block text-[9px] font-bold uppercase tracking-wide text-muted-foreground">
                    Achievement percentage
                  </label>
                  <Input
                    id="task-achievement-percentage"
                    name="taskAchievementPercentage"
                    className={`${inputClass} font-semibold`}
                  />
                </div>
              </div>
            </fieldset>

            <div className="flex flex-col-reverse gap-3 border-t border-border pt-8 sm:flex-row sm:items-center sm:justify-end sm:gap-3">
              <Link
                to={actionPlanHref}
                className="inline-flex items-center justify-center rounded-xl border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground shadow-sm ring-1 ring-border/60 transition hover:border-border hover:bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                Cancel
              </Link>
              <Button
                type="submit"
                className="inline-flex h-auto items-center justify-center w-full rounded-xl px-5 py-2.5 text-sm font-semibold bg-primary text-primary-foreground shadow-md hover:bg-primary/90 sm:w-auto"
              >
                Save task
              </Button>
            </div>
          </div>
        </form>
      </div>
    </>
  )
}
