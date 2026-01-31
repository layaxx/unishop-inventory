import { Metadata } from "next"
import StocktakingOverview from "./components/StocktakingOverview"
import Breadcrumbs from "../../components/layout/Breadcrumbs"
import getLastStocktakingProcesses from "./queries/getLastStocktakingProcesses"
import { invoke } from "../../blitz-server"
import getLocations from "../locations/queries/getLocations"
import getInventoryEntries from "./queries/getInventoryEntries"

export const metadata: Metadata = {
  title: "Stocktaking",
  description: "Stocktaking management",
}

export default async function Page() {
  const [inventoryEntriesInitialData, locationsInitialData, auditsInitialData] = await Promise.all([
    invoke(getInventoryEntries, {}),
    invoke(getLocations, {}),
    invoke(getLastStocktakingProcesses, {}),
  ])

  return (
    <Breadcrumbs page="Stocktaking" pre={[]}>
      <StocktakingOverview
        inventoryEntriesInitialData={inventoryEntriesInitialData}
        locationsInitialData={locationsInitialData}
        auditsInitialData={auditsInitialData}
      />
    </Breadcrumbs>
  )
}
