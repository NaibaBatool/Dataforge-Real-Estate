import { ClipboardList, Sparkles, KeyRound } from "lucide-react"
import { SectionHeading } from "./section-heading"
import { Reveal } from "./reveal"

const steps = [
  {
    icon: ClipboardList,
    title: "Tell us what you need",
    description:
      "Share your budget, preferred areas, and timeline. It takes about two minutes — no account, no commitment.",
  },
  {
    icon: Sparkles,
    title: "Get matched, not spammed",
    description:
      "We filter thousands of listings down to the handful that genuinely fit, and send them straight to you.",
  },
  {
    icon: KeyRound,
    title: "Tour and move in",
    description:
      "Visit the ones you love with an advisor by your side. We handle paperwork and negotiation to closing.",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-24 bg-surface py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="How It Works"
          title="Three simple steps to the right home"
          description="Buying or renting shouldn't feel like a second job. Here's how we keep it effortless."
        />

        <div className="relative mt-14 grid gap-8 md:grid-cols-3">
          <div
            className="absolute left-0 right-0 top-8 hidden h-px bg-gradient-to-r from-transparent via-hairline to-transparent md:block"
            aria-hidden="true"
          />
          {steps.map((step, i) => (
            <Reveal key={step.title} delay={i * 120} className="relative flex flex-col items-center text-center">
              <div className="relative z-10 flex size-16 items-center justify-center rounded-2xl bg-navy text-gold shadow-lg">
                <step.icon className="size-7" aria-hidden="true" />
                <span className="absolute -right-2 -top-2 flex size-7 items-center justify-center rounded-full bg-gold text-xs font-bold text-navy">
                  {i + 1}
                </span>
              </div>
              <h3 className="mt-6 font-heading text-xl font-bold text-navy">{step.title}</h3>
              <p className="mt-3 max-w-xs text-pretty leading-relaxed text-ink-muted">
                {step.description}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
