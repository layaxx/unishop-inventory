"use client"

import { useQuery } from "@blitzjs/rpc"
import Link from "next/link"
import getProducts from "../queries/getProducts"
import { DataTable } from "@/src/app/components/DataTable"
import { FC } from "react"

type Props = {
  initialData?: Awaited<ReturnType<typeof getProducts>>
}

export const PRODUCTS_PER_PAGE = 100

function getStockCount(product: any) {
  return product.variants.reduce((acc: number, variant: any) => {
    const variantStock = variant.stockLevels.reduce(
      (variantAcc: number, stockLevel: any) => variantAcc + stockLevel.quantity,
      0
    )
    return acc + variantStock
  }, 0)
}

export const ProductsList: FC<Props> = ({ initialData }) => {
  const [res] = useQuery(
    getProducts,
    {
      orderBy: { id: "asc" },
      take: PRODUCTS_PER_PAGE,
    },
    { initialData }
  )

  const { products } = res ?? { products: [] }

  return (
    <div>
      <DataTable
        data={products.map((prod) => ({
          ...prod,
          totalStock: getStockCount(prod),
        }))}
        columns={[
          { accessorKey: "id", header: "ID" },
          {
            accessorKey: "name",
            header: "Name",
            cell: ({ row }) => (
              <Link href={`/products/${row.original.id}`} className="underline">
                {row.original.name}
              </Link>
            ),
          },
          {
            header: "Number of Variants",
            accessorKey: "variants",
            cell: ({ row }) => row.original.variants.length,
          },
          { accessorKey: "totalStock", header: "Total Stock" },
        ]}
      />
    </div>
  )
}
