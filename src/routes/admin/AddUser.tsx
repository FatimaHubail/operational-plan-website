import { useState } from "react"
import type { FormEvent } from "react"
import { Link, useLocation } from "react-router-dom"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { UserPlusIcon } from "lucide-react"

const UNIT_DEPARTMENT_OPTIONS = [
  "President's Office",
  "VP Office for Partnerships & Development",
  "VP Office for Academic Affairs",
  "General Director of Administrative Services Office",
  "Deanship of Graduate Studies & Scientific Research",
  "Deanship of Student Affairs",
  "Deanship of Admission & Registration",
  "University Rankings Committee",
  "Governance Committee (Policies & Procedures)",
  "Quality Assurance & Accreditation Center",
  "Business Incubator Center",
  "IT & Digital Learning Directorate",
  "English Language Center",
  "Media Center",
  "Community Service & Continuing Education Center",
  "Teaching Excellence & Leadership Unit",
  "Human Resources Directorate",
  "Public Relations & Media Directorate",
  "General Services Directorate",
  "Library & Information Services Directorate",
  "Security & Safety Directorate",
  "Finance & Budget Directorate",
  "Procurement Directorate",
  "Assets & Stores Directorate",
  "Buildings & Maintenance Directorate",
  "Alumni Affairs Directorate",
  "College of Arts",
  "College of Science",
  "College of Business Administration",
  "Bahrain Teachers College (BTC)",
  "College of Applied Studies",
  "College of Information Technology",
  "College of Law",
  "College of Health & Sport Sciences",
  "College of Engineering",
] as const

