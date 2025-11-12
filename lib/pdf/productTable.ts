export function buildProductTable(
  variants: ({
    variant: {
      product: { name: string }
      modifierValues: ({ modifierType: { name: string } } & {
        value: string
        id: number
        updatedAt: Date
        createdAt: Date
        modifierTypeId: number
        order: number
      })[]
    } & { id: number; updatedAt: Date; image: string | null; createdAt: Date; productId: number }
  } & { locationId: number; id: number; variantId: number; quantity: number; updatedAt: Date })[],
  productName: string
) {
  let latex = ""

  // --- Collect modifier types in order ---
  const modifierTypes = Array.from(
    new Set(variants.flatMap((s) => s.variant.modifierValues.map((mv) => mv.modifierType.name)))
  )

  if (modifierTypes.length === 0) modifierTypes.push("Variante")

  // Pick the first modifier as the group key (e.g. "Color")
  const groupBy = modifierTypes[0]

  // --- Group variants by first modifier value ---
  const groupedByFirst: Record<string, typeof variants> = {}
  for (const s of variants) {
    const key =
      s.variant.modifierValues.find((mv) => mv.modifierType.name === groupBy)?.value ?? "—"
    if (!groupedByFirst[key]) groupedByFirst[key] = []
    groupedByFirst[key].push(s)
  }

  // --- Table header ---
  latex += `
\\section*{${productName}}
\\begin{tabularx}{\\textwidth}{|X|${modifierTypes.map(() => "l|").join("")}r|}
\\hline
\\textbf{Artikel} & ${modifierTypes
    .map((t) => `\\textbf{${t}} &`)
    .join("")} \\textbf{Anzahl} \\\\ \\hline
\\endfirsthead

\\hline
\\textbf{Artikel (Fortsetzung)} & ${modifierTypes
    .map((t) => `\\textbf{${t}} & `)
    .join("")}  \\textbf{Anzahl} \\\\ \\hline
\\endhead

\\hline
\\multicolumn{${modifierTypes.length + 2}}{r}{\\textit{Fortsetzung auf der nächsten Seite}} \\\\
\\endfoot

\\hline
\\endlastfoot
`

  // --- Render grouped rows ---
  const productMultirow =
    variants.length > 1 ? `\\multirow[t]{${variants.length}}{*}{${productName}}` : productName
  let productPrinted = false

  const groupedByFirstSorted = Object.entries(groupedByFirst)
  // sort by group value
  groupedByFirstSorted.sort((a, b) => a[0].localeCompare(b[0]))

  let totalIndex = 0

  for (const [groupValue, groupVariants] of groupedByFirstSorted) {
    const groupMultirow =
      groupVariants.length > 1
        ? `\\multirow[t]{${groupVariants.length}}{*}{${groupValue}}`
        : groupValue

    groupVariants.sort((a, b) => {
      // sort by other modifier values
      const aModifiers = Object.fromEntries(
        a.variant.modifierValues.map((mv) => [mv.modifierType.name, mv.value])
      )
      const bModifiers = Object.fromEntries(
        b.variant.modifierValues.map((mv) => [mv.modifierType.name, mv.value])
      )

      for (const modType of modifierTypes.slice(1)) {
        const aValue = aModifiers[modType] || ""
        const bValue = bModifiers[modType] || ""

        if (isValidSizeString(aValue) && isValidSizeString(bValue)) {
          const aSize = parseSizeString(aValue)
          const bSize = parseSizeString(bValue)
          const cmp = aSize - bSize
          if (cmp !== 0) return cmp
          continue
        }

        const cmp = aValue.localeCompare(bValue)
        if (cmp !== 0) return cmp
      }
      return 0
    })

    groupVariants.forEach((s, i) => {
      totalIndex++
      const modifiers = Object.fromEntries(
        s.variant.modifierValues.map((mv) => [mv.modifierType.name, mv.value])
      )

      const otherModifiers = modifierTypes
        .slice(1)
        .map((t) => (modifiers[t] ?? "") + " & ")
        .join()

      const prefixProduct = !productPrinted ? productMultirow : ""
      const prefixGroup = i === 0 ? groupMultirow : ""
      let lineEnd =
        i < groupVariants.length - 1
          ? `\\\\ \\cline{3-${modifierTypes.length + 2}}`
          : `\\\\ \\cline{2-${modifierTypes.length + 2}}`

      if (totalIndex === variants.length) {
        lineEnd = `\\\\ \\hline`
      }

      latex += `${prefixProduct} & ${prefixGroup} & ${otherModifiers} ${s.quantity} ${lineEnd}\n`
      productPrinted = true
    })
  }

  // --- Total row ---
  const total = variants.reduce((sum, s) => sum + s.quantity, 0)
  latex += `\\multicolumn{${
    modifierTypes.length + 1
  }}{|r|}{\\textbf{${productName} Gesamt}} & \\textbf{${total}} \\\\ \\hline\n`

  latex += `\\end{tabularx}\n\n`
  return latex
}

const sizeMap: Record<string, number> = {
  xs: 1,
  s: 2,
  m: 3,
  l: 4,
  xl: 5,
  xxl: 6,
  xxxl: 7,
  "2xl": 6,
}

function isValidSizeString(aValue: string) {
  return aValue.toLowerCase() in sizeMap
}
function parseSizeString(aValue: string): number {
  return sizeMap[aValue.toLowerCase()] || 100
}
