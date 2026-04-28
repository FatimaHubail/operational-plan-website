/** Turns API-style field keys (camelCase / snake_case) into spaced, title-style labels for UI. */
export function formatFieldLabel(key: string): string {
  if (/^achievement_\d{4}$/.test(key)) {
    return `Achievement (${key.slice(-4)})`
  }
  let s = key.replace(/_/g, " ")
  s = s.replace(/([a-z\d])([A-Z])/g, "$1 $2")
  s = s.replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
  const words = s.split(/\s+/).filter(Boolean)
  return words.map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ")
}
