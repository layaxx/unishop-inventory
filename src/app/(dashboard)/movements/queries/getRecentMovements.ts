import { resolver } from "@blitzjs/rpc"
import db from "db"

export default resolver.pipe(resolver.authorize(), async () => {
  const batches = await db.movementBatch.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      movements: {
        orderBy: { quantity: "desc" },
        include: {
          variant: {
            include: {
              modifierValues: {
                include: { modifierType: { select: { name: true } } },
              },
              product: { select: { name: true } },
            },
          },
        },
      },
    },
    take: 10,
  })

  return batches
})
