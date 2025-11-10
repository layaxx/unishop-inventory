import { ProductModifierValue } from "@prisma/client"

export function getName(variant: any) {
  return `${variant.product.name} (${variant.modifierValues
    .map((mv: ProductModifierValue) => mv.value)
    .join(", ")})`
}
