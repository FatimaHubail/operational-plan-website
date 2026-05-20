import { useEffect, useState, type FormEvent } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RequiredFieldMessage } from "@/components/required-field-message"
import { useAuth } from "@/context/AuthContext"
import { useRequiredFieldForm } from "@/hooks/useRequiredFieldForm"
import { changePassword } from "@/lib/authApi"
import { homeForRole } from "@/lib/roleRoutes"
import uobLogo from "@/assets/UOB_LOGO.png"

const PASSWORD_RULES = [
  "At least 12 characters",
  "At least one uppercase letter (A–Z)",
  "At least one lowercase letter (a–z)",
  "At least one number (0–9)",
  "At least one special character",
  "No spaces",
] as const

export default function ChangePassword() {
  const navigate = useNavigate()
  const { user, loading, login, logout, refreshUser } = useAuth()
  const [email, setEmail] = useState(user?.email ?? "")

  useEffect(() => {
    if (user?.email) setEmail(user.email)
  }, [user?.email])
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const { validateForm, clearFieldError, getFieldError, fieldInvalid } = useRequiredFieldForm()

  const signedIn = Boolean(user)
  const forcedChange = Boolean(user?.mustChangePassword)

  async function finishAndReturnToLogin() {
    await logout()
    navigate("/login", {
      replace: true,
      state: {
        passwordUpdated: "Password updated. Sign in with your new password.",
      },
    })
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    if (!validateForm(e.currentTarget)) return

    if (newPassword !== confirmPassword) {
      setError("New password and confirmation do not match.")
      return
    }

    setSubmitting(true)
    try {
      if (!signedIn) {
        await login(email.trim(), currentPassword)
      }

      await changePassword(currentPassword, newPassword)

      if (signedIn && forcedChange) {
        await refreshUser()
        navigate(homeForRole(user!.role), { replace: true })
        return
      }

      await finishAndReturnToLogin()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update password")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return null

  return (
    <div className="relative isolate flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-10 text-foreground antialiased">
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-orange-950"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-24 -top-16 h-[22rem] w-[22rem] rounded-full bg-primary-foreground/15 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-32 left-1/4 h-72 w-72 rounded-full bg-primary-foreground/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-md rounded-3xl bg-card p-8 sm:p-10">
        <div className="mb-8 text-center">
          <img
            src={uobLogo}
            alt="University of Bahrain logo"
            className="mx-auto mb-5 h-24 w-24 object-contain"
          />
          <h1 className="text-xl font-bold tracking-tight text-foreground">Change your password</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {forcedChange
              ? `You must set a new password before continuing (${user?.displayName || user?.email}).`
              : signedIn
                ? `Update the password for ${user?.displayName || user?.email}, then sign in again.`
                : "Enter your university email and current password then choose a new password"}
          </p>
        </div>

        <form className="space-y-4" noValidate onSubmit={onSubmit}>
          {error ? (
            <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          ) : null}

          {!signedIn ? (
            <div className="space-y-2">
              <label htmlFor="change-email" className="text-sm font-medium text-foreground">
                University email <span className="text-primary">*</span>
              </label>
              <Input
                id="change-email"
                name="email"
                type="email"
                autoComplete="username"
                placeholder="name@uob.edu.bh"
                required
                aria-required="true"
                aria-invalid={fieldInvalid("email") || undefined}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (e.target.value.trim()) clearFieldError("email")
                }}
                className="h-9.5 rounded-2xl bg-muted"
              />
              <RequiredFieldMessage message={getFieldError("email")} />
            </div>
          ) : null}

          <div className="space-y-2">
            <label htmlFor="current-password" className="text-sm font-medium text-foreground">
              Current password <span className="text-primary">*</span>
            </label>
            <Input
              id="current-password"
              name="currentPassword"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              required
              aria-required="true"
              aria-invalid={fieldInvalid("currentPassword") || undefined}
              value={currentPassword}
              onChange={(e) => {
                setCurrentPassword(e.target.value)
                if (e.target.value) clearFieldError("currentPassword")
              }}
              className="h-9.5 rounded-2xl bg-muted"
            />
            <RequiredFieldMessage message={getFieldError("currentPassword")} />
          </div>

          <div className="space-y-2">
            <label htmlFor="new-password" className="text-sm font-medium text-foreground">
              New password <span className="text-primary">*</span>
            </label>
            <Input
              id="new-password"
              name="newPassword"
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              required
              aria-required="true"
              aria-invalid={fieldInvalid("newPassword") || undefined}
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value)
                if (e.target.value) clearFieldError("newPassword")
              }}
              className="h-9.5 rounded-2xl bg-muted"
            />
            <RequiredFieldMessage message={getFieldError("newPassword")} />
            <ul className="list-inside list-disc space-y-0.5 text-xs text-muted-foreground">
              {PASSWORD_RULES.map((rule) => (
                <li key={rule}>{rule}</li>
              ))}
            </ul>
          </div>

          <div className="space-y-2">
            <label htmlFor="confirm-password" className="text-sm font-medium text-foreground">
              Confirm new password <span className="text-primary">*</span>
            </label>
            <Input
              id="confirm-password"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              required
              aria-required="true"
              aria-invalid={fieldInvalid("confirmPassword") || undefined}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value)
                if (e.target.value) clearFieldError("confirmPassword")
              }}
              className="h-9.5 rounded-2xl bg-muted"
            />
            <RequiredFieldMessage message={getFieldError("confirmPassword")} />
          </div>

          <Button type="submit" disabled={submitting} className="mt-2 h-9.5 w-full rounded-2xl">
            {submitting ? "Updating…" : "Update password"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          <Link to="/login" className="font-semibold text-primary hover:text-primary/90">
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
