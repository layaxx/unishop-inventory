"use client"

import { useQuery } from "@blitzjs/rpc"
import getInventoryEntries from "../queries/getInventoryEntries"
import getLocations from "../../locations/queries/getLocations"
import { Card, CardAction, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

const StocktakingOverview = () => {
  const [inventoryEntries] = useQuery(getInventoryEntries, {})

  const [locations] = useQuery(getLocations, {})

  return (
    <div className="mt-4 flex flex-wrap gap-4">
      {locations?.locations.map((location) => (
        <Card key={location.id} className="w-full max-w-5/12">
          <CardHeader>
            <CardTitle>{location.name}</CardTitle>
            <CardDescription>
              {inventoryEntries?.some((entry) => entry.locationId === location.id)
                ? "There is an active stocktaking process at this location."
                : "No stocktaking active."}
            </CardDescription>
            <CardAction>
              <Link href={`/stock-taking/locations/${location.id}`}>Go to process</Link>
            </CardAction>
          </CardHeader>
        </Card>
      ))}
    </div>
  )
}

export default StocktakingOverview
