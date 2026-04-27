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
import { Input } from "@/components/ui/input"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { SearchIcon, UserPlusIcon } from "lucide-react"

type UserRow = {
  name: string
  email: string
  role: "Administrator" | "Contributor" | "Auditor"
  unit: string
  status: "Active" | "Invited"
  actionLabel: "Manage" | "Resend invite"
}

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
]

function roleClass(role: UserRow["role"]) {
  if (role === "Administrator") return "bg-accent text-accent-foreground"
  if (role === "Contributor") return "bg-secondary text-secondary-foreground"
  return "bg-muted text-foreground"
}

export default function AdminUsers() {
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
            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Access control</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">Users</h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Add colleagues and assign roles so they can view or contribute to the operational plan workspace.
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
              <p className="mt-0.5 text-sm text-muted-foreground">University accounts with access to this application</p>
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
              <NativeSelect id="filter-role" name="role" className="w-full min-w-[10rem] rounded-full sm:w-auto">
                <NativeSelectOption value="">All roles</NativeSelectOption>
                <NativeSelectOption value="admin">Administrator</NativeSelectOption>
                <NativeSelectOption value="contributor">Contributor</NativeSelectOption>
                <NativeSelectOption value="auditor">Auditor</NativeSelectOption>
              </NativeSelect>
            </div>
          </div>

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
                  Unit
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
                    <Button type="button" variant="ghost" size="sm" className="rounded-full text-xs font-semibold">
                      {user.actionLabel}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex flex-col items-start justify-between gap-3 border-t border-border px-4 py-4 sm:flex-row sm:items-center sm:px-6 lg:px-8">
            <p className="text-xs text-muted-foreground">
              Showing <span className="font-medium text-foreground">3</span> users
            </p>
            <p className="text-xs text-muted-foreground">
              Connect directory sync or SSO here when backend services are available.
            </p>
          </div>
        </section>
    </div>
  )
}
