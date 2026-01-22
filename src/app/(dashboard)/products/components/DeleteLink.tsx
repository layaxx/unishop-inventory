"use client"

import { useMutation } from "@blitzjs/rpc"
import deleteProduct from "../mutations/deleteProduct"
import { useRouter } from "next/navigation"

export default function DeleteLink({ productId }: { productId: number }) {
  const router = useRouter()
  const [deleteProductMutation] = useMutation(deleteProduct)

  return (
    <button
      type="button"
      onClick={async () => {
        if (window.confirm("This will be deleted")) {
          await deleteProductMutation({ id: productId })
          router.push("/products")
        }
      }}
      style={{ marginLeft: "0.5rem" }}
    >
      Delete
    </button>
  )
}
