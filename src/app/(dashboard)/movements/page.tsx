import { Metadata } from "next"
import { Suspense } from "react"
import Breadcrumbs from "../../components/layout/Breadcrumbs"
import AddMovement from "./components/AddMovement"
import RecentMovements from "./components/RecentMovements"
import { invoke } from "src/app/blitz-server"
import getRecentMovements from "./queries/getRecentMovements"

export const metadata: Metadata = {
  title: "Movements",
  description: "List of Movements",
}

export default async function Page() {
  // Prefetch on server
  const initialMovements = await invoke(getRecentMovements, {})

  return (
    <Breadcrumbs page="Movements" pre={[]}>
      <div>
        <Suspense fallback={<div>Loading...</div>}>
          <AddMovement />
        </Suspense>

        <RecentMovements initialData={initialMovements} />
      </div>
    </Breadcrumbs>
  )
}
