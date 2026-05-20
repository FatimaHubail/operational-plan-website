import { Navigate, Outlet, useLocation } from "react-router-dom"
import { Spinner } from "@/components/ui/spinner"
import { useAuth } from "@/context/AuthContext"
import { homeForRole } from "@/lib/roleRoutes"

type RequireAuthProps = {
  allowedRoles?: string[]
}

export function RequireAuth({ allowedRoles }: RequireAuthProps) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Spinner className="size-8 text-primary" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  if (user.mustChangePassword) {
    return <Navigate to="/change-password" replace />
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={homeForRole(user.role)} replace />
  }

  return <Outlet />
}
