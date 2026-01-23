"use client"

import { useQuery } from "@blitzjs/rpc"
import Link from "next/link"
import getProducts from "../queries/getProducts"
import { DataTable } from "@/src/app/components/DataTable"

const ITEMS_PER_PAGE = 100

function getStockCount(product: any) {
  return product.variants.reduce((acc: number, variant: any) => {
    const variantStock = variant.stockLevels.reduce(
      (variantAcc: number, stockLevel: any) => variantAcc + stockLevel.quantity,
      0
    )
    return acc + variantStock
  }, 0)
}

export const ProductsList = () => {
  const [res] = useQuery(getProducts, {
    orderBy: { id: "asc" },
    take: ITEMS_PER_PAGE,
  })

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
