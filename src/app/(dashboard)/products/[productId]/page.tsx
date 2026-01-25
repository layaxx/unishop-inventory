import { Metadata } from "next"
import { notFound } from "next/navigation"
import { invoke } from "src/app/blitz-server"
import Link from "next/link"

import getProduct from "../queries/getProduct"
import Modifiers from "../components/variants/Modifiers"
import VariantOverview from "../components/variants/VariantOverview"
import DeleteLink from "../components/DeleteLink"

type ProductPageProps = {
  params: Promise<{ productId: string }>
}

export async function generateMetadata(props: ProductPageProps): Promise<Metadata> {
  const { productId } = await props.params
  const id = parseInt(productId)

  if (isNaN(id)) return { title: "Product Not Found" }

  try {
    const product = await invoke(getProduct, { id })
    return { title: `${product.name}` }
  } catch {
    return { title: "Product Not Found" }
  }
}

export default async function Page(props: ProductPageProps) {
  const { productId } = await props.params
  const id = parseInt(productId)

  if (isNaN(id)) notFound()

  const product = await invoke(getProduct, { id }).catch(() => null)

  if (!product) notFound()

  return (
    <div>
      <div>
        <h1 className="text-5xl font-bold">{product.name}</h1>
        <p>{product.description}</p>

        {product.image && <img src={product.image} alt={product.name} width={200} />}

        <Link href={`/products/${product.id}/edit`} className="underline">
          Edit
        </Link>
        <DeleteLink productId={product.id} />

        <Modifiers productId={product.id} />
        <VariantOverview productId={product.id} />
      </div>
    </div>
  )
}
