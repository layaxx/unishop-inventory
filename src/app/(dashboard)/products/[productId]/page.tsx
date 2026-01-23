import { Metadata } from "next"
import { invoke } from "src/app/blitz-server"
import getProduct from "../queries/getProduct"
import Link from "next/link"
import Modifiers from "../components/variants/Modifiers"
import VariantOverview from "../components/variants/VariantOverview"
import getProductModifierTypes from "../queries/getProductModifierTypes"
import getProductVariants from "../queries/getProductVariants"
import getLocations from "../../locations/queries/getLocations"
import DeleteLink from "../components/DeleteLink"

export async function generateMetadata(props: ProductPageProps): Promise<Metadata> {
  const params = await props.params
  if (!params.productId || isNaN(Number(params.productId))) {
    return {
      title: "Product - Unknown",
    }
  }
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

  if (!params.productId) {
    return <div>Product ID is required</div>
  }

  const product = await invoke(getProduct, { id: 1 })

  const types = await invoke(getProductModifierTypes, {
    productId: Number(params.productId),
  })

  const variants = await invoke(getProductVariants, {
    where: { productId: Number(params.productId) },
    include: { modifierValues: true, stockLevels: true },
  })
  const locations = await invoke(getLocations, { take: 100 })

  return (
    <div>
      <div>
        <h1 className="text-5xl font-bold">{product.name}</h1>
        <p>Product {product.id}</p>
        <p>{product.description}</p>

        {product.image && <img src={product.image} alt={product.name} width={200} />}

        <Link href={`/products/${product.id}/edit`}>Edit</Link>
        <DeleteLink productId={product.id} />

        <Modifiers types={types} productId={product.id} />
        <VariantOverview
          locations={locations.locations}
          types={types}
          variants={variants.productVariants}
        />
      </div>
    </div>
  )
}
