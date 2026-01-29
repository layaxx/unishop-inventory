import { describe, it, beforeEach } from "vitest"
import db from "db"
import { mockCtx } from "@/test/createMockContext"
import deleteProductModifierValue from "./deleteProductModifierValue"
import { dbReset } from "@/test/dbreset"

describe("deleteProductModifierValue mutation", () => {
  let productId: number = 0
  let typeId: number = 0
  let valueId: number = 0
  let variantId: number = 0

  beforeEach(async () => {
    await dbReset()

    const product = await db.product.create({
      data: {
        name: "Test Product",
      },
    })
    productId = product.id

    const modifierType = await db.productModifierType.create({
      data: {
        name: "Size",
        product: {
          connect: { id: product.id },
        },
      },
    })
    typeId = modifierType.id

    const value = await db.productModifierValue.create({
      data: {
        value: "S",
        modifierType: {
          connect: { id: modifierType.id },
        },
      },
    })
    valueId = value.id

    const variant = await db.productVariant.create({
      data: {
        product: {
          connect: { id: product.id },
        },
        modifierValues: {
          connect: [{ id: value.id }],
        },
        stockLevels: {
          create: {
            quantity: 0,
            location: { create: { name: "Main Warehouse" } },
          },
        },
      },
    })
    variantId = variant.id
  })

  it("removes product variant when non-last value of type is deleted", async () => {
    const value2 = await db.productModifierValue.create({
      data: {
        value: "M",
        modifierType: {
          connect: { id: typeId },
        },
      },
    })

    const variant2 = await db.productVariant.create({
      data: {
        product: {
          connect: { id: productId },
        },
        modifierValues: {
          connect: [{ id: value2.id }],
        },
      },
    })

    await deleteProductModifierValue({ id: valueId }, mockCtx)

    const remainingVariants = await db.productVariant.findMany({})

    expect(remainingVariants.length).toBe(1)
    expect(remainingVariants[0].id).toBe(variant2.id)
  })

  it("does not remove product modifier value when it has stock levels", async () => {
    await db.stockLevel.create({
      data: {
        quantity: 10,
        location: { create: { name: "Main Warehouse" } },
        variant: {
          connect: { id: variantId },
        },
      },
    })

    await expect(deleteProductModifierValue({ id: valueId }, mockCtx)).rejects.toThrowError(
      "Cannot delete modifier value with existing stock levels"
    )
  })

  it("does not remove product variant if last value of type is deleted", async () => {
    // when
    await deleteProductModifierValue({ id: valueId }, mockCtx)

    // then
    const remainingVariants = await db.productVariant.findMany({
      include: { modifierValues: true },
    })
    expect(remainingVariants.length).toBe(1)
    expect(remainingVariants[0].id).toBe(variantId)
    expect(remainingVariants[0].modifierValues.length).toBe(0)
  })

  it("correctly modifies variants for last value of second type", async () => {
    // given
    const secondValue = await db.productModifierValue.create({
      data: {
        value: "M",
        modifierType: { connect: { id: typeId } },
      },
    })
    const variant2 = await db.productVariant.create({
      data: {
        product: { connect: { id: productId } },
        modifierValues: { connect: [{ id: secondValue.id }] },
      },
    })

    const secondType = await db.productModifierType.create({
      data: {
        name: "Color",
        product: {
          connect: { id: productId },
        },
      },
    })
    const colorValue = await db.productModifierValue.create({
      data: {
        value: "Red",
        modifierType: { connect: { id: secondType.id } },
        ProductVariant: { connect: [{ id: variantId }, { id: variant2.id }] },
      },
    })

    // when
    await deleteProductModifierValue({ id: colorValue.id }, mockCtx)

    // then
    const remainingVariants = await db.productVariant.findMany({
      include: { modifierValues: true },
    })
    expect(remainingVariants.length).toBe(2)
    const variantWithSizeS = remainingVariants.find((v) =>
      v.modifierValues.some((mv) => mv.value === "S")
    )
    const variantWithSizeM = remainingVariants.find((v) =>
      v.modifierValues.some((mv) => mv.value === "M")
    )
    expect(variantWithSizeS).toBeDefined()
    expect(variantWithSizeM).toBeDefined()
    expect(variantWithSizeS!.modifierValues.length).toBe(1)
    expect(variantWithSizeM!.modifierValues.length).toBe(1)
  })

  it("correctly removes variants for non-last value of second type", async () => {
    // given
    const secondValue = await db.productModifierValue.create({
      data: {
        value: "M",
        modifierType: { connect: { id: typeId } },
      },
    })
    const variant2 = await db.productVariant.create({
      data: {
        product: { connect: { id: productId } },
        modifierValues: { connect: [{ id: secondValue.id }] },
      },
    })

    const secondType = await db.productModifierType.create({
      data: {
        name: "Color",
        product: {
          connect: { id: productId },
        },
      },
    })
    const colorValue = await db.productModifierValue.create({
      data: {
        value: "Red",
        modifierType: { connect: { id: secondType.id } },
        ProductVariant: { connect: [{ id: variantId }, { id: variant2.id }] },
      },
    })
    const colorValue2 = await db.productModifierValue.create({
      data: {
        value: "Blue",
        modifierType: { connect: { id: secondType.id } },
      },
    })
    const variant3 = await db.productVariant.create({
      data: {
        product: { connect: { id: productId } },
        modifierValues: { connect: [{ id: colorValue2.id }, { id: secondValue.id }] },
      },
    })
    const variant4 = await db.productVariant.create({
      data: {
        product: { connect: { id: productId } },
        modifierValues: { connect: [{ id: colorValue2.id }, { id: valueId }] },
      },
    })

    // when
    await deleteProductModifierValue({ id: colorValue.id }, mockCtx)

    // then
    const remainingVariants = await db.productVariant.findMany({
      include: { modifierValues: true },
    })
    expect(remainingVariants.length).toBe(2)
    const combinationsExpected = new Set([new Set(["S", "Blue"]), new Set(["M", "Blue"])])
    const combinationsActual = new Set(
      remainingVariants.map((v) => new Set(v.modifierValues.map((mv) => mv.value)))
    )
    expect(combinationsActual).toEqual(combinationsExpected)
  })

  it("correctly removes stock levels when non-last value is deleted", async () => {
    const value1 = await db.productModifierValue.create({
      data: {
        value: "M",
        modifierType: {
          connect: { id: typeId },
        },
      },
    })

    const variant2 = await db.productVariant.create({
      data: {
        product: {
          connect: { id: productId },
        },
        modifierValues: {
          connect: [{ id: value1.id }],
        },
        stockLevels: {
          create: {
            quantity: 0,
            location: { create: { name: "Second Warehouse" } },
          },
        },
      },
    })

    await deleteProductModifierValue({ id: valueId }, mockCtx)

    const remainingVariants = await db.productVariant.findMany({})

    expect(remainingVariants.length).toBe(1)
    expect(remainingVariants[0].id).toBe(variant2.id)

    const remainingStockLevels = await db.stockLevel.findMany({})

    expect(remainingStockLevels.length).toBe(1)
    expect(remainingStockLevels[0].variantId).toBe(variant2.id)
  })

  it("throws if modifier value is not found", async () => {
    await expect(deleteProductModifierValue({ id: 42 }, mockCtx)).rejects.toThrowError(
      "Modifier value not found"
    )
  })

  it("deletes modifier value when it is the last of its type even though stock levels exist, keeping variant", async () => {
    await db.stockLevel.updateMany({
      data: { quantity: 5 },
      where: { variantId },
    })

    await deleteProductModifierValue({ id: valueId }, mockCtx)

    const remainingValues = await db.productModifierValue.findMany({})
    expect(remainingValues.length).toBe(0)

    const remainingVariants = await db.productVariant.findMany({
      include: { modifierValues: true, stockLevels: true },
    })
    expect(remainingVariants.length).toBe(1)
    expect(remainingVariants[0].id).toBe(variantId)
    expect(remainingVariants[0].modifierValues.length).toBe(0)
    expect(remainingVariants[0].stockLevels.length).toBe(1)
    expect(remainingVariants[0].stockLevels[0].quantity).toBe(5)
  })
})
