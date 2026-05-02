import type { AriaRole } from "react"

import { cn } from "@/lib/utils"

export type RatioSegment = {
  ratio: number
  className: string
  title?: string
}

/** Stacked horizontal segments; ratios are normalized by their sum (same idea as flex grow). */
export function HorizontalRatioStack({
  segments,
  height = 8,
  className,
  role,
  "aria-label": ariaLabel,
  "aria-hidden": ariaHidden,
}: {
  segments: RatioSegment[]
  height?: number
  className?: string
  role?: AriaRole
  "aria-label"?: string
  "aria-hidden"?: boolean | "true" | "false"
}) {
  const filtered = segments.filter((s) => s.ratio > 0)
  const sum = filtered.reduce((acc, s) => acc + s.ratio, 0)
  let x = 0
  return (
    <svg
      className={cn("block w-full", className)}
      height={height}
      viewBox="0 0 100 8"
      preserveAspectRatio="none"
      role={role}
      aria-label={ariaLabel}
      aria-hidden={ariaHidden}
    >
      {filtered.map((seg, i) => {
        const w = sum > 0 ? (seg.ratio / sum) * 100 : 0
        const el = (
          <rect key={i} x={x} y={0} width={w} height={8} className={seg.className}>
            {seg.title ? <title>{seg.title}</title> : null}
          </rect>
        )
        x += w
        return el
      })}
    </svg>
  )
}

/** Single filled strip from 0 to `percent` (0–100); underlying track optional. */
export function HorizontalPercentFill({
  percent,
  fillClassName,
  trackClassName = "fill-muted",
  height = 8,
  className,
}: {
  percent: number
  fillClassName: string
  trackClassName?: string
  height?: number
  className?: string
}) {
  const p = Math.min(100, Math.max(0, percent))
  return (
    <svg className={cn("block w-full", className)} height={height} viewBox="0 0 100 8" preserveAspectRatio="none">
      <rect x={0} y={0} width={100} height={8} className={trackClassName} />
      <rect x={0} y={0} width={p} height={8} className={fillClassName} />
    </svg>
  )
}
