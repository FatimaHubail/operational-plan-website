import { api } from "@/lib/api"
import type { AuthUser } from "@/lib/authApi"

export type UserAffiliation = {
  departmentName: string
  subUnits: string[]
}

export type AdminUser = AuthUser & {
  status: "active" | "invited" | "not_invited" | "invite_expired"
  affiliations?: UserAffiliation[]
  inviteExpiresAt?: string | null
  inviteExpiresAtDisplay?: string | null
}

export type CreateUserBody = {
  email: string
  firstName: string
  secondName: string
  lastName: string
  password: string
  role: string
  sendInvite?: boolean
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
}

export function roleLabel(dbRole: string) {
  return ROLE_LABELS[dbRole] ?? dbRole
}

export function statusLabel(status: AdminUser["status"]) {
  if (status === "active") return "Active"
  if (status === "invited") return "Invited"
  if (status === "not_invited") return "Not invited"
  if (status === "invite_expired") return "Invite expired"
  return status
}

export function formRoleFromDbRole(dbRole: string) {
  return DB_TO_FORM_ROLE[dbRole] ?? dbRole
}

export function formatDepartments(affiliations?: UserAffiliation[]) {
  if (!affiliations?.length) return "—"
  return affiliations.map((a) => a.departmentName).join(", ")
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

export function sendInvite(id: string, password: string) {
  return api<{ user: AdminUser }>(`/api/users/${id}/send-invite`, {
    method: "POST",
    body: JSON.stringify({ password }),
  })
}

export function resendInvite(id: string, password: string) {
  return api<{ user: AdminUser }>(`/api/users/${id}/resend-invite`, {
    method: "POST",
    body: JSON.stringify({ password }),
  })
}
