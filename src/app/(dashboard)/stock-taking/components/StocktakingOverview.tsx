"use client"

import { useMutation, useQuery } from "@blitzjs/rpc"
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
import CombinedPDF from "./CombinedPDF"
import PastReports from "../../reports/components/PastReports"
import { Await } from "blitz"
import { FC } from "react"

type Props = {
  inventoryEntriesInitialData?: Await<ReturnType<typeof getInventoryEntries>>
  locationsInitialData?: Await<ReturnType<typeof getLocations>>
  auditsInitialData?: Await<ReturnType<typeof getLastStocktakingProcesses>>
}

const StocktakingOverview: FC<Props> = ({
  inventoryEntriesInitialData,
  locationsInitialData,
  auditsInitialData,
}) => {
  const [inventoryEntries] = useQuery(
    getInventoryEntries,
    {},
    { initialData: inventoryEntriesInitialData }
  )
  const [locations] = useQuery(getLocations, {}, { initialData: locationsInitialData })
  const [audits] = useQuery(getLastStocktakingProcesses, {}, { initialData: auditsInitialData })

  return (
    <>
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
      <div>
        <CombinedPDF />

        <PastReports />
      </div>
    </>
  )
}

export default StocktakingOverview
