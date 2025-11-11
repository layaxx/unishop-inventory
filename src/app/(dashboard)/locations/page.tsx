import { Metadata } from "next"
import Link from "next/link"
import { Suspense } from "react"
import { LocationsList } from "./components/LocationsList"
import Breadcrumbs from "../../components/layout/Breadcrumbs"

export const metadata: Metadata = {
  title: "Locations",
  description: "List of locations",
}

export default function Page() {
  return (
    <Breadcrumbs page="Locations" pre={[]}>
      <div>
        <p className="underline">
          <Link href={"/locations/new"}>Create Location</Link>
        </p>
        <Suspense fallback={<div>Loading...</div>}>
          <LocationsList />
        </Suspense>
      </div>
    </Breadcrumbs>
  )
}
