import { calculateLeadScore, type LeadSubmission, type ScoreBreakdown } from "./scoring"
import { findMatches, type MatchCriteria } from "./matching"

export type LeadStatus = "new" | "contacted" | "qualified" | "closed"

export type StoredLead = LeadSubmission & {
  id: string
  scoreBreakdown: ScoreBreakdown
  createdAt: string
  status: LeadStatus
  updatedAt?: string
}

// Global in-memory cache for development and server execution
const globalLeads = new Map<string, StoredLead>()

// Seed initial realistic leads across different tiers
const initialLeads: StoredLead[] = [
  {
    id: "lead-hot-01",
    purpose: "buy",
    propertyType: "house",
    areas: ["Emerald Heights"],
    budgetMin: 450000,
    budgetMax: 950000,
    timeline: "immediately",
    name: "Victoria Sterling",
    phone: "+1 555 492 8812",
    email: "victoria.sterling@example.com",
    notes: "Pre-approved mortgage. Seeking detached 4+ bed with garden and quiet street.",
    consent: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(), // 35 mins ago
    status: "new",
    scoreBreakdown: {
      timelinePoints: 3,
      budgetPoints: 2,
      areaPoints: 1,
      phonePoints: 2,
      viewingPoints: 0,
      totalScore: 8,
      tier: "hot",
    },
  },
  {
    id: "lead-hot-02",
    purpose: "buy",
    propertyType: "house",
    areas: ["Westlake", "Emerald Heights"],
    budgetMin: 800000,
    budgetMax: 1400000,
    timeline: "immediately",
    name: "Dr. Tariq Mansoor",
    phone: "+92 321 8899221",
    email: "tmansoor@example.com",
    notes: "Relocating next month. Need waterfront or luxury villa with home office.",
    consent: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
    status: "contacted",
    scoreBreakdown: {
      timelinePoints: 3,
      budgetPoints: 2,
      areaPoints: 1,
      phonePoints: 2,
      viewingPoints: 0,
      totalScore: 8,
      tier: "hot",
    },
  },
  {
    id: "demo-lead-01",
    purpose: "buy",
    propertyType: "house",
    areas: ["Emerald Heights"],
    budgetMin: 400000,
    budgetMax: 700000,
    timeline: "1-3_months",
    name: "Alexander Vance",
    phone: "+1 555 234 5678",
    email: "alexander@example.com",
    notes: "Looking for family home near reputable international schools.",
    consent: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(), // 6 hours ago
    status: "new",
    scoreBreakdown: {
      timelinePoints: 2,
      budgetPoints: 2,
      areaPoints: 1,
      phonePoints: 2,
      viewingPoints: 0,
      totalScore: 7,
      tier: "warm",
    },
  },
  {
    id: "lead-warm-02",
    purpose: "rent",
    propertyType: "apartment",
    areas: ["Downtown District"],
    budgetMin: 1500,
    budgetMax: 2800,
    timeline: "1-3_months",
    name: "Sophia Chen",
    phone: "+1 555 873 2190",
    email: "sophia.chen@example.com",
    notes: "Corporate executive lease. High floor penthouse or loft preferred.",
    consent: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(), // 18 hours ago
    status: "qualified",
    scoreBreakdown: {
      timelinePoints: 2,
      budgetPoints: 2,
      areaPoints: 1,
      phonePoints: 2,
      viewingPoints: 0,
      totalScore: 7,
      tier: "warm",
    },
  },
  {
    id: "lead-cold-01",
    purpose: "invest",
    propertyType: "plot",
    areas: ["Green Valley"],
    budgetMin: 100000,
    budgetMax: 200000,
    timeline: "exploring",
    name: "David Kim",
    phone: "+1 555 334 1120",
    email: "dkim.invest@example.com",
    notes: "Exploring potential land parcels for future 3-year holding.",
    consent: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(), // 1.5 days ago
    status: "closed",
    scoreBreakdown: {
      timelinePoints: 0,
      budgetPoints: 2,
      areaPoints: 1,
      phonePoints: 2,
      viewingPoints: 0,
      totalScore: 5,
      tier: "warm",
    },
  },
  {
    id: "lead-cold-02",
    purpose: "buy",
    propertyType: "apartment",
    areas: ["Willowbrook"],
    budgetMin: 200000,
    budgetMax: 350000,
    timeline: "exploring",
    name: "Marcus Brody",
    phone: "+1 555 901 4452",
    email: undefined,
    notes: "Just window shopping for next year.",
    consent: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    status: "new",
    scoreBreakdown: {
      timelinePoints: 0,
      budgetPoints: 2,
      areaPoints: 1,
      phonePoints: 2,
      viewingPoints: 0,
      totalScore: 5,
      tier: "warm",
    },
  },
]

