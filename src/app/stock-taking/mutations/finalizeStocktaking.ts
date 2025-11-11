import { resolver } from "@blitzjs/rpc"
import db from "db"
import { FinalizeStocktakingInput } from "../schemas"

export default resolver.pipe(
  resolver.zod(FinalizeStocktakingInput),
  resolver.authorize(),
  async ({ locationId }) => {
    // assert no untracked variants exist
    const trackedVariantIds = await db.inventoryEntry.findMany({
      select: { variantId: true },
      where: { locationId },
    })

    const untrackedVariant = await db.productVariant.findFirst({
      where: {
        id: { notIn: trackedVariantIds.map((x) => x.variantId) },
      },
      include: { product: { select: { name: true } }, modifierValues: { select: { value: true } } },
    })

    if (untrackedVariant) {
      throw new Error(
        `Cannot finalize stocktaking. Variant "${
          untrackedVariant.product.name
        } - ${untrackedVariant.modifierValues
          .map((mv) => mv.value)
          .join(", ")}" has no inventory entry.`
      )
    }

    // update stockLevels for all tracked variants
    await db.$transaction(async (tx) => {
      const groups = await tx.inventoryEntry.groupBy({
        by: ["variantId"],
        where: { locationId },
        _sum: { quantity: true },
      })

      for (const group of groups) {
        if (!group._sum.quantity) {
          throw new Error("Invariant violation: quantity sum is null")
        }
        await tx.stockLevel.upsert({
          where: {
            locationId_variantId: {
              variantId: group.variantId,
              locationId,
            },
          },
          create: {
            variantId: group.variantId,
            locationId,
            quantity: group._sum.quantity,
          },
          update: {
            quantity: group._sum.quantity,
          },
        })
      }

      // remove all inventoryEvents for the location
      await db.inventoryEntry.deleteMany({ where: { locationId } })
    })

    return true
  }
)
