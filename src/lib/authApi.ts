import { api } from "@/lib/api"

export type UserAffiliation = {
  departmentName: string
  subUnits: string[]
}

export type AuthUser = {
  id: string
  email: string
  firstName: string
  secondName: string
  lastName: string
  displayName: string
  role: string
  affiliations?: UserAffiliation[]
}

export type LoginResponse = {
  user: AuthUser
}

export function login(email: string, password: string) {
  return api<LoginResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  })
}

export function fetchMe() {
  return api<{ user: AuthUser }>("/api/auth/me")
}

export function logout() {
  return api<void>("/api/auth/logout", { method: "POST" })
}

export function changePassword(currentPassword: string, newPassword: string) {
  return api<{ message: string }>("/api/auth/change-password", {
    method: "POST",
    body: JSON.stringify({ currentPassword, newPassword }),
  })
}

export function forgotPassword(email: string, newPassword: string) {
  return api<{ message: string }>("/api/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email, newPassword }),
  })
}
