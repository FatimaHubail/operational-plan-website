"use client"

import * as React from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"

import { NavMain } from "@/components/nav-main"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import {
  HomeIcon,
  CalendarIcon,
  BellIcon,
  NetworkIcon,
  ClipboardListIcon,
  ClipboardCheckIcon,
  ListTodoIcon,
  LogOutIcon,
  UserCircleIcon,
  UsersIcon,
  UserPlusIcon,
  LayoutGridIcon,
  LayersIcon,
  WalletIcon,
} from "lucide-react"

type SidebarNavItem = {
  title: string
  url: string
  icon: React.ReactNode
  items?: { title: string; url: string }[]
}

function resolveNavUrl(url: string, routePrefix: string) {
  if (!url || url === "#" || !url.startsWith("/")) return url
  if (url.startsWith("/president/") || url.startsWith("/contributor/") || url.startsWith("/admin/") || url.startsWith("/auditor/")) {
    return url
  }
  if (routePrefix && url.startsWith(`${routePrefix}/`)) return url
  return routePrefix ? `${routePrefix}${url}` : url
}

const data = {
  navMain: [
    {
      title: "Home",
      url: "/dashboard",
      icon: <HomeIcon />,
    },
    {
      title: "Calender",
      url: "/calendar", 
      icon: <CalendarIcon />
    },
    {
      title: "Notifications",
      url: "/notifications", 
      icon: <BellIcon />
    },
    {
      title: "Proposals Status",
      url: "/proposals-status",
      icon: <ClipboardListIcon />
    },
    {
      title: "Strategic perspectives",
      url: "#",
      icon: <NetworkIcon />,
      items: [
        {
          title: "Catalysts",
          url: "/catalysts",
        },
        {
          title: "Enablers",
          url: "/enablers",
        },
        {
          title: "Beneficiary",
          url: "/beneficiary",
        },
        {
          title: "Stakeholders",
          url: "/stakeholders",
        },
      ],
    },
  ],
}

const adminNavMain: SidebarNavItem[] = [
  {
    title: "Home",
    url: "/dashboard",
    icon: <HomeIcon />,
  },
  {
    title: "Notifications",
    url: "/notifications",
    icon: <BellIcon />,
  },
  {
    title: "Users",
    url: "/users",
    icon: <UsersIcon />,
  },
  {
    title: "Add user",
    url: "/add-user",
    icon: <UserPlusIcon />,
  },
]

const presidentNavMain: SidebarNavItem[] = [
  {
    title: "Home",
    url: "/dashboard",
    icon: <HomeIcon />,
  },
  {
    title: "Strategic Perspectives overview",
    url: "/president/strategic-perspectives-overview",
    icon: <LayoutGridIcon />,
  },
  {
    title: "Plans overview",
    url: "/president/plans-overview",
    icon: <LayersIcon />,
  },
  {
    title: "Budget and financial resources",
    url: "/president/budget",
    icon: <WalletIcon />,
  },
  {
    title: "Calender",
    url: "/calendar",
    icon: <CalendarIcon />,
  },
  {
    title: "Notifications",
    url: "/notifications",
    icon: <BellIcon />,
  },
  {
    title: "Strategic perspectives",
    url: "#",
    icon: <NetworkIcon />,
    items: [
      { title: "Catalysts", url: "/catalysts" },
      { title: "Enablers", url: "/enablers" },
      { title: "Beneficiary", url: "/beneficiary" },
      { title: "Stakeholders", url: "/stakeholders" },
    ],
  },
]

const auditorNavMain: SidebarNavItem[] = [
  {
    title: "Home",
    url: "/dashboard",
    icon: <HomeIcon />,
  },
  {
    title: "Notifications",
    url: "/notifications",
    icon: <BellIcon />,
  },
  {
    title: "Objective queue",
    url: "/objective-queue",
    icon: <ClipboardCheckIcon />,
  },
  {
    title: "Action queue",
    url: "/action-queue",
    icon: <ClipboardListIcon />,
  },
  {
    title: "Task queue",
    url: "/task-queue",
    icon: <ListTodoIcon />,
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const role = user?.role
  const sourceContext = new URLSearchParams(location.search).get("from")
  const pathname = location.pathname

  const isPresidentArea =
    role === "president" ||
    pathname.startsWith("/president/") ||
    pathname === "/president" ||
    sourceContext === "president-dashboard"
  const isContributorArea =
    role === "contributor" ||
    pathname.startsWith("/contributor/") ||
    pathname === "/contributer-dashboard" ||
    sourceContext === "contributor-dashboard"
  const routePrefix = isPresidentArea ? "/president" : isContributorArea ? "/contributor" : ""
  const isAdminArea =
    role === "administrator" ||
    pathname === "/users" ||
    pathname === "/add-user" ||
    (pathname === "/notifications" && sourceContext === "dashboard-admin") ||
    pathname.startsWith("/admin/")
  const isAuditorArea =
    role === "auditor" ||
    pathname === "/action-queue" ||
    pathname === "/objective-queue" ||
    pathname === "/task-queue" ||
    pathname === "/review-action" ||
    pathname === "/review-objective" ||
    pathname === "/review-task" ||
    (pathname === "/notifications" && sourceContext === "dashboard-auditor") ||
    pathname.startsWith("/auditor/")

  async function handleLogout() {
    await logout()
    navigate("/login", { replace: true })
  }
  const notificationsHref = isAdminArea
    ? "/admin/notifications?from=dashboard-admin"
    : isAuditorArea
      ? "/auditor/notifications?from=dashboard-auditor"
      : isPresidentArea
        ? "/president/notifications?from=president-dashboard"
        : isContributorArea
          ? `${routePrefix}/notifications?from=contributor-dashboard`
          : "/notifications?from=dashboard"

  const baseNav = isAdminArea
    ? adminNavMain
    : isAuditorArea
      ? auditorNavMain
      : isPresidentArea
        ? presidentNavMain
        : data.navMain

  const navMain = React.useMemo(
    () =>
      baseNav.map((item) => ({
        ...item,
        url:
          item.title === "Notifications"
            ? notificationsHref
            : resolveNavUrl(item.url, routePrefix),
        items: item.items?.map((sub) => ({
          ...sub,
          url: resolveNavUrl(sub.url, routePrefix),
        })),
      })),
    [baseNav, notificationsHref, routePrefix]
  )

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarTrigger />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Account"
              isActive={pathname === "/account"}
              render={<Link to="/account" />}
            >
              <UserCircleIcon />
              <span>Account</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Log out" onClick={() => void handleLogout()}>
              <LogOutIcon />
              <span>Log out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
