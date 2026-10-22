import Image from "next/image"
import { Mail } from "lucide-react"
import { agents } from "@/lib/mock-data"
import { SectionHeading } from "./section-heading"
import { Reveal } from "./reveal"
import { LinkedinIcon } from "./social-icons"

export function Team() {
  return (
    <section id="team" className="scroll-mt-24 bg-cream py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Meet the Team"
          title="Real people who know the neighborhood"
          description="Local advisors who live and work in the areas you're looking at — not a faceless call center."
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {agents.map((agent, i) => (
            <Reveal
              key={agent.id}
              delay={i * 80}
              as="article"
              className="group overflow-hidden rounded-2xl border border-hairline bg-surface shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                  src={agent.photo || "/placeholder.svg"}
                  alt={agent.photoAlt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-3 bg-gradient-to-t from-navy/90 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <a
                    href="#contact"
                    className="flex size-9 items-center justify-center rounded-full bg-white/95 text-navy transition-colors hover:bg-gold"
                    aria-label={`Email ${agent.name}`}
                  >
                    <Mail className="size-4" />
                  </a>
                  <a
                    href="#contact"
                    className="flex size-9 items-center justify-center rounded-full bg-white/95 text-navy transition-colors hover:bg-gold"
                    aria-label={`${agent.name} on LinkedIn`}
                  >
                    <LinkedinIcon className="size-4" />
                  </a>
                </div>
              </div>
              <div className="p-5 text-center">
                <h3 className="font-heading text-lg font-bold text-navy">{agent.name}</h3>
                <p className="mt-1 text-sm text-gold">{agent.role}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
