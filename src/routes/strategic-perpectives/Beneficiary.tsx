import { useMemo, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { buildActionPlanHref, type ActionPlanLocationState } from "@/lib/buildActionPlanHref"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { SidebarTrigger } from "@/components/ui/sidebar"

type AchievementMap = Record<string, string>

type OperationalObjective = {
  regulatoryEntity: string
  objective: string
  objectiveExecutionIndicator: string
  executionIndicatorDescription: string
  indicatorOwnerWithinEntity: string
  targetValue: string
  achievement: AchievementMap
  objectiveStatus: string
  requestStatus: string
}

type ObjectiveField = keyof Pick<
  OperationalObjective,
  | "regulatoryEntity"
  | "objective"
  | "objectiveExecutionIndicator"
  | "executionIndicatorDescription"
  | "indicatorOwnerWithinEntity"
  | "targetValue"
>

type BeneficiarySub = {
  label: string
  definition: string
  indicatorDescription: string
  owner: string
  targetValue: string
  achievement: AchievementMap
  operationalObjectives: OperationalObjective[]
}

type BeneficiaryItem = {
  title: string
  body: string
  subs?: BeneficiarySub[]
}

type ObjectiveFieldConfig = {
  field: ObjectiveField
  label: string
  multiline: boolean
}

const achievementYears = ["2023", "2024", "2025", "2026"] as const
const objectiveFieldConfigs: ObjectiveFieldConfig[] = [
  { field: "regulatoryEntity", label: "Regulatory entity", multiline: false },
  { field: "objective", label: "Operational objective", multiline: false },
  { field: "objectiveExecutionIndicator", label: "objective execution Indicator", multiline: true },
  { field: "executionIndicatorDescription", label: "execution Indicator description", multiline: true },
  { field: "indicatorOwnerWithinEntity", label: "Indicator owner within the entity", multiline: false },
  { field: "targetValue", label: "Target value", multiline: false },
]

const defaultAchievement = { "2023": "-", "2024": "-", "2025": "-", "2026": "-" } as const

export const beneficiariesData: Record<string, BeneficiaryItem> = {
  b1: {
    title: "B1 - Assure Integrated Learning Environment",
    body:
      "Indicators on satisfaction with academic counseling, student retention, satisfaction with the learning environment, and activities that build twenty-first century skills.",
    subs: [
      {
        label: "B1.1",
        definition:
          "Commitment to achieving an advanced rate of student satisfaction with Academic Counseling Services",
        indicatorDescription:
          "This indicator measures the percentage of student satisfaction with academic advising services, based on a survey of graduating students at the University of Bahrain.",
        owner: "Quality Assurance & Accreditation Center",
        targetValue: "85%",
        achievement: { ...defaultAchievement },
        operationalObjectives: [
          {
            regulatoryEntity: "Ministry of Higher Education",
            objective: "Improve counseling service quality and accessibility",
            objectiveExecutionIndicator: "Student satisfaction rate with academic counseling (survey-based)",
            executionIndicatorDescription:
              "Expand counseling capacity, response times, and follow-up against an agreed advanced benchmark.",
            indicatorOwnerWithinEntity: "Director, Student Counseling",
            targetValue: "TBD",
            achievement: { ...defaultAchievement },
            objectiveStatus: "Didn't reach the target value",
            requestStatus: "Pending review",
          },
        ],
      },
      {
        label: "B1.2",
        definition: "Improve the rate of student retention at the university.",
        indicatorDescription:
          "This indicator measures the percentage of students who completed their studies within the prescribed duration of their academic programs, out of the total number of students admitted to those programs in a given year.",
        owner: "Vice President Office for Academic Affairs",
        targetValue: "80%",
        achievement: { ...defaultAchievement },
        operationalObjectives: [
          {
            regulatoryEntity: "University Board",
            objective: "Raise retention through targeted student success interventions",
            objectiveExecutionIndicator: "Retention rate by cohort against the institutional target",
            executionIndicatorDescription:
              "Identify at-risk students early and deploy advising, tutoring, and financial/wellbeing support.",
            indicatorOwnerWithinEntity: "Director, Student Success",
            targetValue: "TBD",
            achievement: { ...defaultAchievement },
            objectiveStatus: "Didn't reach the target value",
            requestStatus: "Pending review",
          },
        ],
      },
      {
        label: "B1.3",
        definition:
          "Commitment to achieving an advanced rate of Student Satisfaction with the Learning Environment",
        indicatorDescription:
          "This indicator measures the percentage of student satisfaction with the learning environment, based on a survey of graduating students at the University of Bahrain.",
        owner: "Quality Assurance & Accreditation Center",
        targetValue: "85%",
        achievement: { ...defaultAchievement },
        operationalObjectives: [
          {
            regulatoryEntity: "Executive Committee",
            objective: "Enhance learning spaces and student-facing facilities",
            objectiveExecutionIndicator: "Student satisfaction index for the learning environment",
            executionIndicatorDescription:
              "Prioritize classroom upgrades, labs, libraries, and digital learning tools based on survey insights.",
            indicatorOwnerWithinEntity: "Campus Experience Lead",
            targetValue: "TBD",
            achievement: { ...defaultAchievement },
            objectiveStatus: "Didn't reach the target value",
            requestStatus: "Pending review",
          },
        ],
      },
      {
        label: "B1.4",
        definition: "Develop the number of activities that enhance students' twenty-first century skills.",
        indicatorDescription:
          "This indicator measures the number of activities in which students participate to develop 21st-century skills.",
        owner: "Vice President Office for Academic Affairs",
        targetValue: "250",
        achievement: { ...defaultAchievement },
        operationalObjectives: [
          {
            regulatoryEntity: "Accreditation & Quality Commission",
            objective: "Scale co-curricular and curricular twenty-first century skills programming",
            objectiveExecutionIndicator: "Count of approved activities mapped to institutional skills framework",
            executionIndicatorDescription:
              "Catalog workshops, competitions, and course-embedded modules; monitor participation and outcomes.",
            indicatorOwnerWithinEntity: "Skills Development Coordinator",
            targetValue: "TBD",
            achievement: { ...defaultAchievement },
            objectiveStatus: "Didn't reach the target value",
            requestStatus: "Pending review",
          },
        ],
      },
    ],
  },
}


function getStatusBucket(status: string) {
  const normalized = status.toLowerCase()
  if (normalized.includes("above")) return "above"
  if (normalized.includes("reached")) return "on_target"
  return "below"
}

function getStatusClasses(status: string) {
  const bucket = getStatusBucket(status)
  if (bucket === "above") {
    return "border-border bg-secondary text-secondary-foreground ring-1 ring-border/70"
  }
  if (bucket === "on_target") {
    return "border-border bg-muted text-foreground ring-1 ring-border/70"
  }
  return "border-border bg-accent text-accent-foreground ring-1 ring-border/70"
}

function flattenObjectives(item: BeneficiaryItem) {
  return item.subs?.flatMap((sub) => sub.operationalObjectives) ?? []
}

export default function Beneficiary() {
  const location = useLocation()
  const routePrefix = location.pathname.startsWith("/contributor/") ? "/contributor" : ""
  const dashboardHref = location.pathname.startsWith("/contributor/") ? "/contributor/dashboard" : "/dashboard"
  const [beneficiaryState, setBeneficiaryState] = useState(beneficiariesData)
  const [activeBeneficiaryKey, setActiveBeneficiaryKey] = useState<keyof typeof beneficiariesData>("b1")
  const [currentSubIndex, setCurrentSubIndex] = useState(0)
  const [selectedObjectiveIndex, setSelectedObjectiveIndex] = useState<number | null>(null)
  const [isObjectiveModalOpen, setIsObjectiveModalOpen] = useState(false)
  const [isObjectiveEditing, setIsObjectiveEditing] = useState(false)
  const [objectiveDraft, setObjectiveDraft] = useState<Record<ObjectiveField, string>>({
    regulatoryEntity: "",
    objective: "",
    objectiveExecutionIndicator: "",
    executionIndicatorDescription: "",
    indicatorOwnerWithinEntity: "",
    targetValue: "",
  })
  const [isAchievementModalOpen, setIsAchievementModalOpen] = useState(false)
  const [achievementEditTarget, setAchievementEditTarget] = useState<"sub" | "objective" | null>(null)
  const [achievementDraft, setAchievementDraft] = useState<AchievementMap>({
    "2023": "",
    "2024": "",
    "2025": "",
    "2026": "",
  })

  const activeBeneficiary = beneficiaryState[activeBeneficiaryKey]
  const activeSub = activeBeneficiary.subs?.[currentSubIndex] ?? null
  const activeObjectives = activeSub?.operationalObjectives ?? []
  const selectedObjective =
    selectedObjectiveIndex !== null ? activeObjectives[selectedObjectiveIndex] ?? null : null

  const summary = useMemo(() => {
    const objectives = flattenObjectives(activeBeneficiary)
    const counts = objectives.reduce(
      (acc, objective) => {
        acc[getStatusBucket(objective.objectiveStatus) as "below" | "on_target" | "above"] += 1
        return acc
      },
      { below: 0, on_target: 0, above: 0 },
    )

    return {
      objectiveCount: objectives.length,
      counts,
    }
  }, [activeBeneficiary])

  const openAchievementEditor = (target: "sub" | "objective") => {
    const source =
      target === "sub"
        ? activeSub?.achievement
        : selectedObjectiveIndex !== null
          ? activeObjectives[selectedObjectiveIndex]?.achievement
          : undefined

    if (!source) return

    setAchievementDraft({
      "2023": source["2023"] ?? "",
      "2024": source["2024"] ?? "",
      "2025": source["2025"] ?? "",
      "2026": source["2026"] ?? "",
    })
    setAchievementEditTarget(target)
    setIsAchievementModalOpen(true)
  }

  const saveAchievementDraft = () => {
    if (!achievementEditTarget) return

    setBeneficiaryState((prev) => {
      const updated = structuredClone(prev) as typeof prev
      const beneficiary = updated[activeBeneficiaryKey]
      const sub = beneficiary.subs?.[currentSubIndex]
      if (!sub) return prev

      if (achievementEditTarget === "sub") {
        sub.achievement = { ...achievementDraft }
      } else if (selectedObjectiveIndex !== null && sub.operationalObjectives[selectedObjectiveIndex]) {
        sub.operationalObjectives[selectedObjectiveIndex].achievement = { ...achievementDraft }
      }

      return updated
    })

    setIsAchievementModalOpen(false)
    setAchievementEditTarget(null)
  }

  const deleteObjective = (objectiveIndex: number) => {
    setBeneficiaryState((prev) => {
      const updated = structuredClone(prev) as typeof prev
      updated[activeBeneficiaryKey].subs?.[currentSubIndex].operationalObjectives.splice(objectiveIndex, 1)
      return updated
    })

    if (selectedObjectiveIndex === objectiveIndex) {
      setSelectedObjectiveIndex(null)
      setIsObjectiveModalOpen(false)
      setIsObjectiveEditing(false)
    }
  }

  const openObjectiveDetails = (objectiveIndex: number) => {
    const objective = activeObjectives[objectiveIndex]
    if (!objective) return

    setSelectedObjectiveIndex(objectiveIndex)
    setObjectiveDraft({
      regulatoryEntity: objective.regulatoryEntity,
      objective: objective.objective,
      objectiveExecutionIndicator: objective.objectiveExecutionIndicator,
      executionIndicatorDescription: objective.executionIndicatorDescription,
      indicatorOwnerWithinEntity: objective.indicatorOwnerWithinEntity,
      targetValue: objective.targetValue,
    })
    setIsObjectiveEditing(false)
    setIsObjectiveModalOpen(true)
  }

  const saveObjectiveDetails = () => {
    if (selectedObjectiveIndex === null) return

    setBeneficiaryState((prev) => {
      const updated = structuredClone(prev) as typeof prev
      const objective =
        updated[activeBeneficiaryKey].subs?.[currentSubIndex].operationalObjectives[selectedObjectiveIndex]

      if (!objective) return prev

      objective.regulatoryEntity = objectiveDraft.regulatoryEntity
      objective.objective = objectiveDraft.objective
      objective.objectiveExecutionIndicator = objectiveDraft.objectiveExecutionIndicator
      objective.executionIndicatorDescription = objectiveDraft.executionIndicatorDescription
      objective.indicatorOwnerWithinEntity = objectiveDraft.indicatorOwnerWithinEntity
      objective.targetValue = objectiveDraft.targetValue

      return updated
    })

    setIsObjectiveEditing(false)
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
              <BreadcrumbPage>Beneficiary</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="min-w-0 flex-1 overflow-x-hidden bg-background p-4 pt-0 sm:p-6 sm:pt-0 lg:p-8 lg:pt-0">
        <header className="mb-8 w-full min-w-0">
          <div className="mt-2 flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-6">
            <div
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 text-white shadow-lg shadow-orange-500/30"
              aria-hidden="true"
            >
              <svg className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
                />
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Beneficiary</h1>
            </div>
          </div>
        </header>

        <section
          className="mb-8 overflow-hidden rounded-3xl border border-slate-200/80 bg-slate-900 shadow-[0_12px_40px_rgba(0,0,0,0.06),0_4px_12px_rgba(0,0,0,0.04)] ring-1 ring-slate-900/10"
          aria-labelledby="beneficiaries-glance-heading"
        >
          <div className="relative flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-5 py-4 sm:px-6">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-orange-500/15 via-transparent to-transparent" aria-hidden="true" />
            <div className="relative">
              <h2 id="beneficiaries-glance-heading" className="text-[10px] font-bold uppercase tracking-[0.2em] text-orange-300/90">
                Overview
              </h2>
              <p className="mt-1 text-sm font-semibold text-white">Beneficiary layer - 2026 operational plan</p>
            </div>
            <div className="relative flex flex-wrap items-center gap-3">
              <time
                className="rounded-lg bg-orange-500/20 px-3 py-1.5 text-xs font-semibold tabular-nums text-orange-100 ring-1 ring-orange-400/30"
                dateTime="2026-03-28"
              >
                28 Mar 2026
              </time>
            </div>
          </div>
          <div className="grid divide-y divide-slate-200/80 bg-gradient-to-b from-slate-50 to-white sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-3">
            <div className="p-5 sm:p-6" role="group" aria-label="Beneficiary coverage">
              <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">Beneficiary groups modeled</p>
              <p className="mt-2 flex items-baseline gap-2">
                <span className="text-4xl font-bold tabular-nums tracking-tight text-slate-900">1</span>
                <span className="text-sm font-medium text-slate-500">B1</span>
              </p>
              <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-200">
                <div className="h-full rounded-full bg-gradient-to-r from-orange-400 to-orange-600" style={{ width: "100%" }} />
              </div>
              <p className="mt-2 text-[11px] font-medium text-slate-600">Model coverage 100%</p>
            </div>
            <div className="p-5 sm:p-6" role="group" aria-label="Operational objectives">
              <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">Operational objectives</p>
              <p className="mt-2 text-4xl font-bold tabular-nums tracking-tight text-slate-900">
                {summary.objectiveCount}
              </p>
              <p className="mt-1 text-xs text-slate-600">In the active strategic perspective</p>
            </div>
            <div className="p-5 sm:col-span-2 sm:p-6 lg:col-span-1" role="group" aria-label="Objective status in this perspective">
              <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">Objective status</p>
              <div className="mt-3 flex h-2 w-full min-w-0 overflow-hidden rounded-full ring-1 ring-slate-200/70">
                {summary.counts.below > 0 && <div className="bg-rose-400" style={{ flex: `${summary.counts.below} 1 0%` }} />}
                {summary.counts.on_target > 0 && <div className="bg-emerald-500" style={{ flex: `${summary.counts.on_target} 1 0%` }} />}
                {summary.counts.above > 0 && <div className="bg-sky-500" style={{ flex: `${summary.counts.above} 1 0%` }} />}
              </div>
              <div className="mt-2 flex flex-wrap gap-x-3 gap-y-0.5 text-[11px] text-slate-600">
                <span><span className="mr-1 inline-block h-2 w-2 rounded-sm bg-rose-400 align-middle" />Below target {summary.counts.below}</span>
                <span><span className="mr-1 inline-block h-2 w-2 rounded-sm bg-emerald-500 align-middle" />On target {summary.counts.on_target}</span>
                <span><span className="mr-1 inline-block h-2 w-2 rounded-sm bg-sky-500 align-middle" />Above target {summary.counts.above}</span>
              </div>
              <p className="mt-2 text-[11px] text-slate-500">
                {summary.objectiveCount > 0
                  ? "Versus declared target value for each objective in this perspective."
                  : "No operational objectives in this perspective yet."}
              </p>
            </div>
          </div>
        </section>

        <div className="w-full min-w-0">
          <div
            className="overflow-hidden rounded-3xl bg-white shadow-[0_12px_40px_rgba(0,0,0,0.06),0_4px_12px_rgba(0,0,0,0.04)] ring-1 ring-slate-200/60"
            aria-labelledby="beneficiaries-nav-heading"
          >
            <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50/90 via-white to-orange-50/30 px-6 py-4 sm:px-8 sm:py-5">
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">Strategic perspective</p>
            </div>
            <div className="p-6 sm:p-8">
              <h2 id="beneficiaries-nav-heading" className="sr-only">Beneficiary sections</h2>
              <nav className="mb-8" aria-label="Beneficiary items">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Select perspective</p>
                <div
                  role="tablist"
                  className="flex flex-wrap gap-1 rounded-2xl bg-slate-100/90 p-1.5 shadow-inner ring-1 ring-slate-200/50"
                >
                  {Object.keys(beneficiaryState).map((key) => {
                    const isActive = key === activeBeneficiaryKey
                    return (
                      <button
                        key={key}
                        type="button"
                        role="tab"
                        aria-selected={isActive}
                        onClick={() => {
                          setActiveBeneficiaryKey(key as keyof typeof beneficiariesData)
                          setCurrentSubIndex(0)
                          setSelectedObjectiveIndex(null)
                        }}
                        className={`min-w-[3.25rem] rounded-xl px-4 py-2.5 text-sm font-semibold transition duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/45 focus-visible:ring-offset-2 ${
                          isActive
                            ? "bg-white text-orange-600 shadow-md shadow-orange-500/10 ring-1 ring-slate-200/70"
                            : "text-slate-600 hover:bg-white/80 hover:text-slate-900 hover:shadow-sm"
                        }`}
                      >
                        {key.toUpperCase()}
                      </button>
                    )
                  })}
                </div>
              </nav>

              <article className="relative overflow-hidden rounded-2xl border border-orange-200/50 bg-gradient-to-br from-orange-50/90 via-white to-amber-50/40 p-5 shadow-inner ring-1 ring-orange-100/40 sm:p-7">
                <div className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-orange-300/15 blur-3xl" aria-hidden="true" />
                <div className="pointer-events-none absolute -bottom-20 -left-16 h-48 w-48 rounded-full bg-amber-200/20 blur-3xl" aria-hidden="true" />
                <div className="relative">
                  <div className="flex flex-col gap-4 border-b border-orange-200/40 pb-5 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-orange-800/60">Current perspective</p>
                      <h3 className="mt-1.5 text-lg font-bold leading-snug text-slate-900 sm:text-xl">
                        {activeBeneficiary.title}
                      </h3>
                    </div>

                    {activeBeneficiary.subs?.length ? (
                      <div className="w-full shrink-0 sm:w-auto sm:min-w-[13rem]">
                        <label htmlFor="beneficiary-sub" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                          Sub-section
                        </label>
                        <div className="relative">
                          <select
                            id="beneficiary-sub"
                            value={currentSubIndex}
                            onChange={(event) => setCurrentSubIndex(Number(event.target.value))}
                            className="w-full cursor-pointer appearance-none rounded-xl border border-slate-200/90 bg-white py-2.5 pl-3 pr-10 text-sm font-semibold text-slate-800 shadow-sm outline-none transition hover:border-orange-200 hover:shadow-md focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20"
                          >
                            {activeBeneficiary.subs.map((sub, index) => (
                              <option key={sub.label} value={index}>
                                {sub.label}
                              </option>
                            ))}
                          </select>
                          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                            </svg>
                          </span>
                        </div>
                      </div>
                    ) : null}
                  </div>

                  <div className="relative mt-6">
                    <p className="mb-3 text-xs font-bold uppercase tracking-wide text-orange-900/50">Key indicator</p>
                    {activeSub ? (
                      <div className="space-y-3 sm:space-y-4">
                        <div className="rounded-xl border border-white/60 bg-white/95 p-4 shadow-sm ring-1 ring-slate-200/40">
                          <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Indicator</p>
                          <div className="mt-1.5 text-sm text-slate-800 sm:text-base">
                            <span className="font-semibold text-orange-700">{activeSub.label}: </span>
                            {activeSub.definition}
                          </div>
                        </div>
                        <div className="rounded-xl border border-white/60 bg-white/95 p-4 shadow-sm ring-1 ring-slate-200/40">
                          <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Indicator Description</p>
                          <div className="mt-1.5 text-sm text-slate-800 sm:text-base">
                            {activeSub.indicatorDescription || "-"}
                          </div>
                        </div>
                        <div className="rounded-xl border border-white/60 bg-white/95 p-4 shadow-sm ring-1 ring-slate-200/40">
                          <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Indicator owner</p>
                          <div className="mt-1.5 text-sm text-slate-800 sm:text-base">{activeSub.owner}</div>
                        </div>
                        <div className="rounded-xl border border-white/60 bg-white/95 p-4 shadow-sm ring-1 ring-slate-200/40">
                          <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Target value</p>
                          <div className="mt-1.5 text-sm text-slate-800 sm:text-base">{activeSub.targetValue}</div>
                        </div>
                        <div className="rounded-xl border border-orange-100/60 bg-gradient-to-b from-white to-orange-50/30 p-4 shadow-sm ring-1 ring-slate-200/40">
                          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                            <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Achievement rate</p>
                            <button
                              type="button"
                              onClick={() => openAchievementEditor("sub")}
                              className="shrink-0 rounded-lg border border-orange-200/80 bg-white px-2.5 py-1 text-xs font-semibold text-orange-700 shadow-sm transition hover:border-orange-300 hover:bg-orange-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/40"
                            >
                              Edit achievement
                            </button>
                          </div>
                          <div className="mt-2 grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3">
                            {achievementYears.map((year) => (
                              <div key={year} className="rounded-xl bg-gradient-to-br from-orange-50 to-amber-50/50 px-3 py-2.5 ring-1 ring-orange-100/70">
                                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{year}</p>
                                <p className="mt-1 text-sm font-bold text-slate-900 sm:text-base">{activeSub.achievement[year]}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="rounded-2xl border border-slate-200/60 bg-white/90 p-5 shadow-sm ring-1 ring-white/60 backdrop-blur-sm sm:p-6">
                        <p className="text-sm leading-relaxed text-slate-600 sm:text-base">{activeBeneficiary.body}</p>
                      </div>
                    )}
                  </div>

                  {activeSub ? (
                    <section className="relative mt-8 overflow-hidden rounded-2xl border border-slate-200/80 bg-white/80 p-5 shadow-[0_8px_30px_rgba(0,0,0,0.04),0_2px_8px_rgba(0,0,0,0.03)] ring-1 ring-slate-200/50 backdrop-blur-sm sm:p-6">
                      <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-orange-400 to-amber-500" aria-hidden="true" />
                      <div className="pl-3 sm:pl-4">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                          <div className="flex items-start gap-3">
                            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white shadow-md" aria-hidden="true">
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664v.75h-4.5M4.5 15.75v-2.25m0 0h15m-15 0H3m9.75 0H9m9.75 0H15"
                                />
                              </svg>
                            </span>
                            <div>
                              <h4 className="text-base font-bold text-slate-900 sm:text-lg">Operational objectives</h4>
                              <p className="mt-0.5 text-xs leading-relaxed text-slate-500 sm:text-sm">
                                Browse objectives in this sub-section and navigate to their supporting action plans
                              </p>
                            </div>
                          </div>
                          <Link
                            to={`${routePrefix}/beneficiary/add-objective`}
                            className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-xl border border-orange-200 bg-orange-50/90 px-4 py-2.5 text-sm font-semibold text-orange-800 shadow-sm transition hover:border-orange-300 hover:bg-orange-100/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/45 focus-visible:ring-offset-2 sm:w-auto"
                          >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                            Add objective
                          </Link>
                        </div>

                        <div className="mt-5">
                          {activeObjectives.length ? (
                            <ul className="flex flex-col gap-5 sm:gap-6">
                              {activeObjectives.map((objective, index) => (
                                <li className="list-none" key={`${objective.objective}-${index}`}>
                                  <article className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_8px_30px_rgba(0,0,0,0.04),0_2px_8px_rgba(0,0,0,0.03)] ring-1 ring-slate-200/40 transition duration-300 hover:border-orange-200/60 hover:shadow-[0_12px_40px_rgba(0,0,0,0.06),0_4px_12px_rgba(0,0,0,0.04)] sm:p-5">
                                    <div className="relative">
                                      <header className="mb-4 flex items-start justify-between gap-3 border-b border-slate-100 pb-4">
                                        <div className="flex min-w-0 flex-1 items-start gap-3">
                                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 text-sm font-bold text-white shadow-md shadow-orange-500/25">
                                            {index + 1}
                                          </span>
                                          <div className="min-w-0 flex-1 pt-0.5">
                                            <p className="text-[11px] font-bold text-slate-600">Objective {index + 1}</p>
                                            <h5 className="mt-0.5 line-clamp-2 text-sm font-bold text-slate-900 sm:text-base">
                                              {objective.objective || "-"}
                                            </h5>
                                          </div>
                                        </div>
                                        <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-xl border px-2.5 py-1.5 text-left text-[10px] font-semibold leading-snug shadow-sm ${getStatusClasses(objective.objectiveStatus)}`}>
                                          <span className="mt-0.5 h-1.5 w-1.5 shrink-0 self-start rounded-full bg-current opacity-70" />
                                          <span className="max-w-[11rem]">{objective.objectiveStatus}</span>
                                        </span>
                                      </header>

                                      <div className="space-y-2.5 sm:space-y-3">
                                        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                                          <span className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Proposal status</span>
                                          <span className="inline-flex max-w-full items-center rounded-xl border border-amber-200/90 bg-gradient-to-b from-amber-50 to-amber-100/60 px-2.5 py-1.5 text-[10px] font-semibold leading-snug text-amber-950 ring-1 ring-amber-100/70">
                                            {objective.requestStatus}
                                          </span>
                                        </div>

                                        <div className="rounded-xl border border-slate-200/50 bg-gradient-to-b from-slate-50 to-white p-3 ring-1 ring-slate-100 sm:p-4">
                                          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                                            <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Achievement rate</p>
                                            <button
                                              type="button"
                                              onClick={() => {
                                                setSelectedObjectiveIndex(index)
                                                openAchievementEditor("objective")
                                              }}
                                              className="shrink-0 rounded-lg border border-orange-200/80 bg-white px-2.5 py-1 text-xs font-semibold text-orange-700 shadow-sm transition hover:border-orange-300 hover:bg-orange-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/40"
                                            >
                                              Edit achievement
                                            </button>
                                          </div>
                                          <div className="mt-2 grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3">
                                            {achievementYears.map((year) => (
                                              <div key={year} className="rounded-xl bg-white px-2.5 py-2.5 ring-1 ring-slate-200/50 sm:px-3">
                                                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{year}</p>
                                                <p className="mt-1 text-sm font-bold text-slate-900 sm:text-base">
                                                  {objective.achievement[year]}
                                                </p>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      </div>

                                      <div className="mt-5 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
                                        <button
                                          type="button"
                                          onClick={() => openObjectiveDetails(index)}
                                          className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/40 focus-visible:ring-offset-2 sm:w-auto"
                                        >
                                          View details
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => deleteObjective(index)}
                                          className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50/80 px-4 py-2.5 text-sm font-semibold text-rose-800 shadow-sm transition hover:border-rose-300 hover:bg-rose-100/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400/40 focus-visible:ring-offset-2 sm:w-auto"
                                        >
                                          Delete objective
                                        </button>
                                        <Link
                                          to={buildActionPlanHref("beneficiary", routePrefix)}
                                          state={
                                            {
                                              p: String(activeBeneficiaryKey),
                                              si: currentSubIndex,
                                              oi: index,
                                            } satisfies ActionPlanLocationState
                                          }
                                          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-2.5 text-sm font-semibold text-white no-underline shadow-md shadow-orange-500/25 transition hover:from-orange-600 hover:to-orange-700 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 sm:w-auto"
                                        >
                                          <span>Action plan</span>
                                          <svg className="h-4 w-4 shrink-0 opacity-95" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                          </svg>
                                        </Link>
                                      </div>
                                    </div>
                                  </article>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50/80 px-4 py-8 text-center text-sm text-slate-500">
                              No operational objectives are linked to this sub-section.
                            </p>
                          )}
                        </div>
                      </div>
                    </section>
                  ) : null}
                </div>
              </article>
            </div>
          </div>
        </div>
      </div>

      {isObjectiveModalOpen && selectedObjective ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6" role="dialog" aria-modal="true" aria-labelledby="objective-detail-modal-title">
          <button
            type="button"
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-[2px] transition hover:bg-slate-900/55"
            aria-label="Close objective details"
            onClick={() => setIsObjectiveModalOpen(false)}
          />
          <div className="relative z-10 flex max-h-[min(90vh,42rem)] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-[0_12px_40px_rgba(0,0,0,0.06),0_4px_12px_rgba(0,0,0,0.04)] ring-1 ring-slate-200/80">
            <div className="flex shrink-0 items-start justify-between gap-3 border-b border-slate-100 bg-gradient-to-r from-slate-50/90 to-white px-5 py-4 sm:px-6">
              <h2 id="objective-detail-modal-title" className="text-base font-bold text-slate-900 sm:text-lg">
                Objective details
              </h2>
              <button
                type="button"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/40"
                aria-label="Close"
                onClick={() => setIsObjectiveModalOpen(false)}
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4 sm:px-6 sm:py-5">
              {isObjectiveEditing ? (
                <div className="space-y-3">
                  {objectiveFieldConfigs.map(({ field, label, multiline }) => (
                    <label className="block" key={field}>
                      <span className="text-[11px] font-bold uppercase tracking-wide text-slate-500">{label}</span>
                      {multiline ? (
                        <textarea
                          rows={3}
                          value={objectiveDraft[field]}
                          onChange={(event) =>
                            setObjectiveDraft((prev) => ({
                              ...prev,
                              [field]: event.target.value,
                            }))
                          }
                          className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400/25"
                        />
                      ) : (
                        <input
                          type="text"
                          value={objectiveDraft[field]}
                          onChange={(event) =>
                            setObjectiveDraft((prev) => ({
                              ...prev,
                              [field]: event.target.value,
                            }))
                          }
                          className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400/25"
                        />
                      )}
                    </label>
                  ))}
                </div>
              ) : (
                <div className="space-y-2.5 sm:space-y-3">
                  {[
                    ["Regulatory entity", selectedObjective.regulatoryEntity],
                    ["Operational objective", selectedObjective.objective],
                    ["objective execution Indicator", selectedObjective.objectiveExecutionIndicator],
                    ["execution Indicator description", selectedObjective.executionIndicatorDescription],
                    ["Indicator owner within the entity", selectedObjective.indicatorOwnerWithinEntity],
                    ["Target value", selectedObjective.targetValue],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="rounded-xl border border-slate-100 bg-slate-50/80 px-3 py-2.5 transition hover:border-slate-200 hover:bg-white sm:px-4"
                    >
                      <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">{label}</p>
                      <div className="mt-1 text-sm leading-relaxed text-slate-800">{value || "-"}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="shrink-0 border-t border-slate-100 bg-slate-50/80 px-5 py-3 sm:px-6">
              {isObjectiveEditing ? (
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={saveObjectiveDetails}
                    className="inline-flex flex-1 items-center justify-center rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-orange-500/25 transition hover:from-orange-600 hover:to-orange-700 sm:flex-none sm:px-6"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsObjectiveEditing(false)}
                    className="inline-flex flex-1 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50 sm:flex-none"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsObjectiveEditing(true)}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/40 focus-visible:ring-offset-2 sm:w-auto"
                >
                  Edit details
                </button>
              )}
            </div>
          </div>
        </div>
      ) : null}

      {isAchievementModalOpen ? (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6" role="dialog" aria-modal="true" aria-labelledby="achievement-edit-modal-title">
          <button
            type="button"
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-[2px] transition hover:bg-slate-900/55"
            aria-label="Close achievement editor"
            onClick={() => setIsAchievementModalOpen(false)}
          />
          <div className="relative z-10 flex max-h-[min(90vh,32rem)] w-full max-w-md flex-col overflow-hidden rounded-2xl bg-white shadow-[0_12px_40px_rgba(0,0,0,0.06),0_4px_12px_rgba(0,0,0,0.04)] ring-1 ring-slate-200/80">
            <div className="flex shrink-0 items-start justify-between gap-3 border-b border-slate-100 px-5 py-4 sm:px-6">
              <h2 id="achievement-edit-modal-title" className="text-base font-bold text-slate-900">
                Edit achievement rate
              </h2>
              <button
                type="button"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/40"
                aria-label="Close"
                onClick={() => setIsAchievementModalOpen(false)}
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form
              className="flex min-h-0 flex-1 flex-col overflow-y-auto px-5 py-4 sm:px-6 sm:py-5"
              onSubmit={(event) => {
                event.preventDefault()
                saveAchievementDraft()
              }}
            >
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-2">
                {achievementYears.map((year) => (
                  <label className="block" key={year}>
                    <span className="text-[11px] font-bold uppercase tracking-wide text-slate-500">{year}</span>
                    <input
                      type="text"
                      value={achievementDraft[year]}
                      onChange={(event) =>
                        setAchievementDraft((prev) => ({
                          ...prev,
                          [year]: event.target.value,
                        }))
                      }
                      className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400/25"
                    />
                  </label>
                ))}
              </div>
              <div className="mt-5 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
                <button
                  type="submit"
                  className="inline-flex flex-1 items-center justify-center rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-orange-500/25 transition hover:from-orange-600 hover:to-orange-700 sm:flex-none sm:px-6"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setIsAchievementModalOpen(false)}
                  className="inline-flex flex-1 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50 sm:flex-none"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  )
}