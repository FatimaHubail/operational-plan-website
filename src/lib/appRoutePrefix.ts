/** Role-scoped URL prefix for contributor and president areas. */
export function getAppRoutePrefix(pathname: string): "" | "/contributor" | "/president" {
  if (pathname.startsWith("/president/") || pathname === "/president") return "/president"
  if (pathname.startsWith("/contributor/") || pathname === "/contributer-dashboard") return "/contributor"
  return ""
}

export function isRoleScopedPath(pathname: string) {
  const prefix = getAppRoutePrefix(pathname)
  return prefix === "/contributor" || prefix === "/president"
}

export function getDashboardHref(pathname: string) {
  const prefix = getAppRoutePrefix(pathname)
  if (prefix === "/president") return "/president/dashboard"
  if (prefix === "/contributor") return "/contributor/dashboard"
  return "/dashboard"
}

export function getProposalsStatusHref(pathname: string) {
  const prefix = getAppRoutePrefix(pathname)
  if (prefix === "/contributor") return "/contributor/proposals-status"
  if (prefix === "") return "/proposals-status"
  return null
}
