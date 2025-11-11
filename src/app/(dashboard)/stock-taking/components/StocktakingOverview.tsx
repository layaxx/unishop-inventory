"use client"

import { useQuery } from "@blitzjs/rpc"
import getInventoryEntries from "../queries/getInventoryEntries"
import getLocations from "../../locations/queries/getLocations"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Link from "next/link"
import getLastStocktakingProcesses from "../queries/getLastStocktakingProcesses"
import dayjs from "dayjs"

const StocktakingOverview = () => {
  const [inventoryEntries] = useQuery(getInventoryEntries, {})
  const [locations] = useQuery(getLocations, {})
  const [audits] = useQuery(getLastStocktakingProcesses, {})

  return (
    <div className="mt-4 flex flex-wrap gap-4">
      {locations?.locations.map((location) => {
        const lastAudit = audits?.find((audit) => audit.locationId === location.id)
        const lastAuditDate = lastAudit
          ? dayjs(lastAudit?.createdAt).format("DD.MM.YYYY")
          : "No audit found"

        return (
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
            <CardContent>
              <p>
                Last completed Stocktaking process: {lastAuditDate}{" "}
                {lastAudit && (
                  <a
                    href={`/api/audit/${lastAudit.id}/pdf`}
                    download="report.pdf"
                    className="underline"
                  >
                    (Download PDF)
                  </a>
                )}
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

export default StocktakingOverview
