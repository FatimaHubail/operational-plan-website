import type { FormEvent } from "react"
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
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"

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
    <div className="mt-2 rounded-xl border border-violet-200/60 bg-gradient-to-br from-violet-50/90 to-white p-3 ring-1 ring-violet-100/50">
      <div className="flex items-start gap-2.5">
        <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-violet-100 text-violet-600" aria-hidden="true">
          <SparklesIcon className="h-4 w-4" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-wide text-violet-800/75">Suggested text</p>
          <p className={`mt-1 text-xs leading-relaxed text-slate-500 italic ${minHeightClass}`} data-ai-for={fieldId}>
            Connect an assistant to show suggestions here.
          </p>
        </div>
      </div>
      <div className="mt-2 flex justify-end border-t border-violet-100/90 pt-2">
        <Button type="button" variant="outline" size="sm" disabled className="h-7 border-border text-xs">
          Apply to field
        </Button>
      </div>
    </div>
  )
}

export default function AddAction() {
  const location = useLocation()
  const { planSection } = useParams<{ planSection: string }>()
  const isContributorArea = location.pathname.startsWith("/contributor/")
  const dashboardHref = isContributorArea ? "/contributor/dashboard" : "/dashboard"
  const isValidSection = (s: string | undefined): s is PlanSection =>
    !!s && (PLAN_SECTIONS as readonly string[]).includes(s)

  if (!isValidSection(planSection)) {
    return <Navigate to={isContributorArea ? "/contributor/catalysts/add-action" : "/catalysts/add-action"} replace />
  }

  const parentPath = `/${planSection}` as `/${PlanSection}`
  const sectionHref = isContributorArea ? `/contributor${parentPath}` : parentPath
  const parentLabel = SECTION_LABELS[parentPath] ?? "Planning"
  const actionPlanHref = `${sectionHref}/action-plan`

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
  }

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border/60 bg-background px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
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
              <BreadcrumbPage>Add action</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="min-w-0 flex-1 overflow-x-hidden bg-background p-4 sm:p-6 lg:p-8">
        <header className="mb-8 w-full min-w-0">
          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Execution</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Add action</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Define the action header and capture task fields used on the action plan.
          </p>
        </header>

        <div className="mb-8 rounded-2xl border border-border bg-muted/40 p-4 shadow-sm ring-1 ring-border/60 sm:p-5" role="note">
          <p className="text-xs font-bold uppercase tracking-wide text-foreground/70">After you submit</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Actions are reviewed like objectives. Track request status from My submissions.
          </p>
        </div>

        <form
          id="add-action-form"
          className="relative overflow-hidden rounded-3xl border border-border bg-card text-card-foreground shadow-sm"
          onSubmit={onSubmit}
        >
          <div className="relative border-b border-slate-100 bg-gradient-to-r from-slate-50/95 via-white to-orange-50/30 px-6 py-6 sm:px-10 sm:py-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 text-white shadow-lg shadow-orange-500/30 sm:h-14 sm:w-14">
                <svg className="h-6 w-6 sm:h-7 sm:w-7" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-orange-800/60">New action & task</p>
              </div>
            </div>
          </div>

          <div className="relative mx-6 mb-2 rounded-2xl border border-violet-200/60 bg-gradient-to-r from-violet-50/80 to-white px-4 py-3.5 shadow-sm ring-1 ring-violet-100/50 sm:mx-10">
            <div className="flex gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
                <SparklesIcon className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-violet-950">Assistant-ready fields</p>
                <p className="mt-0.5 text-xs leading-relaxed text-slate-600">
                  AI suggestion panels are shown under key narrative fields.
                </p>
              </div>
            </div>
          </div>

          <div className="relative space-y-10 px-6 py-8 sm:px-10 sm:py-10">
            <fieldset className="space-y-4 border-0 p-0">
              <legend className="mb-1 text-[10px] font-bold uppercase tracking-[0.12em] text-orange-800/55">Action</legend>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-x-4 sm:gap-y-5">
                <div className="sm:col-span-2">
                  <label htmlFor="action-title" className="mb-1.5 flex flex-wrap items-center gap-x-2 text-[9px] font-bold uppercase tracking-wide text-slate-500">
                    <span>Action title</span>
                    <span className="rounded bg-violet-100 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wide text-violet-800">AI</span>
                  </label>
                  <Input id="action-title" name="actionTitle" placeholder="e.g. Faculty KPI mapping and sign-off" className="h-9 bg-background" />
                  <AiSuggestionBlock fieldId="action-title" minHeightClass="min-h-[2.75rem]" />
                </div>
                <div className="rounded-lg border border-orange-100/90 bg-gradient-to-br from-orange-50/80 to-amber-50/50 p-3 ring-1 ring-orange-100/60 sm:max-w-xs">
                  <label htmlFor="action-total-weight" className="mb-1.5 block text-[9px] font-bold uppercase tracking-wide text-slate-500">Total weight</label>
                  <Input id="action-total-weight" name="actionTotalWeight" placeholder="e.g. 50%" className="h-9 bg-background font-semibold" />
                </div>
              </div>
            </fieldset>

            <fieldset className="space-y-4 border-0 border-t border-slate-100 p-0 pt-10">
              <legend className="mb-1 text-[10px] font-bold uppercase tracking-[0.12em] text-orange-800/55">Task</legend>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-x-4 sm:gap-y-5">
                <div className="sm:col-span-2">
                  <label htmlFor="task-name" className="mb-1.5 flex flex-wrap items-center gap-x-2 text-[9px] font-bold uppercase tracking-wide text-slate-500">
                    <span>Task name</span>
                    <span className="rounded bg-violet-100 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wide text-violet-800">AI</span>
                  </label>
                  <Input id="task-name" name="taskName" placeholder="Shown as Task 1: … on the plan" className="h-9 bg-background" />
                  <AiSuggestionBlock fieldId="task-name" minHeightClass="min-h-[2.75rem]" />
                </div>

                <Input name="taskWeight" placeholder="Weight (e.g. 35%)" className="h-9 bg-background font-semibold" />
                <Input name="taskMainEntity" placeholder="Main entity" className="h-9 bg-background" />
                <Input name="taskSupportingEntities" placeholder="Supporting entity/s" className="h-9 bg-background sm:col-span-2" />
                <Textarea name="taskHumanResources" rows={3} placeholder="Human resources required" className="min-h-[5rem] bg-background sm:col-span-2" />

                <div className="sm:col-span-2">
                  <Textarea name="taskFinancialResources" rows={3} placeholder="Financial resources required" className="min-h-[5rem] bg-background" />
                  <AiSuggestionBlock fieldId="task-financial-resources" minHeightClass="min-h-[4rem]" />
                </div>

                <Input type="date" name="taskStartDate" className="h-9 bg-background" />
                <Input type="date" name="taskExpectedEndDate" className="h-9 bg-background" />

                <div className="sm:col-span-2">
                  <Textarea name="taskPerformanceIndicators" rows={4} placeholder="Performance indicators" className="min-h-[6rem] bg-background" />
                  <AiSuggestionBlock fieldId="task-performance-indicators" minHeightClass="min-h-[5rem]" />
                </div>

                <Input name="taskTargetValue" type="number" placeholder="Target value" className="h-9 bg-background font-semibold" />
                <Input name="taskActualValueAchieved" type="number" placeholder="Number achieved" className="h-9 bg-background font-semibold" />
                <Input name="taskAchievementPercentage" placeholder="Achievement percentage (e.g. 82%)" className="h-9 bg-background font-semibold" />
                <Input name="taskActionContributionPercentage" placeholder="Action contribution percentage (e.g. 40%)" className="h-9 bg-background font-semibold" />

                <div className="sm:col-span-2">
                  <label htmlFor="task-status" className="mb-1.5 block text-[9px] font-bold uppercase tracking-wide text-slate-500">Status</label>
                  <NativeSelect id="task-status" name="taskStatus" className="w-full">
                    <NativeSelectOption value="">Select status…</NativeSelectOption>
                    <NativeSelectOption value="Not started">Not started</NativeSelectOption>
                    <NativeSelectOption value="In progress">In progress</NativeSelectOption>
                    <NativeSelectOption value="Completed">Completed</NativeSelectOption>
                  </NativeSelect>
                </div>

                <div className="sm:col-span-2">
                  <Textarea name="taskNotes" rows={4} placeholder="Notes" className="min-h-[6rem] bg-background" />
                  <AiSuggestionBlock fieldId="task-notes" minHeightClass="min-h-[5rem]" />
                </div>
              </div>
            </fieldset>

            <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-8 sm:flex-row sm:items-center sm:justify-end">
              <Link
                to={actionPlanHref}
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200/60 transition hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2"
              >
                Cancel
              </Link>
              <Button type="submit" className="w-full sm:w-auto">Save action</Button>
            </div>
          </div>
        </form>
      </div>
    </>
  )
}
