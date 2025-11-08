import { useAuthenticatedBlitzContext } from "src/app/blitz-server"
import SidebarLayout from "../components/layout/SidebarLayout"

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  await useAuthenticatedBlitzContext({
    redirectTo: "/login",
  })
  return SidebarLayout({ children, breadcrumbs: { page: "Products", pre: [] } })
}
