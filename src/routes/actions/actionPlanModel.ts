export type ActionPlanTask = {
  name: string
  weight: string
  mainEntity: string
  supportingEntities: string
  humanResources: string
  financialResources: string
  startDate: string
  expectedEndDate: string
  performanceIndicators: string
  targetValue: string
  actualValueAchieved: string
  achievementPercentage: string
  actionContributionPercentage: string
  status: string
  requestStatus: string
  notes: string
}

export type ActionPlanAction = {
  title: string
  totalWeight: string
  totalAchievement?: string
  /** Owner who proposed this action (same shape as operational objectives). */
  proposedByName?: string
  proposedByDepartment?: string
  proposedBySubUnit?: string
  tasks: ActionPlanTask[]
}

export function newTaskTemplate(): ActionPlanTask {
  return {
    name: "New task",
    weight: "0%",
    mainEntity: "",
    supportingEntities: "",
    humanResources: "",
    financialResources: "",
    startDate: "",
    expectedEndDate: "",
    performanceIndicators: "",
    targetValue: "",
    actualValueAchieved: "",
    achievementPercentage: "",
    actionContributionPercentage: "",
    status: "Not started",
    requestStatus: "Pending review",
    notes: "",
  }
}

export const initialActionsData: ActionPlanAction[] = [
  {
    title: "Faculty KPI mapping and sign-off",
    totalWeight: "50%",
    proposedByName: "Ahmed Khalil",
    proposedByDepartment: "Office of Strategy & Planning",
    proposedBySubUnit: "Institutional KPI & Reporting Section",
    tasks: [
      {
        name: "Faculty workshop series",
        weight: "35%",
        mainEntity: "Office of Strategy & Planning",
        supportingEntities: "Academic Affairs · Deans Council · IT Analytics",
        humanResources: "2.0 FTE planners\n4 × faculty facilitators @ 0.2 FTE",
        financialResources: "USD 18,000\n(venues, materials, facilitation)",
        startDate: "2025-02-01",
        expectedEndDate: "2025-05-30",
        performanceIndicators: "• % faculties with approved KPI map\n• Workshop attendance rate vs target",
        targetValue: "100% faculties mapped\n≥ 90% session attendance",
        actualValueAchieved: "75% faculties (6/8)\n87% attendance",
        achievementPercentage: "82%",
        actionContributionPercentage: "40%",
        status: "In progress",
        requestStatus: "Accepted",
        notes:
          "Two faculties moved to Q3.\nDriver: overlapping external accreditation visit window.",
      },
      {
        name: "Template consolidation",
        weight: "15%",
        mainEntity: "Quality Assurance Office",
        supportingEntities: "Strategy & Planning",
        humanResources: "1 instructional designer\n1 data analyst",
        financialResources: "USD 4,500",
        startDate: "2025-03-01",
        expectedEndDate: "2025-04-15",
        performanceIndicators: "• Master template version\n• Controlled document register",
        targetValue: "Template v2.0 published",
        actualValueAchieved: "v1.9 in pilot (3 units)",
        achievementPercentage: "70%",
        actionContributionPercentage: "20%",
        status: "Not started",
        requestStatus: "Accepted",
        notes: "Legal review added ~3 weeks to freeze date.\nNew target: publish after sign-off.",
      },
    ],
  },
  {
    title: "National benchmark dashboard",
    totalWeight: "50%",
    proposedByName: "Sara Al-Najjar",
    proposedByDepartment: "Institutional Research",
    proposedBySubUnit: "Analytics & Benchmarking Unit",
    tasks: [
      {
        name: "Indicator definitions workshop",
        weight: "50%",
        mainEntity: "Institutional Research",
        supportingEntities: "Ministry liaison · External QA consultant",
        humanResources: "3 analysts\n1 project manager (0.5 FTE)",
        financialResources: "USD 22,000\n(consultancy + UAT cycles)",
        startDate: "2025-01-15",
        expectedEndDate: "2025-08-31",
        performanceIndicators: "• Indicator definitions signed\n• Dashboard UAT pass rate",
        targetValue: "12 definitions signed\nUAT ≥ 95%",
        actualValueAchieved: "9 definitions signed\nUAT 91%",
        achievementPercentage: "76%",
        actionContributionPercentage: "40%",
        status: "Completed",
        requestStatus: "Pending review",
        notes:
          "Pending: ministry feedback on 3 composite indicators.\nWorkshop 4 rescheduled once comments return.",
      },
    ],
  },
]

