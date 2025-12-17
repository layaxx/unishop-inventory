import db from "@/db"
import buildPDF from "@/src/app/(dashboard)/stock-taking/mutations/buildPDF"
import { withBlitzAuth } from "@/src/app/blitz-server"
import dayjs from "dayjs"
import { NextResponse } from "next/server"

export const { GET } = withBlitzAuth({
  GET: async (_request, _params, ctx) => {
    if (!ctx.session.$isAuthorized()) {
      return new NextResponse("Unauthorized", { status: 401 })
    }
    const allLocations = (await db.location.findMany()).map((loc) => loc.id)
    let report
    try {
      report = await buildPDF(
        { locationIds: allLocations, includeCompact: true, directFromStockTaking: false },
        ctx
      )
    } catch (e) {
      console.log("Error generating PDF report:", e)
      return new NextResponse("Failed to generate report", { status: 500 })
    }

    if (!report) {
      return new NextResponse("Failed to generate report", { status: 500 })
    }

    const body = new Uint8Array(report)
    return new NextResponse(body, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="report_${dayjs().format("YYYY-MM-DD")}.pdf"`,
      },
    })
  },
})
