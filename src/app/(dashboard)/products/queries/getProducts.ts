import { paginate } from "blitz"
import { resolver } from "@blitzjs/rpc"
import db, { Prisma } from "db"
import { ROLES_WITH_READ_ACCESS } from "@/src/app/(auth)/validations"

interface GetProductsInput
  extends Pick<Prisma.ProductFindManyArgs, "where" | "orderBy" | "skip" | "take"> {}

export default resolver.pipe(
  resolver.authorize(ROLES_WITH_READ_ACCESS),
  async ({ where, orderBy, skip = 0, take = 100 }: GetProductsInput) => {
    const {
      items: products,
      hasMore,
      nextPage,
      count,
    } = await paginate({
      skip,
      take,
      count: () => db.product.count({ where }),
      query: (paginateArgs) =>
        db.product.findMany({
          ...paginateArgs,
          where,
          orderBy,
          include: { variants: { include: { stockLevels: true } } },
        }),
    })

    return {
      products,
      nextPage,
      hasMore,
      count,
    }
  }
)
