import { resolver } from "@blitzjs/rpc"
import db from "db"
import { DeleteProductModifierValueSchema } from "../schemas"

// TODO: dont remove for last value of type

export default resolver.pipe(
  resolver.zod(DeleteProductModifierValueSchema),
  resolver.authorize(),
  async ({ id }) => {
    const existing = await db.productModifierValue.findUnique({
      where: { id },
      include: { modifierType: { include: { values: true } } },
    })
    if (!existing) {
      throw new Error("Modifier value not found")
    }

    const stockLevels = await db.stockLevel.findMany({
      where: { variant: { modifierValues: { some: { id } } } },
      select: { quantity: true },
    })

    const hasNonZeroStock = stockLevels.some((sl) => sl.quantity > 0)

    if (hasNonZeroStock) {
      throw new Error("Cannot delete modifier value with existing stock levels")
    }

    if (existing.modifierType.values.length > 1) {
      return await db.$transaction(async (tx) => {
        await tx.stockLevel.deleteMany({
          where: { variant: { modifierValues: { some: { id } } } },
        })

        await tx.productVariant.deleteMany({
          where: { modifierValues: { some: { id } } },
        })

        return await tx.productModifierValue.deleteMany({ where: { id } })
      })
    }

    const value = await db.productModifierValue.deleteMany({ where: { id } })

    return value
  }
)
