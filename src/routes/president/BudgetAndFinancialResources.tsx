import { useMemo, useState } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Progress } from "@/components/ui/progress"
import {
  budgetDepartments,
  budgetLineItems,
  CHART_BAR,
  PresidentBreadcrumbHeader,
  PresidentPageShell,
  ReportCard,
  ReportChart,
  budgetChartConfig,
  budgetPerspectiveBarFill,
  budgetPerspectiveIndicatorBand,
  formatBd,
  formatBdCompact,
  pct,
  perspectives,
  usePresidentMetrics,
} from "@/lib/presidentReporting"
import {
  indicatorBandNumClass,
  indicatorBandProgressClass,
  PLAN_ITEM,
  PRESIDENT_REPORT_CARD_SURFACE,
} from "@/lib/proposalStatPalette"
import { cn } from "@/lib/utils"
import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts"

const budgetPerspectives = ["Catalysts", "Enablers", "Beneficiary", "Stakeholders"] as const

const summaryStats = [
  {
    label: "Total required",
    valueKey: "totalBudget" as const,
    format: formatBd,
    valueClassName: PLAN_ITEM.budget.secondary,
  },
  {
    label: "Reported spent",
    valueKey: "totalSpent" as const,
    format: formatBd,
    valueClassName: PLAN_ITEM.budget.primary,
  },
  {
    label: "Utilization",
    valueKey: "budgetUtilization" as const,
    format: (v: number) => `${v}%`,
    valueClassName: PLAN_ITEM.objectives.num,
  },
  {
    label: "Avg. per action",
    valueKey: "avgBudgetPerAction" as const,
    format: formatBdCompact,
    valueClassName: PLAN_ITEM.tasks.num,
  },
]

