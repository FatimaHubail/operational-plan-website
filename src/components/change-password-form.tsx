import { useState, type FormEvent } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { RequiredFieldMessage } from "@/components/required-field-message"
import { useRequiredFieldForm } from "@/hooks/useRequiredFieldForm"
import { changePassword } from "@/lib/authApi"
import { cn } from "@/lib/utils"

export const PASSWORD_RULES = [
  "At least 12 characters",
  "At least one uppercase letter (A–Z)",
  "At least one lowercase letter (a–z)",
  "At least one number (0–9)",
  "At least one special character",
  "No spaces",
] as const

const inputClassName = cn("h-9.5 rounded-2xl bg-muted")

type ChangePasswordFormProps = {
  email?: string
  showEmailField?: boolean
  onSubmitPassword: (args: {
    email: string
    currentPassword: string
    newPassword: string
  }) => Promise<void>
  submitLabel?: string
}

export function ChangePasswordForm({
  email: initialEmail = "",
  showEmailField = false,
  onSubmitPassword,
  submitLabel = "Update password",
}: ChangePasswordFormProps) {
  const [email, setEmail] = useState(initialEmail)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const { validateForm, clearFieldError, getFieldError, fieldInvalid } = useRequiredFieldForm()

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
      await onSubmitPassword({
        email: email.trim(),
        currentPassword,
        newPassword,
      })
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update password")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="space-y-4" noValidate onSubmit={onSubmit}>
      {error ? (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      <FieldGroup>
        {showEmailField ? (
          <Field data-invalid={fieldInvalid("email") || undefined}>
            <FieldLabel htmlFor="change-email">
              University email <span className="text-primary">*</span>
            </FieldLabel>
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
              className={inputClassName}
            />
            <RequiredFieldMessage message={getFieldError("email")} />
          </Field>
        ) : null}

        <Field data-invalid={fieldInvalid("currentPassword") || undefined}>
          <FieldLabel htmlFor="current-password">
            Current password <span className="text-primary">*</span>
          </FieldLabel>
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
            className={inputClassName}
          />
          <RequiredFieldMessage message={getFieldError("currentPassword")} />
        </Field>

        <Field data-invalid={fieldInvalid("newPassword") || undefined}>
          <FieldLabel htmlFor="new-password">
            New password <span className="text-primary">*</span>
          </FieldLabel>
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
            className={inputClassName}
          />
          <RequiredFieldMessage message={getFieldError("newPassword")} />
          <FieldDescription>
            <ul className="list-inside list-disc space-y-0.5">
              {PASSWORD_RULES.map((rule) => (
                <li key={rule}>{rule}</li>
              ))}
            </ul>
          </FieldDescription>
        </Field>

        <Field data-invalid={fieldInvalid("confirmPassword") || undefined}>
          <FieldLabel htmlFor="confirm-password">
            Confirm new password <span className="text-primary">*</span>
          </FieldLabel>
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
            className={inputClassName}
          />
          <RequiredFieldMessage message={getFieldError("confirmPassword")} />
        </Field>
      </FieldGroup>

      <Button
        type="submit"
        disabled={submitting}
        className={cn(
          "mt-2 h-9.5 w-full rounded-2xl transition-colors hover:bg-primary/90",
        )}
      >
        {submitting ? "Updating…" : submitLabel}
      </Button>
    </form>
  )
}
export async function submitPasswordChange({
  email,
  currentPassword,
  newPassword,
  login,
}: {
  email: string
  currentPassword: string
  newPassword: string
  login: (email: string, password: string) => Promise<unknown>
}) {
  await login(email, currentPassword)
  await changePassword(currentPassword, newPassword)
}

