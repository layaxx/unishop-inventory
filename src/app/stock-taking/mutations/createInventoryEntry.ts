import { resolver } from "@blitzjs/rpc"
import db from "db"
import { CreateInventoryEntrySchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(CreateInventoryEntrySchema),
  resolver.authorize(),
  async (input) => {
    const entry = db.inventoryEntry.create({
      data: {
        location: { connect: { id: input.locationId } },
        variant: { connect: { id: input.variantId } },
        quantity: input.quantity,
        description: input.description && input.description.length > 0 ? input.description : null,
      },
    })

    return entry
  }
)
