type RequiredFieldMessageProps = {
  message?: string
  className?: string
}

export function RequiredFieldMessage({ message, className }: RequiredFieldMessageProps) {
  if (!message) return null

  return (
    <p className={className ?? "mt-1 text-[11px] text-destructive"} role="alert">
      {message}
    </p>
  )
}
