import { buildCompactProductsTable } from "@/lib/pdf/compactTable"
import { Location, StockLevel } from "@/db"

export const buildCompactTable = async (
  locations: Location[],
  stockLevels: Pick<StockLevel, "variantId" | "locationId" | "quantity">[],
  stockData: Array<{
    quantity: number
    variantId: number
    variant: {
      product: { name: string }
      modifierValues: { modifierType: { name: string }; value: string }[]
    }
  }>
) => {
  if (stockData.length === 0) {
    return "% No stock data available\n"
  }

  // Group by product
  const grouped: Record<string, typeof stockData> = {}
  for (const s of stockData) {
    const pName = s.variant.product.name
    if (!grouped[pName]) grouped[pName] = []
    grouped[pName].push(s)
  }

  const data = Object.entries(grouped)
  // sort by product name
  data.sort((a, b) => a[0].localeCompare(b[0]))

  const locationNames: Record<number, string> = {}
  for (const loc of locations) {
    locationNames[loc.id] = loc.name
  }

  return buildCompactProductsTable(
    data.map(([product, variants]) => {
      return {
        product,
        quantity: Object.fromEntries(
          locations.map((loc) => {
            const stockEntries = stockLevels.filter(
              (s) => variants.some((v) => v.variantId === s.variantId) && s.locationId === loc.id
            )
            const quantity = stockEntries.reduce((sum, entry) => sum + entry.quantity, 0)
            return [locationNames[loc.id], quantity]
          })
        ),
      }
    })
  ).trim()
}
