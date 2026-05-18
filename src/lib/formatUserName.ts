export type UserNameFields = {
  firstName: string
  secondName: string
  lastName: string
}

export function formatUserName(user: UserNameFields) {
  return [user.firstName, user.secondName, user.lastName].filter(Boolean).join(" ")
}

export function isUobEmail(email: string) {
  return String(email).trim().toLowerCase().endsWith("@uob.edu.bh")
}
