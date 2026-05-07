/**
 * Shared styling for proposal lifecycle chips - CSS classes in `index.css` (`.proposal-status-tone-*`),
 * same as the Status column on Proposals Status (`ProposalsStatus.tsx`).
 */
export type ProposalLifecycleTone = "pending" | "review" | "changes" | "accepted"

/** Maps API/display strings (e.g. objective `requestStatus`) to lifecycle tones. */
export function requestStatusToProposalTone(raw: string): ProposalLifecycleTone | "default" {
  const s = raw.trim().toLowerCase()
  if (!s) return "default"
  if (s.includes("not accepted") || s.includes("unaccepted")) return "default"
  if (s.includes("changes requested") || s.includes("change requested")) return "changes"
  if (
    s.includes("re-review") ||
    s.includes("awaiting re-review") ||
    s.includes("edited -") ||
    s.includes("edited -")
  ) {
    return "review"
  }
  if (s.includes("pending")) return "pending"
  if (s.includes("accepted")) return "accepted"
  return "default"
}

/** Background (+ default segment uses muted). Matches `statusToneSurfaceClass` in Proposals Status. */
export function proposalStatusToneSurfaceClass(tone: ProposalLifecycleTone | "default"): string {
  switch (tone) {
    case "pending":
      return "proposal-status-tone-pending"
    case "changes":
      return "proposal-status-tone-changes"
    case "review":
      return "proposal-status-tone-review"
    case "accepted":
      return "proposal-status-tone-accepted"
    default:
      return "bg-muted"
  }
}
