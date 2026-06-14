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
import { PASSWORD_RULES } from "@/components/change-password-form"
import { useRequiredFieldForm } from "@/hooks/useRequiredFieldForm"
import { forgotPassword } from "@/lib/authApi"
import { cn } from "@/lib/utils"

const inputClassName = cn("h-9.5 rounded-2xl bg-muted")

type ForgotPasswordFormProps = {
  onSuccess: () => void
}

export function ForgotPasswordForm({ onSuccess }: ForgotPasswordFormProps) {
  const [email, setEmail] = useState("")
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
      await forgotPassword(email.trim(), newPassword)
      onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not reset password")
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
        <Field data-invalid={fieldInvalid("email") || undefined}>
          <FieldLabel htmlFor="forgot-email">
            University email <span className="text-primary">*</span>
          </FieldLabel>
          <Input
            id="forgot-email"
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

        <Field data-invalid={fieldInvalid("newPassword") || undefined}>
          <FieldLabel htmlFor="forgot-new-password">
            New password <span className="text-primary">*</span>
          </FieldLabel>
          <Input
            id="forgot-new-password"
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
          <FieldLabel htmlFor="forgot-confirm-password">
            Confirm new password <span className="text-primary">*</span>
          </FieldLabel>
          <Input
            id="forgot-confirm-password"
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
        {submitting ? "Resetting…" : "Reset password"}
      </Button>
    </form>
  )
}
