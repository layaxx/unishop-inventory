"use client"

import { ClipboardClock } from "lucide-react"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"

export function NavMovements() {
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Movements</SidebarGroupLabel>
      <SidebarMenu>
        <SidebarMenuItem>
          <Link href="/movements">
            <SidebarMenuButton className="text-sidebar-foreground/70">
              <ClipboardClock className="text-sidebar-foreground/70" />
              {<span>Log a Movement</span>}
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  )
}
