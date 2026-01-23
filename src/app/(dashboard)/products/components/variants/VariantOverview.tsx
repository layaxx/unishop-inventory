"use client"

import { FC } from "react"
import { DataTable } from "@/src/app/components/DataTable"
import { ProductModifierType, ProductVariant, Location } from "@prisma/client"

const VariantOverview: FC<{
  locations: Location[]
  types: ProductModifierType[]
  variants: ProductVariant[]
}> = ({ locations, types, variants }) => {
  return (
    <div className="mt-4">
      <h2 className="font-bold text-4xl">Variants</h2>
      <DataTable
        data={
          variants.map((x) => {
            const stockLevels = Array.isArray((x as any).stockLevels) ? (x as any).stockLevels : []
            const totalStock = stockLevels.reduce(
              (acc: number, level: any) => acc + (level?.quantity ?? 0),
              0
            )

            const obj: Record<string, string | number> = {
              totalStock,
            }
            for (const location of locations ?? []) {
              const level = stockLevels.find((sl: any) => sl.locationId === location.id)
              obj["loc" + location.id] = level ? level.quantity : -999
            }

            for (const type of types ?? []) {
              const value = ((x as any).modifierValues as any[] | undefined)?.find(
                (mv) => mv.modifierTypeId === type.id
              )?.value

              obj["mod" + type.id] = value || "(Default)"
            }

            if (types?.length === 0) {
              obj["x"] = "(Default)"
            }

            return obj
          }) ?? []
        }
        columns={[
          ...((types ?? []).map((type) => ({
            accessorKey: "mod" + type.id,
            header: type.name,
          })) as any),
          ...(types?.length === 0
            ? [
                {
                  accessorKey: "x",
                  header: "Name",
                },
              ]
            : []),
          ...(locations.map((location) => ({
            accessorKey: `loc${location.id}`,
            header: `Stock (${location.name})`,
          })) ?? []),
          {
            accessorKey: "totalStock",
            header: "Stock (total)",
          },
        ]}
      />
    </div>
  )
}

export default VariantOverview
