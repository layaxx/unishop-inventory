import { NotFoundError } from "blitz"
import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"

const GetProductModifierType = z.object({
  // This accepts type of undefined, but is required at runtime
  productId: z.number().optional().refine(Boolean, "Required"),
})

export default resolver.pipe(
  resolver.zod(GetProductModifierType),
  resolver.authorize(),
  async ({ productId }) => {
    const productModifierTypes = await db.productModifierType.findMany({
      where: { productId },
      include: {
        values: {
          include: { ProductVariant: { include: { stockLevels: true } } },
          orderBy: { order: "asc" },
        },
      },
    })

    if (!productModifierTypes) throw new NotFoundError()

    return productModifierTypes
  }
)
