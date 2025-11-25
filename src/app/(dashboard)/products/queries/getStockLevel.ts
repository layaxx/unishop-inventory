import { NotFoundError } from "blitz"
import { resolver } from "@blitzjs/rpc"
import db from "db"
import { GetStockLevelSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(GetStockLevelSchema),
  resolver.authorize(),
  async ({ locationId, variantId }) => {
    const stockLevel = await db.stockLevel.findFirst({
      where: { locationId, variantId },
    })

    if (!stockLevel) throw new NotFoundError()

    return stockLevel
  }
)
