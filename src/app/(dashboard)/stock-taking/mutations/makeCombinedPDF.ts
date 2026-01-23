import db from "@/db"
import { resolver } from "@blitzjs/rpc"
import buildPDF from "./buildPDF"

export default resolver.pipe(resolver.authorize(), async (_data, ctx) => {
  const allLocations = (await db.location.findMany()).map((loc) => loc.id)

  const report = await buildPDF({ locationIds: allLocations }, ctx)

  const audits = await Promise.all(
    allLocations.map(async (locId) => {
      const latestAudit = await db.auditLogStocktaking.findFirst({
        where: { locationId: locId, success: true },
        orderBy: { createdAt: "desc" },
      })
      return latestAudit
    })
  )

  if (audits.some((a) => !a)) {
    throw new Error("No successful stocktaking audits found for all locations")
  }

  await db.pDF.create({
    data: {
      data: Buffer.from(report),
      audits: { connect: audits.map((a) => ({ id: a!.id })) },
    },
  })

  return {
    downloadLink: `/api/stock-taking/pdf/latest`,
  }
})
