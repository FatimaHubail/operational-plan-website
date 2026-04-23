const PLAN_SECTIONS = ["catalysts", "enablers", "beneficiary", "stakeholders"] as const
export type ActionPlanPlanSection = (typeof PLAN_SECTIONS)[number]

export function isActionPlanPlanSection(s: string): s is ActionPlanPlanSection {
  return (PLAN_SECTIONS as readonly string[]).includes(s)
}

/** Passed with `<Link state={...} />` — keeps the URL as `/…/action-plan` only. */
export type ActionPlanLocationState = {
  p: string
  si: number
  oi: number
}

export function buildActionPlanHref(planSection: ActionPlanPlanSection): string {
  return `/${planSection}/action-plan`
}
