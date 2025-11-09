import { paginate } from "blitz"
import { resolver } from "@blitzjs/rpc"
import db, { Prisma } from "db"

interface GetProductVariantsInput
  extends Pick<
    Prisma.ProductVariantFindManyArgs,
    "where" | "orderBy" | "skip" | "take" | "include"
  > {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, orderBy, skip = 0, take = 100, include }: GetProductVariantsInput) => {
    const {
      items: productVariants,
      hasMore,
      nextPage,
      count,
    } = await paginate({
      skip,
      take,
      count: () => db.productVariant.count({ where }),
      query: (paginateArgs) =>
        db.productVariant.findMany({
          ...paginateArgs,
          where,
          orderBy,
          include,
        }),
    })

    return {
      productVariants,
      nextPage,
      hasMore,
      count,
    }
  }
)