export function formatDate(iso: string): string {
  if (!iso || typeof iso !== "string") return iso != null && iso !== "" ? String(iso) : "—"
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (!m) return iso
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]))
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
}

export function normalizeStatus(s: string): string {
  return (s || "").toLowerCase()
}

export function taskStatusPillClass(status: string): string {
  const t = normalizeStatus(status)
  if (t.includes("not start")) return "bg-muted text-foreground ring-1 ring-border"
  if (t.includes("complete")) return "bg-primary text-primary-foreground ring-1 ring-border"
  return "bg-secondary text-secondary-foreground ring-1 ring-border"
}

export function sumTaskWeightsPercent(tasks: ActionPlanTask[]): string | null {
  if (!tasks?.length) return null
  let sum = 0
  let n = 0
  tasks.forEach((t) => {
    const m = (t.weight || "").match(/(\d+(?:\.\d+)?)/)
    if (m) {
      sum += parseFloat(m[1])
      n += 1
    }
  })
  if (n === 0) return null
  const rounded = Math.round(sum * 10) / 10
  return `${rounded % 1 === 0 ? Math.round(rounded) : rounded}%`
}

export function aggregateActionAchievementPercent(tasks: ActionPlanTask[]): string | null {
  if (!tasks?.length) return null
  let weightedSum = 0
  let weightSum = 0
  const achievements: number[] = []
  tasks.forEach((t) => {
    const wm = (t.weight || "").match(/(\d+(?:\.\d+)?)/)
    const am = (t.achievementPercentage || "").match(/(\d+(?:\.\d+)?)/)
    const w = wm ? parseFloat(wm[1]) : 0
    const a = am ? parseFloat(am[1]) : NaN
    if (!Number.isNaN(a)) {
      achievements.push(a)
      if (w > 0) {
        weightedSum += w * a
        weightSum += w
      }
    }
  })
  let v: number
  if (weightSum > 0) {
    v = Math.round((weightedSum / weightSum) * 10) / 10
  } else if (achievements.length) {
    v = Math.round((achievements.reduce((s, x) => s + x, 0) / achievements.length) * 10) / 10
  } else {
    return null
  }
  return `${v % 1 === 0 ? Math.round(v) : v}%`
}

export function parseISODate(iso: string): Date | null {
  if (!iso || typeof iso !== "string") return null
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (!m) return null
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]))
  return Number.isNaN(d.getTime()) ? null : d
}

export function taskBucket(status: string): "in_progress" | "completed" | "not_started" {
  const t = normalizeStatus(status)
  if (t.includes("not start")) return "not_started"
  if (t.includes("complete")) return "completed"
  return "in_progress"
}

export function flattenTasksFromActions(actions: ActionPlanAction[]): ActionPlanTask[] {
  const list: ActionPlanTask[] = []
  actions.forEach((action) => {
    ;(action.tasks || []).forEach((t) => list.push(t))
  })
  return list
}

export function computeObjectiveAchievementPercent(actions: ActionPlanAction[]): number | null {
  let totalW = 0
  let sum = 0
  actions.forEach((action) => {
    const wm = (action.totalWeight || "").match(/(\d+(?:\.\d+)?)/)
    const aw = wm ? parseFloat(wm[1]) : 0
    const achStr = aggregateActionAchievementPercent(action.tasks || [])
    if (aw <= 0 || !achStr) return
    const am = achStr.match(/(\d+(?:\.\d+)?)/)
    if (!am) return
    sum += aw * parseFloat(am[1])
    totalW += aw
  })
  if (totalW <= 0) return null
  return Math.round((sum / totalW) * 10) / 10
}

/** SVG rect fill classes (theme chart colors). */
export const CHART_SEGMENT_FILL = [
  "fill-chart-1",
  "fill-chart-2",
  "fill-chart-3",
  "fill-chart-4",
  "fill-chart-5",
] as const
/** Legend color swatches next to labels. */
export const CHART_LEGEND_BG = [
  "bg-chart-1",
  "bg-chart-2",
  "bg-chart-3",
  "bg-chart-4",
  "bg-chart-5",
] as const
/** Emphasis text matching chart index. */
export const CHART_LABEL_TEXT = [
  "text-chart-1",
  "text-chart-2",
  "text-chart-3",
  "text-chart-4",
  "text-chart-5",
] as const
