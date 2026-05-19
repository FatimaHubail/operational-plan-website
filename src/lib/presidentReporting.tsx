import { useMemo, type ReactNode } from "react"
import { Link, useLocation } from "react-router-dom"
import { getDashboardHref } from "@/lib/appRoutePrefix"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, type ChartConfig } from "@/components/ui/chart"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { UNIT_DEPARTMENT_OPTIONS_SORTED } from "@/lib/unitDepartmentOptions"
import { cn } from "@/lib/utils"

export type PerspectiveRow = {
  perspective: string
  objectives: number
  actions: number
  tasks: number
  indicators: number
  achievementPct: number
  budgetUsd: number
  belowTarget: number
  onTarget: number
  aboveTarget: number
}

export type DepartmentRow = {
  department: string
  objectives: number
  actions: number
  tasks: number
  budgetUsd: number
  avgAchievementPct: number
}

export type DepartmentPlanDetail = DepartmentRow & {
  perspective: string
  indicatorsMeasured: number
  indicatorsTotal: number
  belowTargetObj: number
  onTargetObj: number
  aboveTargetObj: number
}

export type IndicatorDetail = {
  name: string
  perspective: string
  department: string
  sectionCode: string
  subsectionCode: string
  target: string
  achievement: string
  band: "slow" | "good" | "excellent" | "achieved" | "notMeasured"
}

export type BudgetLineItem = {
  department: string
  perspective: string
  sectionCode: string
  subsectionCode: string
  allocatedUsd: number
  spentUsd: number
  actionsCount: number
  primaryUse: string
}

export const perspectives: PerspectiveRow[] = [
  {
    perspective: "Catalysts",
    objectives: 84,
    actions: 118,
    tasks: 241,
    indicators: 48,
    achievementPct: 78,
    budgetUsd: 1_240_000,
    belowTarget: 18,
    onTarget: 52,
    aboveTarget: 14,
  },
  {
    perspective: "Enablers",
    objectives: 72,
    actions: 96,
    tasks: 198,
    indicators: 44,
    achievementPct: 71,
    budgetUsd: 980_000,
    belowTarget: 22,
    onTarget: 38,
    aboveTarget: 12,
  },
  {
    perspective: "Beneficiary",
    objectives: 68,
    actions: 89,
    tasks: 176,
    indicators: 41,
    achievementPct: 69,
    budgetUsd: 860_000,
    belowTarget: 24,
    onTarget: 34,
    aboveTarget: 10,
  },
  {
    perspective: "Stakeholders",
    objectives: 88,
    actions: 125,
    tasks: 276,
    indicators: 53,
    achievementPct: 76,
    budgetUsd: 1_420_000,
    belowTarget: 16,
    onTarget: 58,
    aboveTarget: 14,
  },
]

export const topDepartments: DepartmentRow[] = [
  {
    department: "College of Engineering",
    objectives: 42,
    actions: 58,
    tasks: 124,
    budgetUsd: 620_000,
    avgAchievementPct: 82,
  },
  {
    department: "College of Science",
    objectives: 36,
    actions: 51,
    tasks: 108,
    budgetUsd: 485_000,
    avgAchievementPct: 78,
  },
  {
    department: "President's Office",
    objectives: 28,
    actions: 44,
    tasks: 96,
    budgetUsd: 410_000,
    avgAchievementPct: 81,
  },
  {
    department: "College of Business Administration",
    objectives: 31,
    actions: 47,
    tasks: 102,
    budgetUsd: 395_000,
    avgAchievementPct: 74,
  },
  {
    department: "IT & Digital Learning Directorate",
    objectives: 24,
    actions: 38,
    tasks: 88,
    budgetUsd: 360_000,
    avgAchievementPct: 69,
  },
  {
    department: "Finance & Budget Directorate",
    objectives: 18,
    actions: 26,
    tasks: 54,
    budgetUsd: 290_000,
    avgAchievementPct: 72,
  },
  {
    department: "Deanship of Student Affairs",
    objectives: 22,
    actions: 34,
    tasks: 71,
    budgetUsd: 275_000,
    avgAchievementPct: 67,
  },
]

