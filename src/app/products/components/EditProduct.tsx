"use client"
import { Suspense } from "react"
import { UpdateProductSchema } from "../schemas"
import { FORM_ERROR, ProductForm } from "./ProductForm"
import { useMutation, useQuery } from "@blitzjs/rpc"
import { useRouter } from "next/navigation"
import getProduct from "../queries/getProduct"
import updateProduct from "../mutations/updateProduct"

export const EditProduct = ({ productId }: { productId: number }) => {
  const [product, { setQueryData }] = useQuery(
    getProduct,
    { id: productId },
    {
      // This ensures the query never refreshes and overwrites the form data while the user is editing.
      staleTime: Infinity,
    }
  )
  const [updateProductMutation] = useMutation(updateProduct)
  const router = useRouter()

  if (!product) return <div>Product not found</div>

  return (
    <>
      <div>
        <h1>Edit Product {product.id}</h1>
        <pre>{JSON.stringify(product, null, 2)}</pre>
        <Suspense fallback={<div>Loading...</div>}>
          <ProductForm
            submitText="Update Product"
            schema={UpdateProductSchema}
            initialValues={product}
            onSubmit={async (values) => {
              try {
                const updated = await updateProductMutation({
                  ...values,
                  id: product.id,
                })
                await setQueryData(updated)
                router.refresh()
              } catch (error: any) {
                console.error(error)
                return {
                  [FORM_ERROR]: error.toString(),
                }
              }
            }}
          />
        </Suspense>
      </div>
    </>
  )
}
