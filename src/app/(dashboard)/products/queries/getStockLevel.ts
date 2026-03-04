import { NotFoundError } from "blitz"
import { resolver } from "@blitzjs/rpc"
import db from "db"
import { GetStockLevelSchema } from "../schemas"
import { ROLES_WITH_READ_ACCESS } from "@/src/app/(auth)/validations"

export default resolver.pipe(
  resolver.zod(GetStockLevelSchema),
  resolver.authorize(ROLES_WITH_READ_ACCESS),
  async ({ locationId, variantId }) => {
    const stockLevel = await db.stockLevel.findFirst({
      where: { locationId, variantId },
    })

    if (!stockLevel) throw new NotFoundError()

    return stockLevel
  }
)
