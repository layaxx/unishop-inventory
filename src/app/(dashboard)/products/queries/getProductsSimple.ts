import { ROLES_WITH_READ_ACCESS } from "@/src/app/(auth)/validations"
import { resolver } from "@blitzjs/rpc"
import db, { Prisma } from "db"

interface GetProductsInput extends Prisma.ProductFindManyArgs {}

export default resolver.pipe(
  resolver.authorize(ROLES_WITH_READ_ACCESS),
  async (input: GetProductsInput) => {
    return db.product.findMany(input)
  }
)
