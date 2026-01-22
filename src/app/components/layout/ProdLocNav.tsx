"use client"

import { Shirt, Warehouse } from "lucide-react"
import getLocations from "../../(dashboard)/locations/queries/getLocations"
import getProducts from "../../(dashboard)/products/queries/getProducts"
import { useQuery } from "@blitzjs/rpc"
import { NavMain } from "./NavMain"

export default function ProdLocNav() {
  const [products] = useQuery(getProducts, { take: 5 })
  const [locations] = useQuery(getLocations, { take: 10 })
  return (
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
  )
}
