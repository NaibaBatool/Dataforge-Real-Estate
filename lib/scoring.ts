/**
 * Lead scoring module for DataForge Estates.
 * Calculates deterministic lead score and classification tier.
 */

export type TimelineOption =
  | "immediately"
  | "1-3_months"
  | "3-6_months"
  | "exploring"

export type LeadTier = "hot" | "warm" | "cold"

export type LeadSubmission = {
  purpose: "buy" | "rent" | "invest"
  propertyType: "house" | "apartment" | "plot" | "commercial"
  areas: string[]
  budgetMin: number
  budgetMax: number
  timeline: TimelineOption
  name: string
  phone: string
  email?: string
  notes?: string
  consent: boolean
  viewingBooked?: boolean
}

export type ScoreBreakdown = {
  timelinePoints: number
  budgetPoints: number
  areaPoints: number
  phonePoints: number
  viewingPoints: number
  totalScore: number
  tier: LeadTier
}

/**
 * Validates phone numbers simply and safely:
 * Allows standard formats with optional +, digits, spaces, hyphens, parentheses (7 to 20 chars).
 */
export function isValidPhone(phone: string): boolean {
  if (!phone) return false
  const clean = phone.trim()
  const digitsOnly = clean.replace(/\D/g, "")
  return digitsOnly.length >= 7 && digitsOnly.length <= 15
}

/**
 * Validates budget: min >= 0, max > 0, max >= min.
 */
export function isValidBudget(min: number, max: number): boolean {
  return typeof min === "number" && typeof max === "number" && min >= 0 && max > 0 && max >= min
}

/**
 * Computes deterministic lead score according to the business specification.
 */
export function calculateLeadScore(lead: Partial<LeadSubmission>): ScoreBreakdown {
  let timelinePoints = 0
  if (lead.timeline === "immediately") {
    timelinePoints = 3
  } else if (lead.timeline === "1-3_months") {
    timelinePoints = 2
  } else if (lead.timeline === "3-6_months") {
    timelinePoints = 1
  }

  let budgetPoints = 0
  if (lead.budgetMin !== undefined && lead.budgetMax !== undefined && isValidBudget(lead.budgetMin, lead.budgetMax)) {
    budgetPoints = 2
  }

  let areaPoints = 0
  if (lead.areas && lead.areas.length > 0 && lead.areas.some((a) => a.trim().length > 0 && a.toLowerCase() !== "all")) {
    areaPoints = 1
  }

  let phonePoints = 0
  if (lead.phone && isValidPhone(lead.phone)) {
    phonePoints = 2
  }

  let viewingPoints = 0
  if (lead.viewingBooked === true) {
    viewingPoints = 3
  }

  const totalScore = timelinePoints + budgetPoints + areaPoints + phonePoints + viewingPoints

  let tier: LeadTier = "cold"
  if (totalScore >= 8) {
    tier = "hot"
  } else if (totalScore >= 4) {
    tier = "warm"
  } else {
    tier = "cold"
  }

  return {
    timelinePoints,
    budgetPoints,
    areaPoints,
    phonePoints,
    viewingPoints,
    totalScore,
    tier,
  }
}
