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

  if (locationId === -1 || variantId === -1) {
    return <p>?</p>
  }

  return <p>Currently on Stock: {stockLevel?.quantity}</p>
}

export default CurrentStockLevel