for (const lead of initialLeads) {
  globalLeads.set(lead.id, lead)
}

export function generateLeadId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return "lead-" + Math.random().toString(36).substring(2, 10) + "-" + Date.now().toString(36)
}

export function saveLead(data: LeadSubmission): StoredLead {
  const id = generateLeadId()
  const scoreBreakdown = calculateLeadScore(data)

  const leadRecord: StoredLead = {
    ...data,
    id,
    scoreBreakdown,
    createdAt: new Date().toISOString(),
    status: "new",
  }

  globalLeads.set(id, leadRecord)
  return leadRecord
}

export function getLead(id: string): StoredLead | undefined {
  return globalLeads.get(id)
}

export function getAllLeads(filterOptions?: {
  tier?: string
  purpose?: string
  status?: string
  search?: string
}): StoredLead[] {
  let leads = Array.from(globalLeads.values())

  // Apply filters
  if (filterOptions) {
    const { tier, purpose, status, search } = filterOptions

    if (tier && tier !== "all") {
      leads = leads.filter((l) => l.scoreBreakdown.tier === tier)
    }

    if (purpose && purpose !== "all") {
      leads = leads.filter((l) => l.purpose === purpose)
    }

    if (status && status !== "all") {
      leads = leads.filter((l) => l.status === status)
    }

    if (search && search.trim()) {
      const q = search.toLowerCase().trim()
      leads = leads.filter(
        (l) =>
          l.name.toLowerCase().includes(q) ||
          l.phone.toLowerCase().includes(q) ||
          (l.email && l.email.toLowerCase().includes(q)) ||
          l.areas.some((a) => a.toLowerCase().includes(q))
      )
    }
  }

  // Tier sorting weights: Hot = 3, Warm = 2, Cold = 1
  const tierWeight: Record<string, number> = { hot: 3, warm: 2, cold: 1 }

  leads.sort((a, b) => {
    const weightDiff = (tierWeight[b.scoreBreakdown.tier] || 0) - (tierWeight[a.scoreBreakdown.tier] || 0)
    if (weightDiff !== 0) return weightDiff

    // Second sort by total score
    const scoreDiff = b.scoreBreakdown.totalScore - a.scoreBreakdown.totalScore
    if (scoreDiff !== 0) return scoreDiff

    // Third sort by recency
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })

  return leads
}

export function updateLeadStatus(id: string, newStatus: LeadStatus): StoredLead | null {
  const lead = globalLeads.get(id)
  if (!lead) return null

  const updated: StoredLead = {
    ...lead,
    status: newStatus,
    updatedAt: new Date().toISOString(),
  }

  globalLeads.set(id, updated)
  return updated
}

export function getLeadMetrics() {
  const all = Array.from(globalLeads.values())
  return {
    total: all.length,
    hot: all.filter((l) => l.scoreBreakdown.tier === "hot").length,
    warm: all.filter((l) => l.scoreBreakdown.tier === "warm").length,
    cold: all.filter((l) => l.scoreBreakdown.tier === "cold").length,
    newCount: all.filter((l) => l.status === "new").length,
    contactedCount: all.filter((l) => l.status === "contacted").length,
    qualifiedCount: all.filter((l) => l.status === "qualified").length,
    closedCount: all.filter((l) => l.status === "closed").length,
  }
}

export function getLeadMatchesResult(leadId: string) {
  const lead = getLead(leadId)
  if (!lead) return null

  const criteria: MatchCriteria = {
    purpose: lead.purpose,
    propertyType: lead.propertyType,
    areas: lead.areas,
    budgetMin: lead.budgetMin,
    budgetMax: lead.budgetMax,
  }

  return {
    lead: {
      id: lead.id,
      name: lead.name,
      phone: lead.phone,
      email: lead.email,
      notes: lead.notes,
      purpose: lead.purpose,
      propertyType: lead.propertyType,
      areas: lead.areas,
      budgetMin: lead.budgetMin,
      budgetMax: lead.budgetMax,
      timeline: lead.timeline,
      status: lead.status,
      createdAt: lead.createdAt,
      score: lead.scoreBreakdown.totalScore,
      tier: lead.scoreBreakdown.tier,
      breakdown: lead.scoreBreakdown,
    },
    ...findMatches(criteria),
  }
}
