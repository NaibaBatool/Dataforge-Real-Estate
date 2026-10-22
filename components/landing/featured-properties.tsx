"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import {
  properties,
  propertyFilters,
  matchesFilter,
  type FilterKey,
} from "@/lib/mock-data"
import { SectionHeading } from "./section-heading"
import { PropertyCard } from "./property-card"
import { Reveal } from "./reveal"

function PropertySkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-hairline bg-surface shadow-sm">
      <div className="aspect-[4/3] animate-pulse bg-navy/5" />
      <div className="flex flex-col gap-3 p-5">
        <div className="h-5 w-3/4 animate-pulse rounded bg-navy/10" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-navy/5" />
        <div className="mt-2 h-4 w-full animate-pulse rounded bg-navy/5" />
        <div className="mt-3 h-6 w-1/3 animate-pulse rounded bg-navy/10" />
      </div>
    </div>
  )
}

export function FeaturedProperties() {
  const [filter, setFilter] = useState<FilterKey>("all")
  const [loading, setLoading] = useState(false)

  // Simulate a fetch when the filter changes so the skeleton state is visible.
  useEffect(() => {
    setLoading(true)
    const timer = setTimeout(() => setLoading(false), 450)
    return () => clearTimeout(timer)
  }, [filter])

  const visible = useMemo(
    () => properties.filter((p) => matchesFilter(p, filter)),
    [filter],
  )

  return (
    <section id="properties" className="scroll-mt-24 bg-cream py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Featured Listings"
          title="Handpicked homes worth a closer look"
          description="A rotating selection of our latest verified properties. Filter by what you need — no account required to browse."
        />

        <Reveal className="mt-10 flex flex-wrap justify-center gap-2">
          {propertyFilters.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              className={cn(
                "rounded-full border px-5 py-2 text-sm font-medium transition-colors",
                filter === f.key
                  ? "border-navy bg-navy text-white"
                  : "border-hairline bg-surface text-ink-muted hover:border-navy/40 hover:text-navy",
              )}
              aria-pressed={filter === f.key}
            >
              {f.label}
            </button>
          ))}
        </Reveal>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => <PropertySkeleton key={i} />)
          ) : visible.length > 0 ? (
            visible.map((property, i) => (
              <Reveal key={property.id} delay={i * 60} as="div">
                <PropertyCard property={property} />
              </Reveal>
            ))
          ) : (
            <p className="col-span-full py-12 text-center text-ink-muted">
              No properties match this filter yet. Try another category.
            </p>
          )}
        </div>

        <Reveal className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/properties"
            className="inline-flex items-center justify-center rounded-full bg-navy px-8 py-3.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-navy/90 hover:shadow-lg"
          >
            Explore All Available Properties →
          </Link>
          <Link
            href="/qualify"
            className="inline-flex items-center justify-center rounded-full border border-navy/30 bg-surface px-7 py-3.5 text-sm font-semibold text-navy transition-colors hover:border-gold hover:text-gold"
          >
            Get Matched to Your Requirements
          </Link>
        </Reveal>
      </div>
    </section>
  )
}
