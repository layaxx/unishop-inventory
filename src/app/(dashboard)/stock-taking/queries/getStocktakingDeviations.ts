import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"

const schema = z.object({
  audits: z.array(z.number()),
})

export default resolver.pipe(resolver.zod(schema), resolver.authorize(), async ({ audits }) => {
  const auditsComplete = await db.auditLogStocktaking.findMany({
    where: { id: { in: audits } },
    include: {
      adjustments: {
        include: {
          movements: {
            include: {
              variant: {
                include: {
                  product: { select: { name: true } },
                  modifierValues: { select: { value: true } },
                },
              },
            },
          },
        },
      },
    },
  })

  return auditsComplete.flatMap((audit) => audit.adjustments?.movements)
})
