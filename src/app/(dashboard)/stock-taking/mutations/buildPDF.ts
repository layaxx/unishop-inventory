import { resolver } from "@blitzjs/rpc"
import { z } from "zod"
import fs from "node:fs/promises"
import { join } from "node:path"
import { tmpdir } from "node:os"
import { exec } from "node:child_process"

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


\\begin{minipage}[t][3cm][t]{6cm}%
  \\hrulefill                           \\\\\\textit{Ort, Unterschrift}
\\end{minipage}\\hfill

\\end{document}
`

const BuildPDFSchema = z.object({})

const buildTable = (data: any) => {
  // FIXME: implement table building logic
  return ""
}

export default resolver.pipe(
  resolver.zod(BuildPDFSchema),
  resolver.authorize(),
  async (data, ctx) => {
    const latexText = template.replace("###TABLE###", buildTable(data))

    // render latex to pdf
    return await renderToPDF(latexText)
  }
)

async function renderToPDF(latexText: string): Promise<Buffer> {
  const tmpDirectory = await fs.mkdtemp(join(tmpdir(), "latex-inventory"))
  const texFilePath = join(tmpDirectory, "document.tex")
  const pdfFilePath = join(tmpDirectory, "document.pdf")

  await fs.writeFile(texFilePath, latexText)

  await new Promise<void>((resolve, reject) => {
    exec(`pdflatex -output-directory=${tmpDirectory} ${texFilePath}`, (error) => {
      if (error) {
        reject(error)
        return
      }
      resolve()
    })
  })

  const pdfBuffer = await fs.readFile(pdfFilePath)

  // clean up temporary files
  await fs.rm(tmpDirectory, { recursive: true, force: true })

  return pdfBuffer
}
