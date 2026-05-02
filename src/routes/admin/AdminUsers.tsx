import { useState } from "react"
import { Link } from "react-router-dom"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
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
import { PencilIcon, SearchIcon, UserPlusIcon } from "lucide-react"

type UserRow = {
  name: string
  email: string
  role: "Administrator" | "Contributor" | "Auditor" | "Indicator Owner"
  unit: string
  status: "Active" | "Invited" | "Not invited"
  actionLabel: "Manage" | "Resend invite" | "Invite"
}

type DepartmentCard = { department: string; subUnits: string[] }

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

const users: UserRow[] = [
  {
    name: "Juliana Rahman",
    email: "juliana.rahman@uob.edu.bh",
    role: "Administrator",
    unit: "Planning office",
    status: "Active",
    actionLabel: "Manage",
  },
  {
    name: "Ahmed Khalil",
    email: "a.khalil@uob.edu.bh",
    role: "Contributor",
    unit: "College of Science",
    status: "Active",
    actionLabel: "Manage",
  },
  {
    name: "Sara Al-Najjar",
    email: "s.alnajjar@uob.edu.bh",
    role: "Auditor",
    unit: "Finance",
    status: "Invited",
    actionLabel: "Resend invite",
  },
  {
    name: "Fatima Al-Mansoori",
    email: "f.almansoori@uob.edu.bh",
    role: "Indicator Owner",
    unit: "College of Engineering",
    status: "Not invited",
    actionLabel: "Invite",
  },
]

function roleClass(role: UserRow["role"]) {
  if (role === "Administrator") return "bg-accent text-accent-foreground"
  if (role === "Contributor") return "bg-secondary text-secondary-foreground"
  if (role === "Indicator Owner") return "bg-primary/10 text-foreground"
  return "bg-muted text-foreground"
}