export const departmentPlanDetails: DepartmentPlanDetail[] = [
  {
    department: "College of Engineering",
    perspective: "Catalysts",
    objectives: 42,
    actions: 58,
    tasks: 124,
    budgetUsd: 620_000,
    avgAchievementPct: 82,
    indicatorsMeasured: 22,
    indicatorsTotal: 24,
    belowTargetObj: 4,
    onTargetObj: 28,
    aboveTargetObj: 10,
  },
  {
    department: "College of Science",
    perspective: "Catalysts",
    objectives: 36,
    actions: 51,
    tasks: 108,
    budgetUsd: 485_000,
    avgAchievementPct: 78,
    indicatorsMeasured: 18,
    indicatorsTotal: 20,
    belowTargetObj: 6,
    onTargetObj: 24,
    aboveTargetObj: 6,
  },
  {
    department: "President's Office",
    perspective: "Enablers",
    objectives: 28,
    actions: 44,
    tasks: 96,
    budgetUsd: 410_000,
    avgAchievementPct: 81,
    indicatorsMeasured: 16,
    indicatorsTotal: 17,
    belowTargetObj: 3,
    onTargetObj: 20,
    aboveTargetObj: 5,
  },
  {
    department: "Deanship of Student Affairs",
    perspective: "Beneficiary",
    objectives: 22,
    actions: 34,
    tasks: 71,
    budgetUsd: 275_000,
    avgAchievementPct: 67,
    indicatorsMeasured: 14,
    indicatorsTotal: 18,
    belowTargetObj: 8,
    onTargetObj: 11,
    aboveTargetObj: 3,
  },
  {
    department: "Finance & Budget Directorate",
    perspective: "Stakeholders",
    objectives: 18,
    actions: 26,
    tasks: 54,
    budgetUsd: 290_000,
    avgAchievementPct: 72,
    indicatorsMeasured: 12,
    indicatorsTotal: 14,
    belowTargetObj: 5,
    onTargetObj: 10,
    aboveTargetObj: 3,
  },
]

