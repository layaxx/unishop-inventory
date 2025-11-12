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
  const modifierTypes = Array.from(
    new Set(variants.flatMap((s) => s.variant.modifierValues.map((mv) => mv.modifierType.name)))
  )

  // Table header
  latex += `
\\section*{Produkt: ${productName}}
\\begin{tabularx}{\\textwidth}{|X|${modifierTypes.map(() => "l|").join("")}r|}
\\hline
\\textbf{Artikel} & ${modifierTypes
    .map((t) => `\\textbf{${t}} & `)
    .join("")}\\textbf{Anzahl} \\\\ \\hline
\\endfirsthead

\\hline
\\textbf{Artikel} & ${modifierTypes
    .map((t) => `\\textbf{${t}} & `)
    .join("")} \\textbf{Anzahl} \\\\ \\hline
\\endhead

\\hline
\\multicolumn{${modifierTypes.length + 2}}{r}{\\textit{Weiter auf der nächsten Seite}} \\\\
\\endfoot

\\hline
\\endlastfoot
`

  // --- Table rows ---
  const multirow =
    variants.length > 1 ? `\\multirow[t]{${variants.length}}{*}{${productName}}` : productName

  variants.forEach((s, i) => {
    const modifiers = Object.fromEntries(
      s.variant.modifierValues.map((mv) => [mv.modifierType.name, mv.value])
    )

    const cols = modifierTypes.map((t) => (modifiers[t] ?? "") + " & ").join("")
    const prefix = i === 0 ? multirow : ""
    const lineEnd =
      i < variants.length - 1 ? `\\\\ \\cline{2-${modifierTypes.length + 2}}` : `\\\\ \\hline`
    latex += `${prefix} & ${cols} ${s.quantity} ${lineEnd}\n`
  })

  const total = variants.reduce((sum, s) => sum + s.quantity, 0)
  latex += `\\multicolumn{${
    modifierTypes.length + 1
  }}{|r|}{\\textbf{${productName} Gesamt}} & \\textbf{${total}} \\\\ \\hline\n`

  latex += `\\end{tabularx}\n\\bigskip\n`
  return latex
}
