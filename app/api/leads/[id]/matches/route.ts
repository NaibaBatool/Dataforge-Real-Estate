import { NextResponse } from "next/server"
import { getLeadMatchesResult } from "@/lib/leads-store"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const matchResult = getLeadMatchesResult(id)

  if (!matchResult) {
    return NextResponse.json(
      { success: false, error: "Lead not found or session expired. Please complete the qualification form again." },
      { status: 404 }
    )
  }

  return NextResponse.json({
    success: true,
    ...matchResult,
  })
}
