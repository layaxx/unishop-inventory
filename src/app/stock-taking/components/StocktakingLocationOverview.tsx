"use client"

import { useQuery } from "@blitzjs/rpc"
import getInventoryEntries from "../queries/getInventoryEntries"
import NewStocktakingEntry from "./NewStocktakingEntry"
import { DataTable } from "../../components/DataTable"
import UntrackedVariants from "./UntrackedVariants"
import { getName } from "@/src/lib/variant"
import { FC, useRef } from "react"
import getLocation from "../../locations/queries/getLocation"

const StocktakingLocationOverview: FC<{ locationId: number }> = ({ locationId }) => {
  const [inventoryEntries] = useQuery(getInventoryEntries, { where: { locationId } })
  const [location] = useQuery(getLocation, { id: locationId })

  const formRef = useRef(null)

  return (
    <div>
      <h1 className="text-5xl font-bold mb-4">Stocktaking for {location?.name}</h1>
      <NewStocktakingEntry locationId={locationId} innerRef={formRef} />
      <div className="flex flex-wrap gap-4 mt-4">
        <div className="w-full md:w-6/12">
          <h2 className="mb-2 font-bold text-4xl">Tracked variants</h2>
          <DataTable
            data={inventoryEntries ?? []}
            columns={[
              { accessorKey: "id", header: "ID" },
              { accessorKey: "location.name", header: "Location" },
              { accessorFn: (original) => getName(original.variant), header: "Variant ID" },
              {
                accessorKey: "quantity",
                header: () => <div className="text-right">Quantity</div>,
                cell({ row }) {
                  return <div className="text-right">{row.getValue("quantity")}</div>
                },
              },
              { accessorKey: "description", header: "Description" },
            ]}
          />
        </div>
        <div className="w-full md:w-3/12">
          <UntrackedVariants locationId={locationId} formRef={formRef} />
        </div>
      </div>
    </div>
  )
}

export default StocktakingLocationOverview
