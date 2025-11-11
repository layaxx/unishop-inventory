"use client"
import { FORM_ERROR, ProductForm } from "./ProductForm"
import { CreateProductSchema } from "../schemas"
import { invalidateQuery, useMutation } from "@blitzjs/rpc"
import { useRouter } from "next/navigation"
import createProduct from "../mutations/createProduct"
import getProducts from "../queries/getProducts"

export function NewProduct() {
  const [createProductMutation] = useMutation(createProduct)
  const router = useRouter()
  return (
    <ProductForm
      submitText="Create Product"
      schema={CreateProductSchema}
      initialValues={{ name: "", image: "", description: "" }}
      onSubmit={async (values) => {
        try {
          const product = await createProductMutation(values)
          invalidateQuery(getProducts)
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
