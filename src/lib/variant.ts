import type { ProductModifierValue } from "db"

export function getName(variant: any) {
  if (variant.modifierValues.length === 0) {
    return variant.product.name
  }

  return `${variant.product.name} (${variant.modifierValues
    .map((mv: ProductModifierValue) => mv.value)
    .join(", ")})`
}
