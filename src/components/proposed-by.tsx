import { UserRound } from "lucide-react"

import { cn } from "@/lib/utils"

export type ProposedByFields = {
  name?: string
  department?: string
  subUnit?: string
}

type ProposedByBlockProps = ProposedByFields & {
  className?: string
  /** Tighter padding for dense layouts (e.g. action plan action cards). */
  density?: "default" | "compact"
}

/** Owner attribution: name — department, sub-unit with subtle accent styling. */
export function ProposedByBlock({ name, department, subUnit, className, density = "default" }: ProposedByBlockProps) {
  const n = name?.trim() || "—"
  const d = department?.trim() || "—"
  const s = subUnit?.trim() || "—"

  const compact = density === "compact"

  return (
    <div
      className={cn(
        "flex min-w-0 items-center gap-2.5 rounded-lg bg-transparent",
        compact ? "py-1.5 pl-2 pr-2.5" : "py-2 pl-2.5 pr-3 sm:gap-3 sm:pl-3 sm:pr-3.5",
        className,
      )}
    >
      <span
        className={cn(
          "flex shrink-0 items-center justify-center rounded-full bg-primary/12 text-primary ring-1 ring-primary/15 dark:bg-primary/18",
          compact ? "size-7" : "size-8 sm:size-9",
        )}
        aria-hidden
      >
        <UserRound className={cn(compact ? "size-3.5" : "size-4")} strokeWidth={1.75} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-muted-foreground">Proposed by</p>
        <p className={cn("mt-0.5 leading-snug tracking-tight text-foreground", compact ? "text-[11px]" : "text-[11px] sm:text-xs")}>
          <span className="font-semibold text-foreground">{n}</span>
          <span className="font-medium text-muted-foreground"> — </span>
          <span className="font-normal text-muted-foreground">{d}</span>
          <span className="text-muted-foreground/70">, </span>
          <span className="font-normal text-muted-foreground">{s}</span>
        </p>
      </div>
    </div>
  )
}
