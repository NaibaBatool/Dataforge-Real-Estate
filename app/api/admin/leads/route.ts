import { NextResponse } from "next/server"
import { getAuthenticatedAdmin } from "@/lib/auth"
import { getAllLeads, getLeadMetrics } from "@/lib/leads-store"

export async function GET(request: Request) {
  const admin = await getAuthenticatedAdmin()
  if (!admin) {
    return NextResponse.json(
      { success: false, error: "Unauthorized. Administrator session required." },
      { status: 401 }
    )
  }

  const { searchParams } = new URL(request.url)
  const tier = searchParams.get("tier") || undefined
  const purpose = searchParams.get("purpose") || undefined
  const status = searchParams.get("status") || undefined
  const search = searchParams.get("search") || undefined

  const leads = getAllLeads({ tier, purpose, status, search })
  const metrics = getLeadMetrics()

  return NextResponse.json({
    success: true,
    count: leads.length,
    metrics,
    leads,
  })
}
