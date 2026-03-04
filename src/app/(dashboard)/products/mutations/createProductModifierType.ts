import { resolver } from "@blitzjs/rpc"
import db from "db"
import { CreateProductModifierTypeSchema } from "../schemas"
import { ROLES_WITH_WRITE_ACCESS } from "@/src/app/(auth)/validations"

export default resolver.pipe(
  resolver.zod(CreateProductModifierTypeSchema),
  resolver.authorize(ROLES_WITH_WRITE_ACCESS),
  async (input) => {
    const product = await db.productModifierType.create({ data: input })

    return product
  }
)
