import db from "@/db"
import { withBlitzAuth } from "@/src/app/blitz-server"
import { NextResponse } from "next/server"

export const { GET } = withBlitzAuth({
  GET: async (_request, _params, ctx) => {
    if (!ctx.session.$isAuthorized()) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const report = await db.pDF.findFirst({
      orderBy: { createdAt: "desc" },
    })

    if (!report?.data) {
      return new NextResponse("No PDF found", { status: 404 })
    }

    const pdfBuffer = Buffer.isBuffer(report.data) ? report.data : Buffer.from(report.data as any)
    const body = new Uint8Array(pdfBuffer)
    return new NextResponse(body, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="report.pdf"',
      },
    })
  },
})
