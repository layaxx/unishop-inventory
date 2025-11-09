"use client"

import { useQuery } from "@blitzjs/rpc"
import getInventoryEntries from "../queries/getInventoryEntries"
import NewStocktakingEntry from "./NewStocktakingEntry"
import { DataTable } from "../../components/DataTable"

const StocktakingOverview = () => {
  const [inventoryEntries] = useQuery(getInventoryEntries, {})

  return (
    <div>
      <NewStocktakingEntry />

      <DataTable
        data={inventoryEntries ?? []}
        columns={[
          { accessorKey: "id", header: "ID" },
          { accessorKey: "location.name", header: "Location" },
          { accessorKey: "variant.id", header: "Variant ID" },
          { accessorKey: "quantity", header: "Quantity" },
          { accessorKey: "description", header: "Description" },
        ]}
      />
    </div>
  )
}

export default StocktakingOverview
