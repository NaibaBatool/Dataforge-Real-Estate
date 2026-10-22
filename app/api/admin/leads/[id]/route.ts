import { NextResponse } from "next/server"
import { getAuthenticatedAdmin } from "@/lib/auth"
import { getLeadMatchesResult, updateLeadStatus, type LeadStatus } from "@/lib/leads-store"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getAuthenticatedAdmin()
  if (!admin) {
    return NextResponse.json(
      { success: false, error: "Unauthorized. Administrator session required." },
      { status: 401 }
    )
  }

  const { id } = await params
  const leadData = getLeadMatchesResult(id)

  if (!leadData) {
    return NextResponse.json(
      { success: false, error: "Lead record not found." },
      { status: 404 }
    )
  }

  return NextResponse.json({
    success: true,
    lead: leadData.lead,
    exactMatches: leadData.exactMatches,
    alternativeMatches: leadData.alternativeMatches,
  })
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getAuthenticatedAdmin()
  if (!admin) {
    return NextResponse.json(
      { success: false, error: "Unauthorized. Administrator session required." },
      { status: 401 }
    )
  }

  const { id } = await params
  const body = await request.json()
  const { status } = body

  if (!status || !["new", "contacted", "qualified", "closed"].includes(status)) {
    return NextResponse.json(
      { success: false, error: "Invalid status value provided." },
      { status: 400 }
    )
  }

  const updatedLead = updateLeadStatus(id, status as LeadStatus)
  if (!updatedLead) {
    return NextResponse.json(
      { success: false, error: "Lead record not found." },
      { status: 404 }
    )
  }

  return NextResponse.json({
    success: true,
    message: `Lead status updated to ${status}.`,
    lead: updatedLead,
  })
}
