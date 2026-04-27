"use client"

import * as React from "react"
import { Link, useLocation } from "react-router-dom"

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
  LogOutIcon,
  UsersIcon,
  UserPlusIcon,
} from "lucide-react"

type SidebarNavItem = {
  title: string
  url: string
  icon: React.ReactNode
  items?: { title: string; url: string }[]
}

function resolveNavUrl(url: string, routePrefix: string) {
  if (!url || url === "#" || !url.startsWith("/")) return url
  return `${routePrefix}${url}`
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
    url: "/dashboard-admin",
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

const auditorNavMain: SidebarNavItem[] = [
  {
    title: "Home",
    url: "/dashboard-auditor",
    icon: <HomeIcon />,
  },
  {
    title: "Notifications",
    url: "/notifications",
    icon: <BellIcon />,
  },
  {
    title: "Queue",
    url: "/action-queue",
    icon: <ClipboardListIcon />,
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const location = useLocation()
  const sourceContext = new URLSearchParams(location.search).get("from")
  const isContributorArea =
    location.pathname.startsWith("/contributor/") ||
    location.pathname === "/contributer-dashboard" ||
    sourceContext === "contributor-dashboard"
  const routePrefix = isContributorArea ? "/contributor" : ""
  const isAdminArea =
    location.pathname === "/dashboard-admin" ||
    location.pathname === "/users" ||
    location.pathname === "/add-user" ||
    (location.pathname === "/notifications" && sourceContext === "dashboard-admin") ||
    location.pathname.startsWith("/admin/")
  const isAuditorArea =
    location.pathname === "/dashboard-auditor" ||
    location.pathname === "/action-queue" ||
    location.pathname === "/objective-queue" ||
    location.pathname === "/review-action" ||
    (location.pathname === "/notifications" && sourceContext === "dashboard-auditor") ||
    location.pathname.startsWith("/auditor/")
  const notificationsHref = isAdminArea
    ? "/notifications?from=dashboard-admin"
    : isAuditorArea
      ? "/notifications?from=dashboard-auditor"
      : isContributorArea
        ? `${routePrefix}/notifications?from=contributor-dashboard`
        : "/notifications?from=dashboard"

  const navMain = React.useMemo(
    () =>
      (isAdminArea ? adminNavMain : isAuditorArea ? auditorNavMain : data.navMain).map((item) => ({
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
    [isAdminArea, isAuditorArea, notificationsHref, routePrefix]
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
            <SidebarMenuButton tooltip="Log out" render={<Link to="/login" />}>
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
