import { resolver } from "@blitzjs/rpc"
import db from "db"
import { CreateInventoryEntrySchema } from "../schemas"
import { ROLES_WITH_WRITE_ACCESS } from "@/src/app/(auth)/validations"

export default resolver.pipe(
  resolver.zod(CreateInventoryEntrySchema),
  resolver.authorize(ROLES_WITH_WRITE_ACCESS),
  async (input) => {
    const entry = db.inventoryEntry.create({
      data: {
        location: { connect: { id: input.locationId } },
        variant: { connect: { id: input.variantId } },
        quantity: Number(input.quantity),
        description: input.description && input.description.length > 0 ? input.description : null,
      },
    })

    console.log("ENTRY-EVENT", input)

    return entry
  }
)
