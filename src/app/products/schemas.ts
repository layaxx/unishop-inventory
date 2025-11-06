import { z } from "zod"

export const CreateProductSchema = z.object({
  name: z.string(),
  sku: z.string().optional(),
  image: z.string().optional(),
  description: z.string().optional(),
  productModifierTypeId: z.number().optional(),
})
export const UpdateProductSchema = CreateProductSchema.merge(
  z.object({
    id: z.number(),
  })
)

export const DeleteProductSchema = z.object({
  id: z.number(),
})

export const CreateProductModifierTypeSchema = z.object({
  name: z.string(),
  productId: z.number(),
})

export const CreateProductModifierValueSchema = z.object({
  value: z.string(),
  modifierTypeId: z.number(),
})

export const UpdateProductModifierValueSchema = z.object({
  id: z.number(),
  value: z.string(),
  order: z.number().optional(),
})
export const DeleteProductModifierValueSchema = z.object({
  id: z.number(),
})
