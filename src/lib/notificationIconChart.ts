/**
 * Maps notification kinds to --chart-1 … --chart-5 (see `index.css`).
 */
export type ChartSlot = 1 | 2 | 3 | 4 | 5

export function notifIconChartClass(slot: ChartSlot) {
  return `notif-icon-chart-${slot}`
}

/** Rounded rectangle chip behind notification SVG (smaller than legacy square). */
export const NOTIF_ICON_WRAP_CLASS = "notif-icon-wrap"

/** Category / type badge — matches chart hue of the row icon. */
export function notifTypeBadgeClass(slot: ChartSlot) {
  return `notif-type-badge-chart-${slot}`
}

const contributorMap = {
  lifecycle: 1,
  resubmission: 2,
  calendar: 3,
  perspective: 4,
  performance: 5,
} as const

export type ContributorNotifCategory = keyof typeof contributorMap

export function chartSlotForContributor(category: ContributorNotifCategory) {
  return contributorMap[category] as ChartSlot
}

const auditorMap = {
  new_proposal: 1,
  proposal_update: 2,
  queue_aging: 3,
  rereview_aging: 4,
} as const

export type AuditorNotifCategory = keyof typeof auditorMap

export function chartSlotForAuditor(category: AuditorNotifCategory) {
  return auditorMap[category] as ChartSlot
}

const adminMap = {
  invite_delivery: 1,
  invite_expired: 2,
  account_access: 3,
  validation_alert: 4,
} as const

export type AdminNotifCategory = keyof typeof adminMap

export function chartSlotForAdmin(category: AdminNotifCategory) {
  return adminMap[category] as ChartSlot
}
