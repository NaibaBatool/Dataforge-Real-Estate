import { Home, Building2, LandPlot, TrendingUp, FileText, Handshake } from "lucide-react"
import { SectionHeading } from "./section-heading"
import { Reveal } from "./reveal"

const services = [
  {
    icon: Home,
    title: "Buying a Home",
    description: "From first tour to final signature, we guide you to a home that fits your life and budget.",
  },
  {
    icon: Building2,
    title: "Renting Made Easy",
    description: "Curated rentals matched to your needs, with transparent terms and no hidden fees.",
  },
  {
    icon: LandPlot,
    title: "Plots & Land",
    description: "Verified plots in growing neighborhoods, vetted for clear ownership and real potential.",
  },
  {
    icon: TrendingUp,
    title: "Investment Advisory",
    description: "Data-backed guidance on where to invest, with honest projections and zero pressure.",
  },
  {
    icon: FileText,
    title: "Paperwork & Legal",
    description: "We handle contracts, verification, and documentation so you can move in with confidence.",
  },
  {
    icon: Handshake,
    title: "Negotiation Support",
    description: "Experienced negotiators working in your corner to get you the best possible deal.",
  },
]

export function Services() {
  return (
    <section id="services" className="scroll-mt-24 bg-cream py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="What We Do"
          title="Everything you need under one roof"
          description="A full-service team covering every step of your property journey — so you never have to juggle multiple middlemen."
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => (
            <Reveal
              key={service.title}
              delay={(i % 3) * 80}
              as="article"
              className="group rounded-2xl border border-hairline bg-surface p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-gold/50 hover:shadow-xl"
            >
              <div className="flex size-14 items-center justify-center rounded-xl bg-navy/5 text-navy transition-colors duration-300 group-hover:bg-navy group-hover:text-gold">
                <service.icon className="size-7" aria-hidden="true" />
              </div>
              <h3 className="mt-5 font-heading text-xl font-bold text-navy">{service.title}</h3>
              <p className="mt-3 leading-relaxed text-ink-muted">{service.description}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
