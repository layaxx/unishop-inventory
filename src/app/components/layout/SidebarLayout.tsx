import { AppSidebar } from "./Sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { ErrorBoundary } from "@blitzjs/next"
import { FC, PropsWithChildren } from "react"

const SidebarLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <ErrorBoundary fallback={<>test fallback</>}>{children}</ErrorBoundary>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default SidebarLayout