export const indicatorDetails: IndicatorDetail[] = [
  {
    name: "Employer satisfaction index",
    perspective: "Catalysts",
    department: "College of Engineering",
    sectionCode: "C1",
    subsectionCode: "C1.2",
    target: "85%",
    achievement: "78%",
    band: "good",
  },
  {
    name: "Industry partnership agreements",
    perspective: "Catalysts",
    department: "College of Engineering",
    sectionCode: "C1",
    subsectionCode: "C1.4",
    target: "18",
    achievement: "16",
    band: "excellent",
  },
  {
    name: "Capstone project completion rate",
    perspective: "Catalysts",
    department: "College of Engineering",
    sectionCode: "C2",
    subsectionCode: "C2.1",
    target: "92%",
    achievement: "88%",
    band: "good",
  },
  {
    name: "Faculty development programme completion",
    perspective: "Enablers",
    department: "College of Engineering",
    sectionCode: "E1",
    subsectionCode: "E1.2",
    target: "95%",
    achievement: "91%",
    band: "excellent",
  },
  {
    name: "Research lab certification rate",
    perspective: "Enablers",
    department: "College of Engineering",
    sectionCode: "E2",
    subsectionCode: "E2.1",
    target: "100%",
    achievement: "98%",
    band: "good",
  },
  {
    name: "Digital learning tools rollout",
    perspective: "Enablers",
    department: "College of Engineering",
    sectionCode: "E3",
    subsectionCode: "E3.1",
    target: "80%",
    achievement: "74%",
    band: "good",
  },
  {
    name: "Industry placement rate",
    perspective: "Beneficiary",
    department: "College of Engineering",
    sectionCode: "B1",
    subsectionCode: "B1.3",
    target: "70%",
    achievement: "65%",
    band: "slow",
  },
  {
    name: "Student mentoring coverage",
    perspective: "Beneficiary",
    department: "College of Engineering",
    sectionCode: "B2",
    subsectionCode: "B2.1",
    target: "88%",
    achievement: "84%",
    band: "good",
  },
  {
    name: "Employer partnership events",
    perspective: "Stakeholders",
    department: "College of Engineering",
    sectionCode: "S1",
    subsectionCode: "S1.2",
    target: "12",
    achievement: "10",
    band: "good",
  },
  {
    name: "Alumni engagement index",
    perspective: "Stakeholders",
    department: "College of Engineering",
    sectionCode: "S2",
    subsectionCode: "S2.1",
    target: "75%",
    achievement: "72%",
    band: "good",
  },
  {
    name: "Graduate employment rate",
    perspective: "Catalysts",
    department: "College of Science",
    sectionCode: "C1",
    subsectionCode: "C1.1",
    target: "72%",
    achievement: "64%",
    band: "slow",
  },
  {
    name: "STEM enrollment growth",
    perspective: "Catalysts",
    department: "College of Science",
    sectionCode: "C3",
    subsectionCode: "C3.2",
    target: "8%",
    achievement: "9%",
    band: "achieved",
  },
  {
    name: "Graduate research funding secured",
    perspective: "Enablers",
    department: "College of Science",
    sectionCode: "E1",
    subsectionCode: "E1.1",
    target: "BD 2.4M",
    achievement: "BD 2.1M",
    band: "good",
  },
  {
    name: "Lab safety compliance rate",
    perspective: "Enablers",
    department: "College of Science",
    sectionCode: "E2",
    subsectionCode: "E2.2",
    target: "100%",
    achievement: "100%",
    band: "achieved",
  },
  {
    name: "Undergraduate research participation",
    perspective: "Beneficiary",
    department: "College of Science",
    sectionCode: "B1",
    subsectionCode: "B1.1",
    target: "45%",
    achievement: "41%",
    band: "slow",
  },
  {
    name: "Science outreach programme reach",
    perspective: "Stakeholders",
    department: "College of Science",
    sectionCode: "S1",
    subsectionCode: "S1.1",
    target: "3,000",
    achievement: "2,750",
    band: "good",
  },
  {
    name: "Student satisfaction (programs)",
    perspective: "Beneficiary",
    department: "Deanship of Student Affairs",
    sectionCode: "B1",
    subsectionCode: "B1.3",
    target: "80%",
    achievement: "76%",
    band: "good",
  },
  {
    name: "Advising sessions delivered",
    perspective: "Beneficiary",
    department: "Deanship of Student Affairs",
    sectionCode: "B2",
    subsectionCode: "B2.1",
    target: "1,200",
    achievement: "1,050",
    band: "slow",
  },
  {
    name: "Research output index",
    perspective: "Enablers",
    department: "President's Office",
    sectionCode: "E1",
    subsectionCode: "E1.2",
    target: "12 publications",
    achievement: "11 publications",
    band: "excellent",
  },
  {
    name: "Benchmarking cycle completion",
    perspective: "Enablers",
    department: "President's Office",
    sectionCode: "E2",
    subsectionCode: "E2.1",
    target: "100%",
    achievement: "100%",
    band: "achieved",
  },
  {
    name: "Digital service adoption",
    perspective: "Enablers",
    department: "IT & Digital Learning Directorate",
    sectionCode: "E3",
    subsectionCode: "E3.1",
    target: "90%",
    achievement: "—",
    band: "notMeasured",
  },
  {
    name: "Platform uptime (core systems)",
    perspective: "Enablers",
    department: "IT & Digital Learning Directorate",
    sectionCode: "E3",
    subsectionCode: "E3.4",
    target: "99.5%",
    achievement: "99.7%",
    band: "achieved",
  },
  {
    name: "Community engagement events",
    perspective: "Stakeholders",
    department: "Finance & Budget Directorate",
    sectionCode: "S1",
    subsectionCode: "S1.2",
    target: "24 events",
    achievement: "24 events",
    band: "achieved",
  },
  {
    name: "Stakeholder forum attendance",
    perspective: "Stakeholders",
    department: "Finance & Budget Directorate",
    sectionCode: "S2",
    subsectionCode: "S2.1",
    target: "320",
    achievement: "285",
    band: "good",
  },
]

