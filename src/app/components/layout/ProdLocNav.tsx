"use client"

import { Shirt, Warehouse } from "lucide-react"
import getLocations from "../../(dashboard)/locations/queries/getLocations"
import { useQuery } from "@blitzjs/rpc"
import { NavMain } from "./NavMain"
import getProductsSimple from "../../(dashboard)/products/queries/getProductsSimple"
import { Route } from "next"

type Props = {
  initialProducts: { id: number; name: string }[]
  initialLocations: { id: number; name: string }[]
}

export default function ProdLocNav({ initialProducts, initialLocations }: Props) {
  const [products] = useQuery(
    getProductsSimple,
    { select: { id: true, name: true } },
    { initialData: initialProducts }
  )
  const [locations] = useQuery(
    getLocations,
    { take: 10 },
    { initialData: { locations: initialLocations } }
  )
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
