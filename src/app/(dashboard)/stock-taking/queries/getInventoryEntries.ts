import { resolver } from "@blitzjs/rpc"
import db from "db"
import { GetInventoryEntriesSchema } from "../schemas"
import { ROLES_WITH_READ_ACCESS } from "@/src/app/(auth)/validations"

export default resolver.pipe(
  resolver.zod(GetInventoryEntriesSchema),
  resolver.authorize(ROLES_WITH_READ_ACCESS),
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
