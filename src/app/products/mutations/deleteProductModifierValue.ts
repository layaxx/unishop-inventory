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
    })
    if (!existing) {
      throw new Error("Modifier value not found")
    }

    const stockLevels = await db.stockLevel.findMany({
      where: { variant: { modifierValues: { some: { id } } } },
      select: { quantity: true },
    })

    const totalStock = stockLevels.reduce((acc, curr) => acc + curr.quantity, 0)

    if (totalStock > 0) {
      throw new Error("Cannot delete modifier value with existing stock levels")
    }

    await db.productVariant.deleteMany({ where: { modifierValues: { some: { id } } } })

    const value = await db.productModifierValue.deleteMany({ where: { id } })

    return value
  }
)
