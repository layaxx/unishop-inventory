import { Metadata } from "next"
import Link from "next/link"
import { Suspense } from "react"
import { invoke } from "src/app/blitz-server"
import getLocation from "../queries/getLocation"
import { Location } from "../components/Location"

export async function generateMetadata(props: LocationPageProps): Promise<Metadata> {
  const params = await props.params
  const location = await invoke(getLocation, { id: Number(params.locationId) })
  return {
    title: `Location ${location.id} - ${location.name}`,
  }
}

type LocationPageProps = {
  params: Promise<{ locationId: string }>
}

export default async function Page(props: LocationPageProps) {
  const params = await props.params
  return (
    <div>
      <p>
        <Link href={"/locations"}>Locations</Link>
      </p>
      <Suspense fallback={<div>Loading...</div>}>
        <Location locationId={Number(params.locationId)} />
      </Suspense>
    </div>
  )
}
