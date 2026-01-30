import { AppSidebar } from "./Sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { ErrorBoundary } from "@blitzjs/next"
import { FC, PropsWithChildren } from "react"
import Error from "../../error"

type Props = PropsWithChildren<{
  initialProducts: { id: number; name: string }[]
  initialLocations: { id: number; name: string }[]
}>

const SidebarLayout: FC<Props> = ({ children, initialProducts, initialLocations }) => {
  return (
    <SidebarProvider>
      <AppSidebar initialProducts={initialProducts} initialLocations={initialLocations} />
      <SidebarInset>
        <ErrorBoundary FallbackComponent={Error}>{children}</ErrorBoundary>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default SidebarLayout
