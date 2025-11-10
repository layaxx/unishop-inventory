import { ProductModifierValue } from "@prisma/client"

export function getName(variant: any) {
  if (variant.modifierValues.length === 0) {
    return variant.product.name
  }

  return `${variant.product.name} (${variant.modifierValues
    .map((mv: ProductModifierValue) => mv.value)
    .join(", ")})`
}
