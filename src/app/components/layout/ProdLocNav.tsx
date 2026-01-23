"use client"

import { Shirt, Warehouse } from "lucide-react"
import getLocations from "../../(dashboard)/locations/queries/getLocations"
import { useQuery } from "@blitzjs/rpc"
import { NavMain } from "./NavMain"
import getProductsSimple from "../../(dashboard)/products/queries/getProductsSimple"
import { Route } from "next"

export default function ProdLocNav() {
  const [products] = useQuery(getProductsSimple, { select: { id: true, name: true } })
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
            ...(products?.map((product) => ({
              title: product.name,
              url: `/products/${product.id}`,
            })) ?? []),
            { title: "all products...", url: "/products" },
          ],
          searchThrough:
            products?.map((product) => ({
              id: product.id,
              title: product.name,
              url: `/products/${product.id}` as Route,
            })) ?? [],
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
