import { useCallback, useState } from "react"
import { collectRequiredFieldErrors } from "@/lib/requiredFieldValidation"

export function useRequiredFieldForm() {
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const validateForm = useCallback((form: HTMLFormElement | null) => {
    if (!form) return false
    const errors = collectRequiredFieldErrors(form)
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }, [])

  const clearFieldError = useCallback((fieldKey: string) => {
    setFieldErrors((prev) => {
      if (!prev[fieldKey]) return prev
      const next = { ...prev }
      delete next[fieldKey]
      return next
    })
  }, [])

  const getFieldError = useCallback(
    (fieldKey: string) => fieldErrors[fieldKey],
    [fieldErrors],
  )

  const fieldInvalid = useCallback(
    (fieldKey: string) => Boolean(fieldErrors[fieldKey]),
    [fieldErrors],
  )

  const clearFieldErrors = useCallback(() => {
    setFieldErrors({})
  }, [])

  return {
    fieldErrors,
    validateForm,
    clearFieldError,
    clearFieldErrors,
    getFieldError,
    fieldInvalid,
  }
}
