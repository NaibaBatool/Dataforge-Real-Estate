"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Menu, X, Phone, Sparkles, ShieldCheck } from "lucide-react"
import { cn } from "@/lib/utils"
import { siteConfig } from "@/lib/site.config"
import { BrandLogo } from "./brand-logo"

const links = [
  { href: "/properties", label: "Browse Properties" },
  { href: "/qualify", label: "Get Matched" },
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/#services", label: "Services" },
  { href: "/#team", label: "Team" },
  { href: "/#contact", label: "Contact" },
]

export function Navbar({ variant = "transparent" }: { variant?: "transparent" | "solid" }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  const isSolid = variant === "solid" || scrolled

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        isSolid ? "bg-navy/95 py-3 shadow-lg backdrop-blur" : "bg-transparent py-5",
      )}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <BrandLogo />

        <ul className="hidden items-center gap-6 xl:gap-7 lg:flex">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-sm font-medium text-white/85 transition-colors hover:text-gold"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-2.5 lg:flex">
          <a
            href={`tel:${siteConfig.contact.phone.replace(/\s/g, "")}`}
            className="inline-flex items-center gap-1.5 text-xs xl:text-sm font-medium text-white/80 transition-colors hover:text-gold pr-1"
          >
            <Phone className="size-3.5" aria-hidden="true" />
            <span className="hidden xl:inline">{siteConfig.contact.phone}</span>
          </a>

          <Link
            href="/qualify"
            className="inline-flex items-center justify-center gap-1.5 rounded-full bg-gold px-4 py-2 text-xs xl:text-sm font-semibold text-navy shadow-sm transition-all hover:bg-gold-hover hover:shadow"
          >
            <Sparkles className="size-3.5" />
            <span>Find My Home</span>
          </Link>

          {/* Discreet Admin Login */}
          <Link
            href="/admin/login"
            className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/80 transition-all hover:border-gold hover:bg-white/10 hover:text-gold"
            title="Administrator Lead Portal"
          >
            <ShieldCheck className="size-3.5 text-gold" />
            <span>Admin</span>
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex size-10 items-center justify-center rounded-lg text-white lg:hidden"
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        className={cn(
          "overflow-hidden bg-navy/98 backdrop-blur transition-[max-height] duration-300 lg:hidden",
          open ? "max-h-[32rem]" : "max-h-0",
        )}
      >
        <ul className="flex flex-col gap-1 px-4 py-4 sm:px-6">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-3 text-base font-medium text-white/85 transition-colors hover:bg-white/5 hover:text-gold"
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li className="mt-2 pt-2 border-t border-white/10">
            <Link
              href="/qualify"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center gap-2 rounded-full bg-gold px-5 py-3 text-center text-base font-semibold text-navy"
            >
              <Sparkles className="size-4" />
              <span>Get Matched (60 Seconds)</span>
            </Link>
          </li>
          {/* Mobile Admin Link */}
          <li className="pt-2 text-center">
            <Link
              href="/admin/login"
              onClick={() => setOpen(false)}
              className="inline-flex items-center justify-center gap-1.5 py-2 text-center text-xs font-medium text-white/70 hover:text-gold transition-colors"
            >
              <ShieldCheck className="size-3.5 text-gold" />
              <span>Admin Portal Login</span>
            </Link>
          </li>
        </ul>
      </div>
    </header>
  )
}
