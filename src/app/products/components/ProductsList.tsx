"use client"
import { usePaginatedQuery } from "@blitzjs/rpc"
import Link from "next/link"
import { useRouter } from "next/navigation"
import getProducts from "../queries/getProducts"
import { useSearchParams } from "next/navigation"
import { usePathname } from "next/navigation"
import { Route } from "next"
import { Button } from "@/components/ui/button"
import { DataTable } from "../../components/DataTable"
import { ButtonGroup, ButtonGroupSeparator } from "@/components/ui/button-group"

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
  const searchparams = useSearchParams()!
  const page = Number(searchparams.get("page")) || 0
  const [res] = usePaginatedQuery(getProducts, {
    where: {},
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })

  const { products, hasMore } = res ?? { products: [], hasMore: false }
  const router = useRouter()
  const pathname = usePathname()

  const goToPreviousPage = () => {
    const params = new URLSearchParams(searchparams)
    params.set("page", (page - 1).toString())
    router.push((pathname + "?" + params.toString()) as Route)
  }
  const goToNextPage = () => {
    const params = new URLSearchParams(searchparams)
    params.set("page", (page + 1).toString())
    router.push((pathname + "?" + params.toString()) as Route)
  }

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

      <ButtonGroup>
        <Button disabled={page === 0} onClick={goToPreviousPage} variant="outline">
          Previous
        </Button>
        <ButtonGroupSeparator />
        <Button disabled={!hasMore} onClick={goToNextPage} variant="outline">
          Next
        </Button>
      </ButtonGroup>
    </div>
  )
}
