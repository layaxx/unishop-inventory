import { z } from "zod"

export const CreateInventoryEntrySchema = z.object({
  locationId: z.number().min(0, "Location is required"),
  variantId: z.number().min(0, "Variant is required"),
  quantity: z.number().min(0, "Quantity cannot be negative"),
  description: z.string().optional(),
})

export const GetUntrackedEntitySchema = z.object({
  where: z
    .object({
      locationId: z.number().optional(),
    })
    .optional(),
})

export const GetInventoryEntriesSchema = z.object({
  where: z
    .object({
      locationId: z.number().optional(),
    })
    .optional(),
})
