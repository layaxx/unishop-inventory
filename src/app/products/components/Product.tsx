"use client"
import { useMutation, useQuery } from "@blitzjs/rpc"
import Link from "next/link"
import { useRouter } from "next/navigation"
import deleteProduct from "../mutations/deleteProduct"
import getProduct from "../queries/getProduct"
import Modifiers from "./variants/Modifiers"
import VariantOverview from "./variants/VariantOverview"

export const Product = ({ productId }: { productId: number }) => {
  const router = useRouter()
  const [deleteProductMutation] = useMutation(deleteProduct)
  const [product] = useQuery(getProduct, { id: productId })

  if (!product) return <></>

  return (
    <>
      <div>
        <h1 className="text-5xl font-bold">{product.name}</h1>
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

        <h2 className="font-bold text-4xl">Variants</h2>
        <Modifiers productId={product.id} />
        <VariantOverview productId={product.id} />
      </div>
    </>
  )
}
