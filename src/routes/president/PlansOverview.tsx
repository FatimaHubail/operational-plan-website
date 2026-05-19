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
import {
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  bandLabel,
  indicatorBandNumClass,
  indicatorBandBadgeClass,
  CHART_BAR,
  CHART_PIE,
  departmentPlanDetails,
  indicatorBandChartConfig,
  indicatorDepartments,
  indicatorDetails,
  objectiveTargetChartConfig,
  pct,
  PresidentBreadcrumbHeader,
  PresidentPageShell,
  ReportCard,
  ReportChart,
  taskStatusChartConfig,
  taskStatusCounts,
  usePresidentMetrics,
} from "@/lib/presidentReporting"
import {
  perspectiveStrategicClass,
  PROPOSALS_TABLE_HEAD,
  PROPOSALS_TABLE_HEAD_FIRST,
  PROPOSALS_TABLE_PERSPECTIVE_CHIP,
} from "@/lib/proposalStatPalette"
import { cn } from "@/lib/utils"
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, XAxis, YAxis } from "recharts"

const planPerspectives = ["Catalysts", "Enablers", "Beneficiary", "Stakeholders"] as const

export default function PlansOverview() {
  const metrics = usePresidentMetrics()
  const [department, setDepartment] = useState("College of Engineering")

  const departmentIndicators = useMemo(
    () => indicatorDetails.filter((row) => row.department === department),
    [department],
  )

  const indicatorsByPerspective = useMemo(() => {
    const grouped = new Map<string, (typeof indicatorDetails)[number][]>()
    for (const row of departmentIndicators) {
      if (!grouped.has(row.perspective)) {
        grouped.set(row.perspective, [])
      }
      grouped.get(row.perspective)!.push(row)
    }
    for (const rows of grouped.values()) {
      rows.sort(
        (a, b) =>
          a.subsectionCode.localeCompare(b.subsectionCode) || a.name.localeCompare(b.name),
      )
    }
    return planPerspectives.map((perspective) => ({
      perspective,
      rows: grouped.get(perspective) ?? [],
    }))
  }, [departmentIndicators])

  const hasDepartmentIndicators = departmentIndicators.length > 0

  return (
    <>
      <PresidentBreadcrumbHeader pageLabel="Plans overview" />
      <PresidentPageShell
        title="Plans overview"
        description="Objective target performance, task lifecycle, indicator achievement bands, and departmental breakdown of plan items."
      >
      <div className="grid gap-4 lg:grid-cols-2 lg:items-start">
        <ReportCard
          title="Objectives vs target"
          description={`${metrics.belowTarget} below · ${metrics.onTarget} on · ${metrics.aboveTarget} above target`}
        >
          <ReportChart config={objectiveTargetChartConfig} dimension={CHART_BAR} className="h-[260px]">
            <BarChart data={metrics.objectiveTargetData} margin={{ top: 12, right: 12, left: 0, bottom: 4 }}>
              <CartesianGrid vertical={false} strokeDasharray="4 4" className="stroke-border/60" />
              <XAxis dataKey="perspective" tickLine={false} axisLine={false} tickMargin={8} fontSize={11} />
              <YAxis tickLine={false} axisLine={false} width={36} fontSize={11} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="belowTarget" stackId="a" fill="var(--color-belowTarget)" maxBarSize={40} />
              <Bar dataKey="onTarget" stackId="a" fill="var(--color-onTarget)" maxBarSize={40} />
              <Bar dataKey="aboveTarget" stackId="a" fill="var(--color-aboveTarget)" radius={[4, 4, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ReportChart>
        </ReportCard>

        <ReportCard
          fitContent
          title="Departments — plan items & objective targets"
          description="Objectives and target status by contributing department"
          className="flex h-full min-h-0 flex-col"
        >
          <div className="max-h-[23rem] overflow-x-auto overflow-y-auto">
            <Table className="min-w-[720px]">
              <TableHeader>
                <TableRow className="border-b border-border bg-muted/80 hover:bg-muted/80">
                  <TableHead className={PROPOSALS_TABLE_HEAD_FIRST}>Department</TableHead>
                  <TableHead className={PROPOSALS_TABLE_HEAD}>Perspective</TableHead>
                  <TableHead className={cn(PROPOSALS_TABLE_HEAD, "text-right")}>Obj.</TableHead>
                  <TableHead className={cn(PROPOSALS_TABLE_HEAD, "text-right")}>Below</TableHead>
                  <TableHead className={cn(PROPOSALS_TABLE_HEAD, "text-right")}>On</TableHead>
                  <TableHead className={cn(PROPOSALS_TABLE_HEAD, "text-right sm:px-6")}>Above</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-border">
                {departmentPlanDetails.map((row) => (
                  <TableRow key={row.department} className="border-0 hover:bg-muted/50">
                    <TableCell className="min-w-[8rem] whitespace-nowrap px-4 py-4 font-medium text-foreground sm:px-6">
                      {row.department}
                    </TableCell>
                    <TableCell className="px-4 py-4">
                      <span className={cn(PROPOSALS_TABLE_PERSPECTIVE_CHIP, perspectiveStrategicClass(row.perspective))}>
                        {row.perspective}
                      </span>
                    </TableCell>
                    <TableCell className="px-4 py-4 text-right tabular-nums text-foreground">
                      {row.objectives}
                    </TableCell>
                    <TableCell className="px-4 py-4 text-right tabular-nums text-foreground">
                      {row.belowTargetObj}
                    </TableCell>
                    <TableCell className="px-4 py-4 text-right tabular-nums text-foreground">
                      {row.onTargetObj}
                    </TableCell>
                    <TableCell className="px-4 py-4 text-right tabular-nums text-foreground sm:px-6">
                      {row.aboveTargetObj}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </ReportCard>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2 lg:items-stretch">
        <ReportCard
          title="Task status"
          description={`${metrics.taskTotal} tasks · ${metrics.taskCompletionRate}% completed`}
        >
        <ReportChart config={taskStatusChartConfig} dimension={CHART_BAR} className="h-[260px]">
          <BarChart data={taskStatusCounts} layout="vertical" margin={{ top: 8, right: 24, left: 4, bottom: 8 }}>
            <CartesianGrid horizontal={false} strokeDasharray="4 4" className="stroke-border/60" />
            <XAxis type="number" tickLine={false} axisLine={false} fontSize={11} />
            <YAxis type="category" dataKey="label" tickLine={false} axisLine={false} width={100} fontSize={11} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="count" radius={[0, 6, 6, 0]} maxBarSize={36}>
              {taskStatusCounts.map((entry) => (
                <Cell key={entry.status} fill={`var(--color-${entry.status})`} />
              ))}
            </Bar>
          </BarChart>
        </ReportChart>
        </ReportCard>

        <ReportCard
          title="Indicator achievement progress"
          description="Institutional classification bands for execution indicators (2026 reporting year)"
        >
          <div className="flex flex-col gap-4">
            <ReportChart
              config={indicatorBandChartConfig}
              dimension={CHART_PIE}
              className="mx-auto h-[220px] w-full max-w-[240px]"
            >
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent hideLabel nameKey="band" />} />
              <Pie
                data={metrics.indicatorBandData}
                dataKey="count"
                nameKey="band"
                innerRadius={50}
                outerRadius={82}
                paddingAngle={2}
                strokeWidth={2}
                stroke="var(--card)"
              >
                {metrics.indicatorBandData.map((entry) => (
                  <Cell key={entry.band} fill={`var(--color-${entry.band})`} />
                ))}
              </Pie>
            </PieChart>
          </ReportChart>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {metrics.indicatorBandData.map((row) => {
              const share = pct(row.count, metrics.indicatorTotal)
              const label =
                indicatorBandChartConfig[row.band as keyof typeof indicatorBandChartConfig]?.label ?? row.band
              return (
                <div key={row.band} className="rounded-lg border border-border bg-muted/30 px-3 py-2.5 text-center sm:text-left">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">{label}</p>
                  <p className={cn("mt-0.5 text-xl font-bold tabular-nums", indicatorBandNumClass(row.band))}>
                    {row.count}
                  </p>
                  <p className="text-[11px] tabular-nums text-muted-foreground">{share}%</p>
                </div>
              )
            })}
          </div>
          </div>
        </ReportCard>
      </div>

      <ReportCard
        fitContent
        title="Department execution indicators"
        description="Select a department to view indicators by perspective and sub-section"
        className="mt-4 w-full"
      >
        <div className="mb-4">
          <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Department</p>
          <Select value={department} onValueChange={(value) => value && setDepartment(value)}>
            <SelectTrigger className="w-full max-w-md">
              <SelectValue placeholder="Select department" />
            </SelectTrigger>
            <SelectContent>
              {indicatorDepartments.map((name) => (
                <SelectItem key={name} value={name}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {!hasDepartmentIndicators ? (
          <p className="text-sm text-muted-foreground">No indicators recorded for this department.</p>
        ) : (
          <div className="space-y-6">
            {indicatorsByPerspective.map(({ perspective, rows }) => (
              <section key={perspective}>
                <h3 className="mb-2 text-sm font-semibold text-foreground">{perspective}</h3>
                <div className="max-h-[23rem] overflow-x-auto overflow-y-auto">
                  <Table className="min-w-[720px]">
                    <TableHeader>
                      <TableRow className="border-b border-border bg-muted/80 hover:bg-muted/80">
                        <TableHead className={cn(PROPOSALS_TABLE_HEAD_FIRST, "min-w-[12rem]")}>
                          Indicator
                        </TableHead>
                        <TableHead className={PROPOSALS_TABLE_HEAD}>Target</TableHead>
                        <TableHead className={cn(PROPOSALS_TABLE_HEAD, "text-right")}>Achievement</TableHead>
                        <TableHead className={cn(PROPOSALS_TABLE_HEAD, "sm:px-6")}>Classification</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody className="divide-y divide-border">
                      {rows.length === 0 ? (
                        <TableRow className="border-0 hover:bg-muted/50">
                          <TableCell colSpan={4} className="px-4 py-4 text-sm text-muted-foreground sm:px-6">
                            No indicators recorded for this perspective.
                          </TableCell>
                        </TableRow>
                      ) : (
                        rows.map((row) => (
                          <TableRow key={`${row.subsectionCode}-${row.name}`} className="border-0 hover:bg-muted/50">
                            <TableCell className="min-w-[12rem] px-4 py-4 font-medium text-foreground sm:px-6">
                              <span className="tabular-nums text-muted-foreground">{row.subsectionCode}</span>
                              <span className="text-muted-foreground">: </span>
                              {row.name}
                            </TableCell>
                            <TableCell className="px-4 py-4 tabular-nums text-foreground">{row.target}</TableCell>
                            <TableCell className="px-4 py-4 text-right tabular-nums text-foreground">
                              {row.achievement}
                            </TableCell>
                            <TableCell className="px-4 py-4 sm:px-6">
                              <span
                                className={cn(
                                  "inline-flex max-w-full min-w-0 flex-wrap items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition",
                                  indicatorBandBadgeClass(row.band),
                                )}
                              >
                                {bandLabel(row.band)}
                              </span>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </section>
            ))}
          </div>
        )}
      </ReportCard>
      </PresidentPageShell>
    </>
  )
}
