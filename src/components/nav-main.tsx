import * as React from "react"
import { Link } from "react-router-dom"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Popover,
  PopoverContent,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import { ChevronRightIcon } from "lucide-react"

type NavItem = {
  title: string
  url: string
  icon?: React.ReactNode
  isActive?: boolean
  items?: {
    title: string
    url: string
  }[]
}

function NavSubmenuPopover({ item }: { item: NavItem }) {
  const [open, setOpen] = React.useState(false)
  const subItems = item.items ?? []

  return (
    <SidebarMenuItem>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          render={
            <SidebarMenuButton tooltip={item.title} render={<button type="button" />} />
          }
        >
          {item.icon}
          <span>{item.title}</span>
        </PopoverTrigger>
        <PopoverContent
          side="right"
          align="start"
          sideOffset={8}
          className="w-56 p-1"
        >
          <PopoverTitle className="sr-only">{item.title}</PopoverTitle>
          <nav className="flex flex-col gap-0.5" aria-label={item.title}>
            {subItems.map((subItem) => (
              <Link
                key={subItem.title}
                to={subItem.url}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-md px-2 py-2 text-sm text-popover-foreground outline-none ring-ring/50 transition-colors",
                  "hover:bg-accent hover:text-accent-foreground focus-visible:ring-2",
                )}
              >
                {subItem.title}
              </Link>
            ))}
          </nav>
        </PopoverContent>
      </Popover>
    </SidebarMenuItem>
  )
}

export function NavMain({ items }: { items: NavItem[] }) {
  const { state, isMobile } = useSidebar()
  const useCollapsedSubmenu =
    state === "collapsed" && !isMobile

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => {
          const hasSubmenu = Boolean(item.items?.length)

          if (hasSubmenu && useCollapsedSubmenu) {
            return <NavSubmenuPopover key={item.title} item={item} />
          }

          return (
            <Collapsible
              key={item.title}
              defaultOpen={item.isActive}
              className="group/collapsible"
              render={<SidebarMenuItem />}
            >
              <CollapsibleTrigger
                render={<SidebarMenuButton tooltip={item.title} render={<Link to={item.url} />} />}
              >
                {item.icon}
                <span>{item.title}</span>
                {item.items?.length ? (
                  <ChevronRightIcon className="ml-auto transition-transform duration-200 group-data-open/collapsible:rotate-90" />
                ) : null}
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.items?.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton render={<Link to={subItem.url} />}>
                        <span>{subItem.title}</span>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </Collapsible>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
