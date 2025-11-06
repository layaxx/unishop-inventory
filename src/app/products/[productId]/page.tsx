import { Metadata } from "next"
import Link from "next/link"
import { Suspense } from "react"
import { invoke } from "src/app/blitz-server"
import getProduct from "../queries/getProduct"
import { Product } from "../components/Product"

export async function generateMetadata(props: ProductPageProps): Promise<Metadata> {
  const params = await props.params
  const product = await invoke(getProduct, { id: Number(params.productId) })
  return {
    title: `Product ${product.id} - ${product.name}`,
  }
}

type ProductPageProps = {
  params: Promise<{ productId: string }>
}

export default async function Page(props: ProductPageProps) {
  const params = await props.params
  return (
    <div>
      <p>
        <Link href={"/products"}>Products</Link>
      </p>
      <Suspense fallback={<div>Loading...</div>}>
        <Product productId={Number(params.productId)} />
      </Suspense>
    </div>
  )
}
