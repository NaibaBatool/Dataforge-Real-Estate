import { NextResponse } from "next/server"
import { isValidPhone, isValidBudget } from "@/lib/scoring"
import { saveLead } from "@/lib/leads-store"
import { dispatchN8NWebhook } from "@/lib/n8n"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // 1. Validation
    const {
      purpose,
      propertyType,
      areas,
      budgetMin,
      budgetMax,
      timeline,
      name,
      phone,
      email,
      notes,
      consent,
    } = body

    if (!purpose || !["buy", "rent", "invest"].includes(purpose)) {
      return NextResponse.json(
        { success: false, error: "Please select a valid property purpose (buy, rent, or invest)." },
        { status: 400 }
      )
    }

    if (!propertyType || !["house", "apartment", "plot", "commercial"].includes(propertyType)) {
      return NextResponse.json(
        { success: false, error: "Please select a valid property type." },
        { status: 400 }
      )
    }

    if (!Array.isArray(areas) || areas.length === 0) {
      return NextResponse.json(
        { success: false, error: "Please select at least one preferred location area." },
        { status: 400 }
      )
    }

    const minNum = Number(budgetMin)
    const maxNum = Number(budgetMax)
    if (isNaN(minNum) || isNaN(maxNum) || !isValidBudget(minNum, maxNum)) {
      return NextResponse.json(
        { success: false, error: "Please specify a valid budget range where maximum is greater than minimum." },
        { status: 400 }
      )
    }

    if (!timeline) {
      return NextResponse.json(
        { success: false, error: "Please specify your target timeline." },
        { status: 400 }
      )
    }

    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: "Please provide your full name." },
        { status: 400 }
      )
    }

    if (!phone || !isValidPhone(phone)) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid phone number for property match follow-up." },
        { status: 400 }
      )
    }

    if (consent !== true) {
      return NextResponse.json(
        { success: false, error: "Consent is required to submit contact details and receive matched properties." },
        { status: 400 }
      )
    }

    // 2. Persist lead and compute score & tier
    const storedLead = saveLead({
      purpose,
      propertyType,
      areas,
      budgetMin: minNum,
      budgetMax: maxNum,
      timeline,
      name: name.trim(),
      phone: phone.trim(),
      email: email ? email.trim() : undefined,
      notes: notes ? notes.trim() : undefined,
      consent: true,
    })

    // 3. Optional n8n webhook notification (non-blocking)
    dispatchN8NWebhook({
      event: "lead.created",
      leadId: storedLead.id,
      purpose: storedLead.purpose,
      propertyType: storedLead.propertyType,
      areas: storedLead.areas,
      budgetMin: storedLead.budgetMin,
      budgetMax: storedLead.budgetMax,
      timeline: storedLead.timeline,
      score: storedLead.scoreBreakdown.totalScore,
      tier: storedLead.scoreBreakdown.tier,
      name: storedLead.name,
      phone: storedLead.phone,
      email: storedLead.email,
      notes: storedLead.notes,
      createdAt: storedLead.createdAt,
    }).catch((err) => {
      console.warn("n8n webhook dispatch background notification warning:", err)
    })

    // 4. Return safe response without leaking unnecessary internal credentials
    return NextResponse.json({
      success: true,
      leadId: storedLead.id,
      score: storedLead.scoreBreakdown.totalScore,
      tier: storedLead.scoreBreakdown.tier,
      message: "Lead qualified successfully. Redirecting to your property matches.",
    })
  } catch (err: unknown) {
    console.error("Error processing lead submission:", err)
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred while processing your request. Please try again." },
      { status: 500 }
    )
  }
}
