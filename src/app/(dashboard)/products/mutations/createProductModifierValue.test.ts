import { describe, it, beforeEach, afterEach } from "vitest"
import db from "db"
import createProductModifierValue from "./createProductModifierValue"
import { mockCtx } from "@/test/createMockContext"
import { dbReset } from "@/test/dbreset"

async function makeProduct() {
  return await db.product.create({
    data: {
      name: "Test Product",
    },
  })
}

async function makeLocation() {
  return await db.location.create({
    data: {
      name: "Main Warehouse",
    },
  })
}

async function makeProductModifierType(productId?: number) {
  return await db.productModifierType.create({
    data: {
      name: "Size",
      product: {
        connect: { id: productId ?? 1 },
      },
    },
  })
}

async function makeDefaultVariant(productId?: number) {
  return await db.productVariant.create({
    data: {
      product: {
        connect: { id: productId ?? 1 },
      },
    },
  })
}

let modifierTypeId: number = 0
let productId: number = 0

beforeEach(async () => {
  await dbReset()

  const product = await makeProduct()
  productId = product.id
  const modifierType = await makeProductModifierType(productId)
  modifierTypeId = modifierType.id
  await makeDefaultVariant(productId)
  await makeLocation()
})

describe("createProductModifierValue mutation", () => {
  it("throws error if no ProductVariant exists", async () => {
    await db.productVariant.deleteMany({}) // remove all variants

    await expect(
      createProductModifierValue({ modifierTypeId, value: "XS" }, mockCtx)
    ).rejects.toThrow()
  })

  it("throws error if productModifierType does not exist", async () => {
    await db.productModifierType.deleteMany({}) // remove all types

    await expect(
      createProductModifierValue({ modifierTypeId, value: "XS" }, mockCtx)
    ).rejects.toThrow()
  })

  it("throws no error for the first value of the only type", async () => {
    await expect(
      createProductModifierValue({ modifierTypeId, value: "XS" }, mockCtx)
    ).resolves.not.toThrow()
  })

  it("correctly assigns product variant for first value of only type", async () => {
    await createProductModifierValue({ modifierTypeId, value: "XS" }, mockCtx)

    const variant = await db.productVariant.findMany({
      where: {
        productId,
      },
      include: { modifierValues: true },
    })

    if (!variant || variant.length === 0) {
      throw new Error("Variant with new modifier value not found")
    }

    expect(variant.length).toBe(1)
    expect(variant[0].modifierValues.length).toBe(1)
    expect(variant[0].modifierValues[0].value).toBe("XS")
  })

  it("correctly assigns product variant for two values of only type", async () => {
    await createProductModifierValue({ modifierTypeId, value: "XS" }, mockCtx)
    await createProductModifierValue({ modifierTypeId, value: "S" }, mockCtx)

    const variants = await db.productVariant.findMany({
      where: {
        productId,
      },
      include: { modifierValues: true },
    })

    if (!variants || variants.length === 0) {
      throw new Error("Variant with new modifier value not found")
    }

    expect(variants.length).toBe(2)
    expect(variants.every((entry) => entry.modifierValues.length === 1)).toBeTruthy()
    expect(new Set(variants.map((entry) => entry.modifierValues[0].value))).toEqual(
      new Set(["XS", "S"])
    )
  })

  it("correctly assigns product variant for first value of second type", async () => {
    // given
    await createProductModifierValue({ modifierTypeId, value: "XS" }, mockCtx)
    await createProductModifierValue({ modifierTypeId, value: "S" }, mockCtx)

    // when
    const secondType = await db.productModifierType.create({
      data: {
        name: "Color",
        product: {
          connect: { id: productId ?? 1 },
        },
      },
    })
    await createProductModifierValue({ modifierTypeId: secondType.id, value: "Red" }, mockCtx)

    const variants = await db.productVariant.findMany({
      where: {
        productId,
      },
      include: { modifierValues: true },
    })

    if (!variants || variants.length === 0) {
      throw new Error("Variant with new modifier value not found")
    }

    expect(variants.length).toBe(2)
    expect(variants.every((entry) => entry.modifierValues.length === 2)).toBeTruthy()
    expect(
      variants.every((entry) => entry.modifierValues.filter((x) => x.value === "Red").length === 1)
    ).toBeTruthy()
  })

  it("correctly assigns product variant for second value of second type", async () => {
    // given
    await createProductModifierValue({ modifierTypeId, value: "XS" }, mockCtx)
    await createProductModifierValue({ modifierTypeId, value: "S" }, mockCtx)

    // when
    const secondType = await db.productModifierType.create({
      data: {
        name: "Color",
        product: {
          connect: { id: productId ?? 1 },
        },
      },
    })
    await createProductModifierValue({ modifierTypeId: secondType.id, value: "Red" }, mockCtx)
    await createProductModifierValue({ modifierTypeId: secondType.id, value: "Blue" }, mockCtx)

    const variants = await db.productVariant.findMany({
      where: {
        productId,
      },
      include: { modifierValues: true },
    })

    if (!variants || variants.length === 0) {
      throw new Error("Variant with new modifier value not found")
    }

    expect(variants.length).toBe(4)
    expect(variants.every((entry) => entry.modifierValues.length === 2)).toBeTruthy()
    const combinationsExpected = new Set([
      new Set(["XS", "Red"]),
      new Set(["XS", "Blue"]),
      new Set(["S", "Red"]),
      new Set(["S", "Blue"]),
    ])

    const combinationsActual = new Set(
      variants.map((entry) => new Set(entry.modifierValues.map((mv) => mv.value)))
    )

    expect(combinationsActual).toEqual(combinationsExpected)
  })

  it("correctly assigns product variant for first value of third type", async () => {
    // given
    await createProductModifierValue({ modifierTypeId, value: "XS" }, mockCtx)
    await createProductModifierValue({ modifierTypeId, value: "S" }, mockCtx)

    // when
    const secondType = await db.productModifierType.create({
      data: {
        name: "Color",
        product: {
          connect: { id: productId ?? 1 },
        },
      },
    })
    await createProductModifierValue({ modifierTypeId: secondType.id, value: "Red" }, mockCtx)
    await createProductModifierValue({ modifierTypeId: secondType.id, value: "Blue" }, mockCtx)

    const thirdType = await db.productModifierType.create({
      data: {
        name: "Material",
        product: {
          connect: { id: productId ?? 1 },
        },
      },
    })
    await createProductModifierValue({ modifierTypeId: thirdType.id, value: "Cotton" }, mockCtx)

    const variants = await db.productVariant.findMany({
      where: {
        productId,
      },
      include: { modifierValues: true },
    })

    if (!variants || variants.length === 0) {
      throw new Error("Variant with new modifier value not found")
    }

    expect(variants.length).toBe(4)
    expect(variants.every((entry) => entry.modifierValues.length === 3)).toBeTruthy()
    const combinationsExpected = new Set([
      new Set(["XS", "Red", "Cotton"]),
      new Set(["XS", "Blue", "Cotton"]),
      new Set(["S", "Red", "Cotton"]),
      new Set(["S", "Blue", "Cotton"]),
    ])

    const combinationsActual = new Set(
      variants.map((entry) => new Set(entry.modifierValues.map((mv) => mv.value)))
    )

    expect(combinationsActual).toEqual(combinationsExpected)
  })

  it("correctly assigns product variant for second value of third type", async () => {
    // given
    await createProductModifierValue({ modifierTypeId, value: "XS" }, mockCtx)
    await createProductModifierValue({ modifierTypeId, value: "S" }, mockCtx)

    // when
    const secondType = await db.productModifierType.create({
      data: {
        name: "Color",
        product: {
          connect: { id: productId ?? 1 },
        },
      },
    })
    await createProductModifierValue({ modifierTypeId: secondType.id, value: "Red" }, mockCtx)
    await createProductModifierValue({ modifierTypeId: secondType.id, value: "Blue" }, mockCtx)

    const thirdType = await db.productModifierType.create({
      data: {
        name: "Material",
        product: {
          connect: { id: productId ?? 1 },
        },
      },
    })
    await createProductModifierValue({ modifierTypeId: thirdType.id, value: "Cotton" }, mockCtx)
    await createProductModifierValue({ modifierTypeId: thirdType.id, value: "Polyester" }, mockCtx)

    const variants = await db.productVariant.findMany({
      where: {
        productId,
      },
      include: { modifierValues: true },
    })

    if (!variants || variants.length === 0) {
      throw new Error("Variant with new modifier value not found")
    }

    expect(variants.length).toBe(8)
    expect(variants.every((entry) => entry.modifierValues.length === 3)).toBeTruthy()
    const combinationsExpected = new Set([
      new Set(["XS", "Red", "Cotton"]),
      new Set(["XS", "Red", "Polyester"]),
      new Set(["XS", "Blue", "Cotton"]),
      new Set(["XS", "Blue", "Polyester"]),
      new Set(["S", "Red", "Cotton"]),
      new Set(["S", "Red", "Polyester"]),
      new Set(["S", "Blue", "Cotton"]),
      new Set(["S", "Blue", "Polyester"]),
    ])

    const combinationsActual = new Set(
      variants.map((entry) => new Set(entry.modifierValues.map((mv) => mv.value)))
    )

    expect(combinationsActual).toEqual(combinationsExpected)
  })
})
