import { resolver } from "@blitzjs/rpc"
import db from "db"
import { CreateProductSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(CreateProductSchema),
  resolver.authorize(),
  async (input) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const product = await db.product.create({ data: input })

    return product
  }
)
