import { PROPERTIES_DATA, type Property } from "./properties-data"

export type MatchCriteria = {
  purpose: "buy" | "rent" | "invest"
  propertyType: "house" | "apartment" | "plot" | "commercial"
  areas: string[]
  budgetMin: number
  budgetMax: number
}

export type PropertyMatch = {
  property: Property
  isExactMatch: boolean
  matchScore: number // 0 to 100
  explanations: string[]
  discrepancies: string[]
}

/**
 * Deterministically evaluates a property against customer criteria.
 */
export function evaluatePropertyMatch(property: Property, criteria: MatchCriteria): PropertyMatch {
  const explanations: string[] = []
  const discrepancies: string[] = []
  let points = 0

  // 1. Purpose check
  if (criteria.purpose === "buy") {
    if (property.purpose === "buy") {
      points += 30
      explanations.push("Available for purchase")
    } else {
      discrepancies.push("Listed for rent instead of purchase")
    }
  } else if (criteria.purpose === "rent") {
    if (property.purpose === "rent") {
      points += 30
      explanations.push("Available for rent")
    } else {
      discrepancies.push("Listed for sale instead of rent")
    }
  } else if (criteria.purpose === "invest") {
    // For investment, both high-potential plots or properties for sale/rent are valid
    points += 25
    explanations.push("Strong rental or appreciation potential")
  }

  // 2. Property Type check
  if (property.type === criteria.propertyType) {
    points += 30
    const typeLabel = property.type.charAt(0).toUpperCase() + property.type.slice(1)
    explanations.push(`Matches requested property type (${typeLabel})`)
  } else {
    discrepancies.push(`Different property type (${property.type})`)
  }

  // 3. Location / Area check
  const hasAreaPreference = criteria.areas.length > 0 && !criteria.areas.includes("all")
  if (hasAreaPreference) {
    const areaMatch = criteria.areas.some(
      (a) => a.toLowerCase().trim() === property.area.toLowerCase().trim()
    )
    if (areaMatch) {
      points += 25
      explanations.push(`Located in preferred area (${property.area})`)
    } else {
      discrepancies.push(`Located in ${property.area}`)
    }
  } else {
    points += 20
    explanations.push(`Located in ${property.area}`)
  }

  // 4. Budget check
  const withinBudget =
    property.price >= criteria.budgetMin && property.price <= criteria.budgetMax

  if (withinBudget) {
    points += 15
    explanations.push(`Comfortably within budget (${property.priceFormatted})`)
  } else if (property.price < criteria.budgetMin) {
    points += 8
    explanations.push(`Below your min budget ($${property.price.toLocaleString()})`)
  } else if (property.price <= criteria.budgetMax * 1.15) {
    // Within 15% tolerance of max budget
    points += 5
    discrepancies.push(`Slightly above preferred budget ($${property.price.toLocaleString()})`)
  } else {
    discrepancies.push(`Above target budget range ($${property.price.toLocaleString()})`)
  }

  const isExactMatch = discrepancies.length === 0

  return {
    property,
    isExactMatch,
    matchScore: Math.min(100, points),
    explanations,
    discrepancies,
  }
}

/**
 * Finds matched properties for a given criteria, sorting exact matches first,
 * followed by highest score alternatives.
 */
export function findMatches(criteria: MatchCriteria): {
  exactMatches: PropertyMatch[]
  alternativeMatches: PropertyMatch[]
  totalMatches: number
} {
  const allEvaluations = PROPERTIES_DATA
    .filter((p) => p.available)
    .map((p) => evaluatePropertyMatch(p, criteria))

  // Sort descending by match score
  allEvaluations.sort((a, b) => b.matchScore - a.matchScore)

  const exactMatches = allEvaluations.filter((m) => m.isExactMatch)
  const alternativeMatches = allEvaluations.filter((m) => !m.isExactMatch && m.matchScore >= 50)

  return {
    exactMatches,
    alternativeMatches,
    totalMatches: exactMatches.length + alternativeMatches.length,
  }
}
