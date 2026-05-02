import { Outlet, useLocation } from "react-router-dom"
import uobLogo from "@/assets/UOB_LOGO.png"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export default function AppLayout() {
  const location = useLocation()
  const isContributorArea = location.pathname.startsWith("/contributor")

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset
        className="min-w-0 overflow-x-hidden bg-background"
        data-user-scope={isContributorArea ? "contributor" : "default"}
      >
        <div className="relative flex min-h-screen flex-col">
          <img
            src={uobLogo}
            alt="University of Bahrain logo"
            className="pointer-events-none absolute right-4 top-4 z-10 h-20 w-20 object-contain sm:right-6 sm:top-6 lg:right-8 lg:top-8"
          />
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}