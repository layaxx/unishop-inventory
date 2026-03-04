import { NotFoundError } from "blitz"
import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"
import { ROLES_WITH_READ_ACCESS } from "@/src/app/(auth)/validations"

const GetProduct = z.object({
  // This accepts type of undefined, but is required at runtime
  id: z.number().optional().refine(Boolean, "Required"),
})

export default resolver.pipe(
  resolver.zod(GetProduct),
  resolver.authorize(ROLES_WITH_READ_ACCESS),
  async ({ id }) => {
    const product = await db.product.findFirst({ where: { id } })

    if (!product) throw new NotFoundError()

    return product
  }
)
