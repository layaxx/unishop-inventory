import { resolver } from "@blitzjs/rpc"
import db from "db"
import { GetUntrackedEntitySchema } from "../schemas"
import { ROLES_WITH_READ_ACCESS } from "@/src/app/(auth)/validations"

export default resolver.pipe(
  resolver.zod(GetUntrackedEntitySchema),
  resolver.authorize(ROLES_WITH_READ_ACCESS),
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
