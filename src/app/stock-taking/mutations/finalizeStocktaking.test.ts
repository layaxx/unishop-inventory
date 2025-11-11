import db from "@/db"
import finalizeStocktaking from "./finalizeStocktaking"
import { mockCtx } from "@/test/createMockContext"

async function makeSampleData() {
  const user = await db.user.create({ data: { email: "x@example.com" } })
  const location = await db.location.create({ data: { name: "Sample Location" } })
  const product = await db.product.create({ data: { name: "Sample Product" } })
  const type = await db.productModifierType.create({
    data: { name: "Size", productId: product.id },
  })
  const value1 = await db.productModifierValue.create({
    data: { value: "M", modifierTypeId: type.id },
  })
  const value2 = await db.productModifierValue.create({
    data: { value: "L", modifierTypeId: type.id },
  })
  const variant1 = await db.productVariant.create({
    data: {
      productId: product.id,
      modifierValues: { connect: { id: value1.id } },
      stockLevels: { create: { locationId: location.id, quantity: 0 } },
    },
  })
  const variant2 = await db.productVariant.create({
    data: {
      productId: product.id,
      modifierValues: { connect: { id: value2.id } },
      stockLevels: { create: { locationId: location.id, quantity: 0 } },
    },
  })

  return { locationId: location.id, productId: product.id, variantIds: [variant1.id, variant2.id] }
}

