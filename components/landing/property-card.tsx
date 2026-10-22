"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, BedDouble, Bath, Maximize, MapPin, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Property } from "@/lib/mock-data"

const statusLabels: Record<Property["status"], { label: string; className: string }> = {
  sale: { label: "For Sale", className: "bg-navy text-white" },
  rent: { label: "For Rent", className: "bg-gold text-navy" },
  new: { label: "New", className: "bg-emerald-600 text-white" },
}

export function PropertyCard({ property }: { property: Property }) {
  const [saved, setSaved] = useState(false)
  const status = statusLabels[property.status]

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-hairline bg-surface shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Link href={`/properties/${property.id}`} className="block h-full w-full">
          <Image
            src={property.image || "/placeholder.svg"}
            alt={property.imageAlt}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>
        <span
          className={cn(
            "absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-semibold shadow-sm",
            status.className,
          )}
        >
          {status.label}
        </span>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            setSaved((v) => !v)
          }}
          className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full bg-white/90 text-navy shadow-sm backdrop-blur transition-colors hover:bg-white"
          aria-pressed={saved}
          aria-label={saved ? "Remove from saved" : "Save property"}
        >
          <Heart className={cn("size-4.5", saved && "fill-red-500 text-red-500")} />
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <Link href={`/properties/${property.id}`}>
            <h3 className="font-heading text-lg font-bold leading-snug text-navy transition-colors hover:text-gold">
              {property.title}
            </h3>
          </Link>
        </div>

        <p className="flex items-center gap-1.5 text-sm text-ink-muted">
          <MapPin className="size-4 shrink-0 text-gold" aria-hidden="true" />
          {property.area}{property.city ? `, ${property.city}` : ""}
        </p>

        <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-hairline pt-4 text-sm text-ink-muted">
          {property.beds > 0 && (
            <span className="inline-flex items-center gap-1.5">
              <BedDouble className="size-4 text-navy/60" aria-hidden="true" />
              {property.beds} beds
            </span>
          )}
          {property.baths > 0 && (
            <span className="inline-flex items-center gap-1.5">
              <Bath className="size-4 text-navy/60" aria-hidden="true" />
              {property.baths} baths
            </span>
          )}
          <span className="inline-flex items-center gap-1.5">
            <Maximize className="size-4 text-navy/60" aria-hidden="true" />
            {property.size.toLocaleString()} sqft
          </span>
        </div>

        <div className="mt-auto flex items-center justify-between pt-4">
          <span className="font-heading text-xl font-bold text-navy">{property.price}</span>
          <Link
            href={`/properties/${property.id}`}
            className="inline-flex items-center gap-1 text-sm font-semibold text-gold transition-colors hover:text-gold-hover"
          >
            <span>View details</span>
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </article>
  )
}
