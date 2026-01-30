"use client"

import { FC } from "react"
import { DataTable } from "@/src/app/components/DataTable"
import { useQuery } from "@blitzjs/rpc"
import getLocations from "../../../locations/queries/getLocations"
import getProductModifierTypes from "../../queries/getProductModifierTypes"
import React from "react"
import getProductVariantsWithStocksAndValues from "../../queries/getProductVariantsWithStocksAndValues"
import { makeVariantSortFunction } from "@/src/lib/variant"

type Props = {
  productId: number
  initialTypes?: Awaited<ReturnType<typeof getProductModifierTypes>>
  initialVariants?: Awaited<ReturnType<typeof getProductVariantsWithStocksAndValues>>
  initialLocations?: Awaited<ReturnType<typeof getLocations>>
}

const VariantOverview: FC<Props> = ({
  productId,
  initialTypes,
  initialVariants,
  initialLocations,
}) => {
  const [types] = useQuery(getProductModifierTypes, { productId }, { initialData: initialTypes })
  const [variants] = useQuery(
    getProductVariantsWithStocksAndValues,
    {
      where: { productId },
    },
    { initialData: initialVariants }
  )
  const [locations] = useQuery(getLocations, { take: 100 }, { initialData: initialLocations })

  const tableData = React.useMemo(() => {
    const temp =
      variants?.productVariants.sort(makeVariantSortFunction(types)).map((variant) => {
        const stockLevels = variant.stockLevels ?? []
        const totalStock = stockLevels.reduce(
          (acc: number, level: any) => acc + (level?.quantity ?? 0),
          0
        )

        const obj: Record<string, string | number | number[]> = {
          totalStock,
        }
        for (const location of locations?.locations ?? []) {
          const level = stockLevels.find((sl) => sl.locationId === location.id)
          obj["loc" + location.id] = level ? level.quantity : -999
        }

        types?.forEach((type, index) => {
          const value = variant.modifierValues?.find((mv) => mv.modifierTypeId === type.id)?.value

          obj["mod" + index] = value || "(Default)"
        })

        if (types?.length === 0) {
          obj["x"] = "(Default)"
        }
        return obj
      }) ?? []

    temp.sort()

    let previousValue: string | number | number[] | undefined = undefined
    return temp.map((x, _idx, array) => {
      x.rowspan = 1
      const thisValue = x["mod0"]
      if (thisValue === previousValue) {
        x.rowspan = 0
      } else {
        // number of identical values
        x.rowspan = array.filter((v) => {
          return v["mod0"] === thisValue
        }).length
      }
      previousValue = thisValue

      return x
    })
  }, [variants, types, locations])

  return (
    <div className="mt-4">
      <h2 className="font-bold text-4xl">Variants</h2>
      <DataTable
        data={tableData}
        columns={[
          ...(types ?? []).map((type, idx) => ({
            accessorKey: "mod" + idx,
            header: type.name,
            enableRowSpan: true,
          })),
          ...(types?.length === 0
            ? [
                {
                  accessorKey: "x",
                  header: "Name",
                },
              ]
            : []),
          ...(locations?.locations.map((location) => ({
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
