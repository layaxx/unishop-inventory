import { Metadata } from "next"
import { Suspense } from "react"
import { invoke } from "src/app/blitz-server"
import getProduct from "../../queries/getProduct"
import { EditProduct } from "../../components/EditProduct"

type EditLocationPageProps = {
  params: Promise<{ productId: string }>
}

export async function generateMetadata(props: EditLocationPageProps): Promise<Metadata> {
  const params = await props.params
  const Location = await invoke(getProduct, { id: Number(params.productId) })
  return {
    title: `Edit Location ${Location.id} - ${Location.name}`,
  }
}

export default async function Page(props: EditLocationPageProps) {
  const params = await props.params
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <EditProduct productId={Number(params.productId)} />
      </Suspense>
    </div>
  )
}
