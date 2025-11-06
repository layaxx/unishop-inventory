"use client"
import { usePaginatedQuery } from "@blitzjs/rpc"
import Link from "next/link"
import { useRouter } from "next/navigation"
import getProducts from "../queries/getProducts"
import { useSearchParams } from "next/navigation"
import { usePathname } from "next/navigation"
import { Route } from "next"

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

  const { products, hasMore } = res ?? { locations: [], hasMore: false }
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
      <ul>
        {products?.map((product) => (
          <li key={product.id}>
            <Link href={`/products/${product.id}`}>
              {product.name} ({product.variants.length} Variants) [{getStockCount(product)} items]
            </Link>
          </li>
        ))}
      </ul>

      <button disabled={page === 0} onClick={goToPreviousPage}>
        Previous
      </button>
      <button disabled={!hasMore} onClick={goToNextPage}>
        Next
      </button>
    </div>
  )
}
