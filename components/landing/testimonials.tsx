"use client"

import { useCallback, useEffect, useState } from "react"
import Image from "next/image"
import { Quote, ChevronLeft, ChevronRight, Star } from "lucide-react"
import { cn } from "@/lib/utils"
import { testimonials } from "@/lib/mock-data"
import { SectionHeading } from "./section-heading"

export function Testimonials() {
  const [index, setIndex] = useState(0)
  const count = testimonials.length

  const go = useCallback(
    (dir: number) => setIndex((prev) => (prev + dir + count) % count),
    [count],
  )

  useEffect(() => {
    const timer = setInterval(() => setIndex((prev) => (prev + 1) % count), 6000)
    return () => clearInterval(timer)
  }, [count])

  const active = testimonials[index]

  return (
    <section className="bg-surface py-20 sm:py-28">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Client Stories"
          title="People who found their place with us"
        />

        <div className="relative mt-12">
          <div className="rounded-3xl border border-hairline bg-cream p-8 shadow-sm sm:p-12">
            <Quote className="size-10 text-gold/40" aria-hidden="true" />

            <div className="mt-4 flex gap-1" aria-label="5 out of 5 stars">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="size-5 fill-gold text-gold" aria-hidden="true" />
              ))}
            </div>

            <blockquote className="mt-5 text-pretty font-heading text-xl leading-relaxed text-navy sm:text-2xl">
              “{active.quote}”
            </blockquote>

            <figcaption className="mt-8 flex items-center gap-4">
              <div className="relative size-14 overflow-hidden rounded-full ring-2 ring-gold/40">
                <Image
                  src={active.avatar || "/placeholder.svg"}
                  alt={`Photo of ${active.name}`}
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              </div>
              <div>
                <p className="font-semibold text-navy">{active.name}</p>
                <p className="text-sm text-ink-muted">{active.detail}</p>
              </div>
            </figcaption>
          </div>

          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => go(-1)}
              className="flex size-11 items-center justify-center rounded-full border border-hairline bg-surface text-navy transition-colors hover:border-navy hover:bg-navy hover:text-white"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="size-5" />
            </button>

            <div className="flex gap-2">
              {testimonials.map((t, i) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setIndex(i)}
                  className={cn(
                    "h-2 rounded-full transition-all",
                    i === index ? "w-8 bg-gold" : "w-2 bg-navy/20 hover:bg-navy/40",
                  )}
                  aria-label={`Go to testimonial ${i + 1}`}
                  aria-current={i === index}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={() => go(1)}
              className="flex size-11 items-center justify-center rounded-full border border-hairline bg-surface text-navy transition-colors hover:border-navy hover:bg-navy hover:text-white"
              aria-label="Next testimonial"
            >
              <ChevronRight className="size-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
