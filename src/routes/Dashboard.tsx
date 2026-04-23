import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Link } from "react-router-dom"

const calendarDays = [
  "", "", "", "", "", "1", "2",
  "3", "4", "5", "6", "7", "8", "9",
  "10", "11", "12", "13", "14", "15", "16",
  "17", "18", "19", "20", "21", "22", "23",
  "24", "25", "26", "27", "28", "29", "30",
]

const implementation = [
  { year: "2023", value: 72 },
  { year: "2024", value: 78 },
  { year: "2025", value: 86 },
  { year: "2026", value: 64 },
]

export default function DashboardPage() {
  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border/60 bg-background px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="md:hidden" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">Operational Plan</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Dashboard</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 lg:p-8">
        <header className="flex flex-col gap-4 lg:flex-row lg:items-center">
          <div className="lg:max-w-xs">
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Welcome, Juliana</h1>
            <p className="mt-1 text-sm text-muted-foreground sm:text-base">
              Here is a concise overview of your operational plan
            </p>
          </div>
          <div className="flex flex-1 items-center gap-3">
            <Input type="search" placeholder="Search" className="h-11" />
            <Avatar className="h-11 w-11">
              <AvatarImage src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop&crop=face" />
              <AvatarFallback>JU</AvatarFallback>
            </Avatar>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">April 2026</CardTitle>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon-sm" aria-label="Previous month">{"<"}</Button>
                <Button variant="ghost" size="icon-sm" aria-label="Next month">{">"}</Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-7 text-center text-xs font-medium text-muted-foreground">
                <span>SUN</span><span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center">
                {calendarDays.map((day, i) =>
                  day ? (
                    <Button
                      key={`${day}-${i}`}
                      variant={day === "8" ? "default" : "ghost"}
                      size="icon-sm"
                      className="mx-auto"
                    >
                      {day}
                    </Button>
                  ) : (
                    <span key={`empty-${i}`} />
                  )
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Notifications</CardTitle>
              <Badge variant="secondary">3 new</Badge>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-lg border border-border bg-muted/40 p-3">
                <p className="text-sm font-semibold text-foreground">Action returned for edits</p>
                <p className="text-sm text-muted-foreground">Auditor left notes on REQ-2026-0112.</p>
                <p className="text-xs text-muted-foreground">Just now</p>
              </div>
              <div className="rounded-lg border border-border bg-muted/40 p-3">
                <p className="text-sm font-semibold text-foreground">Operational plan review</p>
                <p className="text-sm text-muted-foreground">Provost office requested updates to Q2 milestones.</p>
                <p className="text-xs text-muted-foreground">2 min ago</p>
              </div>
              <div className="rounded-lg border border-border bg-muted/40 p-3">
                <p className="text-sm font-semibold text-foreground">Submission approved</p>
                <p className="text-sm text-muted-foreground">College of Arts plan v3 is approved for publication.</p>
                <p className="text-xs text-muted-foreground">1 hour ago</p>
              </div>
              <Button variant="outline" className="w-full">View all notifications</Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="grid gap-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Strategic perspectives</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-2">
                <Link to="/catalysts" className="inline-flex h-8 items-center justify-start rounded-lg bg-secondary px-2.5 text-sm font-medium text-secondary-foreground hover:bg-secondary/80">Catalysts</Link>
                <Link to="/enablers" className="inline-flex h-8 items-center justify-start rounded-lg bg-secondary px-2.5 text-sm font-medium text-secondary-foreground hover:bg-secondary/80">Enablers</Link>
                <Link to="/beneficiary" className="inline-flex h-8 items-center justify-start rounded-lg bg-secondary px-2.5 text-sm font-medium text-secondary-foreground hover:bg-secondary/80">Beneficiary</Link>
                <Link to="/stakeholders" className="inline-flex h-8 items-center justify-start rounded-lg bg-secondary px-2.5 text-sm font-medium text-secondary-foreground hover:bg-secondary/80">Stakeholders</Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-end justify-between">
                <CardTitle className="text-base">Your submissions</CardTitle>
                <Link to="/submission-status" className="text-xs font-semibold text-primary hover:underline">
                  View all
                </Link>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-2 text-sm">
                <div className="rounded-md border border-border bg-muted/40 p-2"><p className="text-xs text-muted-foreground">Pending</p><p className="font-bold">2</p></div>
                <div className="rounded-md border border-border bg-muted/40 p-2"><p className="text-xs text-muted-foreground">Re-review</p><p className="font-bold">1</p></div>
                <div className="rounded-md border border-border bg-muted/40 p-2"><p className="text-xs text-muted-foreground">Returned</p><p className="font-bold">1</p></div>
                <div className="rounded-md border border-border bg-muted/40 p-2"><p className="text-xs text-muted-foreground">Accepted</p><p className="font-bold">4</p></div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="flex flex-row items-start justify-between">
              <div>
                <CardTitle className="text-base">Strategic action implementation rate</CardTitle>
                <p className="mt-1 text-xs text-muted-foreground">
                  Share of planned operational actions marked complete for the reporting year.
                </p>
              </div>
              <Badge variant="outline">Target 85%</Badge>
            </CardHeader>
            <CardContent className="space-y-3">
              {implementation.map((row) => (
                <div key={row.year} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-foreground">{row.year}</span>
                    <span className="text-muted-foreground">{row.value}%</span>
                  </div>
                  <Progress value={row.value} />
                </div>
              ))}
              <p className="text-center text-xs text-muted-foreground">2026 figure is year-to-date (sample data).</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}