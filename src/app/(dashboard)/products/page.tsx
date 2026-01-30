import { Metadata } from "next"
import Link from "next/link"
import { PRODUCTS_PER_PAGE, ProductsList } from "./components/ProductsList"
import Breadcrumbs from "../../components/layout/Breadcrumbs"
import getProducts from "./queries/getProducts"
import { invoke } from "../../blitz-server"

export const metadata: Metadata = {
  title: "Products",
  description: "List of Products",
}

export default async function Page() {
  const initialData = await invoke(getProducts, {
    orderBy: { id: "asc" },
    take: 100,
  })

  return (
    <Breadcrumbs page="Products" pre={[]} createNew="/products/new">
      <div>
        <p className="underline">
          <Link href="/products/new">Create Product</Link>
        </p>
        <ProductsList initialData={initialData} />
      </div>
    </Breadcrumbs>
  )
}
