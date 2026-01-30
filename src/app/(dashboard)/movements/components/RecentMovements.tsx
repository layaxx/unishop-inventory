"use client"

import { useQuery } from "@blitzjs/rpc"
import getRecentMovements from "../queries/getRecentMovements"
import dayjs from "dayjs"

type RecentMovementsData = Awaited<ReturnType<typeof getRecentMovements>>

const formatProductName = (variant: {
  product: { name: string }
  modifierValues: { modifierType: { name: string }; value: string }[]
}) => {
  const modifierValues = variant.modifierValues
    .map((mv: any) => `${mv.modifierType.name}: ${mv.value}`)
    .join(", ")
  return `${variant.product.name}${modifierValues ? ` (${modifierValues})` : ""}`
}

type Props = {
  initialData: RecentMovementsData
}

const RecentMovements = ({ initialData }: Props) => {
  const [recentMovements] = useQuery(getRecentMovements, {}, { initialData })

  return (
    <>
      <div className="mt-4">
        <h1 className="text-3xl font-bold mb-4">Recent Movements</h1>
      </div>

      <div>
        {recentMovements?.map((batch) => (
          <div key={batch.id} className="mb-6 p-4 border rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-2">
              {dayjs(batch.createdAt).format("DD.MM.YYYY HH:mm")} - {batch.reason}
            </h2>
            <ul className="list-disc list-inside">
              {batch.movements.map((movement) => (
                <li key={movement.id}>
                  Product: {formatProductName(movement.variant)}, Quantity: {movement.quantity},
                  Type: {movement.type}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </>
  )
}

export default RecentMovements
