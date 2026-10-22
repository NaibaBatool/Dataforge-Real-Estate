"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  MapPin,
  ArrowRight,
  RotateCcw,
  BedDouble,
  Bath,
  Maximize,
  Phone,
  MessageCircle,
  HelpCircle,
} from "lucide-react"
import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"
import { WhatsappButton } from "@/components/landing/whatsapp-button"
import { siteConfig } from "@/lib/site.config"
import type { PropertyMatch } from "@/lib/matching"

type MatchesResponse = {
  success: boolean
  lead?: {
    id: string
    purpose: string
    propertyType: string
    areas: string[]
    budgetMin: number
    budgetMax: number
    timeline: string
    score: number
    tier: string
  }
  exactMatches?: PropertyMatch[]
  alternativeMatches?: PropertyMatch[]
  totalMatches?: number
  error?: string
}

function MatchesContent() {
  const searchParams = useSearchParams()
  const leadId = searchParams.get("leadId") || "demo-lead-01" // fallback to demo lead if refreshed or missing

  const [data, setData] = useState<MatchesResponse | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>("")

  useEffect(() => {
    async function fetchMatches() {
      try {
        setLoading(true)
        const res = await fetch(`/api/leads/${encodeURIComponent(leadId)}/matches`)
        const json = await res.json()

        if (!res.ok || !json.success) {
          throw new Error(json.error || "Unable to retrieve property matches.")
        }
        setData(json)
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Error fetching matches."
        setError(msg)
      } finally {
        setLoading(false)
      }
    }

    if (leadId) {
      fetchMatches()
    } else {
      setLoading(false)
    }
  }, [leadId])

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-cream text-navy mb-4 animate-spin">
          <Sparkles className="size-6 text-gold" />
        </div>
        <h2 className="font-heading text-xl font-bold text-navy">Evaluating Property Inventory...</h2>
        <p className="mt-2 text-sm text-ink-muted">
          Matching your parameters against verified listings.
        </p>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="mx-auto max-w-xl py-16 px-4 text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-red-100 text-red-700 mb-4">
          <AlertCircle className="size-6" />
        </div>
        <h2 className="font-heading text-2xl font-bold text-navy">No Active Match Session</h2>
        <p className="mt-2 text-sm text-ink-muted">
          {error || "It looks like your search session expired or no lead ID was provided."}
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link
            href="/qualify"
            className="rounded-full bg-navy px-6 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-navy/90"
          >
            Start New Qualification →
          </Link>
          <Link
            href="/properties"
            className="rounded-full border border-hairline bg-surface px-6 py-2.5 text-xs font-semibold text-navy hover:bg-cream"
          >
            Browse All Properties
          </Link>
        </div>
      </div>
    )
  }

  const { exactMatches = [], alternativeMatches = [], lead } = data
  const hasExact = exactMatches.length > 0
  const hasAlt = alternativeMatches.length > 0

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Criteria Summary Strip */}
      {lead && (
        <div className="rounded-2xl border border-hairline bg-surface p-6 shadow-xs mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-hairline/80 pb-4 mb-4">
            <div>
              <span className="text-xs uppercase tracking-wider text-ink-muted">Lead Qualification Result</span>
              <h2 className="font-heading text-xl font-bold text-navy">Your Verified Criteria</h2>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                  lead.tier === "hot"
                    ? "bg-red-100 text-red-800 border border-red-200"
                    : lead.tier === "warm"
                    ? "bg-amber-100 text-amber-800 border border-amber-200"
                    : "bg-blue-100 text-blue-800 border border-blue-200"
                }`}
              >
                Match Priority: {lead.tier.toUpperCase()} ({lead.score} pts)
              </span>
              <Link
                href="/qualify"
                className="inline-flex items-center gap-1 text-xs font-semibold text-gold hover:underline"
              >
                <RotateCcw className="size-3" /> Edit Criteria
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-ink-muted">Purpose & Type:</span>
              <p className="font-semibold text-navy capitalize">
                {lead.purpose} • {lead.propertyType}
              </p>
            </div>
            <div>
              <span className="text-ink-muted">Preferred Neighborhoods:</span>
              <p className="font-semibold text-navy">
                {lead.areas.length > 0 ? lead.areas.join(", ") : "Any Area"}
              </p>
            </div>
            <div>
              <span className="text-ink-muted">Budget Window:</span>
              <p className="font-semibold text-navy">
                ${lead.budgetMin.toLocaleString()} – ${lead.budgetMax.toLocaleString()}
              </p>
            </div>
            <div>
              <span className="text-ink-muted">Move-in Horizon:</span>
              <p className="font-semibold text-navy capitalize">
                {lead.timeline.replace("_", " ")}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 1: EXACT MATCHES */}
      <div className="mb-14">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold">
                {exactMatches.length}
              </span>
              <h2 className="font-heading text-2xl font-bold text-navy">
                Exact Matches Found
              </h2>
            </div>
            <p className="mt-1 text-xs text-ink-muted">
              Properties that fulfill 100% of your location, property type, purpose, and budget criteria.
            </p>
          </div>
        </div>

        {hasExact ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {exactMatches.map((match) => (
              <MatchCard key={match.property.id} match={match} isExact />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-hairline bg-surface p-8 text-center shadow-xs">
            <HelpCircle className="size-8 text-gold mx-auto mb-2" />
            <h3 className="font-heading text-lg font-bold text-navy">
              No 100% exact matches in current published inventory
            </h3>
            <p className="mt-1 text-xs text-ink-muted max-w-md mx-auto">
              We did not find a listing that aligns with every single parameter simultaneously.
              Below are the closest alternative properties that match almost all requirements.
            </p>
          </div>
        )}
      </div>

      {/* SECTION 2: CLOSE ALTERNATIVES */}
      {hasAlt && (
        <div className="mb-14">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex size-7 items-center justify-center rounded-lg bg-cream text-navy text-xs font-bold">
                  {alternativeMatches.length}
                </span>
                <h2 className="font-heading text-2xl font-bold text-navy">
                  Closest Alternative Recommendations
                </h2>
              </div>
              <p className="mt-1 text-xs text-ink-muted">
                Handpicked properties with honest disclosure of differences (e.g., adjacent neighborhood or slightly different budget).
              </p>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {alternativeMatches.map((match) => (
              <MatchCard key={match.property.id} match={match} isExact={false} />
            ))}
          </div>
        </div>
      )}

      {/* Direct Contact Banner */}
      <div className="rounded-2xl bg-navy p-8 text-white shadow-lg text-center sm:text-left sm:flex sm:items-center sm:justify-between gap-6">
        <div>
          <span className="inline-block rounded-full bg-gold/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-gold mb-2">
            Priority Advisory
          </span>
          <h3 className="font-heading text-2xl font-bold">
            Want to arrange private viewings for these properties?
          </h3>
          <p className="mt-1 text-sm text-white/75 max-w-xl">
            An advisor from {siteConfig.name} has received your qualification dossier and can coordinate keys,
            floorplans, and accompanied viewings immediately.
          </p>
        </div>

        <div className="mt-6 sm:mt-0 flex flex-col sm:flex-row gap-3 shrink-0">
          <a
            href={`https://wa.me/${siteConfig.contact.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(
              `Hi! I just completed the qualification form on ${siteConfig.name} and would like to speak to an advisor about my matches.`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-6 py-3.5 text-sm font-semibold text-white shadow-md hover:scale-105 transition-transform"
          >
            <MessageCircle className="size-4.5" />
            Connect on WhatsApp
          </a>

          <Link
            href="/properties"
            className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white hover:bg-white/20 transition-colors"
          >
            Explore All Listings
          </Link>
        </div>
      </div>
    </div>
  )
}

