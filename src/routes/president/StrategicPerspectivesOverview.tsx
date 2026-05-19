import { Progress } from "@/components/ui/progress"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  CHART_BAR,
  PresidentBreadcrumbHeader,
  PresidentPageShell,
  ReportCard,
  ReportChart,
  perspectivePlanChartConfig,
  perspectives,
  usePresidentMetrics,
} from "@/lib/presidentReporting"
import { INSTITUTION_SUMMARY_NUM, PLAN_ITEM } from "@/lib/proposalStatPalette"
import { ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { cn } from "@/lib/utils"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

/** Same tone as ReportCard description (“Calculated ratios…”). */
const matrixMetricClass = "text-right tabular-nums font-medium text-muted-foreground"

export default function StrategicPerspectivesOverview() {
  const metrics = usePresidentMetrics()

  return (
    <>
      <PresidentBreadcrumbHeader pageLabel="Strategic Perspectives overview" />
      <PresidentPageShell
        title="Strategic Perspectives overview"
        description="Plan volume, achievement performance, and calculated reporting ratios across all four strategic perspectives."
      >
      <div className="grid gap-4 lg:grid-cols-2 lg:items-stretch">
        <ReportCard
          title="Plan items by strategic perspective"
          description="Objectives, actions, and tasks filed per perspective"
        >
          <ReportChart config={perspectivePlanChartConfig} dimension={CHART_BAR} className="h-[300px]">
            <BarChart data={metrics.perspectivePlanData} margin={{ top: 12, right: 12, left: 0, bottom: 4 }}>
              <CartesianGrid vertical={false} strokeDasharray="4 4" className="stroke-border/60" />
              <XAxis dataKey="perspective" tickLine={false} axisLine={false} tickMargin={8} fontSize={11} />
              <YAxis tickLine={false} axisLine={false} width={40} fontSize={11} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="objectives" fill="var(--color-objectives)" radius={[4, 4, 0, 0]} maxBarSize={32} />
              <Bar dataKey="actions" fill="var(--color-actions)" radius={[4, 4, 0, 0]} maxBarSize={32} />
              <Bar dataKey="tasks" fill="var(--color-tasks)" radius={[4, 4, 0, 0]} maxBarSize={32} />
            </BarChart>
          </ReportChart>
          <div className="mt-3 flex flex-wrap justify-center gap-4 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <span className={cn("mr-0 size-2.5 rounded-sm", PLAN_ITEM.objectives.swatch)} aria-hidden />
              Objectives
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className={cn("mr-0 size-2.5 rounded-sm", PLAN_ITEM.actions.swatch)} aria-hidden />
              Actions
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className={cn("mr-0 size-2.5 rounded-sm", PLAN_ITEM.tasks.swatch)} aria-hidden />
              Tasks
            </span>
          </div>
        </ReportCard>

        <ReportCard
          title="Achievement by perspective"
          description={`Mean indicator performance vs targets (2026) · institution ${Math.round(metrics.weightedAchievement)}%`}
        >
          <div className="flex flex-1 flex-col justify-center gap-4 py-2">
            {perspectives.map((p) => (
              <div key={p.perspective}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="font-medium">{p.perspective}</span>
                  <span className="tabular-nums font-semibold">{p.achievementPct}%</span>
                </div>
                <Progress
                  value={p.achievementPct}
                  className={cn("gap-0 [&_[data-slot=progress-track]]:h-2", PLAN_ITEM.actions.planChartProgress)}
                />
                <p className="mt-1 text-[11px] text-muted-foreground">
                  {p.indicators} execution indicators · {p.objectives} objectives
                </p>
              </div>
            ))}
          </div>
        </ReportCard>
      </div>

      <ReportCard
        fitContent
        title="Reporting matrix"
        description="Calculated ratios and achievement per strategic perspective"
        className="mt-4 w-full"
      >
        <div className="overflow-x-auto rounded-lg border border-border/60">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="font-semibold">Perspective</TableHead>
                <TableHead className="text-right font-semibold">Obj.</TableHead>
                <TableHead className="text-right font-semibold">Actions</TableHead>
                <TableHead className="text-right font-semibold">Tasks</TableHead>
                <TableHead className="text-right font-semibold">Indicators</TableHead>
                <TableHead className="text-right font-semibold">Act/Obj</TableHead>
                <TableHead className="text-right font-semibold">Tsk/Act</TableHead>
                <TableHead className="text-right font-semibold">Ach.</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {metrics.matrixRows.map((row, index) => (
                <TableRow
                  key={row.perspective}
                  className={cn(index % 2 === 1 && "bg-muted/25")}
                >
                  <TableCell className="font-medium">{row.perspective}</TableCell>
                  <TableCell className={matrixMetricClass}>{row.objectives}</TableCell>
                  <TableCell className={matrixMetricClass}>{row.actions}</TableCell>
                  <TableCell className={matrixMetricClass}>{row.tasks}</TableCell>
                  <TableCell className={matrixMetricClass}>{row.indicators}</TableCell>
                  <TableCell className={matrixMetricClass}>{row.actionsPerObjective}</TableCell>
                  <TableCell className={matrixMetricClass}>{row.tasksPerAction}</TableCell>
                  <TableCell className={matrixMetricClass}>{row.achievementPct}%</TableCell>
                </TableRow>
              ))}
              <TableRow className="bg-muted/40 font-semibold hover:bg-muted/40">
                <TableCell>Institution total / avg</TableCell>
                <TableCell className={cn("text-right tabular-nums", INSTITUTION_SUMMARY_NUM)}>
                  {metrics.totalObjectives}
                </TableCell>
                <TableCell className={cn("text-right tabular-nums", INSTITUTION_SUMMARY_NUM)}>
                  {metrics.totalActions}
                </TableCell>
                <TableCell className={cn("text-right tabular-nums", INSTITUTION_SUMMARY_NUM)}>
                  {metrics.totalTasks}
                </TableCell>
                <TableCell className={cn("text-right tabular-nums", INSTITUTION_SUMMARY_NUM)}>
                  {metrics.totalIndicators}
                </TableCell>
                <TableCell className={cn("text-right tabular-nums", INSTITUTION_SUMMARY_NUM)}>
                  {metrics.avgActionsPerObjective.toFixed(2)}
                </TableCell>
                <TableCell className={cn("text-right tabular-nums", INSTITUTION_SUMMARY_NUM)}>
                  {metrics.avgTasksPerAction.toFixed(2)}
                </TableCell>
                <TableCell className={cn("text-right tabular-nums", INSTITUTION_SUMMARY_NUM)}>
                  {Math.round(metrics.weightedAchievement)}%
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </ReportCard>
      </PresidentPageShell>
    </>
  )
}
