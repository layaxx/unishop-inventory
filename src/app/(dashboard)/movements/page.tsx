import { Metadata } from "next"
import { Suspense } from "react"
import Breadcrumbs from "../../components/layout/Breadcrumbs"
import AddMovement from "./components/AddMovement"
import RecentMovements from "./components/RecentMovements"

export const metadata: Metadata = {
  title: "Movements",
  description: "List of Movements",
}

export default function Page() {
  return (
    <Breadcrumbs page="Movements" pre={[]}>
      <div>
        <Suspense fallback={<div>Loading...</div>}>
          <AddMovement />
        </Suspense>

        <Suspense fallback={<div>Loading...</div>}>
          <RecentMovements />
        </Suspense>
      </div>
    </Breadcrumbs>
  )
}
