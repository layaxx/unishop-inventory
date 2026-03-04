import { resolver } from "@blitzjs/rpc"
import db from "db"
import { CreateLocationSchema } from "../schemas"
import { ROLES_WITH_WRITE_ACCESS } from "@/src/app/(auth)/validations"

export default resolver.pipe(
  resolver.zod(CreateLocationSchema),
  resolver.authorize(ROLES_WITH_WRITE_ACCESS),
  async (input) => {
    const location = await db.location.create({ data: input })

    const variants = await db.productVariant.findMany()

    await db.stockLevel.createMany({
      data: variants.map((variant) => ({
        variantId: variant.id,
        locationId: location.id,
        quantity: 0,
      })),
    })

    return location
  }
)
