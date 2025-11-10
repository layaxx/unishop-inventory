import { Metadata } from "next"
import { Suspense } from "react"
import { NewProduct } from "../components/NewProduct"

export const metadata: Metadata = {
  title: "New Product",
  description: "Create a new product",
}

export default function Page() {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-2">Create New Product</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <NewProduct />
      </Suspense>
    </div>
  )
}
