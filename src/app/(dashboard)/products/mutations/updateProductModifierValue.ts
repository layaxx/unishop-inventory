import { resolver } from "@blitzjs/rpc"
import db from "db"
import { UpdateProductModifierValueSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(UpdateProductModifierValueSchema),
  resolver.authorize(),
  async ({ id, ...data }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const product = await db.productModifierValue.update({ where: { id }, data })

    return product
  }
)
