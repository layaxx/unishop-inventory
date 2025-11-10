import { Metadata } from "next"
import { Suspense } from "react"
import StocktakingLocationOverview from "../../components/StocktakingLocationOverview"

export const metadata: Metadata = {
  title: "Stocktaking",
  description: "Stocktaking management",
}

type LocationPageProps = {
  params: Promise<{ locationId: string }>
}

export default async function Page(props: LocationPageProps) {
  const params = await props.params
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <StocktakingLocationOverview locationId={Number(params.locationId)} />
    </Suspense>
  )
}
