import Image from "next/image"
import { ShieldCheck, Search, Sparkles } from "lucide-react"
import { siteConfig } from "@/lib/site.config"
import { QuickSearch } from "./quick-search"

const trustBadges = [
  { icon: Search, label: "Browse freely — no signup" },
  { icon: Sparkles, label: "Matched to your budget" },
  { icon: ShieldCheck, label: "Verified listings only" },
]

export function Hero() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden pt-28 pb-16">
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/hero.png"
          alt="Elegant modern luxury home exterior at golden hour"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/80 to-navy/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-transparent to-transparent" />
      </div>

      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <span className="inline-flex animate-fade-up items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-gold">
            {siteConfig.name}
          </span>

          <h1
            className="mt-6 text-balance font-heading text-4xl font-bold leading-[1.05] text-white sm:text-5xl lg:text-6xl"
            style={{ animation: "fade-up 0.7s cubic-bezier(0.16,1,0.3,1) 0.05s both" }}
          >
            Find a home that fits your life, not just your budget.
          </h1>

          <p
            className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-white/80"
            style={{ animation: "fade-up 0.7s cubic-bezier(0.16,1,0.3,1) 0.15s both" }}
          >
            Tell us what matters — area, budget, timeline — and we&apos;ll match you with the right
            properties. Or explore our latest listings below at your own pace.
          </p>

          <div
            className="mt-8 flex flex-col gap-3 sm:flex-row"
            style={{ animation: "fade-up 0.7s cubic-bezier(0.16,1,0.3,1) 0.25s both" }}
          >
            <a
              href="#find-home"
              className="inline-flex items-center justify-center rounded-full bg-gold px-7 py-3.5 text-base font-semibold text-navy shadow-lg transition-colors hover:bg-gold-hover"
            >
              Find My Home
            </a>
            <a
              href="#properties"
              className="inline-flex items-center justify-center rounded-full border border-white/40 px-7 py-3.5 text-base font-semibold text-white transition-colors hover:bg-white/10"
            >
              Browse Listings
            </a>
          </div>

          <ul
            className="mt-10 flex flex-wrap gap-x-6 gap-y-3"
            style={{ animation: "fade-up 0.7s cubic-bezier(0.16,1,0.3,1) 0.35s both" }}
          >
            {trustBadges.map((badge) => (
              <li key={badge.label} className="flex items-center gap-2 text-sm text-white/75">
                <badge.icon className="size-4 text-gold" aria-hidden="true" />
                {badge.label}
              </li>
            ))}
          </ul>
        </div>

        <div
          id="find-home"
          className="w-full max-w-3xl scroll-mt-28"
          style={{ animation: "fade-up 0.7s cubic-bezier(0.16,1,0.3,1) 0.45s both" }}
        >
          <QuickSearch />
        </div>
      </div>
    </section>
  )
}
