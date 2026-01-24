import db from "@/db"

export const dbReset = async () => {
  await db.$transaction([
    db.auditLogStocktaking.deleteMany({}),
    db.inventoryEntry.deleteMany({}),
    db.movement.deleteMany({}),
    db.stockLevel.deleteMany({}),
    db.productVariant.deleteMany({}),
    db.productModifierValue.deleteMany({}),
    db.productModifierType.deleteMany({}),
    db.product.deleteMany({}),
    db.location.deleteMany({}),
    db.user.deleteMany({}),
  ])
}