export const indicatorDepartments = UNIT_DEPARTMENT_OPTIONS_SORTED

export const budgetLineItems: BudgetLineItem[] = [
  {
    department: "College of Engineering",
    perspective: "Catalysts",
    sectionCode: "C1",
    subsectionCode: "C1.2",
    allocatedUsd: 320_000,
    spentUsd: 218_000,
    actionsCount: 28,
    primaryUse: "Workshops, faculty facilitation, KPI mapping",
  },
  {
    department: "College of Engineering",
    perspective: "Catalysts",
    sectionCode: "C1",
    subsectionCode: "C1.4",
    allocatedUsd: 180_000,
    spentUsd: 112_000,
    actionsCount: 18,
    primaryUse: "Industry partnership agreements",
  },
  {
    department: "College of Engineering",
    perspective: "Catalysts",
    sectionCode: "C2",
    subsectionCode: "C2.1",
    allocatedUsd: 120_000,
    spentUsd: 82_000,
    actionsCount: 12,
    primaryUse: "Capstone project delivery",
  },
  {
    department: "College of Science",
    perspective: "Catalysts",
    sectionCode: "C1",
    subsectionCode: "C1.1",
    allocatedUsd: 285_000,
    spentUsd: 192_000,
    actionsCount: 32,
    primaryUse: "Lab upgrades, graduate tracking systems",
  },
  {
    department: "College of Science",
    perspective: "Catalysts",
    sectionCode: "C3",
    subsectionCode: "C3.2",
    allocatedUsd: 200_000,
    spentUsd: 126_000,
    actionsCount: 19,
    primaryUse: "STEM enrollment initiatives",
  },
  {
    department: "President's Office",
    perspective: "Enablers",
    sectionCode: "E1",
    subsectionCode: "E1.2",
    allocatedUsd: 240_000,
    spentUsd: 158_000,
    actionsCount: 24,
    primaryUse: "Benchmarking consultancy, dashboard UAT",
  },
  {
    department: "President's Office",
    perspective: "Enablers",
    sectionCode: "E2",
    subsectionCode: "E2.1",
    allocatedUsd: 170_000,
    spentUsd: 107_000,
    actionsCount: 20,
    primaryUse: "Annual benchmarking cycle",
  },
  {
    department: "IT & Digital Learning Directorate",
    perspective: "Enablers",
    sectionCode: "E3",
    subsectionCode: "E3.1",
    allocatedUsd: 210_000,
    spentUsd: 118_000,
    actionsCount: 22,
    primaryUse: "Platform licenses, integration sprints",
  },
  {
    department: "IT & Digital Learning Directorate",
    perspective: "Enablers",
    sectionCode: "E3",
    subsectionCode: "E3.4",
    allocatedUsd: 150_000,
    spentUsd: 80_000,
    actionsCount: 16,
    primaryUse: "Core systems uptime programme",
  },
  {
    department: "Deanship of Student Affairs",
    perspective: "Beneficiary",
    sectionCode: "B1",
    subsectionCode: "B1.3",
    allocatedUsd: 165_000,
    spentUsd: 98_000,
    actionsCount: 20,
    primaryUse: "Advising programs, wellbeing support",
  },
  {
    department: "Deanship of Student Affairs",
    perspective: "Beneficiary",
    sectionCode: "B2",
    subsectionCode: "B2.1",
    allocatedUsd: 110_000,
    spentUsd: 58_000,
    actionsCount: 14,
    primaryUse: "Student advising sessions",
  },
  {
    department: "Finance & Budget Directorate",
    perspective: "Stakeholders",
    sectionCode: "S1",
    subsectionCode: "S1.2",
    allocatedUsd: 175_000,
    spentUsd: 108_000,
    actionsCount: 15,
    primaryUse: "Stakeholder forums, reporting cycles",
  },
  {
    department: "Finance & Budget Directorate",
    perspective: "Stakeholders",
    sectionCode: "S2",
    subsectionCode: "S2.1",
    allocatedUsd: 115_000,
    spentUsd: 66_000,
    actionsCount: 11,
    primaryUse: "Community engagement events",
  },
]

