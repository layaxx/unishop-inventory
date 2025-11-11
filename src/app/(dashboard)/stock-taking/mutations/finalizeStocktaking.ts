import { resolver } from "@blitzjs/rpc"
import db, { MovementType } from "db"
import { FinalizeStocktakingInput } from "../schemas"
import buildPDF from "./buildPDF"

export default resolver.pipe(
  resolver.zod(FinalizeStocktakingInput),
  resolver.authorize(),
  async ({ locationId }, ctx) => {
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
    const auditId = await db.$transaction(async (tx) => {
      const groups = await tx.inventoryEntry.groupBy({
        by: ["variantId"],
        where: { locationId },
        _sum: { quantity: true },
      })

      const updatePromises = groups.map(async (group) => {
        if (group._sum.quantity === undefined || group._sum.quantity === null) {
          throw new Error(
            `Invariant violation: quantity sum is null (variantId: ${group.variantId})`
          )
        }

        const previousStockLevel = await tx.stockLevel.findFirst({
          where: { variantId: group.variantId, locationId },
        })

        if (previousStockLevel) {
          const diff = group._sum.quantity - previousStockLevel.quantity
          if (diff !== 0) {
            if (diff > 0) {
              await tx.movement.create({
                data: {
                  variantId: group.variantId,
                  toId: locationId,
                  quantity: diff,
                  type: MovementType.ADJUSTMENT,
                },
              })
            } else {
              await tx.movement.create({
                data: {
                  variantId: group.variantId,
                  fromId: locationId,
                  quantity: Math.abs(diff),
                  type: MovementType.ADJUSTMENT,
                },
              })
            }
          }
          return tx.stockLevel.update({
            where: { id: previousStockLevel.id },
            data: { quantity: group._sum.quantity },
          })
        } else {
          return tx.stockLevel.create({
            data: {
              variantId: group.variantId,
              locationId,
              quantity: group._sum.quantity,
            },
          })
        }
      })

      await Promise.all(updatePromises)

      // remove all inventoryEvents for the location
      await tx.inventoryEntry.deleteMany({ where: { locationId } })
      return (
        await tx.auditLogStocktaking.create({
          data: {
            locationId,
            userId: ctx.session.userId,
            success: true,
          },
        })
      ).id
    })

    try {
      const pdf = await buildPDF({ locationId }, ctx)
      await db.auditLogStocktaking.update({
        where: { id: auditId },
        data: { pdfReport: pdf },
      })
    } catch (e) {
      console.error("Failed to build stocktaking PDF:", e)
    }

    return true
  }
)
