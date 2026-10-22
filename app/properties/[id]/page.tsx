import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import {
  BedDouble,
  Bath,
  Maximize,
  MapPin,
  CheckCircle2,
  Phone,
  MessageCircle,
  Calendar,
  ArrowLeft,
  Share2,
  ShieldCheck,
  Building,
} from "lucide-react"
import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"
import { WhatsappButton } from "@/components/landing/whatsapp-button"
import { getPropertyById, getAllProperties } from "@/lib/properties-data"
import { siteConfig } from "@/lib/site.config"
import { PropertyCard } from "@/components/landing/property-card"

export async function generateStaticParams() {
  const properties = getAllProperties()
  return properties.map((p) => ({
    id: p.id,
  }))
}

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const property = getPropertyById(id)

  if (!property) {
    notFound()
  }

  // Related properties in the same area or type (excluding current)
  const relatedProperties = getAllProperties()
    .filter((p) => p.id !== property.id && (p.area === property.area || p.type === property.type))
    .slice(0, 3)

  const statusLabel =
    property.status === "sale"
      ? "For Sale"
      : property.status === "rent"
      ? "For Rent"
      : "Newly Listed"

  const whatsappMessage = encodeURIComponent(
    `Hello ${siteConfig.name}, I am inquiring about "${property.title}" (${property.id}) priced at ${property.priceFormatted} in ${property.area}. Is it still available for a private viewing?`
  )
  const whatsappUrl = `https://wa.me/${siteConfig.contact.whatsapp.replace(/\D/g, "")}?text=${whatsappMessage}`

  return (
    <div className="flex min-h-screen flex-col bg-background text-ink">
      <Navbar variant="solid" />

      <main className="flex-1 pt-24 pb-20">
        {/* Breadcrumb Navigation */}
        <div className="border-b border-hairline bg-surface/50 py-3.5">
          <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 text-xs text-ink-muted sm:px-6 lg:px-8">
            <Link href="/" className="hover:text-navy transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/properties" className="hover:text-navy transition-colors">
              Properties
            </Link>
            <span>/</span>
            <span className="truncate font-medium text-navy">{property.title}</span>
          </div>
        </div>

        {/* Hero Header & Gallery */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <Link
            href="/properties"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-muted hover:text-navy mb-6 transition-colors"
          >
            <ArrowLeft className="size-4" />
            Back to all listings
          </Link>

          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-8">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="rounded-full bg-navy px-3 py-1 text-xs font-semibold text-white">
                  {statusLabel}
                </span>
                <span className="rounded-full bg-gold/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-gold">
                  {property.type}
                </span>
                <span className="rounded-full bg-emerald-100 text-emerald-800 px-3 py-1 text-xs font-medium inline-flex items-center gap-1">
                  <ShieldCheck className="size-3.5" />
                  Verified Agency Listing
                </span>
              </div>
              <h1 className="font-heading text-3xl font-bold text-navy sm:text-4xl lg:text-5xl leading-tight">
                {property.title}
              </h1>
              <p className="mt-2 flex items-center gap-2 text-sm text-ink-muted">
                <MapPin className="size-4 text-gold shrink-0" />
                <span>
                  {property.area}, {property.city}
                </span>
              </p>
            </div>

            <div className="flex flex-col sm:items-end rounded-2xl bg-surface border border-hairline p-5 shadow-xs">
              <span className="text-xs uppercase tracking-wider text-ink-muted">Listed Price</span>
              <span className="font-heading text-3xl sm:text-4xl font-bold text-navy">
                {property.priceFormatted}
              </span>
              <span className="mt-1 text-xs text-ink-muted">
                {property.purpose === "rent" ? "Monthly lease terms" : "Freehold title ownership"}
              </span>
            </div>
          </div>

          {/* Image Showcase */}
          <div className="grid gap-4 lg:grid-cols-3 mb-12">
            <div className="relative aspect-[16/10] lg:col-span-2 overflow-hidden rounded-2xl border border-hairline bg-surface shadow-md">
              <Image
                src={property.image}
                alt={property.imageAlt}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 66vw"
                className="object-cover"
              />
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
              <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-hairline bg-surface shadow-xs">
                <Image
                  src="/images/hero.png"
                  alt="Architectural exterior view"
                  fill
                  sizes="(max-width: 1024px) 50vw, 33vw"
                  className="object-cover"
                />
              </div>
              <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-hairline bg-surface shadow-xs">
                <Image
                  src="/images/property-3.png"
                  alt="Interior living space"
                  fill
                  sizes="(max-width: 1024px) 50vw, 33vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          {/* Property Specifications Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 rounded-2xl border border-hairline bg-surface p-6 shadow-xs mb-12">
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-xl bg-cream text-navy">
                <BedDouble className="size-5 text-gold" />
              </div>
              <div>
                <span className="block text-xs uppercase tracking-wider text-ink-muted">Bedrooms</span>
                <span className="font-heading text-lg font-bold text-navy">
                  {property.beds > 0 ? `${property.beds} Beds` : "N/A (Plot/Commercial)"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-xl bg-cream text-navy">
                <Bath className="size-5 text-gold" />
              </div>
              <div>
                <span className="block text-xs uppercase tracking-wider text-ink-muted">Bathrooms</span>
                <span className="font-heading text-lg font-bold text-navy">
                  {property.baths > 0 ? `${property.baths} Baths` : "N/A"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-xl bg-cream text-navy">
                <Maximize className="size-5 text-gold" />
              </div>
              <div>
                <span className="block text-xs uppercase tracking-wider text-ink-muted">Total Area</span>
                <span className="font-heading text-lg font-bold text-navy">
                  {property.size.toLocaleString()} sqft
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-xl bg-cream text-navy">
                <Building className="size-5 text-gold" />
              </div>
              <div>
                <span className="block text-xs uppercase tracking-wider text-ink-muted">Property Type</span>
                <span className="font-heading text-lg font-bold capitalize text-navy">
                  {property.type}
                </span>
              </div>
            </div>
          </div>

          {/* Layout: Content & Booking Form Sidebar */}
          <div className="grid gap-12 lg:grid-cols-3">
            {/* Left 2 cols: Description & Features */}
            <div className="lg:col-span-2 space-y-10">
              <div>
                <h2 className="font-heading text-2xl font-bold text-navy mb-4">About this Property</h2>
                <p className="text-base text-ink-muted leading-relaxed whitespace-pre-line">
                  {property.description}
                </p>
                <p className="mt-4 text-base text-ink-muted leading-relaxed">
                  Located in the prestigious {property.area} enclave, this property benefits from high
                  accessibility to major transportation corridors, premier educational institutions, boutique
                  retail, and civic amenities. Inspected and verified by the {siteConfig.name} advisory team.
                </p>
              </div>

              <div>
                <h3 className="font-heading text-xl font-bold text-navy mb-4">Key Features & Amenities</h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  {property.features.map((feature) => (
                    <div
                      key={feature}
                      className="flex items-center gap-2.5 rounded-xl border border-hairline bg-surface p-3.5"
                    >
                      <CheckCircle2 className="size-5 text-gold shrink-0" />
                      <span className="text-sm font-medium text-navy">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-hairline bg-cream/50 p-6">
                <h3 className="font-heading text-lg font-bold text-navy mb-2">Neighborhood Insights: {property.area}</h3>
                <p className="text-sm text-ink-muted leading-relaxed">
                  {property.area} is recognized for its tree-lined avenues, strong capital appreciation, and
                  exceptional residential infrastructure. Contact an advisor for a comprehensive neighborhood
                  dossier including recent comparable transactions and school rankings.
                </p>
              </div>
            </div>

            {/* Right col: Direct Contact & Qualification CTA Widget */}
            <div>
              <div className="sticky top-28 rounded-2xl border border-hairline bg-surface p-6 shadow-lg space-y-6">
                <div>
                  <span className="inline-block rounded-full bg-gold/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-gold mb-2">
                    Priority Inquiry
                  </span>
                  <h3 className="font-heading text-xl font-bold text-navy">
                    Interested in this property?
                  </h3>
                  <p className="mt-1 text-xs text-ink-muted">
                    Schedule a private tour or request verification documents directly with an assigned agent.
                  </p>
                </div>

                <div className="space-y-3">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition-transform hover:scale-[1.02]"
                  >
                    <MessageCircle className="size-5" />
                    Inquire via WhatsApp
                  </a>

                  <a
                    href={`tel:${siteConfig.contact.phone.replace(/\s/g, "")}`}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-navy/20 bg-background px-5 py-3.5 text-sm font-semibold text-navy transition-colors hover:bg-navy hover:text-white"
                  >
                    <Phone className="size-4" />
                    Call {siteConfig.contact.phone}
                  </a>
                </div>

                <div className="border-t border-hairline pt-5">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-ink-muted mb-2">
                    Looking for multiple options?
                  </h4>
                  <p className="text-xs text-ink-muted mb-4 leading-relaxed">
                    Tell us your full requirements and let our automated qualification engine match you with all
                    comparable homes in {property.area}.
                  </p>
                  <Link
                    href={`/qualify?purpose=${property.purpose}&area=${encodeURIComponent(property.area)}&type=${property.type}`}
                    className="block text-center rounded-xl bg-navy px-5 py-3 text-xs font-semibold text-white shadow-xs hover:bg-navy/90 transition-colors"
                  >
                    Get Matched With Similar Properties →
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Related Properties */}
          {relatedProperties.length > 0 && (
            <div className="mt-20 border-t border-hairline pt-12">
              <h2 className="font-heading text-2xl font-bold text-navy mb-6">
                Similar Properties in {property.area}
              </h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {relatedProperties.map((related) => (
                  <PropertyCard
                    key={related.id}
                    property={{
                      id: related.id,
                      title: related.title,
                      description: related.description,
                      area: related.area,
                      city: related.city,
                      price: related.priceFormatted,
                      priceNumeric: related.price,
                      status: related.status,
                      purpose: related.purpose,
                      type: related.type,
                      beds: related.beds,
                      baths: related.baths,
                      size: related.size,
                      image: related.image,
                      imageAlt: related.imageAlt,
                      features: related.features,
                    }}
                  />
                ))}
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
