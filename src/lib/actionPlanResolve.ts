import { beneficiariesData } from "@/routes/strategic-perpectives/Beneficiary"
import { catalystsData } from "@/routes/strategic-perpectives/Catalysts"
import { enablersData } from "@/routes/strategic-perpectives/Enablers"
import { stakeholdersData } from "@/routes/strategic-perpectives/Stakeholders"
import type { ActionPlanPlanSection } from "@/lib/buildActionPlanHref"

export type ResolvedActionPlanContext = {
  subLabel: string
  perspectiveTitle: string
  /** 1-based index shown in the heading (“Objective 1”) */
  objDisplay: string
  objectiveLead: string
  status: string
}

function getDataset(planSection: ActionPlanPlanSection) {
  switch (planSection) {
    case "catalysts":
      return catalystsData
    case "enablers":
      return enablersData
    case "beneficiary":
      return beneficiariesData
    case "stakeholders":
      return stakeholdersData
    default:
      return null
  }
}

/**
 * Resolve heading + objective copy from compact URL params (`p`, `si`, `oi`) and in-memory plan data.
 */
export function resolveActionPlanContext(
  planSection: ActionPlanPlanSection,
  p: string,
  si: number,
  oi: number
): ResolvedActionPlanContext | null {
  if (!p || !Number.isFinite(si) || !Number.isFinite(oi) || si < 0 || oi < 0) return null

  const data = getDataset(planSection)
  if (!data) return null

  const item = data[p as keyof typeof data]
  if (!item?.subs?.[si]) return null

  const sub = item.subs[si]
  const objective = sub.operationalObjectives?.[oi]
  if (!objective) return null

  return {
    subLabel: sub.label,
    perspectiveTitle: item.title,
    objDisplay: String(oi + 1),
    objectiveLead: objective.objective,
    status: objective.objectiveStatus,
  }
}
