import { ROLES_WITH_READ_ACCESS } from "@/src/app/(auth)/validations"
import { resolver } from "@blitzjs/rpc"
import db from "db"

export default resolver.pipe(resolver.authorize(ROLES_WITH_READ_ACCESS), async () => {
  const latestPerLocation = await db.auditLogStocktaking.groupBy({
    by: ["locationId"],
    where: { success: true },
    _max: {
      createdAt: true,
    },
  })

  const audits = await db.auditLogStocktaking.findMany({
    where: {
      OR: latestPerLocation
        .filter((x) => x._max.createdAt)
        .map((x) => ({
          locationId: x.locationId,
          createdAt: x._max.createdAt!,
        })),
    },
    select: { locationId: true, createdAt: true, id: true },
  })

  return audits
})
