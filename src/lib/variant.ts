import { ProductModifierType, ProductModifierValue } from "@prisma/client"

export function getName(variant: any) {
  if (variant.modifierValues.length === 0) {
    return variant.product.name
  }

  return `${variant.product.name} (${variant.modifierValues
    .map((mv: ProductModifierValue) => mv.value)
    .join(", ")})`
}

export function makeVariantSortFunction(types: ProductModifierType[] | undefined) {
  if (!types || types.length === 0) {
    return () => 0
  }
  return (
    a: { modifierValues: ProductModifierValue[] },
    b: { modifierValues: ProductModifierValue[] }
  ) => {
    for (let i = 0; i < types!.length; i++) {
      const type = types![i]
      const aValue = a.modifierValues.find((mv) => mv.modifierTypeId === type.id)
      const bValue = b.modifierValues.find((mv) => mv.modifierTypeId === type.id)

      if (aValue?.order === bValue?.order) {
        continue
      } else {
        return (aValue?.order ?? 0) - (bValue?.order ?? 0)
      }
    }

    return 0
  }
}
