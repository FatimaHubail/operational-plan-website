import { Link } from "react-router-dom"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/context/AuthContext"
import { welcomeGreeting } from "@/lib/formatUserName"
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
  actionStatusCounts,
  CHART_LINE,
  formatBdCompact,
  indicatorBandCounts,
  ReportCard,
  ReportChart,
  achievementTrendChartConfig,
  achievementTrendData,
  taskStatusCounts,
  usePresidentMetrics,
} from "@/lib/presidentReporting"
import { PLAN_ITEM, PRESIDENT_REPORT_CARD_SURFACE } from "@/lib/proposalStatPalette"
import { cn } from "@/lib/utils"
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

const topDepartmentRankStyles = [
  { row: "bg-primary/8 hover:bg-primary/10", rank: "font-semibold text-primary" },
  { row: "bg-chart-4/10 hover:bg-chart-4/15", rank: cn("font-semibold", PLAN_ITEM.actions.num) },
  { row: "bg-chart-2/10 hover:bg-chart-2/15", rank: cn("font-semibold", PLAN_ITEM.tasks.num) },
] as const

function topDepartmentRowClass(index: number) {
  if (index < topDepartmentRankStyles.length) return topDepartmentRankStyles[index].row
  return index % 2 === 1 ? "bg-muted/25" : undefined
}

function topDepartmentRankClass(index: number) {
  if (index < topDepartmentRankStyles.length) return topDepartmentRankStyles[index].rank
  return "font-medium text-muted-foreground"
}

function topDepartmentMetricClass(index: number, compact = false) {
  return cn("text-right tabular-nums", compact && "text-xs", topDepartmentRankClass(index))
}

const reportLinks = [
  {
    title: "Strategic Perspectives overview",
    description: "Plan items, achievement by perspective, reporting matrix",
    to: "/president/strategic-perspectives-overview",
    cardClassName: "strategic-perspective-bg-chart-1 border-chart-1/30 hover:opacity-95",
    titleClassName: "text-secondary-foreground",
    descriptionClassName: "text-secondary-foreground/85",
  },
  {
    title: "Plans overview",
    description: "Objectives vs target, tasks, indicators, department detail",
    to: "/president/plans-overview",
    cardClassName: "strategic-perspective-bg-chart-2 border-chart-2/30 hover:opacity-95",
    titleClassName: "text-secondary-foreground",
    descriptionClassName: "text-secondary-foreground/85",
  },
  {
    title: "Budget and financial resources",
    description: "Financial resources, departmental budgets, utilization",
    to: "/president/budget",
    cardClassName: "strategic-perspective-bg-chart-4 border-chart-4/30 hover:opacity-95",
    titleClassName: "text-secondary-foreground",
    descriptionClassName: "text-secondary-foreground/85",
  },
]

