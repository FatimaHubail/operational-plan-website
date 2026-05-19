import { Outlet, useLocation } from "react-router-dom"
import uobLogo from "@/assets/UOB_LOGO.png"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export default function AppLayout() {
  const location = useLocation()
  const pathname = location.pathname
  const userScope = pathname.startsWith("/president")
    ? "president"
    : pathname.startsWith("/contributor")
      ? "contributor"
      : "default"

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset
        className="min-w-0 overflow-x-hidden bg-background"
        data-user-scope={userScope}
      >
        <div className="relative flex min-h-screen flex-col">
          <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-28 overflow-hidden sm:h-32">
            <img
              src={uobLogo}
              alt="University of Bahrain logo"
              className="absolute right-4 top-4 h-20 w-20 object-contain sm:right-6 sm:top-6 lg:right-8 lg:top-8"
            />
          </div>
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}