export default function AdminUsers() {
  const [roleFilter, setRoleFilter] = useState("")
  const [manageUser, setManageUser] = useState<UserRow | null>(null)
  const [editable, setEditable] = useState<Record<string, boolean>>({})
  const [manageForm, setManageForm] = useState({
    fullName: "",
    email: "",
    password: "********",
    role: "" as UserRow["role"] | "",
    departmentCards: [{ department: "", subUnits: [""] }] as DepartmentCard[],
  })

  const openManage = (user: UserRow) => {
    setManageUser(user)
    setEditable({})
    setManageForm({
      fullName: user.name,
      email: user.email,
      password: "********",
      role: user.role,
      departmentCards: [{ department: user.unit, subUnits: [""] }],
    })
  }

  const toggleFieldEdit = (field: string) => {
    setEditable((prev) => ({ ...prev, [field]: !prev[field] }))
  }

  const addDepartmentCard = () => {
    setManageForm((prev) => ({
      ...prev,
      departmentCards: [...prev.departmentCards, { department: "", subUnits: [""] }],
    }))
  }

  const removeDepartmentCard = (index: number) => {
    setManageForm((prev) => ({
      ...prev,
      departmentCards:
        prev.departmentCards.length <= 1 ? prev.departmentCards : prev.departmentCards.filter((_, i) => i !== index),
    }))
  }

  const updateDepartmentCard = (index: number, patch: Partial<DepartmentCard>) => {
    setManageForm((prev) => ({
      ...prev,
      departmentCards: prev.departmentCards.map((entry, i) => (i === index ? { ...entry, ...patch } : entry)),
    }))
  }

  const addSubUnit = (cardIndex: number) => {
    setManageForm((prev) => ({
      ...prev,
      departmentCards: prev.departmentCards.map((entry, i) =>
        i === cardIndex ? { ...entry, subUnits: [...entry.subUnits, ""] } : entry
      ),
    }))
  }

  const updateSubUnit = (cardIndex: number, subIndex: number, value: string) => {
    setManageForm((prev) => ({
      ...prev,
      departmentCards: prev.departmentCards.map((entry, i) =>
        i === cardIndex
          ? { ...entry, subUnits: entry.subUnits.map((sub, j) => (j === subIndex ? value : sub)) }
          : entry
      ),
    }))
  }

  const removeSubUnit = (cardIndex: number, subIndex: number) => {
    setManageForm((prev) => ({
      ...prev,
      departmentCards: prev.departmentCards.map((entry, i) => {
        if (i !== cardIndex) return entry
        if (entry.subUnits.length <= 1) return entry
        return { ...entry, subUnits: entry.subUnits.filter((_, j) => j !== subIndex) }
      }),
    }))
  }

  return (
    <div className="min-w-0 flex-1 overflow-x-hidden bg-background p-4 sm:p-6 lg:p-8">
        <header className="mb-6 flex flex-col gap-4 sm:mb-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink render={<Link to="/dashboard-admin" />}>Administration</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Users</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">Users</h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Add colleagues and assign roles so they can view or contribute to the operational plan workspace
            </p>
          </div>
          <Link
            to="/add-user"
            state={{ from: "admin-users" }}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-xs transition hover:bg-primary/90"
          >
            <UserPlusIcon className="h-4 w-4" />
            Add user
          </Link>
        </header>

        <section className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
          <div className="flex flex-col gap-4 border-b border-border bg-muted/30 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-6 lg:px-8">
            <div className="min-w-0 flex-1">
              <h2 className="text-lg font-bold">Directory</h2>
              <p className="mt-0.5 text-sm text-muted-foreground">University accounts with access to the operational plan workspace</p>
            </div>
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:min-w-[20rem] sm:flex-row sm:items-center">
              <label className="relative block flex-1 sm:min-w-[12rem]">
                <span className="sr-only">Search users</span>
                <Input type="search" name="q" placeholder="Search name or email" className="rounded-full pr-10" />
                <SearchIcon className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              </label>
              <label className="sr-only" htmlFor="filter-role">
                Filter by role
              </label>
              <Select value={roleFilter || undefined} onValueChange={setRoleFilter}>
                <SelectTrigger id="filter-role" className="w-full min-w-[10rem] rounded-full sm:w-auto">
                  <SelectValue placeholder="All roles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrator</SelectItem>
                  <SelectItem value="owner">Indicator Owner</SelectItem>
                  <SelectItem value="contributor">Contributor</SelectItem>
                  <SelectItem value="auditor">Auditor</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="max-h-[22rem] overflow-x-auto overflow-y-auto">
          <Table className="min-w-[640px]">
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="whitespace-nowrap px-4 py-3 text-[11px] font-bold uppercase tracking-wide text-muted-foreground sm:px-6 lg:pl-8">
                  User
                </TableHead>
                <TableHead className="whitespace-nowrap px-4 py-3 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                  Role
                </TableHead>
                <TableHead className="hidden whitespace-nowrap px-4 py-3 text-[11px] font-bold uppercase tracking-wide text-muted-foreground md:table-cell">
                  Department/s
                </TableHead>
                <TableHead className="whitespace-nowrap px-4 py-3 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                  Status
                </TableHead>
                <TableHead className="whitespace-nowrap px-4 py-3 text-right text-[11px] font-bold uppercase tracking-wide text-muted-foreground lg:pr-8">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user, i) => (
                <TableRow key={user.email} className="transition hover:bg-muted/30">
                  <TableCell className="px-4 py-4 sm:px-6 lg:pl-8">
                    <div className="flex items-center gap-3">
                      {i === 0 ? (
                        <Avatar className="h-10 w-10">
                          <AvatarImage src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face" />
                          <AvatarFallback>JR</AvatarFallback>
                        </Avatar>
                      ) : (
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>{user.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}</AvatarFallback>
                        </Avatar>
                      )}
                      <div className="min-w-0">
                        <p className="font-semibold">{user.name}</p>
                        <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-4">
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${roleClass(user.role)}`}>
                      {user.role}
                    </span>
                  </TableCell>
                  <TableCell className="hidden px-4 py-4 text-muted-foreground md:table-cell">{user.unit}</TableCell>
                  <TableCell className="px-4 py-4">
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">{user.status}</span>
                  </TableCell>
                  <TableCell className="px-4 py-4 text-right lg:pr-8">
                    <div className="inline-flex flex-col items-end gap-1">
                      {user.actionLabel === "Manage" ? (
                        <Button type="button" variant="ghost" size="sm" className="rounded-full text-xs font-semibold" onClick={() => openManage(user)}>
                          Manage
                        </Button>
                      ) : (
                        <>
                          <Button type="button" variant="ghost" size="sm" className="rounded-full text-xs font-semibold">
                            {user.actionLabel}
                          </Button>
                          <Button type="button" variant="ghost" size="sm" className="rounded-full text-xs font-semibold" onClick={() => openManage(user)}>
                            Manage
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </div>

          <div className="flex flex-col items-start justify-between gap-3 border-t border-border px-4 py-4 sm:flex-row sm:items-center sm:px-6 lg:px-8">
            <p className="text-xs text-muted-foreground">
              Showing <span className="font-medium text-foreground">4</span> users
            </p>
            <p className="text-xs text-muted-foreground">
              Connect directory sync or SSO here when backend services are available.
            </p>
          </div>
        </section>

        <Dialog
          open={manageUser != null}
          onOpenChange={(open) => {
            if (!open) setManageUser(null)
          }}
        >
          {manageUser ? (
            <DialogContent
              className="flex max-h-[90vh] w-full max-w-[calc(100%-2rem)] flex-col gap-0 overflow-hidden rounded-2xl border border-border bg-card p-0 shadow-xl sm:max-w-3xl"
              showCloseButton
            >
              <DialogHeader className="shrink-0 border-b border-border bg-muted/30 px-5 py-4 sm:px-6">
                <DialogTitle className="text-lg font-bold">Manage User</DialogTitle>
              </DialogHeader>
              <div className="min-h-0 flex-1 space-y-6 overflow-y-auto px-5 py-5 sm:px-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Full name *</label>
                    <div className="relative">
                      <Input className="pr-9" value={manageForm.fullName} disabled={!editable.fullName} onChange={(e) => setManageForm((p) => ({ ...p, fullName: e.target.value }))} />
                      <Button type="button" variant="ghost" size="icon" className="absolute right-2 top-1/2 h-7 w-7 -translate-y-1/2 text-primary" onClick={() => toggleFieldEdit("fullName")} aria-label="Edit full name">
                        <PencilIcon className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wide text-muted-foreground">University email *</label>
                    <div className="relative">
                      <Input className="pr-9" value={manageForm.email} disabled={!editable.email} onChange={(e) => setManageForm((p) => ({ ...p, email: e.target.value }))} />
                      <Button type="button" variant="ghost" size="icon" className="absolute right-2 top-1/2 h-7 w-7 -translate-y-1/2 text-primary" onClick={() => toggleFieldEdit("email")} aria-label="Edit email">
                        <PencilIcon className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Password *</label>
                    <div className="relative">
                      <Input className="pr-9" type="password" value={manageForm.password} disabled={!editable.password} onChange={(e) => setManageForm((p) => ({ ...p, password: e.target.value }))} />
                      <Button type="button" variant="ghost" size="icon" className="absolute right-2 top-1/2 h-7 w-7 -translate-y-1/2 text-primary" onClick={() => toggleFieldEdit("password")} aria-label="Edit password">
                        <PencilIcon className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Role *</label>
                    <div className="relative">
                      <Select
                        value={manageForm.role || undefined}
                        onValueChange={(v) =>
                          setManageForm((p) => ({ ...p, role: v as UserRow["role"] }))
                        }
                        disabled={!editable.role}
                      >
                        <SelectTrigger className="w-full pr-9">
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Auditor">Auditor - action inspection and approval</SelectItem>
                          <SelectItem value="Indicator Owner">
                            Indicator Owner - unit head/chief with contributor editing abilities
                          </SelectItem>
                          <SelectItem value="Contributor">Contributor - edit assigned plans</SelectItem>
                          <SelectItem value="Administrator">Administrator - manage users and settings</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button type="button" variant="ghost" size="icon" className="absolute right-2 top-1/2 h-7 w-7 -translate-y-1/2 text-primary" onClick={() => toggleFieldEdit("role")} aria-label="Edit role">
                        <PencilIcon className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Department &amp; Sub-unit *</p>
                    <Button type="button" variant="outline" size="sm" className="rounded-full" onClick={addDepartmentCard}>
                      Add
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {manageForm.departmentCards.map((entry, cardIndex) => (
                      <div key={`manage-card-${cardIndex}`} className="rounded-xl border border-border bg-muted/30 p-4">
                        <div className="mb-3 flex items-center justify-between">
                          <span />
                          {cardIndex > 0 ? (
                            <Button type="button" variant="outline" size="sm" onClick={() => removeDepartmentCard(cardIndex)}>
                              Remove
                            </Button>
                          ) : null}
                        </div>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          <div>
                            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Department *</label>
                            <div className="relative">
                              <Select
                                value={entry.department || undefined}
                                onValueChange={(v) => updateDepartmentCard(cardIndex, { department: v })}
                                disabled={!editable[`department-${cardIndex}`]}
                              >
                                <SelectTrigger className="w-full pr-9">
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
                              <Button type="button" variant="ghost" size="icon" className="absolute right-2 top-1/2 h-7 w-7 -translate-y-1/2 text-primary" onClick={() => toggleFieldEdit(`department-${cardIndex}`)} aria-label="Edit department">
                                <PencilIcon className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          <div>
                            <div className="mb-1.5 flex items-end justify-between gap-2">
                              <label className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Sub-unit *</label>
                              <Button type="button" variant="ghost" className="h-auto p-0 text-primary" onClick={() => addSubUnit(cardIndex)}>
                                +
                              </Button>
                            </div>
                            <div className="space-y-2">
                              {entry.subUnits.map((sub, subIndex) => (
                                <div key={`manage-sub-${cardIndex}-${subIndex}`} className="flex gap-2">
                                  <div className="relative flex-1">
                                    <Input
                                      className="pr-9"
                                      value={sub}
                                      disabled={!editable[`sub-${cardIndex}-${subIndex}`]}
                                      onChange={(e) => updateSubUnit(cardIndex, subIndex, e.target.value)}
                                      placeholder="e.g. Practical Training and Career Guidance Section"
                                    />
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="icon"
                                      className="absolute right-2 top-1/2 h-7 w-7 -translate-y-1/2 text-primary"
                                      onClick={() => toggleFieldEdit(`sub-${cardIndex}-${subIndex}`)}
                                      aria-label="Edit sub-unit"
                                    >
                                      <PencilIcon className="h-3 w-3" />
                                    </Button>
                                  </div>
                                  {subIndex > 0 ? (
                                    <Button type="button" variant="outline" size="sm" onClick={() => removeSubUnit(cardIndex, subIndex)}>
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
            </DialogContent>
          ) : null}
        </Dialog>
    </div>
  )
}
