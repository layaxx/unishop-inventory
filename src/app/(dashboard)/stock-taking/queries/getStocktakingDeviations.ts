import { ROLES_WITH_READ_ACCESS } from "@/src/app/(auth)/validations"
import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"

const schema = z.object({
  audits: z.array(z.number()),
})

export default resolver.pipe(
  resolver.zod(schema),
  resolver.authorize(ROLES_WITH_READ_ACCESS),
  async ({ audits }) => {
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
  }
)
