import { api } from "@/lib/api"
import type { AuthUser } from "@/lib/authApi"

export type UserAffiliation = {
  departmentName: string
  subUnits: string[]
}

export type AdminUser = AuthUser & {
  status: "active"
  affiliations?: UserAffiliation[]
}

export type CreateUserBody = {
  email: string
  firstName: string
  secondName: string
  lastName: string
  password: string
  role: string
  affiliations: UserAffiliation[]
}

export type UpdateUserBody = {
  email?: string
  firstName?: string
  secondName?: string
  lastName?: string
  role?: string
  affiliations?: UserAffiliation[]
}

const ROLE_LABELS: Record<string, string> = {
  administrator: "Administrator",
  auditor: "Auditor",
  contributor: "Contributor",
  indicator_owner: "Indicator Owner",
  president: "President",
}

const DB_TO_FORM_ROLE: Record<string, string> = {
  administrator: "admin",
  auditor: "auditor",
  contributor: "contributor",
  indicator_owner: "owner",
  president: "president",
}

/** Form `<Select>` values sent to the API (mapped to DB roles on the backend). */
export const USER_FORM_ROLE_OPTIONS = [
  {
    value: "president",
    shortLabel: "President",
    formLabel: "President - university-wide reporting and oversight",
  },
  {
    value: "auditor",
    shortLabel: "Auditor",
    formLabel: "Auditor - inspection and approval",
  },
  {
    value: "owner",
    shortLabel: "Indicator Owner",
    formLabel: "Indicator Owner - unit head/chief with contributor editing abilities",
  },
  {
    value: "contributor",
    shortLabel: "Contributor",
    formLabel: "Contributor - edit assigned plans",
  },
  {
    value: "admin",
    shortLabel: "Administrator",
    formLabel: "Administrator - manage users and settings",
  },
] as const

export type UserFormRole = (typeof USER_FORM_ROLE_OPTIONS)[number]["value"]

export function roleLabel(dbRole: string) {
  return ROLE_LABELS[dbRole] ?? dbRole
}

export function statusLabel(_status: AdminUser["status"]) {
  return "Active"
}

export function formRoleFromDbRole(dbRole: string) {
  return DB_TO_FORM_ROLE[dbRole] ?? dbRole
}

export function formatDepartments(affiliations?: UserAffiliation[]) {
  if (!affiliations?.length) return "—"
  return affiliations.map((a) => a.departmentName).join(", ")
}

export function formatSubUnits(affiliations?: UserAffiliation[]) {
  if (!affiliations?.length) return "—"
  const subUnits = affiliations.flatMap((a) => a.subUnits).filter(Boolean)
  if (!subUnits.length) return "—"
  return subUnits.join(", ")
}

export function affiliationsFromCards(
  cards: { department: string; subUnits: string[] }[],
): UserAffiliation[] {
  return cards
    .filter((c) => c.department)
    .map((c) => ({
      departmentName: c.department,
      subUnits: c.subUnits.filter(Boolean),
    }))
}

export function cardsFromAffiliations(affiliations?: UserAffiliation[]) {
  if (affiliations?.length) {
    return affiliations.map((a) => ({
      department: a.departmentName,
      subUnits: a.subUnits.length ? a.subUnits : [""],
    }))
  }
  return [{ department: "", subUnits: [""] }]
}

export function listUsers() {
  return api<{ users: AdminUser[] }>("/api/users")
}

export function getUser(id: string) {
  return api<{ user: AdminUser }>(`/api/users/${id}`)
}

export function createUser(body: CreateUserBody) {
  return api<{ user: AdminUser }>("/api/users", {
    method: "POST",
    body: JSON.stringify(body),
  })
}

export function updateUser(id: string, body: UpdateUserBody) {
  return api<{ user: AdminUser }>(`/api/users/${id}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  })
}

export function deleteUser(id: string) {
  return api<void>(`/api/users/${id}`, { method: "DELETE" })
}

export function resetUserPassword(id: string, password: string) {
  return api<{ user: AdminUser }>(`/api/users/${id}/reset-password`, {
    method: "POST",
    body: JSON.stringify({ password }),
  })
}
