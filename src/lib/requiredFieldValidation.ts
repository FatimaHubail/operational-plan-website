export const REQUIRED_FIELD_MESSAGE = "this field is required"

export function getRequiredFieldKey(element: Element): string | null {
  return (
    element.getAttribute("data-field-id") ||
    element.getAttribute("name") ||
    element.id ||
    null
  )
}

export function isEmptyRequiredValue(element: Element): boolean {
  if (
    element instanceof HTMLInputElement ||
    element instanceof HTMLSelectElement ||
    element instanceof HTMLTextAreaElement
  ) {
    if (element.type === "checkbox" || element.type === "radio") {
      return !element.checked
    }
    return !element.value.trim()
  }
  return true
}

export function collectRequiredFieldErrors(form: HTMLFormElement): Record<string, string> {
  const errors: Record<string, string> = {}

  form.querySelectorAll<HTMLElement>("[required]").forEach((element) => {
    const key = getRequiredFieldKey(element)
    if (!key || errors[key]) return
    if (isEmptyRequiredValue(element)) {
      errors[key] = REQUIRED_FIELD_MESSAGE
    }
  })

  return errors
}
