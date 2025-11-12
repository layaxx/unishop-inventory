import { resolver } from "@blitzjs/rpc"
import { z } from "zod"
import fs from "node:fs/promises"
import { join } from "node:path"
import { tmpdir } from "node:os"
import { exec } from "node:child_process"
import db from "@/db"
import { promisify } from "node:util"
import { buildProductTable } from "@/lib/pdf/productTable"

const execAsync = promisify(exec)

const template = `\\documentclass[a4paper,10 pt]{article} % Uses article class in A4 format
\\setlength{\\voffset}{-15pt}

\\usepackage[a4paper, margin=2.5cm]{geometry} % Sets margin to 2.5cm for A4 Paper
\\usepackage[onehalfspacing]{setspace} % Sets Spacing to 1.5
\\usepackage{parskip}
\\usepackage[T1]{fontenc} % Use European encoding
\\usepackage[utf8]{inputenc} % Use UTF-8 encoding
\\usepackage{charter} % Use the Charter font
\\usepackage{microtype} % Slightly tweak font spacing for aesthetics
\\usepackage{lastpage}
\\usepackage{multirow}
\\usepackage{tabularx}
\\usepackage{longtable}
\\usepackage{ltablex}
\\keepXColumns

\\usepackage[english, ngerman]{babel} % Language hyphenation and typographical rules

\\usepackage[ddmmyyyy]{datetime} 
\\renewcommand{\\dateseparator}{.}
\\usepackage{xcolor} % Driver-independent color extensions
\\usepackage{booktabs} % Enhances quality of tables
\\usepackage{enumitem}
\\setlist{nosep} % or \\setlist{noitemsep} to leave space around whole list
\\usepackage{fancyhdr} % Headers and footers
\\pagestyle{fancy} % All pages have headers and footers
\\fancyhead{}\\renewcommand{\\headrulewidth}{0pt} % Blank out the default header
\\fancyfoot[L]{\\textsc{Inventur UniShop Bamberg, \\today}} % Custom footer text
\\fancyfoot[C]{} % Custom footer text
\\fancyfoot[R]{\\thepage/\\pageref{LastPage}} % Custom footer text

%----------------------------------------------------------------------------------------
\\providecommand{\\tightlist}{%
  \\setlength{\\itemsep}{0pt}\\setlength{\\parskip}{0pt}}

\\begin{document}
\\title{template_assignment} % Article title
\\fancyhead[C]{}
\\begin{minipage}{0.195\\textwidth} % Left side of title section
  \\raggedright
  %\\hfill
  \\textbf{}
  \\footnotesize % Authors text size
  \\medskip\\hrule
\\end{minipage}
\\begin{minipage}{0.6\\textwidth} % Center of title section
  \\centering
  \\huge % Title text size
  Inventur am \\today{}\\\\ % Assignment title and number
  \\normalsize % Subtitle text size
  UniShop Bamberg\\\\ % Assignment subtitle
\\end{minipage}
\\begin{minipage}{0.195\\textwidth} % Right side of title section
  \\raggedleft
  \\textbf{}
  \\footnotesize % Email text size
  %\\hfill\\\\ % Uncomment if left minipage has more lines
  \\medskip\\hrule
\\end{minipage}
\\bigskip 

###TABLE###

\\begin{minipage}[t][3cm][t]{6cm}%
  \\hrulefill                           \\\\\\textit{Ort, Unterschrift}
\\end{minipage}\\hfill

\\end{document}
`

const BuildPDFSchema = z.object({ locationId: z.number().min(0) })

const buildTables = async (locationId: number) => {
  const stockData = await db.stockLevel.findMany({
    where: { locationId },
    include: {
      variant: {
        include: {
          product: { select: { name: true } },
          modifierValues: {
            include: { modifierType: { select: { name: true } } },
          },
        },
      },
    },
  })

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

  const locationName =
    (await db.location.findUnique({ where: { id: locationId } }))?.name || "Unbekannt"

  for (const [product, variants] of data) {
    // Collect modifier types used only in this product
    latex += buildProductTable(
      variants.map((variant) => {
        return { ...variant, quantity: { [locationName]: variant.quantity } }
      }),
      product
    )
  }

  return latex.trim()
}

export default resolver.pipe(
  resolver.zod(BuildPDFSchema),
  resolver.authorize(),
  async (data, ctx) => {
    const latexText = template.replace("###TABLE###", await buildTables(data.locationId))

    // render latex to pdf
    return await renderToPDF(latexText)
  }
)

async function renderToPDF(latexText: string): Promise<Buffer> {
  const tmpDirectory = await fs.mkdtemp(join(tmpdir(), "latex-inventory"))
  const texFilePath = join(tmpDirectory, "document.tex")
  const pdfFilePath = join(tmpDirectory, "document.pdf")

  await fs.writeFile(texFilePath, latexText)

  try {
    const { stdout, stderr } = await execAsync(
      `latexmk -pdf -interaction=nonstopmode -output-directory=${tmpDirectory} ${texFilePath}`
    )

    if (stderr) console.error("LaTeX errors:", stderr)
    console.log("✅ Compilation done!")
  } catch (err) {
    console.error("❌ LaTeX compilation failed:", err)
  }

  console.log("Reading generated PDF from:", pdfFilePath)

  const pdfBuffer = await fs.readFile(pdfFilePath)

  // clean up temporary files
  await fs.rm(tmpDirectory, { recursive: true, force: true })

  return pdfBuffer
}
