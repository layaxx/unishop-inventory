import { Metadata } from "next"
import Breadcrumbs from "../components/layout/Breadcrumbs"
import { Suspense } from "react"
import StocktakingOverview from "./components/StocktakingOverview"

export const metadata: Metadata = {
  title: "Stocktaking",
  description: "Stocktaking management",
}

export default function Page() {
  return (
    <Breadcrumbs page="Stocktaking" pre={[]}>
      <Suspense fallback={<div>Loading...</div>}>
        <StocktakingOverview />
      </Suspense>
    </Breadcrumbs>
  )
}
