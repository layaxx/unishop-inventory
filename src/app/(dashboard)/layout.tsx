import { useAuthenticatedBlitzContext, invoke } from "src/app/blitz-server"
import SidebarLayout from "../components/layout/SidebarLayout"
import getProductsSimple from "./products/queries/getProductsSimple"
import getLocations from "./locations/queries/getLocations"

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  await useAuthenticatedBlitzContext({
    redirectTo: "/login",
  })

  // Prefetch sidebar data on server
  const [products, locationsResult] = await Promise.all([
    invoke(getProductsSimple, { select: { id: true, name: true } }),
    invoke(getLocations, { take: 10 }),
  ])

  return (
    <SidebarLayout initialProducts={products} initialLocations={locationsResult.locations}>
      {children}
    </SidebarLayout>
  )
}
