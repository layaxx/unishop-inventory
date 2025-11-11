import { resolver } from "@blitzjs/rpc"
import db from "db"
import { DeleteProductSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(DeleteProductSchema),
  resolver.authorize(),
  async ({ id }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const product = await db.product.deleteMany({ where: { id } })

    return product
  }
)
