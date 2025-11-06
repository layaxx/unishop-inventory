"use client"
import { useMutation, useQuery } from "@blitzjs/rpc"
import Link from "next/link"
import { useRouter } from "next/navigation"
import deleteProduct from "../mutations/deleteProduct"
import getProduct from "../queries/getProduct"
import Variants from "./variants/Variants"

export const Product = ({ productId }: { productId: number }) => {
  console.log("Product component rendered with productId:", productId, typeof productId)
  const router = useRouter()
  const [deleteProductMutation] = useMutation(deleteProduct)
  const [product] = useQuery(getProduct, { id: productId })

  if (!product) return

  return (
    <>
      <div>
        <h1>{product.name}</h1>
        <p>Product {product.id}</p>
        <p>{product.description}</p>

        {product.image && <img src={product.image} alt={product.name} width={200} />}

        <Link href={`/products/${product.id}/edit`}>Edit</Link>

        <button
          type="button"
          onClick={async () => {
            if (window.confirm("This will be deleted")) {
              await deleteProductMutation({ id: product.id })
              router.push("/products")
            }
          }}
          style={{ marginLeft: "0.5rem" }}
        >
          Delete
        </button>

        <h2>Variants</h2>
        <Variants productId={product.id} />
      </div>
    </>
  )
}
