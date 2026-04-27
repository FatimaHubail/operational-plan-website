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
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import { UserPlusIcon } from "lucide-react"

export default function AddUser() {
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from
  const showUsersCrumb = from !== "dashboard-admin"
  const [relatedAuthorities, setRelatedAuthorities] = useState<string[]>([""])
  const [sendInvite, setSendInvite] = useState(true)

  const addRelatedAuthority = () => {
    setRelatedAuthorities((prev) => [...prev, ""])
  }

  const removeRelatedAuthority = (index: number) => {
    setRelatedAuthorities((prev) => {
      if (prev.length <= 1) return prev
      return prev.filter((_, i) => i !== index)
    })
  }

  const updateRelatedAuthority = (index: number, value: string) => {
    setRelatedAuthorities((prev) => prev.map((entry, i) => (i === index ? value : entry)))
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
          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Access control</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">Add user</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Create an account for a colleague using their official university email. They will use this identity to sign
            in and access plans according to the role you assign.
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
                  Administrators can invite users and change roles later from the user directory.
                </p>
              </div>
            </div>
          </div>

          <div className="relative space-y-8 px-6 py-8 sm:px-10 sm:py-10">
            <fieldset className="min-w-0 space-y-5 border-0 p-0">
              <legend className="mb-1 text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">Profile</legend>
              <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-5">
                <div className="min-w-0 sm:col-span-2">
                  <label htmlFor="user-full-name" className="mb-1.5 block text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                    Full name
                  </label>
                  <Input id="user-full-name" name="fullName" type="text" required placeholder="e.g. Noor Hassan" />
                </div>
                <div className="min-w-0 sm:col-span-2">
                  <label htmlFor="user-email" className="mb-1.5 block text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                    University email
                  </label>
                  <Input id="user-email" name="email" type="email" required placeholder="name@uob.edu.bh" />
                </div>
                <div className="min-w-0">
                  <label htmlFor="user-role" className="mb-1.5 block text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                    Role
                  </label>
                  <NativeSelect id="user-role" name="role" required>
                    <NativeSelectOption value="">Select a role</NativeSelectOption>
                    <NativeSelectOption value="auditor">Auditor - action inspection and approval</NativeSelectOption>
                    <NativeSelectOption value="contributor">Contributor - edit assigned plans</NativeSelectOption>
                    <NativeSelectOption value="admin">Administrator - manage users and settings</NativeSelectOption>
                  </NativeSelect>
                </div>
                <div className="min-w-0">
                  <label htmlFor="user-unit" className="mb-1.5 block text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                    Unit / department <span className="font-normal normal-case">(optional)</span>
                  </label>
                  <Input id="user-unit" name="unit" type="text" placeholder="e.g. College of Engineering" />
                </div>
                <div className="min-w-0 sm:col-span-2">
                  <div className="mb-1.5 flex flex-wrap items-end justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Related authority</span>
                    <Button type="button" variant="outline" size="sm" className="rounded-full" onClick={addRelatedAuthority}>
                      <UserPlusIcon className="h-3.5 w-3.5" />
                      Add
                    </Button>
                  </div>
                  <p className="mb-2 text-xs text-muted-foreground">
                    List each oversight body or delegated authority this person represents. Use Add for multiple entries.
                  </p>
                  <div className="space-y-2">
                    {relatedAuthorities.map((authority, index) => (
                      <div key={`authority-${index}`} className="flex gap-2">
                        <Input
                          value={authority}
                          onChange={(e) => updateRelatedAuthority(index, e.target.value)}
                          placeholder={index === 0 ? "e.g. Internal audit - planning review" : "e.g. Provost office - sign-off"}
                        />
                        {relatedAuthorities.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="shrink-0"
                            onClick={() => removeRelatedAuthority(index)}
                          >
                            Remove
                          </Button>
                        )}
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
                    The person receives a link to set their password and confirm access. Turn off if you are pre-provisioning
                    before email is ready.
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
