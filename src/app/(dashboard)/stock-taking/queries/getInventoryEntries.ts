import { resolver } from "@blitzjs/rpc"
import db from "db"
import { GetInventoryEntriesSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(GetInventoryEntriesSchema),
  resolver.authorize(),
  async ({ where }) => {
    const entries = await db.inventoryEntry.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        location: { select: { name: true } },
        variant: {
          include: {
            product: { select: { name: true } },
            modifierValues: { select: { value: true } },
          },
        },
      },
    })

    return entries
  }
)
