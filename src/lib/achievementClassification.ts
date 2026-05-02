import { cn } from "@/lib/utils"

/**
 * KPI achievement classification by calendar year (institutional rubric).
 * Bands apply to **performance vs the sub-section target**: (achievement ÷ target) × 100,
 * using numeric values parsed from the achievement cell and the sub-section `targetValue`.
 */
export type AchievementBand = "notMeasured" | "slow" | "good" | "excellent" | "achieved"

/** Parses a percentage from display text; returns null if not a numeric achievement rate. */
export function parseAchievementPercent(raw: string): number | null {
  const t = raw.trim()
  if (!t || t === "-") return null
  const strict = t.match(/^(\d+(?:\.\d+)?)\s*%?\s*$/i)
  if (strict) return Number(strict[1])
  const loose = t.match(/(\d+(?:\.\d+)?)\s*%/i)
  if (loose) return Number(loose[1])
  return null
}

/** Achievement entry: percent-style or plain numeric (e.g. counts). */
function parseAchievementMetric(raw: string): number | null {
  const pct = parseAchievementPercent(raw)
  if (pct !== null) return pct
  const t = raw.trim().replace(/,/g, "")
  if (!t || t === "-") return null
  if (/^(\d+(?:\.\d+)?)$/.test(t)) return Number(t)
  return null
}

/** Target value on the indicator: first `%` number, else leading integer/decimal (supports commas). */
function parseTargetMetric(raw: string): number | null {
  const t = raw.trim()
  if (!t || t === "-" || /^tbd$/i.test(t)) return null
  const noComma = t.replace(/,/g, "")
  const pct = noComma.match(/(\d+(?:\.\d+)?)\s*%/)
  if (pct) return Number(pct[1])
  const lead = noComma.match(/^(\d+(?:\.\d+)?)\b/)
  if (lead) return Number(lead[1])
  return null
}

/**
 * Performance score vs target (0–100+): achievement ÷ target × 100 when both parse.
 */
export function getPerformanceVsTargetPercent(achievementRaw: string, targetRaw: string): number | null {
  const a = parseAchievementMetric(achievementRaw)
  const t = parseTargetMetric(targetRaw)
  if (a === null || t === null || t <= 0) return null
  return (a / t) * 100
}

function classifyScoreByYear(year: string, p: number): AchievementBand {
  switch (year) {
    case "2023": {
      if (p <= 10) return "slow"
      if (p > 10 && p < 50) return "good"
      return "excellent"
    }
    case "2024": {
      if (p <= 40) return "slow"
      if (p > 40 && p < 60) return "good"
      return "excellent"
    }
    case "2025": {
      if (p <= 70) return "slow"
      if (p > 70 && p < 80) return "good"
      return "excellent"
    }
    case "2026": {
      if (p <= 90) return "slow"
      if (p > 90 && p < 100) return "good"
      return "achieved"
    }
    default:
      return "notMeasured"
  }
}

export function getAchievementBand(year: string, achievementRaw: string, targetRaw: string): AchievementBand {
  const score = getPerformanceVsTargetPercent(achievementRaw, targetRaw)
  if (score === null) return "notMeasured"
  return classifyScoreByYear(year, score)
}

export function achievementStatusLabel(year: string, achievementRaw: string, targetRaw: string): string {
  const a = parseAchievementMetric(achievementRaw)
  if (a === null) return "Not measured/reported"

  const t = parseTargetMetric(targetRaw)
  if (t === null || t <= 0) return "Target not set — cannot classify"

  const score = getPerformanceVsTargetPercent(achievementRaw, targetRaw)
  if (score === null) return "Not measured/reported"

  switch (classifyScoreByYear(year, score)) {
    case "slow":
      return "Slow progress"
    case "good":
      return "Good progress"
    case "excellent":
      return "Excellent progress"
    case "achieved":
      return "Achieved"
    default:
      return ""
  }
}

function bandSurfaceClassName(band: AchievementBand): string {
  switch (band) {
    case "notMeasured":
      return "bg-rose-50 text-rose-950 ring-rose-200/90 dark:bg-rose-950/40 dark:text-rose-50 dark:ring-rose-800/55"
    case "slow":
      return "bg-amber-50 text-amber-950 ring-amber-200/90 dark:bg-amber-950/40 dark:text-amber-50 dark:ring-amber-800/55"
    case "good":
      return "bg-emerald-50 text-emerald-950 ring-emerald-200/90 dark:bg-emerald-950/40 dark:text-emerald-50 dark:ring-emerald-800/55"
    case "excellent":
      return "bg-sky-50 text-sky-950 ring-sky-200/90 dark:bg-sky-950/40 dark:text-sky-50 dark:ring-sky-800/55"
    case "achieved":
      return "bg-violet-50 text-violet-950 ring-violet-200/90 dark:bg-violet-950/40 dark:text-violet-50 dark:ring-violet-800/55"
    default:
      return ""
  }
}

/** Year cell in sub-section indicator card — classification uses `targetValue` for that sub-section. */
export function achievementSubsectionCellClassName(year: string, achievementRaw: string, targetRaw: string): string {
  return cn(
    "rounded-xl px-3 py-2.5 ring-1 transition-colors",
    bandSurfaceClassName(getAchievementBand(year, achievementRaw, targetRaw))
  )
}
