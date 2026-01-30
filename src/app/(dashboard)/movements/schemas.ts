import { z } from "zod"

export const MovementSchema = z.object({
  from: z.number().min(-1),
  to: z.number().min(-1),
  reason: z.string().min(1, "Please provide a reason/description for this movement"),
  variants: z.array(
    z.object({
      id: z.number().min(0, "Please select a product variant"),
      quantity: z.number().min(1, "Quantity must be at least 1"),
    })
  ),
})
