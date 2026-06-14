export type UserNameFields = {
  firstName: string
  secondName: string
  lastName: string
}

export function formatUserName(user: UserNameFields) {
  return [user.firstName, user.secondName, user.lastName].filter(Boolean).join(" ")
}

export function welcomeGreeting(user: UserNameFields | null | undefined) {
  const firstName = user?.firstName?.trim()
  if (firstName) return `Welcome, ${firstName}`
  const fullName = user ? formatUserName(user).trim() : ""
  return fullName ? `Welcome, ${fullName}` : "Welcome"
}

export function isUobEmail(email: string) {
  return String(email).trim().toLowerCase().endsWith("@uob.edu.bh")
}
