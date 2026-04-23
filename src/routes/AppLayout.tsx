import { Outlet, useLocation } from "react-router-dom"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider} from "@/components/ui/sidebar"

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
        <div className="flex min-h-screen flex-col">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}