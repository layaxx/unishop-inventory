import { resolver } from "@blitzjs/rpc"
import db from "db"
import { CreateProductModifierValueSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(CreateProductModifierValueSchema),
  resolver.authorize(),
  async (input) => {
    const product = await db.productModifierValue.create({ data: input })

    return product
  }
)
