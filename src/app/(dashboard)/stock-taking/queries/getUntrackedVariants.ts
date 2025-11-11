import { resolver } from "@blitzjs/rpc"
import db from "db"
import { GetUntrackedEntitySchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(GetUntrackedEntitySchema),
  resolver.authorize(),
  async ({ where }) => {
    const trackedVariantIds = await db.inventoryEntry.findMany({
      select: { variantId: true },
      where: { locationId: where?.locationId },
    })

    const entries = await db.productVariant.findMany({
      where: {
        id: { notIn: trackedVariantIds.map((x) => x.variantId) },
      },
      include: { product: { select: { name: true } }, modifierValues: { select: { value: true } } },
    })

    return entries
  }
)
