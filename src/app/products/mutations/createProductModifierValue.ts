import { resolver } from "@blitzjs/rpc"
import db from "db"
import { CreateProductModifierValueSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(CreateProductModifierValueSchema),
  resolver.authorize(),
  async (input) => {
    const productId = await db.productModifierType.findUnique({
      where: { id: input.modifierTypeId },
      select: { productId: true },
    })

    if (typeof productId?.productId !== "number") {
      throw new Error("ProductID could not be found")
    }

    const locationIds = await db.location.findMany({
      select: { id: true },
    })

    const productVariant = await db.productVariant.create({
      data: {
        modifierValue: { create: input },
        product: { connect: { id: productId.productId } },
        stockLevels: {
          create: locationIds.map((location) => ({ quantity: 0, locationId: location.id })),
        },
      },
      include: { modifierValue: true },
    })

    return productVariant.modifierValue
  }
)
