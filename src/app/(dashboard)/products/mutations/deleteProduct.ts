import { resolver } from "@blitzjs/rpc"
import db from "db"
import { DeleteProductSchema } from "../schemas"
import { ROLES_WITH_WRITE_ACCESS } from "@/src/app/(auth)/validations"

export default resolver.pipe(
  resolver.zod(DeleteProductSchema),
  resolver.authorize(ROLES_WITH_WRITE_ACCESS),
  async ({ id }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant

    // check stock levels before deleting
    const stockCount = await db.stockLevel.aggregate({
      where: { variant: { productId: id } },
      _sum: { quantity: true },
    })

    if ((stockCount._sum.quantity ?? 0) !== 0) {
      throw new Error("Cannot delete product with existing stock levels.")
    } else {
      // delete variants first due to foreign key constraint
      await db.productVariant.deleteMany({ where: { productId: id } })
    }

    const product = await db.product.deleteMany({ where: { id } })

    return product
  }
)