export default function BudgetAndFinancialResources() {
  const metrics = usePresidentMetrics()
  const [department, setDepartment] = useState("College of Engineering")

  const departmentBudgetLines = useMemo(
    () => budgetLineItems.filter((row) => row.department === department),
    [department],
  )

  const budgetByPerspective = useMemo(() => {
    const totals = new Map<string, { actionsCount: number; allocatedUsd: number; spentUsd: number }>()
    for (const row of departmentBudgetLines) {
      const current = totals.get(row.perspective) ?? { actionsCount: 0, allocatedUsd: 0, spentUsd: 0 }
      current.actionsCount += row.actionsCount
      current.allocatedUsd += row.allocatedUsd
      current.spentUsd += row.spentUsd
      totals.set(row.perspective, current)
    }
    return budgetPerspectives.map((perspective) => ({
      perspective,
      ...(totals.get(perspective) ?? { actionsCount: 0, allocatedUsd: 0, spentUsd: 0 }),
    }))
  }, [departmentBudgetLines])

  const hasDepartmentBudget = departmentBudgetLines.length > 0

  return (
    <>
      <PresidentBreadcrumbHeader pageLabel="Budget and financial resources" />
      <PresidentPageShell
        title="Budget and financial resources"
        description="Financial resources required from operational plan actions, departmental allocations, and utilization against approved budgets."
      >
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {summaryStats.map((stat) => {
          const raw = metrics[stat.valueKey]
          const value = stat.format(raw)
          return (
            <div
              key={stat.label}
              className={cn("px-4 py-3", PRESIDENT_REPORT_CARD_SURFACE)}
            >
              <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">{stat.label}</p>
              <p className={cn("mt-1 text-lg font-bold tabular-nums sm:text-xl", stat.valueClassName)}>{value}</p>
            </div>
          )
        })}
      </div>

      <ReportCard
        fitContent
        title="Financial resources required"
        description="Aggregated from action-level financial resources fields · by strategic perspective"
        className="mt-4"
      >
        <ReportChart config={budgetChartConfig} dimension={CHART_BAR} className="h-[300px]">
          <BarChart data={metrics.budgetByPerspective} margin={{ top: 12, right: 12, left: 0, bottom: 4 }}>
            <CartesianGrid vertical={false} strokeDasharray="4 4" className="stroke-border/60" />
            <XAxis dataKey="perspective" tickLine={false} axisLine={false} tickMargin={8} fontSize={11} />
            <YAxis tickLine={false} axisLine={false} width={48} fontSize={11} tickFormatter={(v) => `${v}k`} />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(_value, _name, item) => [
                    formatBd((item.payload as { budgetUsd: number }).budgetUsd),
                    "Budget required",
                  ]}
                />
              }
            />
            <Bar dataKey="budgetK" radius={[6, 6, 0, 0]} maxBarSize={52}>
              {metrics.budgetByPerspective.map((entry) => (
                <Cell key={entry.perspective} fill={budgetPerspectiveBarFill(entry.perspective)} />
              ))}
            </Bar>
          </BarChart>
        </ReportChart>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {perspectives.map((p) => {
            const share = pct(p.budgetUsd, metrics.totalBudget)
            return (
              <div key={p.perspective} className="rounded-lg border border-border bg-muted/20 px-3 py-2.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{p.perspective}</span>
                  <span className="tabular-nums text-xs text-muted-foreground">{share}%</span>
                </div>
                <p
                  className={cn(
                    "mt-0.5 text-sm font-semibold tabular-nums",
                    indicatorBandNumClass(budgetPerspectiveIndicatorBand[p.perspective]),
                  )}
                >
                  {formatBdCompact(p.budgetUsd)}
                </p>
                <Progress
                  value={share}
                  className={cn(
                    "mt-2 gap-0 [&_[data-slot=progress-track]]:h-1.5",
                    indicatorBandProgressClass(budgetPerspectiveIndicatorBand[p.perspective]),
                  )}
                />
              </div>
            )
          })}
        </div>
      </ReportCard>

      <ReportCard
        fitContent
        title="Department budget breakdown"
        description="Select a department to view budget totals by strategic perspective"
        className="mt-4 w-full"
      >
        <div className="mb-4">
          <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Department</p>
          <Select value={department} onValueChange={(value) => value && setDepartment(value)}>
            <SelectTrigger className="w-full max-w-md">
              <SelectValue placeholder="Select department" />
            </SelectTrigger>
            <SelectContent>
              {budgetDepartments.map((name) => (
                <SelectItem key={name} value={name}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {!hasDepartmentBudget ? (
          <p className="text-sm text-muted-foreground">No budget lines recorded for this department.</p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-border/60">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="min-w-[9rem] font-semibold">Perspective</TableHead>
                  <TableHead className="text-right font-semibold">Actions</TableHead>
                  <TableHead className="text-right font-semibold">Allocated</TableHead>
                  <TableHead className="text-right font-semibold">Spent</TableHead>
                  <TableHead className="text-right font-semibold">Utilized</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {budgetByPerspective.map((row, index) => {
                  const utilized = pct(row.spentUsd, row.allocatedUsd)
                  return (
                    <TableRow
                      key={row.perspective}
                      className={cn(index % 2 === 1 && "bg-muted/25")}
                    >
                      <TableCell className="font-medium">{row.perspective}</TableCell>
                      <TableCell className="text-right tabular-nums font-medium text-muted-foreground">
                        {row.actionsCount}
                      </TableCell>
                      <TableCell className="text-right tabular-nums font-medium text-muted-foreground">
                        {formatBdCompact(row.allocatedUsd)}
                      </TableCell>
                      <TableCell className="text-right tabular-nums font-medium text-muted-foreground">
                        {formatBdCompact(row.spentUsd)}
                      </TableCell>
                      <TableCell className="text-right tabular-nums font-medium text-muted-foreground">
                        {row.allocatedUsd > 0 ? `${utilized}%` : "—"}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </ReportCard>
      </PresidentPageShell>
    </>
  )
}
