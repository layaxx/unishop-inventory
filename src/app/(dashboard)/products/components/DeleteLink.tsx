"use client"

import { invalidateQuery, useMutation } from "@blitzjs/rpc"
import deleteProduct from "../mutations/deleteProduct"
import { useRouter } from "nextjs-toploader/app"
import getProductsSimple from "../queries/getProductsSimple"
import getProducts from "../queries/getProducts"

export default function DeleteLink({ productId }: { productId: number }) {
  const router = useRouter()
  const [deleteProductMutation] = useMutation(deleteProduct)

  return (
    <button
      type="button"
      onClick={async () => {
        if (window.confirm("This will be deleted")) {
          await deleteProductMutation({ id: productId })
          invalidateQuery(getProducts)
          invalidateQuery(getProductsSimple)
          router.push("/products")
        }
      }}
      style={{ marginLeft: "0.5rem" }}
    >
      Delete
    </button>
  )
}
