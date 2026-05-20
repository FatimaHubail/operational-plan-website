/** DB role from API (`user.role`) → default home after login */
export const ROLE_HOME: Record<string, string> = {
    administrator: "/dashboard",
    auditor: "/dashboard",
    contributor: "/dashboard",
    president: "/dashboard",
    indicator_owner: "/dashboard",
  }
  
  export function homeForRole(role: string) {
    return ROLE_HOME[role] ?? "/login"
  }