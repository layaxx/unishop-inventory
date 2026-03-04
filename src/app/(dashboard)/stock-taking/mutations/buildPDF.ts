import { resolver } from "@blitzjs/rpc"
import { z } from "zod"
import fs from "node:fs/promises"
import { join } from "node:path"
import { tmpdir } from "node:os"
import { exec } from "node:child_process"
import db from "@/db"
import { promisify } from "node:util"
import dayjs from "dayjs"
import { latexTemplate } from "@/lib/pdf/template"
import { buildCompactTable } from "@/lib/pdf/tables/compact"
import { buildTables } from "@/lib/pdf/tables/main-tables"
import {
  TableInputLocations,
  TableInputStockData,
  TableInputStockLevels,
} from "@/lib/pdf/tables/types"
import { ROLES_WITH_READ_ACCESS } from "@/src/app/(auth)/validations"

const execAsync = promisify(exec)

const BuildPDFSchema = z.object({
  auditIds: z.array(z.number().min(1)).min(1).optional(),
  includeCompact: z.boolean().optional(),
  directFromStockTaking: z.boolean().default(true),
})

const formatTemplateForStocktaking = (template: string): string => {
  template = template.replace("###TITLE###", "Inventur am \\today{}")
  return template.replace(
    "###FINAL-WORDS###",
    `\\section*{Abschlussbemerkung}
Die vorliegende Inventur basiert auf einer händischen Zählung der Bestände zum Stichtag. Die erfassten Mengen spiegeln den aktuellen Stand der Lagerbestände wider.

Trotz größter Sorgfalt bei der Zählung können leichte Abweichungen nicht vollständig ausgeschlossen werden.
`
  )
}

const formatTemplateCurrent = (template: string, audits: { createdAt: Date }[]): string => {
  template = template.replace("###TITLE###", "Inventarstand \\today{}")

  const firstDay = dayjs(audits[0].createdAt)
  const allSameDay = audits?.every((audit) => {
    const auditDate = dayjs(audit.createdAt)
    return auditDate.isSame(firstDay, "day")
  })

  const lastFullStocktakingDate = allSameDay
    ? dayjs(audits[0].createdAt).format("DD.MM.YYYY")
    : "einem früheren Datum"

  return template.replace(
    "###FINAL-WORDS###",
    `\\section*{Abschlussbemerkung}
Der vorliegende Bericht basiert auf einer händischen Zählung vom ${lastFullStocktakingDate} abzüglich seitdem aufgezeichneter Verkäufe.

Trotz größter Sorgfalt können Abweichungen nicht vollständig ausgeschlossen werden.
`
  )
}

export default resolver.pipe(
  resolver.zod(BuildPDFSchema),
  resolver.authorize(ROLES_WITH_READ_ACCESS),
  async (data) => {
    if ((!data.auditIds || data.auditIds.length === 0) && data.directFromStockTaking) {
      throw new Error("If directFromStockTaking is true, auditIds must be provided")
    }

    let template = latexTemplate

    if (data.directFromStockTaking) {
      template = formatTemplateForStocktaking(template)
    } else {
      const latestPerLocation = await db.auditLogStocktaking.groupBy({
        by: ["locationId"],
        where: { success: true },
        _max: {
          createdAt: true,
        },
      })

      const audits = await db.auditLogStocktaking.findMany({
        where: {
          OR: latestPerLocation
            .filter((x) => x._max.createdAt)
            .map((x) => ({
              locationId: x.locationId,
              createdAt: x._max.createdAt!,
            })),
        },
        select: { locationId: true, createdAt: true, id: true },
      })
      template = formatTemplateCurrent(template, audits)
    }

    let relevantLocations: TableInputLocations = []
    let stockLevels: TableInputStockLevels = []
    let stockData: TableInputStockData = []
    if (data.directFromStockTaking) {
      const audits = await db.auditLogStocktaking.findMany({
        where: { id: { in: data.auditIds } },
      })

      relevantLocations = await db.location.findMany({
        where: { id: { in: audits.map((a) => a.locationId) } },
      })

      if (relevantLocations.length === 0) {
        throw new Error("No locations found for the provided audit IDs")
      } else if (relevantLocations.length !== data.auditIds!.length) {
        throw new Error("Some audits do not have a corresponding location")
      }

      stockData = await db.stockLevel.findMany({
        where: { locationId: relevantLocations[0].id },
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

      stockLevels = (
        await db.stocktakingCount.findMany({
          where: { auditLogStocktakingId: { in: data.auditIds } },
          include: { auditLogStocktaking: true },
        })
      ).map((entry) => ({
        variantId: entry.variantId,
        locationId: entry.auditLogStocktaking.locationId,
        quantity: entry.quantityCounted,
      }))
    } else {
      relevantLocations = await db.location.findMany()

      stockData = await db.stockLevel.findMany({
        where: { locationId: relevantLocations[0].id },
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

      stockLevels = await db.stockLevel.findMany({
        where: { locationId: { in: relevantLocations.map((loc) => loc.id) } },
      })
    }

    template = template.replace(
      "###COMPACT-TABLE###",
      data.includeCompact
        ? await buildCompactTable(relevantLocations, stockLevels, stockData)
        : "%\n"
    )

    template = template.replace(
      "###TABLE###",
      await buildTables(relevantLocations, stockLevels, stockData)
    )

    // render latex to pdf
    return await renderToPDF(template)
  }
)

async function renderToPDF(latexText: string): Promise<Uint8Array> {
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
