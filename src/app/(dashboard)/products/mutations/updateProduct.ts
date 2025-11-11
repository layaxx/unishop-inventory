import { resolver } from "@blitzjs/rpc"
import db from "db"
import { UpdateProductSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(UpdateProductSchema),
  resolver.authorize(),
  async ({ id, ...data }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const product = await db.product.update({ where: { id }, data })

    return product
  }
)
