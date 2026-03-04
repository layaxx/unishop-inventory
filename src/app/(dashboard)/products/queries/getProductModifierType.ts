import { NotFoundError } from "blitz"
import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"
import { ROLES_WITH_READ_ACCESS } from "@/src/app/(auth)/validations"

const GetProductModifierType = z.object({
  // This accepts type of undefined, but is required at runtime
  productId: z.number().optional().refine(Boolean, "Required"),
})

export default resolver.pipe(
  resolver.zod(GetProductModifierType),
  resolver.authorize(ROLES_WITH_READ_ACCESS),
  async ({ productId }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const productModifierType = await db.productModifierType.findFirst({
      where: { productId },
      include: {
        values: {
          include: { ProductVariant: { include: { stockLevels: true } } },
          orderBy: { order: "asc" },
        },
      },
    })

    if (!productModifierType) throw new NotFoundError()

    return productModifierType
  }
)
