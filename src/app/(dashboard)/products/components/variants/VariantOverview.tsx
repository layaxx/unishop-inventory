import { useQuery } from "@blitzjs/rpc"
import { FC } from "react"
import getProductVariants from "../../queries/getProductVariants"
import getProductModifierTypes from "../../queries/getProductModifierTypes"
import { DataTable } from "@/src/app/components/DataTable"

const VariantOverview: FC<{ productId: number }> = ({ productId }) => {
  const [types] = useQuery(getProductModifierTypes, { productId })
  const [variants] = useQuery(getProductVariants, {
    where: { productId },
    include: { modifierValues: true, stockLevels: true },
  })

  return (
    <div className="mt-4">
      <h2 className="font-bold text-4xl">Variants</h2>
      <DataTable
        data={
          variants?.productVariants.map((x) => {
            const obj: Record<string, string | number> = {
              totalStock: x.stockLevels.reduce((acc, level) => acc + level.quantity, 0),
            }

            for (const type of types ?? []) {
              const value = x.modifierValues.find((mv) => mv.modifierTypeId === type.id)?.value

              obj["mod" + type.id] = value || "(Default)"
            }

            if (types?.length === 0) {
              obj["x"] = "(Default)"
            }

            return obj
          }) ?? []
        }
        columns={[
          ...((types ?? []).map((type) => ({
            accessorKey: "mod" + type.id,
            header: type.name,
          })) as any),
          ...(types?.length === 0
            ? [
                {
                  accessorKey: "x",
                  header: "Name",
                },
              ]
            : []),
          {
            accessorKey: "totalStock",
            header: "Stock (total)",
          },
        ]}
      />
    </div>
  )
}

export default VariantOverview
