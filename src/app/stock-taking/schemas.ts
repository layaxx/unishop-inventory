import { z } from "zod"

export const CreateInventoryEntrySchema = z.object({
  locationId: z.number().min(0, "Location is required"),
  variantId: z.number().min(0, "Variant is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  description: z.string().optional(),
})
