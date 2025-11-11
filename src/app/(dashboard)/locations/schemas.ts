import { z } from "zod"

export const CreateLocationSchema = z.object({
  name: z.string(),
})
export const UpdateLocationSchema = CreateLocationSchema.merge(
  z.object({
    id: z.number(),
  })
)

export const DeleteLocationSchema = z.object({
  id: z.number(),
})
