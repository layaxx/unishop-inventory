import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import { FileSpreadsheet } from "lucide-react"
import Link from "next/link"

const NavReports = () => {
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Reports</SidebarGroupLabel>
      <SidebarMenu>
        <SidebarMenuItem>
          <Link href="/reports">
            <SidebarMenuButton className="text-sidebar-foreground/70">
              <FileSpreadsheet className="text-sidebar-foreground/70" />
              <span>View Reports</span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  )
}

export default NavReports
