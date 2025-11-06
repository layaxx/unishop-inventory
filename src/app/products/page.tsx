import { Metadata } from "next"
import Link from "next/link"
import { Suspense } from "react"
import { ProductsList } from "./components/ProductsList"

export const metadata: Metadata = {
  title: "Products",
  description: "List of Products",
}

export default function Page() {
  return (
    <div>
      <p>
        <Link href={"/products/new"}>Create Product</Link>
      </p>
      <Suspense fallback={<div>Loading...</div>}>
        <ProductsList />
      </Suspense>
    </div>
  )
}
