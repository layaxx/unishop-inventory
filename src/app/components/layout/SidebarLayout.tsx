import { AppSidebar } from "./Sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { ErrorBoundary } from "@blitzjs/next"
import { FC, PropsWithChildren } from "react"
import Error from "../../error"

const SidebarLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <ErrorBoundary FallbackComponent={Error}>{children}</ErrorBoundary>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default SidebarLayout
