import { buildProductTable } from "@/lib/pdf/productTable"
import { TableInputLocations, TableInputStockData, TableInputStockLevels } from "./types"

export const buildTables = async (
  locations: TableInputLocations,
  stockLevels: TableInputStockLevels,
  stockData: TableInputStockData
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

  let latex = ""

  const data = Object.entries(grouped)
  // sort by product name
  data.sort((a, b) => a[0].localeCompare(b[0]))

  const locationNames: Record<number, string> = {}
  for (const loc of locations) {
    locationNames[loc.id] = loc.name
  }

  for (const [product, variants] of data) {
    // Collect modifier types used only in this product
    latex += buildProductTable(
      variants.map((variant) => {
        return {
          ...variant,
          quantity: Object.fromEntries(
            locations.map((loc) => {
              const stockEntry = stockLevels.find(
                (s) => s.variantId === variant.variantId && s.locationId === loc.id
              )
              return [locationNames[loc.id], stockEntry ? stockEntry.quantity : -99] // FIXME: this is maybe not correct atm?
            })
          ),
        }
      }),
      product
    )
  }

  return latex.trim()
}
