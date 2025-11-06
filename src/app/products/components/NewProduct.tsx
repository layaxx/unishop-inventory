"use client"
import { FORM_ERROR, ProductForm } from "./ProductForm"
import { CreateProductSchema } from "../schemas"
import { useMutation } from "@blitzjs/rpc"
import { useRouter } from "next/navigation"
import createProduct from "../mutations/createProduct"

export function New__ModelName() {
  const [createProductMutation] = useMutation(createProduct)
  const router = useRouter()
  return (
    <ProductForm
      submitText="Create Product"
      schema={CreateProductSchema}
      initialValues={{ name: "", sku: "", image: "", description: "" }}
      onSubmit={async (values) => {
        try {
          const product = await createProductMutation(values)
          router.push(`/products/${product.id}`)
        } catch (error: any) {
          console.error(error)
          return {
            [FORM_ERROR]: error.toString(),
          }
        }
      }}
    />
  )
}
