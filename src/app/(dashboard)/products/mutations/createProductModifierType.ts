import { resolver } from "@blitzjs/rpc"
import db from "db"
import { CreateProductModifierTypeSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(CreateProductModifierTypeSchema),
  resolver.authorize(),
  async (input) => {
    const product = await db.productModifierType.create({ data: input })

    return product
  }
)
