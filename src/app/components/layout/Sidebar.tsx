"use client"

import { TopNav } from "./TopNav"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
  SidebarRail,
} from "@/components/ui/sidebar"
import { NavProjects } from "./NavProjects"
import { NavMovements } from "./NavMovement"
import NavReports from "./NavReports"
import { Suspense } from "react"
import ProdLocNav from "./ProdLocNav"
import dynamic from "next/dynamic"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ChevronsUpDown } from "lucide-react"

const NavUser = dynamic(() => import("./NavUser").then((mod) => mod.NavUser), {
  ssr: false,
  loading() {
    return (
      <SidebarMenuButton size="lg" className="">
        <Avatar className="h-8 w-8 rounded-lg">
          <AvatarFallback className="rounded-lg">-</AvatarFallback>
        </Avatar>
        <div className="grid flex-1 text-left text-sm leading-tight animate-pulse">
          <span className="h-4 bg-neutral-300 truncate font-medium"></span>
          <span className="h-4 bg-neutral-300 truncate text-xs"></span>
        </div>
        <ChevronsUpDown className="ml-auto size-4" />
      </SidebarMenuButton>
    )
  },
})

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  initialProducts: { id: number; name: string }[]
  initialLocations: { id: number; name: string }[]
}

export function AppSidebar({ initialProducts, initialLocations, ...props }: AppSidebarProps) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TopNav />
      </SidebarHeader>
      <SidebarContent>
        <ProdLocNav initialProducts={initialProducts} initialLocations={initialLocations} />
        <NavMovements />
        <NavProjects />
        <NavReports />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