function MatchCard({ match, isExact }: { match: PropertyMatch; isExact: boolean }) {
  const p = match.property

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-hairline bg-surface shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="relative aspect-[16/10] overflow-hidden">
        <Link href={`/properties/${p.id}`} className="block h-full w-full">
          <Image
            src={p.image}
            alt={p.imageAlt}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>
        <span
          className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-bold shadow-xs ${
            isExact ? "bg-emerald-600 text-white" : "bg-navy text-white"
          }`}
        >
          {isExact ? "100% Match" : `${match.matchScore}% Match Score`}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-2">
          <Link href={`/properties/${p.id}`}>
            <h3 className="font-heading text-lg font-bold text-navy hover:text-gold transition-colors">
              {p.title}
            </h3>
          </Link>
        </div>

        <p className="mt-1 flex items-center gap-1.5 text-xs text-ink-muted">
          <MapPin className="size-3.5 text-gold shrink-0" />
          {p.area}, {p.city}
        </p>

        {/* Why this matches */}
        <div className="mt-3 rounded-xl bg-cream/60 p-3 space-y-1.5 text-xs border border-hairline/60">
          {match.explanations.map((exp, i) => (
            <div key={i} className="flex items-start gap-1.5 text-emerald-800 font-medium">
              <CheckCircle2 className="size-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span>{exp}</span>
            </div>
          ))}
          {!isExact &&
            match.discrepancies.map((disc, i) => (
              <div key={i} className="flex items-start gap-1.5 text-amber-900 font-medium">
                <AlertCircle className="size-3.5 text-amber-600 shrink-0 mt-0.5" />
                <span>{disc}</span>
              </div>
            ))}
        </div>

        <div className="mt-3 flex items-center gap-3 border-t border-hairline pt-3 text-xs text-ink-muted">
          {p.beds > 0 && <span>{p.beds} beds</span>}
          {p.baths > 0 && <span>• {p.baths} baths</span>}
          <span>• {p.size.toLocaleString()} sqft</span>
        </div>

        <div className="mt-auto flex items-center justify-between pt-4">
          <span className="font-heading text-xl font-bold text-navy">{p.priceFormatted}</span>
          <Link
            href={`/properties/${p.id}`}
            className="inline-flex items-center gap-1 text-xs font-semibold text-gold hover:text-gold-hover transition-colors"
          >
            <span>View Details</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </div>
    </article>
  )
}

export default function MatchesPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-ink">
      <Navbar variant="solid" />

      <main className="flex-1 pt-24 pb-20">
        <section className="border-b border-hairline bg-surface py-8">
          <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-gold">
              <Sparkles className="size-3.5" />
              Tailored Recommendation Engine
            </span>
            <h1 className="mt-2 font-heading text-3xl font-bold text-navy sm:text-4xl">
              Your Personalized Property Matches
            </h1>
            <p className="mt-2 text-sm text-ink-muted max-w-xl mx-auto">
              Our rule-based matching engine has analyzed your requirements against our published and
              verified inventory.
            </p>
          </div>
        </section>

        <Suspense
          fallback={
            <div className="py-20 text-center text-sm text-ink-muted">
              Loading recommendations...
            </div>
          }
        >
          <MatchesContent />
        </Suspense>
      </main>

      <Footer />
      <WhatsappButton />
    </div>
  )
}
