import { Suspense } from "react"
import HomePageNavigation from "./components/HomePageNavigation"

export default async function Home() {
  return (
    <div className="m-4">
      <h1 className="font-bold text-5xl">UniShop Bamberg</h1>
      <h2 className="font-bold text-2xl">Inventory Management</h2>

      <Suspense fallback={<div className="mt-4">Loading...</div>}>
        <HomePageNavigation />
      </Suspense>
    </div>
  )
}
