"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Search, MapPin, Wallet, ArrowRight, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { areas, budgetOptions } from "@/lib/mock-data"

const purposes = [
  { key: "buy", label: "Buy" },
  { key: "rent", label: "Rent" },
] as const

export function QuickSearch() {
  const router = useRouter()
  const [purpose, setPurpose] = useState<(typeof purposes)[number]["key"]>("buy")
  const [area, setArea] = useState("")
  const [budget, setBudget] = useState("")

  const handleGetMatched = () => {
    const params = new URLSearchParams()
    if (purpose) params.set("purpose", purpose)
    if (area) params.set("area", area)
    if (budget) params.set("budget", budget)
    router.push(`/qualify?${params.toString()}`)
  }

  return (
    <div className="w-full rounded-2xl border border-white/15 bg-white/95 p-4 shadow-2xl backdrop-blur sm:p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div className="inline-flex rounded-full bg-cream p-1">
          {purposes.map((p) => (
            <button
              key={p.key}
              type="button"
              onClick={() => setPurpose(p.key)}
              className={cn(
                "rounded-full px-6 py-2 text-sm font-semibold transition-colors",
                purpose === p.key ? "bg-navy text-white shadow-sm" : "text-ink-muted hover:text-navy",
              )}
              aria-pressed={purpose === p.key}
            >
              {p.label}
            </button>
          ))}
        </div>
        <span className="hidden text-xs font-medium text-ink-muted sm:inline-flex items-center gap-1.5">
          <Sparkles className="size-3.5 text-gold" />
          Quick Match Assistant
        </span>
      </div>

      <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
        <label className="flex items-center gap-2 rounded-xl border border-hairline bg-surface px-3 py-3 shadow-xs transition-all focus-within:border-navy focus-within:ring-2 focus-within:ring-gold/30">
          <MapPin className="size-5 shrink-0 text-gold" aria-hidden="true" />
          <span className="sr-only">Area</span>
          <select
            value={area}
            onChange={(e) => setArea(e.target.value)}
            className="w-full bg-surface text-sm font-medium text-navy outline-none cursor-pointer"
          >
            <option value="" className="bg-white text-navy">Any area</option>
            {areas.map((a) => (
              <option key={a} value={a} className="bg-white text-navy">
                {a}
              </option>
            ))}
          </select>
        </label>

        <label className="flex items-center gap-2 rounded-xl border border-hairline bg-surface px-3 py-3 shadow-xs transition-all focus-within:border-navy focus-within:ring-2 focus-within:ring-gold/30">
          <Wallet className="size-5 shrink-0 text-gold" aria-hidden="true" />
          <span className="sr-only">Budget</span>
          <select
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="w-full bg-surface text-sm font-medium text-navy outline-none cursor-pointer"
          >
            <option value="" className="bg-white text-navy">Any budget</option>
            {budgetOptions.map((b) => (
              <option key={b} value={b} className="bg-white text-navy">
                {b}
              </option>
            ))}
          </select>
        </label>

        <button
          type="button"
          onClick={handleGetMatched}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-gold px-6 py-3 text-sm font-semibold text-navy shadow-sm transition-all hover:bg-gold-hover hover:shadow-md cursor-pointer"
        >
          <Search className="size-4" aria-hidden="true" />
          Find My Matches
        </button>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between border-t border-hairline/80 pt-3 text-xs text-ink-muted">
        <span>No signup or commitment required.</span>
        <Link
          href="/properties"
          className="inline-flex items-center gap-1 font-semibold text-navy hover:text-gold transition-colors"
        >
          <span>Browse all properties directly</span>
          <ArrowRight className="size-3.5" />
        </Link>
      </div>
    </div>
  )
}
