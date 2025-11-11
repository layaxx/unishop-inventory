import { resolver } from "@blitzjs/rpc"
import db from "db"
import { CreateProductModifierValueSchema } from "../schemas"

function getCombinations(types: { name: string; ids: number[] }[]): Record<string, number>[] {
  return types.reduce(
    (acc, type) => {
      return acc.flatMap((combination) =>
        type.ids.map((value) => ({
          ...combination,
          [type.name]: value,
        }))
      )
    },
    [{}]
  )
}

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

    const otherValuesSameType = await db.productModifierValue.findMany({
      where: {
        modifierTypeId: input.modifierTypeId,
      },
    })

    const otherTypes = await db.productModifierType.findMany({
      where: {
        productId: productId.productId,
        id: { not: input.modifierTypeId },
      },
      include: { values: true },
    })

    const newValue = await db.productModifierValue.create({
      data: input,
    })

    if (otherValuesSameType.length === 0) {
      // just add to every variant of the product

      const productVariants = await db.productVariant.findMany({
        where: { productId: productId.productId },
      })

      if (productVariants.length === 0) {
        throw new Error("No ProductVariants found for the product")
      }

      await Promise.all(
        productVariants.map((variant) =>
          db.productVariant.update({
            data: {
              modifierValues: {
                connect: { id: newValue.id },
              },
            },
            where: { id: variant.id },
          })
        )
      )
    } else {
      const type = await db.productModifierType.findUnique({
        where: { id: input.modifierTypeId },
      })
      if (!type) throw new Error("Modifier type not found")

      const combinations = getCombinations([
        ...otherTypes.map((type) => ({
          name: type.name,
          ids: type.values.map((v) => v.id),
        })),
      ])

      await Promise.all(
        combinations.map(async (combination) => {
          await db.productVariant.create({
            data: {
              productId: productId.productId,
              modifierValues: {
                connect: [...Object.values(combination).map((id) => ({ id })), { id: newValue.id }],
              },
              stockLevels: {
                createMany: {
                  data: locationIds.map((location) => ({ locationId: location.id, quantity: 0 })),
                },
              },
            },
          })
        })
      )
    }

    return 0
  }
)
