import type { FormEvent } from "react"
import { Link, Navigate, useParams } from "react-router-dom"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { SidebarTrigger } from "@/components/ui/sidebar"

const PLAN_SECTIONS = ["catalysts", "enablers", "beneficiary", "stakeholders"] as const
type PlanSection = (typeof PLAN_SECTIONS)[number]

const SECTION_LABELS: Record<`/${PlanSection}`, string> = {
  "/catalysts": "Catalysts",
  "/enablers": "Enablers",
  "/beneficiary": "Beneficiary",
  "/stakeholders": "Stakeholders",
}

const achievementYears = ["2023", "2024", "2025", "2026"] as const

/** University regulatory / owning units for operational objectives */
const REGULATORY_ENTITIES = [
  "President's Office",
  "VP Office for Partnerships & Development",
  "VP Office for Academic Affairs",
  "General Director of Administrative Services Office",
  "Deanship of Graduate Studies & Scientific Research",
  "Deanship of Student Affairs",
  "Deanship of Admission & Registration",
  "University Rankings Committee",
  "Governance Committee (Policies & Procedures)",
  "Quality Assurance & Accreditation Center",
  "Business Incubator Center",
  "IT & Digital Learning Directorate",
  "English Language Center",
  "Media Center",
  "Community Service & Continuing Education Center",
  "Teaching Excellence & Leadership Unit",
  "Human Resources Directorate",
  "Public Relations & Media Directorate",
  "General Services Directorate",
  "Library & Information Services Directorate",
  "Security & Safety Directorate",
  "Finance & Budget Directorate",
  "Procurement Directorate",
  "Assets & Stores Directorate",
  "Buildings & Maintenance Directorate",
  "Alumni Affairs Directorate",
  "College of Arts",
  "College of Science",
  "College of Business Administration",
  "Bahrain Teachers College (BTC)",
  "College of Applied Studies",
  "College of Information Technology",
  "College of Law",
  "College of Health & Sport Sciences",
  "College of Engineering",
] as const

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

type AiFieldId = "oo-objective" | "oo-objective-execution-indicator" | "oo-execution-indicator-description"

function AiSuggestionBlock({ fieldId, minHeightClass }: { fieldId: AiFieldId; minHeightClass: string }) {
  const apply = () => {
    const body = document.querySelector<HTMLElement>(`.ai-suggestion-body[data-ai-for="${fieldId}"]`)
    const field = document.getElementById(fieldId) as HTMLInputElement | HTMLTextAreaElement | null
    if (!body || !field) return
    const text = (body.textContent || "").trim()
    if (!text || text.startsWith("Connect an assistant")) return
    field.value = text
    field.focus()
  }

  return (
    <div
      id={`ai-desc-${fieldId}`}
      className="mt-2 rounded-xl border border-violet-200/60 bg-gradient-to-br from-violet-50/90 to-white p-3 ring-1 ring-violet-100/50"
    >
      <div className="flex items-start gap-2.5">
        <span
          className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-violet-100 text-violet-600"
          aria-hidden="true"
        >
          <SparklesIcon className="h-4 w-4" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-wide text-violet-800/75">Suggested text</p>
          <p
            className={`ai-suggestion-body mt-1 text-xs leading-relaxed text-slate-500 italic ${minHeightClass}`}
            data-ai-for={fieldId}
          >
            Connect an assistant to show suggestions here.
          </p>
        </div>
      </div>
      <div className="mt-2 flex justify-end border-t border-violet-100/90 pt-2">
        <button
          type="button"
          disabled
          data-ai-apply={fieldId}
          onClick={apply}
          className="rounded-lg border border-violet-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-violet-900 shadow-sm transition hover:bg-violet-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Apply to field
        </button>
      </div>
    </div>
  )
}

