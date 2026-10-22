"use client"

import { useState, useMemo, useTransition } from "react"
import Link from "next/link"
import { Search, RotateCcw, Filter, MapPin, Building, Tag, DollarSign, SlidersHorizontal, Check } from "lucide-react"
import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"
import { WhatsappButton } from "@/components/landing/whatsapp-button"
import { PropertyCard } from "@/components/landing/property-card"
import { PROPERTIES_DATA, AVAILABLE_AREAS, PROPERTY_TYPES, type Property } from "@/lib/properties-data"

export default function PropertiesPage() {
  const [purpose, setPurpose] = useState<string>("all")
  const [propertyType, setPropertyType] = useState<string>("all")
  const [selectedArea, setSelectedArea] = useState<string>("all")
  const [maxPrice, setMaxPrice] = useState<number>(1500000)
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const resetFilters = () => {
    startTransition(() => {
      setPurpose("all")
      setPropertyType("all")
      setSelectedArea("all")
      setMaxPrice(1500000)
      setSearchQuery("")
    })
  }

  const isFiltered =
    purpose !== "all" ||
    propertyType !== "all" ||
    selectedArea !== "all" ||
    maxPrice < 1500000 ||
    searchQuery.trim().length > 0

  const filteredProperties = useMemo(() => {
    return PROPERTIES_DATA.filter((p) => {
      if (purpose !== "all" && p.purpose !== purpose) return false
      if (propertyType !== "all" && p.type !== propertyType) return false
      if (selectedArea !== "all" && p.area !== selectedArea) return false
      if (p.price > maxPrice) return false
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchesTitle = p.title.toLowerCase().includes(q)
        const matchesDesc = p.description.toLowerCase().includes(q)
        const matchesArea = p.area.toLowerCase().includes(q)
        const matchesFeatures = p.features.some((f) => f.toLowerCase().includes(q))
        if (!matchesTitle && !matchesDesc && !matchesArea && !matchesFeatures) return false
      }
      return true
    })
  }, [purpose, propertyType, selectedArea, maxPrice, searchQuery])

  return (
    <div className="flex min-h-screen flex-col bg-background text-ink">
      <Navbar variant="solid" />

      <main className="flex-1 pt-24 pb-20">
        {/* Header Hero Banner */}
        <section className="border-b border-hairline bg-surface py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <div>
                <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-gold">
                  <span className="h-px w-6 bg-gold" aria-hidden="true" />
                  Portfolio Directory
                </span>
                <h1 className="mt-3 font-heading text-3xl font-bold text-navy sm:text-4xl lg:text-5xl">
                  Explore Curated Properties
                </h1>
                <p className="mt-3 max-w-2xl text-base text-ink-muted leading-relaxed">
                  Browse our portfolio of verified homes, apartments, plots, and commercial properties.
                  No registration or personal details needed.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href="/qualify"
                  className="inline-flex items-center justify-center rounded-full bg-gold px-6 py-3 text-sm font-semibold text-navy shadow-sm transition-all hover:bg-gold-hover hover:shadow"
                >
                  Get Matched to Your Budget →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content Area */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* Filter Bar */}
          <div className="rounded-2xl border border-hairline bg-surface p-4 sm:p-6 shadow-sm mb-8">
            <div className="flex flex-col gap-4">
              {/* Search input and mobile toggle */}
              <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4.5 text-navy/40" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by keywords, amenities (e.g. pool, balcony, garage)..."
                    className="w-full rounded-xl border border-hairline bg-surface pl-10 pr-4 py-2.5 text-sm font-medium text-navy placeholder:text-ink-muted outline-none transition-colors focus:border-navy focus:ring-2 focus:ring-gold/30 shadow-xs"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-ink-muted hover:text-navy"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                    className="inline-flex md:hidden items-center justify-center gap-2 rounded-xl border border-hairline bg-background px-4 py-2.5 text-sm font-medium text-navy"
                  >
                    <SlidersHorizontal className="size-4 text-gold" />
                    Filters {isFiltered && "(Active)"}
                  </button>

                  {isFiltered && (
                    <button
                      onClick={resetFilters}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-hairline px-3.5 py-2.5 text-xs font-semibold text-navy hover:bg-background transition-colors"
                      title="Reset all filters"
                    >
                      <RotateCcw className="size-3.5 text-gold" />
                      Reset
                    </button>
                  )}
                </div>
              </div>

              {/* Desktop Filters Row (and Collapsible Mobile) */}
              <div
                className={`grid gap-4 sm:grid-cols-2 lg:grid-cols-4 pt-2 border-t border-hairline/80 ${
                  mobileFilterOpen ? "grid" : "hidden md:grid"
                }`}
              >
                {/* Purpose Filter */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-ink-muted mb-1.5">
                    Purpose
                  </label>
                  <div className="flex rounded-xl bg-background p-1 border border-hairline">
                    {[
                      { key: "all", label: "All" },
                      { key: "buy", label: "Buy" },
                      { key: "rent", label: "Rent" },
                    ].map((btn) => (
                      <button
                        key={btn.key}
                        type="button"
                        onClick={() => setPurpose(btn.key)}
                        className={`flex-1 rounded-lg py-1.5 text-xs font-semibold transition-all ${
                          purpose === btn.key
                            ? "bg-navy text-white shadow-xs"
                            : "text-ink-muted hover:text-navy"
                        }`}
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Property Type Filter */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-ink-muted mb-1.5">
                    Property Type
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gold" />
                    <select
                      value={propertyType}
                      onChange={(e) => setPropertyType(e.target.value)}
                      className="w-full appearance-none rounded-xl border border-hairline bg-surface pl-9 pr-8 py-2 text-sm font-medium text-navy outline-none transition-colors focus:border-navy focus:ring-2 focus:ring-gold/30 shadow-xs cursor-pointer"
                    >
                      <option value="all">All Types</option>
                      {PROPERTY_TYPES.map((t) => (
                        <option key={t.value} value={t.value} className="bg-white text-navy">
                          {t.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Location Filter */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-ink-muted mb-1.5">
                    Neighborhood
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gold" />
                    <select
                      value={selectedArea}
                      onChange={(e) => setSelectedArea(e.target.value)}
                      className="w-full appearance-none rounded-xl border border-hairline bg-surface pl-9 pr-8 py-2 text-sm font-medium text-navy outline-none transition-colors focus:border-navy focus:ring-2 focus:ring-gold/30 shadow-xs cursor-pointer"
                    >
                      <option value="all">All Neighborhoods</option>
                      {AVAILABLE_AREAS.map((a) => (
                        <option key={a} value={a} className="bg-white text-navy">
                          {a}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Max Budget Filter */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                      Max Price
                    </label>
                    <span className="text-xs font-bold text-navy">
                      {maxPrice >= 1500000 ? "Any Price" : `$${maxPrice.toLocaleString()}`}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1000"
                    max="1500000"
                    step="10000"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full accent-gold cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-ink-muted">
                    <span>$1k</span>
                    <span>$500k</span>
                    <span>$1.5M+</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Result Count and Active Filters Feedback */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-ink-muted">
              Showing <span className="font-semibold text-navy">{filteredProperties.length}</span>{" "}
              {filteredProperties.length === 1 ? "property" : "properties"}
              {isFiltered && " matching your criteria"}
            </p>

            {isFiltered && (
              <button
                onClick={resetFilters}
                className="text-xs font-semibold text-gold hover:underline"
              >
                Clear all filters
              </button>
            )}
          </div>

          {/* Property Cards Grid */}
          {filteredProperties.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProperties.map((p) => (
                <PropertyCard
                  key={p.id}
                  property={{
                    id: p.id,
                    title: p.title,
                    description: p.description,
                    area: p.area,
                    city: p.city,
                    price: p.priceFormatted,
                    priceNumeric: p.price,
                    status: p.status,
                    purpose: p.purpose,
                    type: p.type,
                    beds: p.beds,
                    baths: p.baths,
                    size: p.size,
                    image: p.image,
                    imageAlt: p.imageAlt,
                    features: p.features,
                  }}
                />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="rounded-2xl border border-hairline bg-surface p-12 text-center shadow-xs">
              <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-cream text-navy mb-4">
                <Search className="size-6 text-gold" />
              </div>
              <h3 className="font-heading text-xl font-bold text-navy">No matching properties found</h3>
              <p className="mt-2 text-sm text-ink-muted max-w-md mx-auto">
                None of our current listings match the selected combination of filters. Try broadening your
                price range or resetting the filters.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <button
                  onClick={resetFilters}
                  className="rounded-full bg-navy px-6 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-navy/90"
                >
                  Reset All Filters
                </button>
                <Link
                  href="/qualify"
                  className="rounded-full border border-gold bg-surface px-6 py-2.5 text-xs font-semibold text-navy hover:bg-gold/10"
                >
                  Let Us Find Off-Market Properties For You →
                </Link>
              </div>
            </div>
          )}
        </section>
      </main>

      <Footer />
      <WhatsappButton />
    </div>
  )
}
