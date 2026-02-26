"use client"

import { FC } from "react"
import { DataTable } from "@/src/app/components/DataTable"
import { useQuery } from "@blitzjs/rpc"
import getProductModifierTypes from "../../queries/getProductModifierTypes"
import React from "react"
import getProductVariantsWithStocksAndValues from "../../queries/getProductVariantsWithStocksAndValues"
type Props = {
  productId: number
  initialTypes?: Awaited<ReturnType<typeof getProductModifierTypes>>
  initialVariants?: Awaited<ReturnType<typeof getProductVariantsWithStocksAndValues>>
}

const VariantOverview: FC<Props> = ({ productId, initialTypes, initialVariants }) => {
  const [types] = useQuery(getProductModifierTypes, { productId }, { initialData: initialTypes })
  const [variants] = useQuery(
    getProductVariantsWithStocksAndValues,
    {
      where: { productId },
    },
    { initialData: initialVariants }
  )

  const tableData = React.useMemo(() => {
    if (!variants || !types || types.length !== 2) return []

    const rows = types[0].values.map((value) => {
      const variant = variants.productVariants.find((v) =>
        v.modifierValues?.some(
          (mv) => mv.modifierTypeId === types[0].id && mv.value === value.value
        )
      )

      const obj: Record<string, any> = { mod0: value.value }

      const stockLevels = variant?.stockLevels ?? []
      const totalStock = stockLevels.reduce(
        (acc: number, level: any) => acc + (level?.quantity ?? 0),
        0
      )
      obj["totalStock"] = totalStock

      types[1].values.forEach((value2) => {
        const variant2 = variants.productVariants.find((v) =>
          v.modifierValues?.some(
            (mv) =>
              mv.modifierTypeId === types[0].id &&
              mv.value === value.value &&
              v.modifierValues?.some(
                (mv2) => mv2.modifierTypeId === types[1].id && mv2.value === value2.value
              )
          )
        )

        const stockLevels2 = variant2?.stockLevels ?? []
        const totalStock2 = stockLevels2.reduce(
          (acc: number, level: any) => acc + (level?.quantity ?? 0),
          0
        )

        obj["mod1_" + value2.id] = totalStock2
      })
      return obj
    })

    return [
      ...rows,
      {
        mod0: "(total)",
        ...rows.reduce((acc, row) => {
          Object.keys(row)
            .filter((key) => key.startsWith("mod1_"))
            .forEach((key) => {
              acc[key] = (acc[key] || 0) + row[key]
            })
          return acc
        }, {}),
        totalStock: rows.reduce((acc, row) => acc + (row.totalStock || 0), 0),
        meta: { align: "right", isBold: true },
      },
    ]
  }, [variants, types])

  if (!types || types.length !== 2) {
    return <p>Short view only available for products with 2 modifier types</p>
  }

  return (
    <div className="mt-4 max-w-fit min-w-1/2 ps-4">
      <h2 className="font-bold text-4xl">Variant Matrix</h2>
      <DataTable
        data={tableData}
        columns={[
          {
            accessorKey: "mod" + 0,
            header: types[0].name,
          },
          ...(types[1].values.map((value) => ({
            accessorKey: "mod" + 1 + "_" + value.id,
            header: value.value,
            meta: { align: "right" as const },
          })) ?? []),
          {
            accessorKey: "totalStock",
            header: "(total)",
            meta: { align: "right" as const },
            cell({ getValue }) {
              return <span className="font-bold text-right w-full">{String(getValue())}</span>
            },
          },
        ]}
      />
    </div>
  )
}

export default VariantOverview
