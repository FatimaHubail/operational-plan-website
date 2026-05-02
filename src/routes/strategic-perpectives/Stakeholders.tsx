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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { HorizontalRatioStack } from "@/components/ratio-bars"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ProposedByBlock } from "@/components/proposed-by"
import { achievementStatusLabel, achievementSubsectionCellClassName } from "@/lib/achievementClassification"

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
  proposedByName?: string
  proposedByDepartment?: string
  proposedBySubUnit?: string
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

type StakeholderSub = {
  label: string
  definition: string
  indicatorDescription: string
  owner: string
  targetValue: string
  achievement: AchievementMap
  operationalObjectives: OperationalObjective[]
}

type StakeholderItem = {
  title: string
  body: string
  subs?: StakeholderSub[]
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

export const stakeholdersData: Record<string, StakeholderItem> = {
  s1: {
    title: "S1 - Effective Partnerships to Enhance the University's position and role",
    body:
      "Indicators on active memoranda of understanding, contractual projects with international partners, and conferences and scientific activities hosted or organized by the University of Bahrain.",
    subs: [
      {
        label: "S1.1",
        definition: "Increase the number of Active MoUs to the total number",
        indicatorDescription:
          "This indicator measures the number of activated Memoranda of Understanding (MoUs).",
        owner: "Vice President Office for Partnerships & Development",
        targetValue: "80",
        achievement: { ...defaultAchievement },
        operationalObjectives: [
          {
            regulatoryEntity: "Executive Committee",
            objective: "Expand and maintain a healthy portfolio of active partnership MoUs",
            objectiveExecutionIndicator: "Ratio of active MoUs to total MoUs (annual census)",
            executionIndicatorDescription:
              "Track signing, renewal, and retirement of MoUs with clear activation criteria and partner accountability.",
            indicatorOwnerWithinEntity: "Director, Partnerships & Agreements",
            targetValue: "TBD",
            achievement: { ...defaultAchievement },
            objectiveStatus: "Didn't reach the target value",
            requestStatus: "Pending review",
            proposedByName: "Sara Al-Najjar",
            proposedByDepartment: "Vice President Office for Partnerships & Development",
            proposedBySubUnit: "Partnerships & Agreements Directorate",
          },
        ],
      },
      {
        label: "S1.2",
        definition:
          "Develop the number of contractual projects implemented with international entities.",
        indicatorDescription:
          "This indicator measures the number of projects implemented with international entities.",
        owner: "Vice President Office for Partnerships & Development",
        targetValue: "40",
        achievement: { ...defaultAchievement },
        operationalObjectives: [
          {
            regulatoryEntity: "University Board",
            objective: "Increase implemented international joint projects",
            objectiveExecutionIndicator: "Count of contractual projects with international entities completed or in progress",
            executionIndicatorDescription:
              "Standardize project intake, legal review, and reporting for cross-border collaborations.",
            indicatorOwnerWithinEntity: "Head, International Projects Office",
            targetValue: "TBD",
            achievement: { ...defaultAchievement },
            objectiveStatus: "Didn't reach the target value",
            requestStatus: "Pending review",
          },
        ],
      },
      {
        label: "S1.3",
        definition:
          "UOB's continuity to organize a number of conferences and scientific activities.",
        indicatorDescription:
          "This indicator measures the number of events, activities, seminars, and conferences organized by the University of Bahrain in collaboration with other entities.",
        owner: "Communications Directorate",
        targetValue: "2000",
        achievement: { ...defaultAchievement },
        operationalObjectives: [
          {
            regulatoryEntity: "Research Council",
            objective: "Sustain a pipeline of high-quality scientific events",
            objectiveExecutionIndicator: "Number of conferences and scientific activities organized per reporting year",
            executionIndicatorDescription:
              "Coordinate scheduling, sponsorship, and dissemination for institutional and joint scientific events.",
            indicatorOwnerWithinEntity: "Conferences & Scientific Events Lead",
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

function flattenObjectives(item: StakeholderItem) {
  return item.subs?.flatMap((sub) => sub.operationalObjectives) ?? []
}

export default function Stakeholders() {
  const location = useLocation()
  const routePrefix = location.pathname.startsWith("/contributor/") ? "/contributor" : ""
  const dashboardHref = location.pathname.startsWith("/contributor/") ? "/contributor/dashboard" : "/dashboard"
  const [stakeholderState, setStakeholderState] = useState(stakeholdersData)
  const [activeStakeholderKey, setActiveStakeholderKey] = useState<keyof typeof stakeholdersData>("s1")
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

  const activeStakeholder = stakeholderState[activeStakeholderKey]
  const activeSub = activeStakeholder.subs?.[currentSubIndex] ?? null
  const activeObjectives = activeSub?.operationalObjectives ?? []
  const selectedObjective =
    selectedObjectiveIndex !== null ? activeObjectives[selectedObjectiveIndex] ?? null : null

  const summary = useMemo(() => {
    const objectives = flattenObjectives(activeStakeholder)
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
  }, [activeStakeholder])

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

    setStakeholderState((prev) => {
      const updated = structuredClone(prev) as typeof prev
      const stakeholder = updated[activeStakeholderKey]
      const sub = stakeholder.subs?.[currentSubIndex]
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
    setStakeholderState((prev) => {
      const updated = structuredClone(prev) as typeof prev
      updated[activeStakeholderKey].subs?.[currentSubIndex].operationalObjectives.splice(objectiveIndex, 1)
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

    setStakeholderState((prev) => {
      const updated = structuredClone(prev) as typeof prev
      const objective =
        updated[activeStakeholderKey].subs?.[currentSubIndex].operationalObjectives[selectedObjectiveIndex]

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
              <BreadcrumbPage>Stakeholders</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="min-w-0 flex-1 overflow-x-hidden bg-background p-4 pt-0 sm:p-6 sm:pt-0 lg:p-8 lg:pt-0">
        <header className="mb-8 w-full min-w-0">
          <div className="mt-2 flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-6">
            <div
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary text-primary-foreground shadow-lg"
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
              <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Stakeholders</h1>
            </div>
          </div>
        </header>

        <section
          className="mb-8 overflow-hidden rounded-3xl border border-border/80 bg-primary shadow-lg ring-1 ring-primary/10"
          aria-labelledby="stakeholders-glance-heading"
        >
          <div className="relative flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-primary via-primary to-primary px-5 py-4 sm:px-6">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary-foreground/10 via-transparent to-transparent" aria-hidden="true" />
            <div className="relative">
              <h2 id="stakeholders-glance-heading" className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary-foreground/90">
                Overview
              </h2>
              <p className="mt-1 text-sm font-semibold text-primary-foreground">Stakeholder layer - 2026 operational plan</p>
            </div>
            <div className="relative flex flex-wrap items-center gap-3">
              <time
                className="rounded-lg bg-primary-foreground/15 px-3 py-1.5 text-xs font-semibold tabular-nums text-primary-foreground ring-1 ring-primary-foreground/30"
                dateTime="2026-03-28"
              >
                28 Mar 2026
              </time>
            </div>
          </div>
          <div className="grid divide-y divide-border/80 bg-gradient-to-b from-muted to-background sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-3">
            <div className="p-5 sm:p-6" role="group" aria-label="Stakeholder coverage">
              <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Stakeholder groups modeled</p>
              <p className="mt-2 flex items-baseline gap-2">
                <span className="text-4xl font-bold tabular-nums tracking-tight text-foreground">1</span>
                <span className="text-sm font-medium text-muted-foreground">S1</span>
              </p>
              <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-muted">
                <div className="h-full w-full rounded-full bg-gradient-to-r from-primary to-primary" />
              </div>
              <p className="mt-2 text-[11px] font-medium text-muted-foreground">Model coverage 100%</p>
            </div>
            <div className="p-5 sm:p-6" role="group" aria-label="Operational objectives">
              <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Operational objectives</p>
              <p className="mt-2 text-4xl font-bold tabular-nums tracking-tight text-foreground">
                {summary.objectiveCount}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">In the active strategic perspective</p>
            </div>
            <div className="p-5 sm:col-span-2 sm:p-6 lg:col-span-1" role="group" aria-label="Objective status in this perspective">
              <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Objective status</p>
              <div className="mt-3 h-2 w-full min-w-0 overflow-hidden rounded-full ring-1 ring-border/70">
                <HorizontalRatioStack
                  segments={[
                    { ratio: summary.counts.below, className: "fill-destructive", title: `Below target ${summary.counts.below}` },
                    { ratio: summary.counts.on_target, className: "fill-primary", title: `On target ${summary.counts.on_target}` },
                    { ratio: summary.counts.above, className: "fill-muted-foreground", title: `Above target ${summary.counts.above}` },
                  ]}
                  role="img"
                  aria-label={`Objective status: below ${summary.counts.below}, on target ${summary.counts.on_target}, above ${summary.counts.above}`}
                />
              </div>
              <div className="mt-2 flex flex-wrap gap-x-3 gap-y-0.5 text-[11px] text-muted-foreground">
                <span><span className="mr-1 inline-block h-2 w-2 rounded-sm bg-destructive align-middle" />Below target {summary.counts.below}</span>
                <span><span className="mr-1 inline-block h-2 w-2 rounded-sm bg-primary align-middle" />On target {summary.counts.on_target}</span>
                <span><span className="mr-1 inline-block h-2 w-2 rounded-sm bg-muted-foreground align-middle" />Above target {summary.counts.above}</span>
              </div>
              <p className="mt-2 text-[11px] text-muted-foreground">
                {summary.objectiveCount > 0
                  ? "Versus declared target value for each objective in this perspective."
                  : "No operational objectives in this perspective yet."}
              </p>
            </div>
          </div>
        </section>

        <div className="w-full min-w-0">
          <div
            className="overflow-hidden rounded-3xl bg-card shadow-lg ring-1 ring-border/60"
            aria-labelledby="stakeholders-nav-heading"
          >
            <div className="border-b border-border bg-gradient-to-r from-muted/90 via-background to-muted/30 px-6 py-4 sm:px-8 sm:py-5">
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground">Strategic perspective</p>
            </div>
            <div className="p-6 sm:p-8">
              <h2 id="stakeholders-nav-heading" className="sr-only">Stakeholder sections</h2>
              <nav className="mb-8" aria-label="Stakeholder items">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Select perspective</p>
                <div
                  role="tablist"
                  className="flex flex-wrap gap-1 rounded-2xl bg-muted/90 p-1.5 shadow-inner ring-1 ring-border/50"
                >
                  {Object.keys(stakeholderState).map((key) => {
                    const isActive = key === activeStakeholderKey
                    return (
                      <Button
                        key={key}
                        variant="ghost"
                        type="button"
                        role="tab"
                        aria-selected={isActive}
                        onClick={() => {
                          setActiveStakeholderKey(key as keyof typeof stakeholdersData)
                          setCurrentSubIndex(0)
                          setSelectedObjectiveIndex(null)
                        }}
                        className={`min-w-[3.25rem] rounded-xl px-4 py-2.5 text-sm font-semibold transition duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/45 focus-visible:ring-offset-2 ${
                          isActive
                            ? "bg-card text-primary shadow-md shadow-sm ring-1 ring-border/70"
                            : "text-muted-foreground hover:bg-card/80 hover:text-foreground hover:shadow-sm"
                        }`}
                      >
                        {key.toUpperCase()}
                      </Button>
                    )
                  })}
                </div>
              </nav>

              <article className="relative overflow-hidden rounded-2xl border border-primary/25 bg-gradient-to-br from-muted/90 via-background to-muted/40 p-5 shadow-inner ring-1 ring-border/40 sm:p-7">
                <div className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-primary/10 blur-3xl" aria-hidden="true" />
                <div className="pointer-events-none absolute -bottom-20 -left-16 h-48 w-48 rounded-full bg-muted/30 blur-3xl" aria-hidden="true" />
                <div className="relative">
                  <div className="flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-muted-foreground">Current perspective</p>
                      <h3 className="mt-1.5 text-lg font-bold leading-snug text-foreground sm:text-xl">
                        {activeStakeholder.title}
                      </h3>
                    </div>

                    {activeStakeholder.subs?.length ? (
                      <div className="w-full shrink-0 sm:w-auto sm:min-w-[13rem]">
                        <label htmlFor="stakeholder-sub" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          Sub-section
                        </label>
                        <Select
                          value={String(currentSubIndex)}
                          onValueChange={(value) => setCurrentSubIndex(Number(value))}
                        >
                          <SelectTrigger
                            id="stakeholder-sub"
                            className="w-full rounded-xl border-border/90 bg-card py-2.5 text-sm font-semibold shadow-sm"
                          >
                            <SelectValue placeholder="Sub-section" />
                          </SelectTrigger>
                          <SelectContent>
                            {activeStakeholder.subs.map((sub, index) => (
                              <SelectItem key={sub.label} value={String(index)}>
                                {sub.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    ) : null}
                  </div>

                  <div className="relative mt-6">
                    <p className="mb-3 text-xs font-bold uppercase tracking-wide text-muted-foreground">Key indicator</p>
                    {activeSub ? (
                      <div className="space-y-3 sm:space-y-4">
                        <div className="rounded-xl border border-white/60 bg-card/95 p-4 shadow-sm ring-1 ring-border/40">
                          <p className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">Indicator</p>
                          <div className="mt-1.5 text-sm text-foreground sm:text-base">
                            <span className="font-semibold text-primary">{activeSub.label}: </span>
                            {activeSub.definition}
                          </div>
                        </div>
                        <div className="rounded-xl border border-white/60 bg-card/95 p-4 shadow-sm ring-1 ring-border/40">
                          <p className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">Indicator Description</p>
                          <div className="mt-1.5 text-sm text-foreground sm:text-base">
                            {activeSub.indicatorDescription || "-"}
                          </div>
                        </div>
                        <div className="rounded-xl border border-white/60 bg-card/95 p-4 shadow-sm ring-1 ring-border/40">
                          <p className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">Indicator owner</p>
                          <div className="mt-1.5 text-sm text-foreground sm:text-base">{activeSub.owner}</div>
                        </div>
                        <div className="rounded-xl border border-white/60 bg-card/95 p-4 shadow-sm ring-1 ring-border/40">
                          <p className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">Target value</p>
                          <div className="mt-1.5 text-sm text-foreground sm:text-base">{activeSub.targetValue}</div>
                        </div>
                        <div className="rounded-xl border border-border bg-gradient-to-b from-background to-muted/30 p-4 shadow-sm ring-1 ring-border/40">
                          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                            <p className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">Achievement rate</p>
                            <Button
                              type="button"
                              onClick={() => openAchievementEditor("sub")}
                              className="shrink-0 rounded-lg border border-border bg-card px-2.5 py-1 text-xs font-semibold text-primary shadow-sm transition hover:border-border hover:bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
                            >
                              Edit achievement
                            </Button>
                          </div>
                          <div className="mt-2 grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3">
                            {achievementYears.map((year) => (
                              <div
                                key={year}
                                className={achievementSubsectionCellClassName(
                                  year,
                                  activeSub.achievement[year],
                                  activeSub.targetValue
                                )}
                                title={achievementStatusLabel(year, activeSub.achievement[year], activeSub.targetValue)}
                              >
                                <p className="text-[11px] font-semibold uppercase tracking-wide opacity-80">{year}</p>
                                <p className="mt-0.5 text-[10px] font-semibold leading-snug opacity-90">
                                  {achievementStatusLabel(year, activeSub.achievement[year], activeSub.targetValue)}
                                </p>
                                <p className="mt-1 text-sm font-bold sm:text-base">{activeSub.achievement[year]}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="rounded-2xl border border-border/60 bg-card/90 p-5 shadow-sm ring-1 ring-white/60 backdrop-blur-sm sm:p-6">
                        <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">{activeStakeholder.body}</p>
                      </div>
                    )}
                  </div>

                  {activeSub ? (
                    <section className="relative mt-8 overflow-hidden rounded-2xl border border-border/80 bg-card/80 p-5 shadow-md ring-1 ring-border/50 backdrop-blur-sm sm:p-6">
                      <div className="absolute left-0 top-0 h-full w-1 bg-primary" aria-hidden="true" />
                      <div className="pl-3 sm:pl-4">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                          <div className="flex items-start gap-3">
                            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md" aria-hidden="true">
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664v.75h-4.5M4.5 15.75v-2.25m0 0h15m-15 0H3m9.75 0H9m9.75 0H15"
                                />
                              </svg>
                            </span>
                            <div>
                              <h4 className="text-base font-bold text-foreground sm:text-lg">Operational objectives</h4>
                              <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                                Browse objectives in this sub-section and navigate to their supporting action plans
                              </p>
                            </div>
                          </div>
                          <Link
                            to={`${routePrefix}/stakeholders/add-objective`}
                            className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-xl border border-border bg-secondary px-4 py-2.5 text-sm font-semibold text-secondary-foreground shadow-sm transition hover:bg-secondary/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/45 focus-visible:ring-offset-2 sm:w-auto"
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
                                  <article className="group relative overflow-hidden rounded-2xl border border-border/80 bg-card p-4 shadow-md ring-1 ring-border/40 transition duration-300 hover:border-primary/30 hover:shadow-lg sm:p-5">
                                    <div className="relative">
                                      <header className="mb-4 flex items-start justify-between gap-3 border-b border-border pb-4">
                                        <div className="flex min-w-0 flex-1 items-start gap-3">
                                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary text-sm font-bold text-primary-foreground shadow-md">
                                            {index + 1}
                                          </span>
                                          <div className="min-w-0 flex-1 pt-0.5">
                                            <p className="text-[11px] font-bold text-muted-foreground">Objective {index + 1}</p>
                                            <h5 className="mt-0.5 line-clamp-2 text-sm font-bold text-foreground sm:text-base">
                                              {objective.objective || "-"}
                                            </h5>
                                          </div>
                                        </div>
                                        <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-xl border px-2.5 py-1.5 text-left text-[10px] font-semibold leading-snug shadow-sm ${getStatusClasses(objective.objectiveStatus)}`}>
                                          <span className="mt-0.5 h-1.5 w-1.5 shrink-0 self-start rounded-full bg-current opacity-70" />
                                          <span className="max-w-[11rem]">{objective.objectiveStatus}</span>
                                        </span>
                                      </header>

                                      <ProposedByBlock
                                        name={objective.proposedByName}
                                        department={objective.proposedByDepartment}
                                        subUnit={objective.proposedBySubUnit}
                                        className="mb-3"
                                      />

                                      <div className="space-y-2.5 sm:space-y-3">
                                        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                                          <span className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">Proposal status</span>
                                          <span className="inline-flex max-w-full items-center rounded-xl border border-border bg-gradient-to-b from-muted to-muted/60 px-2.5 py-1.5 text-[10px] font-semibold leading-snug text-foreground ring-1 ring-border/70">
                                            {objective.requestStatus}
                                          </span>
                                        </div>

                                        <div className="rounded-xl border border-border/50 bg-gradient-to-b from-muted to-background p-3 ring-1 ring-border sm:p-4">
                                          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                                            <p className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">Achievement rate</p>
                                            <Button
                                              type="button"
                                              variant="outline"
                                              onClick={() => {
                                                setSelectedObjectiveIndex(index)
                                                openAchievementEditor("objective")
                                              }}
                                              className="h-auto shrink-0 rounded-lg px-2.5 py-1 text-xs font-semibold text-primary"
                                            >
                                              Edit achievement
                                            </Button>
                                          </div>
                                          <div className="mt-2 grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3">
                                            {achievementYears.map((year) => (
                                              <div key={year} className="rounded-xl bg-card px-2.5 py-2.5 ring-1 ring-border/50 sm:px-3">
                                                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{year}</p>
                                                <p className="mt-1 text-sm font-bold text-foreground sm:text-base">
                                                  {objective.achievement[year]}
                                                </p>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      </div>

                                      <div className="mt-5 flex flex-wrap gap-2 border-t border-border pt-4">
                                        <Button
                                          type="button"
                                          variant="outline"
                                          onClick={() => openObjectiveDetails(index)}
                                          className="w-full rounded-xl px-4 py-2.5 text-sm font-semibold shadow-sm focus-visible:ring-offset-2 sm:w-auto"
                                        >
                                          View details
                                        </Button>
                                        <Button
                                          type="button"
                                          variant="destructive"
                                          onClick={() => deleteObjective(index)}
                                          className="w-full rounded-xl px-4 py-2.5 text-sm font-semibold shadow-sm focus-visible:ring-offset-2 sm:w-auto"
                                        >
                                          Delete objective
                                        </Button>
                                        <Link
                                          to={buildActionPlanHref("stakeholders", routePrefix)}
                                          state={
                                            {
                                              p: String(activeStakeholderKey),
                                              si: currentSubIndex,
                                              oi: index,
                                            } satisfies ActionPlanLocationState
                                          }
                                          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground no-underline shadow-md transition hover:bg-primary/90 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:w-auto"
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
                            <p className="rounded-xl border border-dashed border-border bg-muted/80 px-4 py-8 text-center text-sm text-muted-foreground">
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

      <Dialog
        open={isObjectiveModalOpen && selectedObjective != null}
        onOpenChange={(open) => {
          setIsObjectiveModalOpen(open)
          if (!open) setIsObjectiveEditing(false)
        }}
      >
        {selectedObjective ? (
        <DialogContent
          className="flex max-h-[min(90vh,42rem)] w-full max-w-[calc(100%-2rem)] flex-col gap-0 overflow-hidden rounded-2xl p-0 ring-1 ring-border/80 sm:max-w-lg"
          showCloseButton
        >
          <DialogHeader className="shrink-0 gap-0 border-b border-border bg-gradient-to-r from-muted/90 to-background px-5 py-4 text-left sm:px-6">
            <DialogTitle className="text-base font-bold sm:text-lg">Objective details</DialogTitle>
          </DialogHeader>
          <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4 sm:px-6 sm:py-5">
              {isObjectiveEditing ? (
                <div className="space-y-3">
                  {objectiveFieldConfigs.map(({ field, label, multiline }) => (
                    <label className="block" key={field}>
                      <span className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">{label}</span>
                      {multiline ? (
                        <Textarea
                          rows={3}
                          value={objectiveDraft[field]}
                          onChange={(event) =>
                            setObjectiveDraft((prev) => ({
                              ...prev,
                              [field]: event.target.value,
                            }))
                          }
                          className="mt-1 min-h-[4.5rem] text-sm shadow-sm"
                        />
                      ) : (
                        <Input
                          type="text"
                          value={objectiveDraft[field]}
                          onChange={(event) =>
                            setObjectiveDraft((prev) => ({
                              ...prev,
                              [field]: event.target.value,
                            }))
                          }
                          className="mt-1 h-auto min-h-9 w-full py-2 text-sm shadow-sm"
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
                      className="rounded-xl border border-border bg-muted/80 px-3 py-2.5 transition hover:border-border hover:bg-card sm:px-4"
                    >
                      <p className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">{label}</p>
                      <div className="mt-1 text-sm leading-relaxed text-foreground">{value || "-"}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="shrink-0 border-t border-border bg-muted/80 px-5 py-3 sm:px-6">
              {isObjectiveEditing ? (
                <div className="flex flex-wrap gap-2">
                  <Button type="button" onClick={saveObjectiveDetails} className="flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold shadow-md sm:flex-none sm:px-6">
                    Save
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setIsObjectiveEditing(false)} className="flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold shadow-sm sm:flex-none">
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button type="button" variant="outline" onClick={() => setIsObjectiveEditing(true)} className="w-full rounded-xl px-4 py-2.5 text-sm font-semibold shadow-sm sm:w-auto">
                  Edit details
                </Button>
              )}
            </div>
        </DialogContent>
        ) : null}
      </Dialog>

      <Dialog open={isAchievementModalOpen} onOpenChange={setIsAchievementModalOpen}>
        <DialogContent
          className="flex max-h-[min(90vh,32rem)] w-full max-w-[calc(100%-2rem)] flex-col gap-0 overflow-hidden rounded-2xl p-0 ring-1 ring-border/80 sm:max-w-md"
          showCloseButton
        >
          <DialogHeader className="shrink-0 gap-0 border-b border-border px-5 py-4 text-left sm:px-6">
            <DialogTitle>Edit achievement rate</DialogTitle>
          </DialogHeader>
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
                    <span className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">{year}</span>
                    <Input
                      type="text"
                      value={achievementDraft[year]}
                      onChange={(event) =>
                        setAchievementDraft((prev) => ({
                          ...prev,
                          [year]: event.target.value,
                        }))
                      }
                      className="mt-1 h-auto min-h-9 w-full py-2 text-sm shadow-sm"
                    />
                  </label>
                ))}
              </div>
              <div className="mt-5 flex flex-wrap gap-2 border-t border-border pt-4">
                <Button type="submit" className="flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold shadow-md sm:flex-none sm:px-6">
                  Save
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsAchievementModalOpen(false)} className="flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold shadow-sm sm:flex-none">
                  Cancel
                </Button>
              </div>
            </form>
        </DialogContent>
      </Dialog>
    </>
  )
}