export default function AddUser() {
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from
  const showUsersCrumb = from !== "dashboard-admin"
  const [departmentCards, setDepartmentCards] = useState([{ department: "", subUnits: [""] }])
  const [sendInvite, setSendInvite] = useState(true)
  const [role, setRole] = useState("")

  const addDepartmentCard = () => {
    setDepartmentCards((prev) => [...prev, { department: "", subUnits: [""] }])
  }

  const removeDepartmentCard = (index: number) => {
    setDepartmentCards((prev) => {
      if (prev.length <= 1) return prev
      return prev.filter((_, i) => i !== index)
    })
  }

  const updateDepartmentCard = (index: number, patch: Partial<{ department: string; subUnits: string[] }>) => {
    setDepartmentCards((prev) => prev.map((entry, i) => (i === index ? { ...entry, ...patch } : entry)))
  }

  const addSubUnit = (cardIndex: number) => {
    setDepartmentCards((prev) =>
      prev.map((entry, i) => (i === cardIndex ? { ...entry, subUnits: [...entry.subUnits, ""] } : entry))
    )
  }

  const updateSubUnit = (cardIndex: number, subIndex: number, value: string) => {
    setDepartmentCards((prev) =>
      prev.map((entry, i) =>
        i === cardIndex
          ? {
              ...entry,
              subUnits: entry.subUnits.map((sub, j) => (j === subIndex ? value : sub)),
            }
          : entry
      )
    )
  }

  const removeSubUnit = (cardIndex: number, subIndex: number) => {
    setDepartmentCards((prev) =>
      prev.map((entry, i) => {
        if (i !== cardIndex) return entry
        if (entry.subUnits.length <= 1) return entry
        return { ...entry, subUnits: entry.subUnits.filter((_, j) => j !== subIndex) }
      })
    )
  }

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
  }

  return (
    <div className="min-w-0 flex-1 overflow-x-hidden bg-background p-4 sm:p-6 lg:p-8">
        <header className="mb-8 w-full min-w-0">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink render={<Link to="/dashboard-admin" />}>Administration</BreadcrumbLink>
              </BreadcrumbItem>
              {showUsersCrumb && (
                <>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink render={<Link to="/users" />}>Users</BreadcrumbLink>
                  </BreadcrumbItem>
                </>
              )}
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Add user</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">Add user</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Create an account for a colleague using their official university email. They will use this identity to sign
            in and access plans according to the role you assign
          </p>
        </header>

        <form
          id="admin-add-user-form"
          className="relative overflow-hidden rounded-3xl border border-border bg-card shadow-sm"
          onSubmit={onSubmit}
        >
          <div className="relative border-b border-border bg-muted/30 px-6 py-6 sm:px-10 sm:py-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground sm:h-14 sm:w-14">
                <UserPlusIcon className="h-6 w-6 sm:h-7 sm:w-7" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground">New workspace member</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Administrators can invite users and change information later from the user directory
                </p>
              </div>
            </div>
          </div>

          <div className="relative space-y-8 px-6 py-8 sm:px-10 sm:py-10">
            <fieldset className="min-w-0 space-y-5 border-0 p-0">
              <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-5">
                <div className="min-w-0 sm:col-span-2">
                  <label htmlFor="user-full-name" className="mb-1.5 block text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                    Full name <span className="text-primary">*</span>
                  </label>
                  <Input id="user-full-name" name="fullName" type="text" required />
                </div>
                <div className="min-w-0 sm:col-span-2">
                  <label htmlFor="user-email" className="mb-1.5 block text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                    University email <span className="text-primary">*</span>
                  </label>
                  <Input id="user-email" name="email" type="email" required placeholder="name@uob.edu.bh" />
                </div>
                <div className="min-w-0 sm:col-span-2">
                  <label htmlFor="user-password" className="mb-1.5 block text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                    Password <span className="text-primary">*</span>
                  </label>
                  <Input id="user-password" name="password" type="password" required />
                </div>
                <div className="min-w-0">
                  <label htmlFor="user-role" className="mb-1.5 block text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                    Role <span className="text-primary">*</span>
                  </label>
                  <input type="hidden" name="role" value={role} required />
                  <Select value={role || undefined} onValueChange={setRole}>
                    <SelectTrigger id="user-role" className="w-full">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="auditor">Auditor - action inspection and approval</SelectItem>
                      <SelectItem value="owner">Indicator Owner - unit head/chief with contributor editing abilities</SelectItem>
                      <SelectItem value="contributor">Contributor - edit assigned plans</SelectItem>
                      <SelectItem value="admin">Administrator - manage users and settings</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="min-w-0 sm:col-span-2">
                  <div className="mb-1.5 flex flex-wrap items-end justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Department &amp; Sub-unit</span>
                    <Button type="button" variant="outline" size="sm" className="rounded-full" onClick={addDepartmentCard}>
                      Add
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {departmentCards.map((entry, index) => (
                      <div key={`dept-card-${index}`} className="rounded-xl border border-border bg-muted/30 p-4">
                        <div className="mb-3 flex items-center justify-between">
                          <span />
                          {index > 0 ? (
                            <Button type="button" variant="outline" size="sm" onClick={() => removeDepartmentCard(index)}>
                              Remove
                            </Button>
                          ) : null}
                        </div>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          <div className="min-w-0">
                            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                              Department <span className="text-primary">*</span>
                            </label>
                            <input type="hidden" name="unitDepartment[]" value={entry.department} required />
                            <Select
                              value={entry.department || undefined}
                              onValueChange={(v) => updateDepartmentCard(index, { department: v })}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select unit / department" />
                              </SelectTrigger>
                              <SelectContent>
                                {UNIT_DEPARTMENT_OPTIONS.map((option) => (
                                  <SelectItem key={option} value={option}>
                                    {option}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="min-w-0">
                            <div className="mb-1.5 flex items-end justify-between gap-2">
                              <label className="block text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                                Sub-unit <span className="text-primary">*</span>
                              </label>
                              <Button type="button" variant="ghost" className="h-auto p-0 text-primary" onClick={() => addSubUnit(index)}>
                                +
                              </Button>
                            </div>
                            <div className="space-y-2">
                              {entry.subUnits.map((subUnit, subIndex) => (
                                <div key={`subunit-${index}-${subIndex}`} className="flex gap-2">
                                  <Input
                                    name={`subUnit-${index}[]`}
                                    required
                                    value={subUnit}
                                    onChange={(e) => updateSubUnit(index, subIndex, e.target.value)}
                                    placeholder="e.g. Practical Training and Career Guidance Section"
                                  />
                                  {subIndex > 0 ? (
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      className="shrink-0"
                                      onClick={() => removeSubUnit(index, subIndex)}
                                    >
                                      Remove
                                    </Button>
                                  ) : null}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </fieldset>

            <fieldset className="min-w-0 space-y-4 border-0 border-t border-border pt-8 p-0">
              <legend className="mb-1 text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">Invitation</legend>
              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-border bg-muted/40 p-4 transition hover:bg-muted/60">
                <Checkbox
                  checked={sendInvite}
                  onCheckedChange={(checked) => setSendInvite(checked === true)}
                  className="mt-0.5"
                />
                <span className="min-w-0">
                  <span className="block text-sm font-semibold">Send invitation email</span>
                  <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">
                    The person receives a link to confirm access. Turn off if you want to send later
                  </span>
                </span>
              </label>
            </fieldset>

            <div className="flex flex-col-reverse gap-3 border-t border-border pt-8 sm:flex-row sm:justify-end sm:gap-4">
              <Link
                to="/users"
                className="inline-flex items-center justify-center rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground shadow-xs transition hover:bg-accent"
              >
                Cancel
              </Link>
              <Button type="submit">Create user</Button>
            </div>
          </div>
        </form>
    </div>
  )
}
