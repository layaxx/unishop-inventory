import { resolver } from "@blitzjs/rpc"
import db from "db"
import { CreateProductSchema } from "../schemas"
import { ROLES_WITH_WRITE_ACCESS } from "@/src/app/(auth)/validations"

export default resolver.pipe(
  resolver.zod(CreateProductSchema),
  resolver.authorize(ROLES_WITH_WRITE_ACCESS),
  async (input) => {
    const locations = await db.location.findMany()

    const product = await db.product.create({
      data: {
        ...input,
        variants: {
          create: {
            image: input.image,
            stockLevels: {
              createMany: {
                data: locations.map((location) => ({ locationId: location.id, quantity: 0 })),
              },
            },
          },
        },
      },
    })

    return product
  }
)