export const budgetDepartments = UNIT_DEPARTMENT_OPTIONS_SORTED

export const indicatorBandCounts = {
  notMeasured: 18,
  slow: 42,
  good: 58,
  excellent: 51,
  achieved: 35,
}

export const actionStatusCounts = [
  { status: "notStarted", label: "Not started", count: 98 },
  { status: "inProgress", label: "In progress", count: 195 },
  { status: "completed", label: "Completed", count: 135 },
]

export const taskStatusCounts = [
  { status: "notStarted", label: "Not started", count: 312 },
  { status: "inProgress", label: "In progress", count: 421 },
  { status: "completed", label: "Completed", count: 158 },
]

export const achievementTrendData = [
  { quarter: "Q1 2025", rate: 68 },
  { quarter: "Q2 2025", rate: 72 },
  { quarter: "Q3 2025", rate: 79 },
  { quarter: "Q4 2025", rate: 81 },
  { quarter: "Q1 2026", rate: 74 },
]

export const perspectivePlanChartConfig = {
  objectives: { label: "Objectives", color: "var(--proposal-stat-fill-objectives)" },
  actions: { label: "Actions", color: "var(--proposal-stat-fill-actions)" },
  tasks: { label: "Tasks", color: "var(--proposal-stat-fill-tasks)" },
} satisfies ChartConfig

/** Stacked segment colors aligned with `perspectivePlanChartConfig` (objectives / actions / tasks). */
export const objectiveTargetChartConfig = {
  belowTarget: { label: "Below target", color: "var(--proposal-stat-fill-objectives)" },
  onTarget: { label: "On target", color: "var(--proposal-stat-fill-actions)" },
  aboveTarget: { label: "Above target", color: "var(--proposal-stat-fill-tasks)" },
} satisfies ChartConfig

/** Pie segment colors aligned with `perspectivePlanChartConfig` (objectives → actions → tasks). */
export const indicatorBandChartConfig = {
  notMeasured: { label: "Not measured", color: "var(--proposal-stat-fill-objectives)" },
  slow: { label: "Slow progress", color: "var(--proposal-stat-fill-slow)" },
  good: { label: "Good progress", color: "var(--proposal-stat-fill-actions)" },
  excellent: { label: "Excellent progress", color: "var(--proposal-stat-fill-excellent)" },
  achieved: { label: "Achieved", color: "var(--proposal-stat-fill-tasks)" },
} satisfies ChartConfig

export const actionStatusChartConfig = {
  count: { label: "Actions", color: "var(--chart-4)" },
  notStarted: { label: "Not started", color: "var(--chart-5)" },
  inProgress: { label: "In progress", color: "var(--chart-4)" },
  completed: { label: "Completed", color: "var(--chart-2)" },
} satisfies ChartConfig

/** Bar colors aligned with `perspectivePlanChartConfig` (objectives → actions → tasks). */
export const taskStatusChartConfig = {
  count: { label: "Tasks", color: "var(--proposal-stat-fill-tasks)" },
  notStarted: { label: "Not started", color: "var(--proposal-stat-fill-objectives)" },
  inProgress: { label: "In progress", color: "var(--proposal-stat-fill-actions)" },
  completed: { label: "Completed", color: "var(--proposal-stat-fill-tasks)" },
} satisfies ChartConfig

/** Bar hues aligned with indicator achievement bands (Plans overview pie). */
export const budgetPerspectiveIndicatorBand = {
  Catalysts: "notMeasured",
  Enablers: "slow",
  Beneficiary: "good",
  Stakeholders: "achieved",
} as const

export function budgetPerspectiveBarFill(perspective: string) {
  const band =
    budgetPerspectiveIndicatorBand[perspective as keyof typeof budgetPerspectiveIndicatorBand]
  return band
    ? indicatorBandChartConfig[band].color
    : indicatorBandChartConfig.notMeasured.color
}

