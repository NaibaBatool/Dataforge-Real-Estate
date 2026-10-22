"use client"

import { useState, type FormEvent } from "react"
import { Phone, Mail, MapPin, CheckCircle2 } from "lucide-react"
import { siteConfig, whatsappHref } from "@/lib/site.config"
import { areas, budgetOptions } from "@/lib/mock-data"

export function Contact() {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Mock submission — wire up to a real endpoint or CRM later.
    setSubmitted(true)
  }

  return (
    <section id="contact" className="scroll-mt-24 bg-navy py-20 sm:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        {/* Left: copy + contact details */}
        <div className="flex flex-col justify-center">
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            <span className="h-px w-6 bg-gold" aria-hidden="true" />
            Find My Home
          </span>
          <h2 className="mt-4 text-balance font-heading text-3xl font-bold leading-tight text-white sm:text-4xl">
            Tell us what you&apos;re looking for
          </h2>
          <p className="mt-4 max-w-md text-pretty leading-relaxed text-white/70">
            Share a few details and an advisor will send you a shortlist of homes that fit — usually
            within one business day. No obligation, no spam.
          </p>

          <ul className="mt-8 space-y-4">
            <li>
              <a
                href={`tel:${siteConfig.contact.phone.replace(/\s/g, "")}`}
                className="flex items-center gap-3 text-white/85 transition-colors hover:text-gold"
              >
                <span className="flex size-10 items-center justify-center rounded-xl bg-white/10">
                  <Phone className="size-5" aria-hidden="true" />
                </span>
                {siteConfig.contact.phone}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="flex items-center gap-3 text-white/85 transition-colors hover:text-gold"
              >
                <span className="flex size-10 items-center justify-center rounded-xl bg-white/10">
                  <Mail className="size-5" aria-hidden="true" />
                </span>
                {siteConfig.contact.email}
              </a>
            </li>
            <li className="flex items-center gap-3 text-white/85">
              <span className="flex size-10 items-center justify-center rounded-xl bg-white/10">
                <MapPin className="size-5" aria-hidden="true" />
              </span>
              {siteConfig.contact.address}
            </li>
          </ul>
        </div>

        {/* Right: form */}
        <div className="rounded-3xl bg-surface p-6 shadow-2xl sm:p-8">
          {submitted ? (
            <div className="flex h-full min-h-80 flex-col items-center justify-center text-center">
              <CheckCircle2 className="size-14 text-emerald-500" aria-hidden="true" />
              <h3 className="mt-4 font-heading text-2xl font-bold text-navy">Thank you!</h3>
              <p className="mt-2 max-w-sm text-ink-muted">
                We&apos;ve received your details. An advisor will reach out with matching homes
                shortly.
              </p>
              <a
                href={whatsappHref()}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center justify-center rounded-full bg-gold px-6 py-3 text-sm font-semibold text-navy transition-colors hover:bg-gold-hover"
              >
                Chat on WhatsApp instead
              </a>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Full name" htmlFor="name">
                  <input
                    id="name"
                    name="name"
                    required
                    autoComplete="name"
                    className="input"
                    placeholder="Jane Doe"
                  />
                </Field>
                <Field label="Phone" htmlFor="phone">
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    autoComplete="tel"
                    className="input"
                    placeholder="+92 300 0000000"
                  />
                </Field>
              </div>

              <Field label="Email" htmlFor="email">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="input"
                  placeholder="jane@example.com"
                />
              </Field>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Preferred area" htmlFor="area">
                  <select id="area" name="area" className="input" defaultValue="">
                    <option value="" disabled>
                      Select area
                    </option>
                    {areas.map((a) => (
                      <option key={a} value={a}>
                        {a}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Budget" htmlFor="budget">
                  <select id="budget" name="budget" className="input" defaultValue="">
                    <option value="" disabled>
                      Select budget
                    </option>
                    {budgetOptions.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>

              <Field label="Anything else? (optional)" htmlFor="message">
                <textarea
                  id="message"
                  name="message"
                  rows={3}
                  className="input resize-none"
                  placeholder="Timeline, must-haves, number of bedrooms…"
                />
              </Field>

              <button
                type="submit"
                className="mt-2 inline-flex items-center justify-center rounded-full bg-gold px-6 py-3.5 text-base font-semibold text-navy transition-colors hover:bg-gold-hover"
              >
                Send my request
              </button>
              <p className="text-center text-xs text-ink-muted">
                By submitting, you agree to be contacted about matching properties.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string
  htmlFor: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-medium text-navy">
        {label}
      </label>
      {children}
    </div>
  )
}
