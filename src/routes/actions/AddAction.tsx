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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

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
    <div className="mt-2 rounded-xl border border-border bg-gradient-to-br from-muted/90 to-card p-3 ring-1 ring-border/50">
      <div className="flex items-start gap-2.5">
        <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground" aria-hidden="true">
          <SparklesIcon className="h-4 w-4" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Suggested text</p>
          <p className={`mt-1 text-xs leading-relaxed text-muted-foreground italic ${minHeightClass}`} data-ai-for={fieldId}>
            Connect an assistant to show suggestions here.
          </p>
        </div>
      </div>
      <div className="mt-2 flex justify-end border-t border-border pt-2">
        <Button type="button" variant="outline" size="sm" disabled className="h-7 border-border text-xs">
          Apply to field
        </Button>
      </div>
    </div>
  )
}

export default function AddAction() {
  const location = useLocation()
  const [taskStatus, setTaskStatus] = useState("")
  const { planSection } = useParams<{ planSection: string }>()
  const isContributorArea = location.pathname.startsWith("/contributor/")
  const dashboardHref = isContributorArea ? "/contributor/dashboard" : "/dashboard"
  const proposalsStatusHref = isContributorArea ? "/contributor/proposals-status" : "/proposals-status"
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
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Add action</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Add one action based on the selected objective. Each save creates a new action with all required details
            and planning fields used on the action plan
          </p>
        </header>

        <div className="mb-8 rounded-2xl border border-border bg-muted/40 p-4 shadow-sm ring-1 ring-border/60 sm:p-5" role="note">
          <p className="text-xs font-bold uppercase tracking-wide text-foreground/70">After you submit</p>
          <p className="mt-1 text-sm text-muted-foreground">
            This action enters the auditor queue for inspection. The auditor may Accept your proposal or Request changes with notes on specific fields. Monitor status on{" "}
            <Link to={proposalsStatusHref} className="font-medium text-primary underline-offset-4 hover:underline">
              Proposals Status
            </Link>
            .
          </p>
        </div>

        <form
          id="add-action-form"
          className="relative overflow-hidden rounded-3xl border border-border bg-card text-card-foreground shadow-sm"
          onSubmit={onSubmit}
        >
          <div className="relative border-b border-border bg-gradient-to-r from-muted/95 via-card to-muted/30 px-6 py-6 sm:px-10 sm:py-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary text-primary-foreground shadow-lg sm:h-14 sm:w-14">
                <svg className="h-6 w-6 sm:h-7 sm:w-7" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground">New action</p>
              </div>
            </div>
          </div>

          <div className="relative mx-6 mb-2 rounded-2xl border border-border bg-gradient-to-r from-muted/80 to-card px-4 py-3.5 shadow-sm ring-1 ring-border/50 sm:mx-10">
            <div className="flex gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                <SparklesIcon className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground">Assistant-ready fields</p>
                <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                AI-generated suggestions are provided to help you draft the objective and its indicators. Review and edit the text as needed to ensure it fits your institution’s context.
                </p>
              </div>
            </div>
          </div>

          <div className="relative space-y-10 px-6 py-8 sm:px-10 sm:py-10">
            <fieldset className="space-y-4 border-0 p-0">
              <legend className="mb-1 text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">Action</legend>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-x-4 sm:gap-y-5">
                <div className="sm:col-span-2">
                  <label htmlFor="action-title" className="mb-1.5 flex flex-wrap items-center gap-x-2 text-[9px] font-bold uppercase tracking-wide text-muted-foreground">
                    <span>Action title <span className="text-primary">*</span></span>
                    <span className="rounded bg-accent px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wide text-foreground">AI</span>
                  </label>
                  <Input
                    id="action-title"
                    name="actionTitle"
                    placeholder="Short title to define the action"
                    className="h-9 bg-background"
                  />
                  <AiSuggestionBlock fieldId="action-title" minHeightClass="min-h-[2.75rem]" />
                </div>
                <div className="sm:max-w-xs">
                  <label htmlFor="action-total-weight" className="mb-1.5 block text-[9px] font-bold uppercase tracking-wide text-muted-foreground">
                    Total weight <span className="text-primary">*</span>
                  </label>
                  <Input
                    id="action-total-weight"
                    name="actionTotalWeight"
                    placeholder="Enter action overall weight"
                    className="h-9 bg-background"
                  />
                </div>
                <div className="sm:max-w-xs">
                  <label htmlFor="action-total-achievement" className="mb-1.5 block text-[9px] font-bold uppercase tracking-wide text-muted-foreground">
                    Total achievement
                  </label>
                  <Input
                    id="action-total-achievement"
                    name="actionTotalAchievement"
                    placeholder="Overall achievement value"
                    className="h-9 bg-background"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="task-main-entity" className="mb-1.5 block text-[9px] font-bold uppercase tracking-wide text-muted-foreground">
                    Main entity <span className="text-primary">*</span>
                  </label>
                  <Input
                    id="task-main-entity"
                    name="taskMainEntity"
                    placeholder="Department that owns action delivery"
                    className="h-9 bg-background"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label
                    htmlFor="task-supporting-entities"
                    className="mb-1.5 block text-[9px] font-bold uppercase tracking-wide text-muted-foreground"
                  >
                    Supporting entities <span className="text-primary">*</span>
                  </label>
                  <Input
                    id="task-supporting-entities"
                    name="taskSupportingEntities"
                    placeholder="Entities that support implementation"
                    className="h-9 bg-background"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label
                    htmlFor="task-human-resources"
                    className="mb-1.5 block text-[9px] font-bold uppercase tracking-wide text-muted-foreground"
                  >
                    Human resources required <span className="text-primary">*</span>
                  </label>
                  <Textarea
                    id="task-human-resources"
                    name="taskHumanResources"
                    rows={3}
                    placeholder="Roles and staffing needed"
                    className="min-h-[5rem] bg-background"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="task-financial-resources"
                    className="mb-1.5 block text-[9px] font-bold uppercase tracking-wide text-muted-foreground"
                  >
                    Financial resources required <span className="text-primary">*</span>
                  </label>
                  <Textarea
                    id="task-financial-resources"
                    name="taskFinancialResources"
                    rows={3}
                  placeholder="Budget and key cost items"
                    className="min-h-[5rem] bg-background"
                  />
                  <AiSuggestionBlock fieldId="task-financial-resources" minHeightClass="min-h-[4rem]" />
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="task-action-contribution-percentage"
                    className="mb-1.5 block text-[9px] font-bold uppercase tracking-wide text-muted-foreground"
                  >
                    Action contribution percentage <span className="text-primary">*</span>
                  </label>
                  <Input
                    id="task-action-contribution-percentage"
                    name="taskActionContributionPercentage"
                    placeholder="How much this action contributes overall"
                    className="h-9 bg-background"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="task-status" className="mb-1.5 block text-[9px] font-bold uppercase tracking-wide text-muted-foreground">
                    Status <span className="text-primary">*</span>
                  </label>
                  <input type="hidden" name="taskStatus" value={taskStatus} />
                  <Select value={taskStatus || undefined} onValueChange={setTaskStatus}>
                    <SelectTrigger id="task-status" className="w-full">
                      <SelectValue placeholder="Select status…" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Not started">Not started</SelectItem>
                      <SelectItem value="In progress">In progress</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="task-notes" className="mb-1.5 block text-[9px] font-bold uppercase tracking-wide text-muted-foreground">
                    Notes
                  </label>
                  <Textarea
                    id="task-notes"
                    name="taskNotes"
                    rows={4}
                    placeholder="Anything important for reviewers"
                    className="min-h-[6rem] bg-background"
                  />
                  <AiSuggestionBlock fieldId="task-notes" minHeightClass="min-h-[5rem]" />
                </div>
              </div>
            </fieldset>

            <div className="flex flex-col-reverse gap-3 border-t border-border pt-8 sm:flex-row sm:items-center sm:justify-end">
              <Link
                to={actionPlanHref}
                className="inline-flex items-center justify-center rounded-xl border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground shadow-sm ring-1 ring-border/60 transition hover:border-border hover:bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
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
