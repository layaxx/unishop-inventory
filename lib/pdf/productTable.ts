export function buildProductTable(
  variants: Array<{
    variant: {
      modifierValues: { modifierType: { name: string }; value: string }[]
    }

    quantity: Record<string, number>
  }>,
  productName: string
) {
  let latex = ""

  // --- Collect modifier types in order ---
  const modifierTypes = Array.from(
    new Set(variants.flatMap((s) => s.variant.modifierValues.map((mv) => mv.modifierType.name)))
  )

  const numLocations = Object.keys(variants[0].quantity).length

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
  const numCols = 1 + modifierTypes.length + numLocations + (numLocations > 1 ? 1 : 0)
  latex += `
\\needspace{5cm}
\\section*{${productName}}
\\begin{tabularx}{\\textwidth}{|X|${modifierTypes.map(() => "l|").join("")}${Array.from({
    length: numLocations,
  })
    .map(() => "r|")
    .join("")}r|}
${makeHeader(modifierTypes, Object.keys(variants[0].quantity), false)}
\\endfirsthead

${makeHeader(modifierTypes, Object.keys(variants[0].quantity), true)}
\\endhead

\\hline
\\multicolumn{${numCols}}{r}{\\textit{Fortsetzung auf der nächsten Seite}} \\\\
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
        i < groupVariants.length - 1 ? `\\\\ \\cline{3-${numCols}}` : `\\\\ \\cline{2-${numCols}}`

      if (totalIndex === variants.length) {
        lineEnd = `\\\\ \\hline`
      }

      const quantities = Object.values(s.quantity).join(" & ")

      const sum =
        numLocations > 1 ? " & " + Object.values(s.quantity).reduce((a, b) => a + b, 0) : ""

      latex += `${prefixProduct} & ${prefixGroup} & ${otherModifiers} ${quantities} ${sum} ${lineEnd}\n`
      productPrinted = true
    })
  }

  // --- Total row ---
  const total = variants.reduce(
    (sum, s) => sum + Object.values(s.quantity).reduce((curr, prev) => curr + prev, 0),
    0
  )
  latex += `\\multicolumn{${
    modifierTypes.length + 1
  }}{|r|}{\\textbf{${productName} Gesamt}} &  ${Object.keys(variants[0].quantity)
    .map((k) => variants.reduce((sum, s) => sum + s.quantity[k as string] || 0, 0))
    .join(" & ")} ${numLocations > 1 ? `& \\textbf{${total}}` : ""} \\\\ \\hline\n`

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
function translate(modifierType: string): string {
  const translations: Record<string, string> = {
    Color: "Farbe",
    Size: "Größe",
  }
  return translations[modifierType] || modifierType
}

function makeHeader(modifierTypes: string[], locationNames: string[], isContinuation: boolean) {
  return `\\hline
\\textbf{Artikel${isContinuation ? " (Fortsetzung)" : ""}} & ${modifierTypes
    .map((t) => `\\textbf{${translate(t)}} &`)
    .join("")} ${locationNames.map((k) => `\\textbf{Anzahl ${k}}`).join(" & ")} ${
    locationNames.length > 1 ? `& \\textbf{Summe}` : ""
  } \\\\ \\hline`
}
