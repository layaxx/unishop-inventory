"use client"

import { Folder, FolderOpen } from "lucide-react"

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useQuery } from "@blitzjs/rpc"
import Link from "next/link"
import isActiveInventoryQuery from "../../(dashboard)/stock-taking/queries/isActiveInventory"

export function NavProjects() {
  const [isActiveInventory] = useQuery(isActiveInventoryQuery, {})

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Stocktaking</SidebarGroupLabel>
      <SidebarMenu>
        <SidebarMenuItem>
          <Link href="/stock-taking/">
            <SidebarMenuButton className="text-sidebar-foreground/70">
              {isActiveInventory ? (
                <FolderOpen className="text-sidebar-foreground/70" />
              ) : (
                <Folder className="text-sidebar-foreground/70" />
              )}
              {isActiveInventory ? <span>Running...</span> : <span>Start Stocktaking</span>}
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  )
}
