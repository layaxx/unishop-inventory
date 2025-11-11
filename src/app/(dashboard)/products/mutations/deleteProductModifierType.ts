import { resolver } from "@blitzjs/rpc"
import db from "db"
import { DeleteProductModifierTypeSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(DeleteProductModifierTypeSchema),
  resolver.authorize(),
  async ({ id }) => {
    const values = await db.productModifierValue.findMany({
      where: { modifierTypeId: id },
      select: { id: true },
    })

    if (values.length > 0) {
      throw new Error("Cannot delete modifier type with existing modifier values")
    }

    const type = await db.productModifierType.deleteMany({ where: { id } })

    return type
  }
)
