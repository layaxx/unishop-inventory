import { resolver } from "@blitzjs/rpc"
import db from "db"
import { UpdateProductModifierValueSchema } from "../schemas"
import { ROLES_WITH_WRITE_ACCESS } from "@/src/app/(auth)/validations"

export default resolver.pipe(
  resolver.zod(UpdateProductModifierValueSchema),
  resolver.authorize(ROLES_WITH_WRITE_ACCESS),
  async ({ id, ...data }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const product = await db.productModifierValue.update({ where: { id }, data })

    return product
  }
)
