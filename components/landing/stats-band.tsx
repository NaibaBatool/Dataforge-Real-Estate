"use client"

import { useEffect, useRef, useState } from "react"

type Stat = { value: number; suffix: string; label: string }

const stats: Stat[] = [
  { value: 1200, suffix: "+", label: "Families placed" },
  { value: 15, suffix: "yrs", label: "In the local market" },
  { value: 98, suffix: "%", label: "Client satisfaction" },
  { value: 500, suffix: "+", label: "Active listings" },
]

function useCountUp(target: number, active: boolean, duration = 1600) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!active) return
    let raf = 0
    const start = performance.now()
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(eased * target))
      if (progress < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, active, duration])

  return value
}

function StatItem({ stat, active }: { stat: Stat; active: boolean }) {
  const value = useCountUp(stat.value, active)
  return (
    <div className="flex flex-col items-center text-center">
      <span className="font-heading text-4xl font-bold text-gold sm:text-5xl">
        {value.toLocaleString()}
        {stat.suffix}
      </span>
      <span className="mt-2 text-sm font-medium uppercase tracking-wider text-white/70">
        {stat.label}
      </span>
    </div>
  )
}

export function StatsBand() {
  const ref = useRef<HTMLElement | null>(null)
  const [active, setActive] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true)
          observer.disconnect()
        }
      },
      { threshold: 0.4 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={ref} className="relative overflow-hidden bg-navy py-16">
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 30%, var(--brand-gold) 0, transparent 40%), radial-gradient(circle at 80% 70%, var(--brand-gold) 0, transparent 40%)",
        }}
        aria-hidden="true"
      />
      <div className="relative mx-auto grid max-w-5xl grid-cols-2 gap-10 px-4 sm:px-6 lg:grid-cols-4 lg:px-8">
        {stats.map((stat) => (
          <StatItem key={stat.label} stat={stat} active={active} />
        ))}
      </div>
    </section>
  )
}
