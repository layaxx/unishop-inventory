import { Metadata } from "next"
import { Suspense } from "react"
import Breadcrumbs from "../../components/layout/Breadcrumbs"
import ReportOverview from "./components/ReportOverview"

export const metadata: Metadata = {
  title: "Reports",
  description: "List of Reports",
}

export default function Page() {
  return (
    <Breadcrumbs page="Reports" pre={[]}>
      <div>
        <Suspense fallback={<div>Loading...</div>}>
          <ReportOverview />
        </Suspense>
      </div>
    </Breadcrumbs>
  )
}
