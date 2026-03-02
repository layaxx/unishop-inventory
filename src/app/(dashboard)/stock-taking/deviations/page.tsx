import { Metadata } from "next"
import { invoke } from "@/src/app/blitz-server"
import Breadcrumbs from "@/src/app/components/layout/Breadcrumbs"
import getLastStocktakingProcesses from "../queries/getLastStocktakingProcesses"
import getStocktakingDeviations from "../queries/getStocktakingDeviations"
import getLocations from "../../locations/queries/getLocations"
import { getName } from "@/lib/variant"
import { DataTable } from "@/src/app/components/DataTable"

export const metadata: Metadata = {
  title: "Deviations",
  description: "Stocktaking management",
}

export default async function Page() {
  const lastAudits = await invoke(getLastStocktakingProcesses, {})
  const movements = await invoke(getStocktakingDeviations, {
    audits: lastAudits.map((audit) => audit.id),
  })
  const { locations } = await invoke(getLocations, {})

  const data: Record<string, Record<string, any>> = {}

  for (const movement of movements) {
    if (!movement) continue

    const variantKey = getName(movement.variant)

    if (!data[variantKey]) {
      data[variantKey] = {}
      for (const location of locations) {
        data[variantKey][location.id] = 0
      }
    }

    if (movement.fromId === null) {
      if (movement.toId === null) {
        console.error("Both fromId and toId are null for movement:", movement)
      }
      data[variantKey][movement.toId!] += movement.quantity
    } else {
      if (movement.toId === null) {
        data[variantKey][movement.fromId!] -= movement.quantity
      } else {
        console.error("Both fromId and toId are set for movement:", movement)
      }
    }
  }

  return (
    <Breadcrumbs page="Stocktaking" pre={[]}>
      <div className="mt-8">
        <h1 className="text-2xl font-bold">Deviations</h1>
        <p className="mt-2 text-muted-foreground">
          Here you can review and manage deviations found during stocktaking processes.
        </p>
        <DataTable
          columns={[
            { header: "Variant", accessorKey: "variant" },
            ...locations.map((location) => ({
              header: location.name,
              accessorKey: location.id,
            })),
          ]}
          data={Object.entries(data).map(([variant, locData]) => ({
            variant,
            ...locData,
          }))}
        />
      </div>
    </Breadcrumbs>
  )
}
