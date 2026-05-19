import { notifTypeBadgeClass, type ChartSlot } from "@/lib/notificationIconChart"

/**
 * Plan-item stat colors — matches Auditor dashboard submission mix
 * (objectives = pending, actions = chart-4, tasks = chart-2).
 */
/** Matches `ReportCard` / president chart cards (`bg-card` + ring). */
export const PRESIDENT_REPORT_CARD_SURFACE =
  "rounded-xl bg-card ring-1 ring-border/60"

/** Institution total / avg row numerals (primary orange). */
export const INSTITUTION_SUMMARY_NUM = "text-[oklch(0.70_0.18_47)]"

/** Strategic perspective chip — same as `ProposalsStatus.tsx` / Dashboard. */
export function perspectiveStrategicClass(perspective: string) {
  switch (perspective) {
    case "Catalysts":
      return "strategic-perspective-bg-chart-1"
    case "Enablers":
      return "strategic-perspective-bg-chart-2"
    case "Beneficiary":
      return "strategic-perspective-bg-chart-4"
    case "Stakeholders":
      return "strategic-perspective-bg-chart-5"
    default:
      return "strategic-perspective-bg-chart-1"
  }
}

export const PROPOSALS_TABLE_HEAD =
  "px-4 py-3 text-[10px] font-bold uppercase tracking-wide text-muted-foreground"

export const PROPOSALS_TABLE_HEAD_FIRST = `${PROPOSALS_TABLE_HEAD} sm:px-6`

export const PROPOSALS_TABLE_PERSPECTIVE_CHIP =
  "inline-flex max-w-full flex-wrap items-center rounded-full px-2.5 py-0.5 text-xs font-semibold text-[oklch(0.55_0.015_255)] transition"

export const PLAN_ITEM = {
  objectives: {
    num: "proposal-stat-num-pending",
    swatch: "proposal-stat-swatch-pending",
    accentBorder: "proposal-stat-accent-pending",
  },
  actions: {
    num: "proposal-stat-num-chart-4",
    swatch: "proposal-stat-swatch-chart-4",
    labelBg: "proposal-stat-label-bg-chart-4",
    labelText: "proposal-stat-label-text-chart-4",
    accentBorder: "proposal-stat-accent-chart-4",
    progress: "proposal-stat-progress-chart-4",
    /** Same fill as Actions bars in plan-items chart (`--proposal-stat-fill-actions`). */
    planChartProgress: "proposal-stat-progress-fill-actions",
  },
  tasks: {
    num: "proposal-stat-num-chart-2",
    swatch: "proposal-stat-swatch-chart-2",
    labelBg: "proposal-stat-label-bg-chart-2",
    labelText: "proposal-stat-label-text-chart-2",
    accentBorder: "proposal-stat-accent-chart-2",
    progress: "proposal-stat-progress-chart-2",
  },
  indicators: {
    num: "proposal-stat-num-chart-3",
    card: "border-chart-3/25 bg-chart-3/10",
    progress: "proposal-stat-progress-chart-3",
  },
  budget: {
    primary: "proposal-stat-num-chart-4",
    secondary: "proposal-stat-num-chart-3",
    utilizationProgress: "proposal-stat-progress-budget-utilization",
  },
} as const

/** Achievement % numerals — chart-2 (strong), chart-3 (mid), pending (low). */
export function achievementPctNumClass(pct: number) {
  if (pct >= 80) return PLAN_ITEM.tasks.num
  if (pct >= 70) return PLAN_ITEM.indicators.num
  return PLAN_ITEM.objectives.num
}

const INDICATOR_BAND_CHART_SLOT: Record<string, ChartSlot> = {
  slow: 5,
  good: 1,
  excellent: 3,
  achieved: 2,
  notMeasured: 5,
}

/** Pie slice fill tokens — numerals use the same CSS vars as `indicatorBandChartConfig`. */
export const INDICATOR_BAND_NUM = {
  notMeasured: "proposal-stat-num-match-fill-objectives",
  slow: "proposal-stat-num-match-fill-slow",
  good: "proposal-stat-num-match-fill-actions",
  excellent: "proposal-stat-num-match-fill-excellent",
  achieved: "proposal-stat-num-match-fill-tasks",
} as const

/** Indicator band counts — matches related pie segment color. */
export function indicatorBandNumClass(band: string) {
  return INDICATOR_BAND_NUM[band as keyof typeof INDICATOR_BAND_NUM] ?? "text-muted-foreground"
}

/** Indicator classification badges — `notif-type-badge-chart-*` (Notifications.tsx). */
export function indicatorBandBadgeClass(band: string) {
  const slot = INDICATOR_BAND_CHART_SLOT[band]
  if (!slot) return "border-border bg-muted/50 text-muted-foreground"
  return notifTypeBadgeClass(slot)
}

/** Progress fill — same hues as `indicatorBandChartConfig` pie segments. */
export function indicatorBandProgressClass(band: string) {
  switch (band) {
    case "notMeasured":
      return "proposal-stat-progress-fill-objectives"
    case "slow":
      return "proposal-stat-progress-fill-slow"
    case "good":
      return "proposal-stat-progress-fill-actions"
    case "achieved":
      return "proposal-stat-progress-fill-tasks"
    case "excellent":
      return "proposal-stat-progress-chart-3"
    default:
      return "proposal-stat-progress-fill-actions"
  }
}