describe("finalizeStocktaking mutation", () => {
  let ids = { locationId: -1, productId: -1, variantIds: [] as number[] }
  beforeEach(async () => {
    await db.$reset()
    ids = await makeSampleData()
  })

  it("throws error if untracked variants exist", async () => {
    await expect(finalizeStocktaking({ locationId: ids.locationId }, mockCtx)).rejects.toThrow(
      "Cannot finalize stocktaking"
    )
  })

  it("updates stockLevels for all tracked variants", async () => {
    expect(ids.variantIds.length).toBe(2)

    await db.inventoryEntry.create({
      data: {
        location: { connect: { id: ids.locationId } },
        variant: { connect: { id: ids.variantIds[0] } },
        quantity: 17,
      },
    })

    await db.inventoryEntry.create({
      data: {
        location: { connect: { id: ids.locationId } },
        variant: { connect: { id: ids.variantIds[1] } },
        quantity: 23,
      },
    })

    await finalizeStocktaking({ locationId: ids.locationId }, mockCtx)

    const variant1 = await db.stockLevel.findMany({
      where: { variantId: ids.variantIds[0], locationId: ids.locationId },
    })
    const variant2 = await db.stockLevel.findMany({
      where: { variantId: ids.variantIds[1], locationId: ids.locationId },
    })

    expect(variant1.length).toBe(1)
    expect(variant1[0].quantity).toBe(17)

    expect(variant2.length).toBe(1)
    expect(variant2[0].quantity).toBe(23)
  })

  it("updates stockLevels for all tracked variants (multiple entries per variant)", async () => {
    expect(ids.variantIds.length).toBe(2)

    await db.inventoryEntry.createMany({
      data: [
        // first variant
        {
          locationId: ids.locationId,
          variantId: ids.variantIds[0],
          quantity: 17,
        },
        {
          locationId: ids.locationId,
          variantId: ids.variantIds[0],
          quantity: 0,
        },
        {
          locationId: ids.locationId,
          variantId: ids.variantIds[0],
          quantity: 5,
        },
        // second variant
        {
          locationId: ids.locationId,
          variantId: ids.variantIds[1],
          quantity: 35,
        },
      ],
    })

    await finalizeStocktaking({ locationId: ids.locationId }, mockCtx)

    const variant1Stocks = await db.stockLevel.findMany({
      where: { variantId: ids.variantIds[0], locationId: ids.locationId },
    })
    const variant2Stocks = await db.stockLevel.findMany({
      where: { variantId: ids.variantIds[1], locationId: ids.locationId },
    })

    expect(variant1Stocks.length).toBe(1)
    expect(variant1Stocks[0].quantity).toBe(22)

    expect(variant2Stocks.length).toBe(1)
    expect(variant2Stocks[0].quantity).toBe(35)
  })

  it("removes all inventory entries for this location", async () => {
    expect(ids.variantIds.length).toBe(2)

    await db.inventoryEntry.createMany({
      data: [
        {
          locationId: ids.locationId,
          variantId: ids.variantIds[0],
          quantity: 17,
        },
        {
          locationId: ids.locationId,
          variantId: ids.variantIds[0],
          quantity: 0,
        },
        {
          locationId: ids.locationId,
          variantId: ids.variantIds[1],
          quantity: 23,
        },
      ],
    })

    await finalizeStocktaking({ locationId: ids.locationId }, mockCtx)

    const entries = await db.inventoryEntry.findMany({
      where: { locationId: ids.locationId },
    })

    expect(entries.length).toBe(0)
  })

  it("keeps all inventory entries for other locations", async () => {
    expect(ids.variantIds.length).toBe(2)

    const secondLocation = await db.location.create({ data: { name: "Other Location" } })
    await db.stockLevel.createMany({
      data: [
        {
          locationId: ids.locationId + 1,
          variantId: ids.variantIds[0],
          quantity: 0,
        },
        {
          locationId: ids.locationId + 1,
          variantId: ids.variantIds[1],
          quantity: 0,
        },
      ],
    })

    await db.inventoryEntry.createMany({
      data: [
        {
          locationId: ids.locationId,
          variantId: ids.variantIds[0],
          quantity: 17,
        },
        {
          locationId: ids.locationId,
          variantId: ids.variantIds[0],
          quantity: 0,
        },
        {
          locationId: ids.locationId,
          variantId: ids.variantIds[1],
          quantity: 23,
        },
        // second location entries
        {
          locationId: secondLocation.id,
          variantId: ids.variantIds[0],
          quantity: 7,
        },
        {
          locationId: secondLocation.id,
          variantId: ids.variantIds[0],
          quantity: 20,
        },
        {
          locationId: secondLocation.id,
          variantId: ids.variantIds[1],
          quantity: 66,
        },
      ],
    })

    await finalizeStocktaking({ locationId: ids.locationId }, mockCtx)

    const entries = await db.inventoryEntry.findMany({
      where: { locationId: secondLocation.id },
    })

    expect(entries.length).toBe(3)

    const stockLevels = await db.stockLevel.findMany()

    expect(stockLevels.length).toBe(4)
  })

  it("creates audit log entry on success", async () => {
    await db.inventoryEntry.createMany({
      data: [
        {
          locationId: ids.locationId,
          variantId: ids.variantIds[0],
          quantity: 10,
        },
        {
          locationId: ids.locationId,
          variantId: ids.variantIds[1],
          quantity: 20,
        },
      ],
    })

    await finalizeStocktaking({ locationId: ids.locationId }, mockCtx)

    const logs = await db.auditLogStocktaking.findMany({
      where: { locationId: ids.locationId },
    })

    expect(logs.length).toBe(1)
    expect(logs[0].userId).toBe(mockCtx.session.userId)
    expect(logs[0].success).toBe(true)
  })

  it("creates ADJUSTMENT type inventory movements on stock level changes", async () => {
    expect(ids.variantIds.length).toBe(2)

    await db.stockLevel.update({
      where: { locationId_variantId: { locationId: ids.locationId, variantId: ids.variantIds[0] } },
      data: { quantity: 50 },
    })

    await db.inventoryEntry.createMany({
      data: [
        // first variant
        {
          locationId: ids.locationId,
          variantId: ids.variantIds[0],
          quantity: 17,
        },
        {
          locationId: ids.locationId,
          variantId: ids.variantIds[0],
          quantity: 0,
        },
        {
          locationId: ids.locationId,
          variantId: ids.variantIds[0],
          quantity: 5,
        },
        // second variant
        {
          locationId: ids.locationId,
          variantId: ids.variantIds[1],
          quantity: 35,
        },
      ],
    })

    await finalizeStocktaking({ locationId: ids.locationId }, mockCtx)

    const movements = await db.movement.findMany()
    expect(movements.length).toBe(2)
    const movementForVariant1 = movements.find((m) => m.variantId === ids.variantIds[0])
    const movementForVariant2 = movements.find((m) => m.variantId === ids.variantIds[1])

    expect(movementForVariant1).toBeDefined()
    expect(movementForVariant1?.type).toBe("ADJUSTMENT")
    expect(movementForVariant1?.fromId).toBe(ids.locationId)
    expect(movementForVariant1?.toId).toBeNull()
    expect(movementForVariant1?.quantity).toBe(28) // 50 -> 22

    expect(movementForVariant2).toBeDefined()
    expect(movementForVariant2?.type).toBe("ADJUSTMENT")
    expect(movementForVariant2?.fromId).toBeNull()
    expect(movementForVariant2?.toId).toBe(ids.locationId)
    expect(movementForVariant2?.quantity).toBe(35) // 0 -> 35
  })
})