export default function PresidentDashboard() {
  const { user } = useAuth()
  const metrics = usePresidentMetrics()
  const indicatorsMeasured = `${metrics.indicatorTotal - indicatorBandCounts.notMeasured} / ${metrics.indicatorTotal}`

  const planVolumeStats = [
    {
      label: "Objectives",
      value: String(metrics.totalObjectives),
      note: `${metrics.onTargetRate}% on target`,
      valueClassName: PLAN_ITEM.objectives.num,
      accentClass: PLAN_ITEM.objectives.accentBorder,
    },
    {
      label: "Actions",
      value: String(metrics.totalActions),
      note: `Avg ${metrics.avgActionsPerObjective.toFixed(1)} per objective`,
      valueClassName: PLAN_ITEM.actions.num,
      accentClass: PLAN_ITEM.actions.accentBorder,
    },
    {
      label: "Tasks",
      value: String(metrics.totalTasks),
      note: `Avg ${metrics.avgTasksPerAction.toFixed(1)} per action`,
      valueClassName: PLAN_ITEM.tasks.num,
      accentClass: PLAN_ITEM.tasks.accentBorder,
    },
  ]

  const completedActions = actionStatusCounts.find((a) => a.status === "completed")?.count ?? 0
  const completedTasks = taskStatusCounts.find((t) => t.status === "completed")?.count ?? 0

  const quickStatItems = [
    {
      label: "Avg. actions / objective",
      value: metrics.avgActionsPerObjective.toFixed(2),
      valueClassName: PLAN_ITEM.actions.num,
    },
    {
      label: "Avg. tasks / action",
      value: metrics.avgTasksPerAction.toFixed(2),
      valueClassName: PLAN_ITEM.tasks.num,
    },
    {
      label: "Objectives on target",
      value: `${metrics.onTargetRate}%`,
      valueClassName: PLAN_ITEM.objectives.num,
    },
    {
      label: "Indicators measured",
      value: indicatorsMeasured,
      valueClassName: PLAN_ITEM.indicators.num,
    },
  ]

  return (
    <div className="min-w-0 flex-1 space-y-8 overflow-x-hidden bg-background p-4 sm:p-6 lg:p-8">
      <header className="mb-2 flex flex-col gap-4 lg:flex-row lg:items-center">
        <div className="lg:max-w-none">
          <Badge
            variant="outline"
            className={cn(
              "h-auto min-h-8 border-border/30 bg-[oklch(0.985_0_0)] px-3 py-1.5 text-xs font-semibold shadow-[0_1px_8px_rgba(0,0,0,0.045)] dark:border-border/40 dark:bg-card dark:shadow-[0_2px_10px_rgba(0,0,0,0.28)]",
            )}
          >
            President
          </Badge>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">{welcomeGreeting(user)}</h1>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground sm:text-base">
            Track institutional performance, progress, and budget of the university strategic plan
          </p>
        </div>
      </header>

      <section>
        <Card className="overflow-hidden ring-1 ring-border/60">
          <CardContent className="p-0">
            <div className="border-b border-border/60 px-4 py-4 sm:px-5">
              <p className="mb-3 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Plan volume</p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-border">
                {planVolumeStats.map((item) => (
                  <div key={item.label} className={cn("border-l-4 pl-3 sm:px-4 sm:first:pl-4", item.accentClass)}>
                    <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">{item.label}</p>
                    <p className={cn("mt-1 text-2xl font-bold tabular-nums sm:text-3xl", item.valueClassName)}>
                      {item.value}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{item.note}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4 border-b border-border/60 p-4 sm:grid-cols-3 sm:p-5">
              <div className="flex flex-col items-center justify-center rounded-xl border border-primary/20 bg-primary/5 px-4 py-5 text-center">
                <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Total achievement</p>
                <p className="mt-2 text-4xl font-bold tabular-nums text-primary sm:text-5xl">
                  {Math.round(metrics.weightedAchievement)}%
                </p>
                <p className="mt-1 text-xs text-muted-foreground">Weighted by indicators (2026)</p>
              </div>

              <div className="flex flex-col justify-center gap-2 rounded-xl border border-border/60 bg-card px-4 py-4">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Actions completed</p>
                  <p className={cn("text-xl font-bold tabular-nums", PLAN_ITEM.actions.num)}>{metrics.actionCompletionRate}%</p>
                </div>
                <Progress
                  value={metrics.actionCompletionRate}
                  className={cn("gap-0 [&_[data-slot=progress-track]]:h-2", PLAN_ITEM.actions.progress)}
                />
                <p className="text-xs text-muted-foreground">
                  {completedActions} of{" "}
                  <span className={cn("font-semibold tabular-nums", PLAN_ITEM.actions.num)}>{metrics.actionTotal}</span>
                </p>
              </div>

              <div className="flex flex-col justify-center gap-2 rounded-xl border border-border/60 bg-card px-4 py-4">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Tasks completed</p>
                  <p className={cn("text-xl font-bold tabular-nums", PLAN_ITEM.tasks.num)}>{metrics.taskCompletionRate}%</p>
                </div>
                <Progress
                  value={metrics.taskCompletionRate}
                  className={cn("gap-0 [&_[data-slot=progress-track]]:h-2", PLAN_ITEM.tasks.progress)}
                />
                <p className="text-xs text-muted-foreground">
                  {completedTasks} of{" "}
                  <span className={cn("font-semibold tabular-nums", PLAN_ITEM.tasks.num)}>{metrics.taskTotal}</span>
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 bg-muted/25 px-4 py-4 sm:flex-row sm:items-center sm:gap-6 sm:px-5">
              <div className="min-w-0 shrink-0 sm:w-48">
                <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Financial resources</p>
                <p className={cn("mt-1 text-2xl font-bold tabular-nums", PLAN_ITEM.budget.secondary)}>
                  {formatBdCompact(metrics.totalBudget)}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">{metrics.budgetUtilization}% utilized</p>
              </div>
              <div className="min-w-0 flex-1">
                <div className="mb-1.5 flex justify-between text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                  <span>Budget utilization</span>
                  <span className="tabular-nums text-foreground">{metrics.budgetUtilization}%</span>
                </div>
                <Progress
                  value={metrics.budgetUtilization}
                  className={cn("gap-0 [&_[data-slot=progress-track]]:h-2.5", PLAN_ITEM.budget.utilizationProgress)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {quickStatItems.map((stat) => (
            <div
              key={stat.label}
              className={cn("px-3 py-2.5", PRESIDENT_REPORT_CARD_SURFACE)}
            >
              <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">{stat.label}</p>
              <p className={cn("mt-0.5 text-lg font-bold tabular-nums", stat.valueClassName)}>{stat.value}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-foreground">Detailed reports</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {reportLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={cn(
                "rounded-xl border p-4 shadow-sm ring-1 ring-border/40 transition",
                link.cardClassName,
              )}
            >
              <p className={cn("font-semibold", link.titleClassName)}>{link.title}</p>
              <p className={cn("mt-1 text-xs", link.descriptionClassName)}>{link.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-5 lg:items-stretch">
        <ReportCard
          title="Total achievement trend"
          description={`Quarterly institution average · current ${Math.round(metrics.weightedAchievement)}%`}
          className="lg:col-span-3"
        >
          <ReportChart config={achievementTrendChartConfig} dimension={CHART_LINE} className="h-[280px]">
            <LineChart data={achievementTrendData} margin={{ top: 12, right: 16, left: 4, bottom: 4 }}>
              <CartesianGrid vertical={false} strokeDasharray="4 4" className="stroke-border/60" />
              <XAxis dataKey="quarter" tickLine={false} axisLine={false} tickMargin={8} fontSize={11} />
              <YAxis domain={[0, 100]} tickLine={false} axisLine={false} width={40} fontSize={11} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey="rate"
                stroke="var(--color-rate)"
                strokeWidth={2.5}
                dot={{ r: 4, fill: "var(--color-rate)", stroke: "var(--card)", strokeWidth: 2 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ReportChart>
        </ReportCard>

        <ReportCard title="Strategic perspectives" description="Browse operational plans" className="lg:col-span-2">
          <div className="grid gap-2.5">
            <Link
              to="/president/catalysts"
              className="strategic-perspective-bg-chart-1 rounded-2xl px-4 py-3.5 text-sm font-semibold text-secondary-foreground transition hover:opacity-95"
            >
              Catalysts
            </Link>
            <Link
              to="/president/enablers"
              className="strategic-perspective-bg-chart-2 rounded-2xl px-4 py-3.5 text-sm font-semibold text-secondary-foreground transition hover:opacity-95"
            >
              Enablers
            </Link>
            <Link
              to="/president/beneficiary"
              className="strategic-perspective-bg-chart-4 rounded-2xl px-4 py-3.5 text-sm font-semibold text-secondary-foreground transition hover:opacity-95"
            >
              Beneficiary
            </Link>
            <Link
              to="/president/stakeholders"
              className="strategic-perspective-bg-chart-5 rounded-2xl px-4 py-3.5 text-sm font-semibold text-secondary-foreground transition hover:opacity-95"
            >
              Stakeholders
            </Link>
          </div>
        </ReportCard>
      </section>

      <section>
        <ReportCard
          title="Top contributing departments"
          description="Ranked by objectives, actions, tasks, and achievement"
        >
          <div className="overflow-x-auto rounded-lg border border-border/60">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="w-8 font-semibold">#</TableHead>
                  <TableHead className="font-semibold">Department</TableHead>
                  <TableHead className="text-right font-semibold">Obj.</TableHead>
                  <TableHead className="text-right font-semibold">Act.</TableHead>
                  <TableHead className="text-right font-semibold">Tasks</TableHead>
                  <TableHead className="text-right font-semibold">Budget</TableHead>
                  <TableHead className="text-right font-semibold">Ach.</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {metrics.departmentScores.map((row, index) => (
                  <TableRow
                    key={row.department}
                    className={topDepartmentRowClass(index)}
                  >
                    <TableCell className={topDepartmentRankClass(index)}>{index + 1}</TableCell>
                    <TableCell
                      className={cn(
                        "max-w-[9rem] sm:max-w-none",
                        index < 3 ? "font-semibold text-foreground" : "font-medium",
                      )}
                    >
                      {row.department}
                    </TableCell>
                    <TableCell className={topDepartmentMetricClass(index)}>{row.objectives}</TableCell>
                    <TableCell className={topDepartmentMetricClass(index)}>{row.actions}</TableCell>
                    <TableCell className={topDepartmentMetricClass(index)}>{row.tasks}</TableCell>
                    <TableCell className={topDepartmentMetricClass(index, true)}>
                      {formatBdCompact(row.budgetUsd)}
                    </TableCell>
                    <TableCell className={topDepartmentMetricClass(index)}>{row.avgAchievementPct}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </ReportCard>
      </section>
    </div>
  )
}
