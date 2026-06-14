import { useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { ChangePasswordForm } from "@/components/change-password-form"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from "@/components/ui/item"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/context/AuthContext"
import { changePassword } from "@/lib/authApi"
import { getDashboardHref } from "@/lib/appRoutePrefix"
import { formatUserName } from "@/lib/formatUserName"
import { formatDepartments, formatSubUnits, roleLabel } from "@/lib/usersApi"
import { cn } from "@/lib/utils"
import { UserCircleIcon } from "lucide-react"

export default function Account() {
  const navigate = useNavigate()
  const { user, logout, refreshUser } = useAuth()

  useEffect(() => {
    void refreshUser()
  }, [refreshUser])

  if (!user) return null

  async function handlePasswordChange({
    currentPassword,
    newPassword,
  }: {
    email: string
    currentPassword: string
    newPassword: string
  }) {
    await changePassword(currentPassword, newPassword)
    await logout()
    navigate("/login", {
      replace: true,
      state: {
        passwordUpdated: "Password updated. Sign in with your new password.",
      },
    })
  }

  return (
    <div className="min-w-0 flex-1 overflow-x-hidden bg-background p-4 sm:p-6 lg:p-8">
      <header className="mb-8 w-full min-w-0">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link to={getDashboardHref("")} />}>Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Account</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className="mt-5 text-2xl font-bold tracking-tight sm:text-3xl">Account</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Your profile information and password settings
        </p>
      </header>

      <div className="grid w-full min-w-0 gap-6">
        <Card className={cn("ring-1 ring-border/60")}>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Avatar size="lg" className="bg-primary/10">
                <AvatarFallback className="bg-primary/10 text-primary">
                  <UserCircleIcon className="h-7 w-7" aria-hidden="true" />
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <CardTitle className="text-lg">{formatUserName(user)}</CardTitle>
                <CardDescription>{user.email}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ItemGroup>
              <Item variant="outline">
                <ItemContent>
                  <ItemTitle>Role</ItemTitle>
                  <ItemDescription>{roleLabel(user.role)}</ItemDescription>
                </ItemContent>
              </Item>
              <Item variant="outline">
                <ItemContent>
                  <ItemTitle>Department/s</ItemTitle>
                  <ItemDescription>{formatDepartments(user.affiliations)}</ItemDescription>
                </ItemContent>
              </Item>
              <Item variant="outline">
                <ItemContent>
                  <ItemTitle>Sub Department/s</ItemTitle>
                  <ItemDescription>{formatSubUnits(user.affiliations)}</ItemDescription>
                </ItemContent>
              </Item>
            </ItemGroup>
          </CardContent>
        </Card>

        <Card className={cn("ring-1 ring-border/60")}>
          <CardHeader>
            <CardTitle className="text-lg">Change password</CardTitle>
            <CardDescription>
              Update your password. You will be signed out and
              need to sign in again with your new password.
            </CardDescription>
          </CardHeader>
          <Separator />
          <CardContent className="pt-6">
            <ChangePasswordForm
              email={user.email}
              onSubmitPassword={handlePasswordChange}
              submitLabel="Update password"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
