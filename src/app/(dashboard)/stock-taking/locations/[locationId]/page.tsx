import { Metadata } from "next"
import StocktakingLocationOverview from "../../components/StocktakingLocationOverview"
import getLocation from "../../../locations/queries/getLocation"
import getInventoryEntries from "../../queries/getInventoryEntries"
import { invoke } from "@/src/app/blitz-server"

export const metadata: Metadata = {
  title: "Stocktaking",
  description: "Stocktaking management",
}

type LocationPageProps = {
  params: Promise<{ locationId: string }>
}

export default async function Page(props: LocationPageProps) {
  const params = await props.params

  const [locationInitialData, inventoryEntriesInitialData] = await Promise.all([
    invoke(getLocation, { id: Number(params.locationId) }),
    invoke(getInventoryEntries, { where: { locationId: Number(params.locationId) } }),
  ])

  return (
    <StocktakingLocationOverview
      locationInitialData={locationInitialData}
      inventoryEntriesInitialData={inventoryEntriesInitialData}
    />
  )
}
