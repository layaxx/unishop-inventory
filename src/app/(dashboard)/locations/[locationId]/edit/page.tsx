import { Metadata } from "next"
import { Suspense } from "react"
import { invoke } from "src/app/blitz-server"
import getLocation from "../../queries/getLocation"
import { EditLocation } from "../../components/EditLocation"

type EditLocationPageProps = {
  params: Promise<{ locationId: string }>
}

export async function generateMetadata(props: EditLocationPageProps): Promise<Metadata> {
  const params = await props.params
  const Location = await invoke(getLocation, { id: Number(params.locationId) })
  return {
    title: `Edit Location ${Location.id} - ${Location.name}`,
  }
}

export default async function Page(props: EditLocationPageProps) {
  const params = await props.params
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <EditLocation locationId={Number(params.locationId)} />
      </Suspense>
    </div>
  )
}