export const budgetChartConfig = {
  budgetK: { label: "Budget (BD k)", color: indicatorBandChartConfig.good.color },
  Catalysts: { label: "Catalysts", color: indicatorBandChartConfig.notMeasured.color },
  Enablers: { label: "Enablers", color: indicatorBandChartConfig.slow.color },
  Beneficiary: { label: "Beneficiary", color: indicatorBandChartConfig.good.color },
  Stakeholders: { label: "Stakeholders", color: indicatorBandChartConfig.achieved.color },
} satisfies ChartConfig

export const achievementTrendChartConfig = {
  rate: { label: "Achievement rate", color: "var(--primary)" },
} satisfies ChartConfig

export const CHART_BAR = { width: 560, height: 280 } as const
export const CHART_LINE = { width: 720, height: 280 } as const
export const CHART_PIE = { width: 260, height: 260 } as const

export function sum(nums: number[]) {
  return nums.reduce((a, b) => a + b, 0)
}

export function pct(part: number, whole: number) {
  if (whole <= 0) return 0
  return Math.round((part / whole) * 1000) / 10
}

export function formatBd(amount: number) {
  return `BD ${new Intl.NumberFormat("en-BH", { maximumFractionDigits: 0 }).format(amount)}`
}

export function formatBdCompact(amount: number) {
  if (amount >= 1_000_000) return `BD ${(amount / 1_000_000).toFixed(2)}M`
  if (amount >= 1_000) return `BD ${Math.round(amount / 1_000)}k`
  return formatBd(amount)
}

/** @deprecated Use formatBd */
export const formatUsd = formatBd

/** @deprecated Use formatBdCompact */
export const formatUsdCompact = formatBdCompact

import {
  achievementPctNumClass,
  indicatorBandBadgeClass,
  indicatorBandNumClass,
  PLAN_ITEM,
} from "@/lib/proposalStatPalette"

export { achievementPctNumClass, indicatorBandBadgeClass, indicatorBandNumClass, PLAN_ITEM }

/** @deprecated Use indicatorBandNumClass */
export function bandCountValueClass(band: IndicatorDetail["band"] | string) {
  return indicatorBandNumClass(band)
}

export function bandLabel(band: IndicatorDetail["band"]) {
  switch (band) {
    case "slow":
      return "Slow progress"
    case "good":
      return "Good progress"
    case "excellent":
      return "Excellent progress"
    case "achieved":
      return "Achieved"
    default:
      return "Not measured"
  }
}

