import { Location, StockLevel } from "db"

export type TableInputLocations = Location[]
export type TableInputStockLevels = Pick<StockLevel, "variantId" | "locationId" | "quantity">[]
export type TableInputStockData = Array<{
  quantity: number
  variantId: number
  variant: {
    product: { name: string }
    modifierValues: { modifierType: { name: string }; value: string }[]
  }
}>
