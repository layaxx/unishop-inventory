import db from "@/db"
import { ROLES_WITH_READ_ACCESS } from "@/src/app/(auth)/validations"
import { withBlitzAuth } from "@/src/app/blitz-server"
import { NextResponse } from "next/server"

export const { GET } = withBlitzAuth({
  GET: async (_request, params, ctx) => {
    if (!ctx.session.$isAuthorized(ROLES_WITH_READ_ACCESS)) {
      return new NextResponse("Unauthorized", { status: 401 })
    }
    const { id } = await params.params

    if (!id || Number.isNaN(Number(id))) {
      return new NextResponse("Missing or invalid id", { status: 403 })
    }

    const audit = await db.auditLogStocktaking.findUnique({
      where: { id: Number(id) },
    })

    if (!audit?.pdfReport) {
      return new NextResponse("No PDF found", { status: 404 })
    }

    const pdfBuffer = Buffer.isBuffer(audit.pdfReport)
      ? audit.pdfReport
      : Buffer.from(audit.pdfReport as any)
    const body = new Uint8Array(pdfBuffer)
    return new NextResponse(body, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="report.pdf"',
      },
    })
  },
})