export default function AddObjective() {
  const { planSection } = useParams<{ planSection: string }>()
  const isValidSection = (s: string | undefined): s is PlanSection =>
    !!s && (PLAN_SECTIONS as readonly string[]).includes(s)

  if (!isValidSection(planSection)) {
    return <Navigate to="/catalysts/add-objective" replace />
  }

  const parentPath = `/${planSection}` as keyof typeof SECTION_LABELS
  const parentLabel = SECTION_LABELS[parentPath] ?? "Planning"
  const cancelHref = parentPath

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
  }

  const inputClass =
    "w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20"

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <SidebarTrigger className="md:hidden" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link to="/dashboard" />}>Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link to={cancelHref} />}>{parentLabel}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Add operational objectives</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="min-w-0 flex-1 overflow-x-hidden bg-gradient-to-b from-slate-100 via-gray-50 to-orange-50/25 p-4 pt-0 sm:p-6 sm:pt-0 lg:p-8 lg:pt-0">
        <header className="mb-8 w-full min-w-0">
          <nav
            aria-label="Breadcrumb"
            className="mb-5 inline-flex flex-wrap items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm ring-1 ring-slate-200/70 backdrop-blur-sm sm:hidden sm:text-sm"
          >
            <Link to="/dashboard" className="text-orange-600 transition hover:text-orange-700">
              Dashboard
            </Link>
            <span className="text-slate-300" aria-hidden="true">
              /
            </span>
            <Link to={cancelHref} className="text-orange-600 transition hover:text-orange-700">
              {parentLabel}
            </Link>
            <span className="text-slate-300" aria-hidden="true">
              /
            </span>
            <span className="text-slate-800">Add operational objectives</span>
          </nav>
          <h1 className="mt-0 text-2xl font-bold tracking-tight text-slate-900 sm:mt-5 sm:text-3xl">Add operational objectives</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-600">
            Add one operational objective based on the selected strategic perspective. Each save creates a new objective
            with all required details and yearly targets (2023–2026).
          </p>
        </header>

        <div className="w-full min-w-0">
          <form
            id="add-oo-form"
            className="relative overflow-hidden rounded-3xl bg-white shadow-[0_12px_40px_rgba(0,0,0,0.06),0_4px_12px_rgba(0,0,0,0.04)] ring-1 ring-slate-200/60"
            onSubmit={onSubmit}
          >
            <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-orange-300/15 blur-3xl" aria-hidden="true" />
            <div className="pointer-events-none absolute -bottom-32 -left-20 h-56 w-56 rounded-full bg-amber-200/20 blur-3xl" aria-hidden="true" />

            <div className="relative border-b border-slate-100 bg-gradient-to-r from-slate-50/95 via-white to-orange-50/30 px-6 py-6 sm:px-10 sm:py-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-5">
                <div
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md shadow-orange-500/25 sm:h-14 sm:w-14"
                  aria-hidden="true"
                >
                  <svg className="h-6 w-6 sm:h-7 sm:w-7" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664v.75h-4.5M4.5 15.75v-2.25m0 0h15m-15 0H3m9.75 0H9m9.75 0H15"
                    />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-orange-800/60">New operational objective</p>
                </div>
              </div>
            </div>

            <div
              className="relative mx-6 mb-2 mt-4 rounded-2xl border border-violet-200/60 bg-gradient-to-r from-violet-50/80 to-white px-4 py-3.5 shadow-sm ring-1 ring-violet-100/50 sm:mx-10"
              role="note"
            >
              <div className="flex gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-600" aria-hidden="true">
                  <SparklesIcon className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-violet-950">Assistant-ready fields</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-slate-600">
                    AI-generated suggestions are provided to help you draft the objective and its indicators. Review and
                    edit the text as needed to ensure it fits your institution’s context.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative space-y-10 px-6 py-8 sm:px-10 sm:py-10">
              <fieldset className="min-w-0 space-y-4 border-0 p-0">
                <legend className="mb-1 text-[10px] font-bold uppercase tracking-[0.12em] text-orange-800/55">
                  Operational objective
                </legend>
                <p className="text-xs text-slate-500">
                  Fill in the required fields to define an operational objective
                </p>

                <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-x-4 sm:gap-y-5">
                  <div className="min-w-0 sm:col-span-2">
                    <label
                      htmlFor="oo-objective"
                      className="mb-1.5 flex flex-wrap items-center gap-x-2 text-[9px] font-bold uppercase tracking-wide text-slate-500"
                    >
                      <span>
                        Operational objective <span className="text-orange-600">*</span>
                      </span>
                      <span className="rounded bg-violet-100 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wide text-violet-800">
                        AI
                      </span>
                    </label>
                    <input
                      id="oo-objective"
                      name="objective"
                      type="text"
                      autoComplete="off"
                      required
                      placeholder="Short title to define the objective"
                      aria-describedby="ai-desc-oo-objective"
                      className={inputClass}
                    />
                    <AiSuggestionBlock fieldId="oo-objective" minHeightClass="min-h-[2.75rem]" />
                  </div>

                  <div className="min-w-0 sm:col-span-2">
                    <label htmlFor="oo-regulatory-entity" className="mb-1.5 block text-[9px] font-bold uppercase tracking-wide text-slate-500">
                      Regulatory entity <span className="text-orange-600">*</span>
                    </label>
                    <div className="relative">
                      <select
                        id="oo-regulatory-entity"
                        name="regulatoryEntity"
                        required
                        defaultValue=""
                        autoComplete="organization"
                        className="w-full cursor-pointer appearance-none rounded-lg border border-slate-200 bg-white py-2.5 pl-3 pr-10 text-sm font-medium text-slate-800 shadow-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="" disabled>
                          Select regulatory entity
                        </option>
                        {REGULATORY_ENTITIES.map((entity) => (
                          <option key={entity} value={entity}>
                            {entity}
                          </option>
                        ))}
                      </select>
                      <span
                        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                        aria-hidden="true"
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                        </svg>
                      </span>
                    </div>
                  </div>

                  <div className="min-w-0 sm:col-span-2">
                    <label htmlFor="oo-indicator-owner" className="mb-1.5 block text-[9px] font-bold uppercase tracking-wide text-slate-500">
                      Indicator owner within the entity <span className="text-orange-600">*</span>
                    </label>
                    <input
                      id="oo-indicator-owner"
                      name="indicatorOwnerWithinEntity"
                      type="text"
                      autoComplete="off"
                      required
                      placeholder="Internal role or unit accountable for the indicator"
                      className={inputClass}
                    />
                  </div>

                  <div className="min-w-0 sm:col-span-2">
                    <label
                      htmlFor="oo-objective-execution-indicator"
                      className="mb-1.5 flex flex-wrap items-center gap-x-2 text-[9px] font-bold uppercase tracking-wide text-slate-500"
                    >
                      <span>
                        objective execution Indicator <span className="text-orange-600">*</span>
                      </span>
                      <span className="rounded bg-violet-100 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wide text-violet-800">
                        AI
                      </span>
                    </label>
                    <textarea
                      id="oo-objective-execution-indicator"
                      name="objectiveExecutionIndicator"
                      rows={4}
                      autoComplete="off"
                      required
                      placeholder="KPI or measure used to judge execution"
                      aria-describedby="ai-desc-oo-objective-execution-indicator"
                      className="min-h-[5rem] w-full resize-y rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm leading-relaxed text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20"
                    />
                    <AiSuggestionBlock fieldId="oo-objective-execution-indicator" minHeightClass="min-h-[5rem]" />
                  </div>

                  <div className="min-w-0 sm:col-span-2">
                    <label
                      htmlFor="oo-execution-indicator-description"
                      className="mb-1.5 flex flex-wrap items-center gap-x-2 text-[9px] font-bold uppercase tracking-wide text-slate-500"
                    >
                      <span>
                        execution Indicator description <span className="text-orange-600">*</span>
                      </span>
                      <span className="rounded bg-violet-100 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wide text-violet-800">
                        AI
                      </span>
                    </label>
                    <textarea
                      id="oo-execution-indicator-description"
                      name="executionIndicatorDescription"
                      rows={5}
                      required
                      placeholder="How the indicator is applied, evidenced, or calculated"
                      aria-describedby="ai-desc-oo-execution-indicator-description"
                      className="min-h-[7rem] w-full resize-y rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm leading-relaxed text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20"
                    />
                    <AiSuggestionBlock fieldId="oo-execution-indicator-description" minHeightClass="min-h-[5rem]" />
                  </div>

                  <div className="min-w-0 rounded-lg border border-orange-100/90 bg-gradient-to-br from-orange-50/80 to-amber-50/50 p-3 ring-1 ring-orange-100/60 sm:col-span-2 sm:max-w-md">
                    <label htmlFor="oo-target-value" className="mb-1.5 block text-[9px] font-bold uppercase tracking-wide text-slate-500">
                      Target value <span className="text-orange-600">*</span>
                    </label>
                    <input
                      id="oo-target-value"
                      name="targetValue"
                      type="text"
                      autoComplete="off"
                      required
                      placeholder="Planned percentage or number the indicator must reach"
                      className="w-full rounded-md border border-orange-200/80 bg-white/90 px-3 py-2 text-sm font-semibold text-slate-800 outline-none transition placeholder:font-normal placeholder:text-slate-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20"
                    />
                  </div>
                </div>
              </fieldset>

              <fieldset className="min-w-0 space-y-4 border-0 border-t border-slate-100 p-0 pt-10">
                <legend className="mb-1 text-[10px] font-bold uppercase tracking-[0.12em] text-orange-800/55">Achievement rate</legend>
                <p className="text-xs text-slate-500">
                  <span className="font-medium text-slate-700">Achievement rate</span> is the objective’s recorded
                  performance or status for each calendar year (2023–2026) against its execution indicator.
                </p>

                <div className="rounded-xl border border-slate-200/50 bg-gradient-to-b from-slate-50 to-white p-4 ring-1 ring-slate-100 sm:p-5">
                  <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">By year</p>
                  <div className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3">
                    {achievementYears.map((year) => (
                      <div key={year} className="rounded-xl bg-white px-2.5 py-2.5 ring-1 ring-slate-200/50 sm:px-3">
                        <label htmlFor={`oo-ach-${year}`} className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                          {year}
                        </label>
                        <input
                          id={`oo-ach-${year}`}
                          name={`achievement_${year}`}
                          type="text"
                          autoComplete="off"
                          placeholder="—"
                          className="mt-1 w-full border-0 bg-transparent p-0 text-sm font-bold text-slate-900 outline-none placeholder:font-normal placeholder:text-slate-400 sm:text-base"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </fieldset>

              <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-8 sm:flex-row sm:items-center sm:justify-end sm:gap-3">
                <Link
                  to={cancelHref}
                  className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200/60 transition hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-orange-500/25 transition hover:from-orange-600 hover:to-orange-700 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 sm:w-auto"
                >
                  Save objective
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
