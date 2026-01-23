import { resolver } from "@blitzjs/rpc"
import db, { Prisma } from "db"

interface GetProductsInput extends Prisma.ProductFindManyArgs {}

export default resolver.pipe(resolver.authorize(), async (input: GetProductsInput) => {
  return db.product.findMany(input)
})