export function usePresidentMetrics() {
  return useMemo(() => {
    const totalObjectives = sum(perspectives.map((p) => p.objectives))
    const totalActions = sum(perspectives.map((p) => p.actions))
    const totalTasks = sum(perspectives.map((p) => p.tasks))
    const totalIndicators = sum(perspectives.map((p) => p.indicators))
    const totalBudget = sum(perspectives.map((p) => p.budgetUsd))
    const totalSpent = sum(budgetLineItems.map((b) => b.spentUsd))
    const belowTarget = sum(perspectives.map((p) => p.belowTarget))
    const onTarget = sum(perspectives.map((p) => p.onTarget))
    const aboveTarget = sum(perspectives.map((p) => p.aboveTarget))
    const totalObjectiveStatuses = belowTarget + onTarget + aboveTarget
    const indicatorTotal = sum(Object.values(indicatorBandCounts))
    const actionTotal = sum(actionStatusCounts.map((a) => a.count))
    const taskTotal = sum(taskStatusCounts.map((t) => t.count))
    const weightedAchievement =
      sum(perspectives.map((p) => p.achievementPct * p.indicators)) / Math.max(totalIndicators, 1)
    const avgTasksPerAction = totalTasks / Math.max(totalActions, 1)
    const avgActionsPerObjective = totalActions / Math.max(totalObjectives, 1)
    const avgBudgetPerAction = totalBudget / Math.max(totalActions, 1)
    const actionCompletionRate = pct(
      actionStatusCounts.find((a) => a.status === "completed")?.count ?? 0,
      actionTotal,
    )
    const taskCompletionRate = pct(
      taskStatusCounts.find((t) => t.status === "completed")?.count ?? 0,
      taskTotal,
    )
    const onTargetRate = pct(onTarget, totalObjectiveStatuses)
    const budgetUtilization = pct(totalSpent, totalBudget)

    const perspectivePlanData = perspectives.map((p) => ({
      perspective: p.perspective,
      objectives: p.objectives,
      actions: p.actions,
      tasks: p.tasks,
    }))

    const objectiveTargetData = perspectives.map((p) => ({
      perspective: p.perspective,
      belowTarget: p.belowTarget,
      onTarget: p.onTarget,
      aboveTarget: p.aboveTarget,
    }))

    const indicatorBandData = (
      Object.entries(indicatorBandCounts) as [keyof typeof indicatorBandCounts, number][]
    ).map(([band, count]) => ({ band, count }))

    const budgetByPerspective = perspectives.map((p) => ({
      perspective: p.perspective,
      budgetK: Math.round(p.budgetUsd / 1000),
      budgetUsd: p.budgetUsd,
    }))

    const matrixRows = perspectives.map((p) => ({
      ...p,
      budgetShare: pct(p.budgetUsd, totalBudget),
      tasksPerAction: (p.tasks / Math.max(p.actions, 1)).toFixed(1),
      actionsPerObjective: (p.actions / Math.max(p.objectives, 1)).toFixed(1),
    }))

    const departmentScores = topDepartments
      .map((d) => ({
        ...d,
        contributionScore: d.objectives * 2 + d.actions + d.tasks * 0.25 + d.avgAchievementPct,
      }))
      .sort((a, b) => b.contributionScore - a.contributionScore)

    return {
      totalObjectives,
      totalActions,
      totalTasks,
      totalIndicators,
      totalBudget,
      totalSpent,
      belowTarget,
      onTarget,
      aboveTarget,
      indicatorTotal,
      actionTotal,
      taskTotal,
      weightedAchievement,
      avgTasksPerAction,
      avgActionsPerObjective,
      avgBudgetPerAction,
      actionCompletionRate,
      taskCompletionRate,
      onTargetRate,
      budgetUtilization,
      perspectivePlanData,
      objectiveTargetData,
      indicatorBandData,
      budgetByPerspective,
      matrixRows,
      departmentScores,
    }
  }, [])
}

export function ReportChart({
  config,
  dimension,
  className,
  children,
}: {
  config: ChartConfig
  dimension: { width: number; height: number }
  className?: string
  children: ReactNode
}) {
  return (
    <ChartContainer
      config={config}
      initialDimension={dimension}
      className={cn(
        "w-full min-w-0 [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-wrapper]:outline-none",
        className,
      )}
    >
      {children}
    </ChartContainer>
  )
}

export function ReportCard({
  title,
  description,
  className,
  children,
  fitContent = false,
}: {
  title: string
  description?: string
  className?: string
  children: ReactNode
  /** When true, card height matches content (no stretch to fill parent). */
  fitContent?: boolean
}) {
  return (
    <Card className={cn("flex flex-col ring-1 ring-border/60", !fitContent && "h-full", className)}>
      <CardHeader className="shrink-0 space-y-1 pb-2">
        <CardTitle className="text-base font-semibold sm:text-lg">{title}</CardTitle>
        {description ? <CardDescription className="text-xs sm:text-sm">{description}</CardDescription> : null}
      </CardHeader>
      <CardContent
        className={cn("pt-0", fitContent ? "pb-4" : "flex min-h-0 flex-1 flex-col")}
      >
        {children}
      </CardContent>
    </Card>
  )
}

export function PresidentBreadcrumbHeader({ pageLabel }: { pageLabel: string }) {
  const location = useLocation()
  const dashboardHref = getDashboardHref(location.pathname)

  return (
    <header className="mt-6 mb-0 flex shrink-0 items-center gap-2 bg-background px-4 pt-0 pb-0 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:pt-2">
      <SidebarTrigger className="md:hidden" />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link to={dashboardHref} />}>Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{pageLabel}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </header>
  )
}

export function PresidentPageShell({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: ReactNode
}) {
  return (
    <div className="min-w-0 flex-1 space-y-6 overflow-x-hidden bg-background p-4 sm:p-6 lg:p-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">{title}</h1>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground sm:text-base">{description}</p>
      </header>
      {children}
    </div>
  )
}
