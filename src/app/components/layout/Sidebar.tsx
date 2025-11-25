"use client"

import { Shirt, Warehouse } from "lucide-react"

import { NavMain } from "./NavMain"
import { NavUser } from "./NavUser"
import { TopNav } from "./TopNav"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useQuery } from "@blitzjs/rpc"
import { NavProjects } from "./NavProjects"
import getProducts from "../../(dashboard)/products/queries/getProducts"
import getLocations from "../../(dashboard)/locations/queries/getLocations"
import { NavMovements } from "./NavMovement"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [products] = useQuery(getProducts, { take: 5 })
  const [locations] = useQuery(getLocations, { take: 10 })

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TopNav />
      </SidebarHeader>
      <SidebarContent>
        <NavMain
          items={[
            {
              title: "Products",
              url: "/products",
              icon: Shirt,
              isActive: true,
              items: [
                ...(products?.products.map((product) => ({
                  title: product.name,
                  url: `/products/${product.id}`,
                })) ?? []),
                { title: "all products...", url: "/products" },
              ],
            },
            {
              title: "Locations",
              url: "/locations",
              icon: Warehouse,
              isActive: true,
              items: [
                ...(locations?.locations.map((location) => ({
                  title: location.name,
                  url: `/locations/${location.id}`,
                })) ?? []),
                { title: "all locations...", url: "/locations" },
              ],
            },
          ]}
        />
        <NavProjects />
        <NavMovements />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
