import { z } from "zod"

export const MovementSchema = z.object({
  from: z.number().min(-1),
  to: z.number().min(-1),
  reason: z.string().min(1),
  variants: z.array(
    z.object({
      id: z.number().min(0),
      quantity: z.number().min(1),
    })
  ),
})
