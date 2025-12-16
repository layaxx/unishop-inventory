export function buildCompactProductsTable(
  products: Array<{
    product: string
    quantity: Record<string, number>
  }>
) {
  let latex = ""

  const numLocations = Object.keys(products[0].quantity).length

  // --- Table header ---
  const numCols = 1 + numLocations + (numLocations > 1 ? 1 : 0)
  latex += `
\\needspace{5cm}
\\section*{Kurzübersicht}
\\begin{tabularx}{\\textwidth}{|X|${Array.from({
    length: numLocations,
  })
    .map(() => "r|")
    .join("")}r|}
${makeHeader(Object.keys(products[0].quantity), false)}
\\endfirsthead

${makeHeader(Object.keys(products[0].quantity), true)}
\\endhead

\\hline
\\multicolumn{${numCols}}{r}{\\textit{Fortsetzung auf der nächsten Seite}} \\\\
\\endfoot

\\hline
\\endlastfoot
`

  let productPrinted = false

  products.forEach((product) => {
    const quantities = Object.values(product.quantity).join(" & ")

    const sum =
      numLocations > 1 ? " & " + Object.values(product.quantity).reduce((a, b) => a + b, 0) : ""

    latex += `${product.product} & ${quantities} ${sum} \\\\ \\hline\n`
    productPrinted = true
  })

  // --- Total row ---
  const total = products.reduce(
    (sum, s) => sum + Object.values(s.quantity).reduce((curr, prev) => curr + prev, 0),
    0
  )
  latex += `\\multicolumn{${1}}{|r|}{\\textbf{Gesamt}} &  ${Object.keys(products[0].quantity)
    .map((k) => products.reduce((sum, s) => sum + s.quantity[k as string] || 0, 0))
    .join(" & ")} ${numLocations > 1 ? `& \\textbf{${total}}` : ""} \\\\ \\hline\n`

  latex += `\\end{tabularx}\n\n`
  return latex
}

function makeHeader(locationNames: string[], isContinuation: boolean) {
  return `\\hline
\\textbf{Artikel${isContinuation ? " (Fortsetzung)" : ""}} & ${locationNames
    .map((k) => `\\textbf{Anzahl ${k}}`)
    .join(" & ")} ${locationNames.length > 1 ? `& \\textbf{Summe}` : ""} \\\\ \\hline`
}
