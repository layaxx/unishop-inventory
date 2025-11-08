"use client"

import { Shirt } from "lucide-react"

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
import getProducts from "../../products/queries/getProducts"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [products] = useQuery(getProducts, { take: 5 })

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
              url: "#",
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
          ]}
        />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
