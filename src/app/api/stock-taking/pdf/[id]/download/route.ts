import db from "@/db"
import { NextResponse } from "next/server"

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const param = await params

  const report = await db.pDF.findUnique({
    where: { id: Number(param.id) },
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
}
