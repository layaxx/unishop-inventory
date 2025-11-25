import { resolver } from "@blitzjs/rpc"
import db, { MovementType } from "db"
import { MovementSchema } from "../schemas"

export default resolver.pipe(resolver.zod(MovementSchema), resolver.authorize(), async (input) => {
  if (input.from === input.to) {
    throw new Error("From and To locations cannot be the same.")
  }

  let type: MovementType
  if (input.from === -1 && input.to !== -1) {
    type = MovementType.PURCHASE
  } else if (input.from !== -1 && input.to === -1) {
    type = MovementType.SALE
  } else {
    type = MovementType.TRANSFER
  }

  await db.$transaction(async (tx) => {
    await tx.movement.createMany({
      data: input.variants.map((variant) => ({
        fromId: input.from === -1 ? null : input.from,
        toId: input.to === -1 ? null : input.to,
        type,
        variantId: variant.id,
        quantity: variant.quantity,
      })),
    })

    if (input.to !== -1) {
      await Promise.all(
        input.variants.map((variant) =>
          tx.stockLevel.updateMany({
            where: { locationId: input.to, variantId: variant.id },
            data: { quantity: { increment: variant.quantity } },
          })
        )
      )
    }
    if (input.from !== -1) {
      await Promise.all(
        input.variants.map((variant) =>
          tx.stockLevel.updateMany({
            where: { locationId: input.from, variantId: variant.id },
            data: { quantity: { decrement: variant.quantity } },
          })
        )
      )
    }
  })

  return true
})
