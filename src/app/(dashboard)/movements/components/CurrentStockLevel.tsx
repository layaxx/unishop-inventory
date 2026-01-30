import { useQuery } from "@blitzjs/rpc"
import { FC } from "react"
import getStockLevel from "../../products/queries/getStockLevel"

const CurrentStockLevel: FC<{ locationId: number; variantId: number }> = ({
  locationId,
  variantId,
}) => {
  const [stockLevel] = useQuery(
    getStockLevel,
    { locationId, variantId },
    { enabled: locationId !== -1 && variantId !== -1 }
  )

  return <p>current stock: {stockLevel?.quantity ?? "n/A"}</p>
}

export default CurrentStockLevel
