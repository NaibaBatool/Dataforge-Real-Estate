"use client"

import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import {
  Users,
  Building,
  BarChart3,
  Globe,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
} from "lucide-react"
import { siteConfig } from "@/lib/site.config"

export function AdminLayout({
  children,
  adminEmail = "admin@dataforge.com",
}: {
  children: React.ReactNode
  adminEmail?: string
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true)
      await fetch("/api/admin/auth/logout", { method: "POST" })
      router.push("/admin/login")
      router.refresh()
    } catch {
      router.push("/admin/login")
    }
  }

  const navItems = [
    {
      label: "Lead Dossiers",
      href: "/admin/leads",
      icon: Users,
      active: pathname === "/admin/leads" || pathname.startsWith("/admin/leads/"),
      disabled: false,
    },
    {
      label: "Property Catalog",
      href: "#",
      icon: Building,
      active: false,
      disabled: true,
      badge: "Upcoming",
    },
    {
      label: "Analytics & Reports",
      href: "#",
      icon: BarChart3,
      active: false,
      disabled: true,
      badge: "Phase 3",
    },
  ]

  return (
    <div className="flex min-h-screen bg-background text-ink">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col border-r border-hairline bg-surface">
        {/* Sidebar Brand Header */}
        <div className="flex items-center gap-3 border-b border-hairline p-5">
          <div className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-gold/30 bg-navy shadow-sm">
            <Image
              src={siteConfig.logo}
              alt="DataForge Logo"
              width={40}
              height={40}
              priority
              className="object-contain p-0.5"
            />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-heading text-base font-bold text-navy">{siteConfig.name}</span>
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gold">
              Admin Portal
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-1.5 p-4">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-ink-muted">
            Management
          </div>
          {navItems.map((item) => (
            <div key={item.label}>
              {item.disabled ? (
                <div
                  className="flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-medium text-ink-muted/60 cursor-not-allowed select-none"
                  title="Coming in future dashboard update"
                >
                  <div className="flex items-center gap-2.5">
                    <item.icon className="size-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="rounded-md bg-cream px-1.5 py-0.5 text-[9px] font-semibold text-ink-muted">
                      {item.badge}
                    </span>
                  )}
                </div>
              ) : (
                <Link
                  href={item.href}
                  className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-semibold transition-all ${
                    item.active
                      ? "bg-navy text-white shadow-xs"
                      : "text-ink hover:bg-cream hover:text-navy"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <item.icon className={`size-4 ${item.active ? "text-gold" : "text-ink-muted"}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.active && <ChevronRight className="size-3.5 text-gold" />}
                </Link>
              )}
            </div>
          ))}

          <div className="pt-6 px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-ink-muted">
            Public Website
          </div>
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-medium text-ink hover:bg-cream hover:text-navy transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <Globe className="size-4 text-gold" />
              <span>View Live Website</span>
            </div>
            <ExternalLink className="size-3 text-ink-muted" />
          </Link>
        </nav>

        {/* Sidebar Footer: Admin User Badge & Logout */}
        <div className="border-t border-hairline p-4 space-y-3">
          <div className="flex items-center gap-2.5 rounded-xl bg-cream/70 p-2.5 border border-hairline/60">
            <div className="flex size-8 items-center justify-center rounded-lg bg-navy text-gold">
              <ShieldCheck className="size-4" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="block text-[10px] font-semibold uppercase tracking-wider text-gold">
                Administrator
              </span>
              <span className="block truncate text-xs font-semibold text-navy" title={adminEmail}>
                {adminEmail}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full flex items-center justify-center gap-2 rounded-xl border border-hairline bg-surface px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-50 hover:border-red-200 transition-colors cursor-pointer"
          >
            <LogOut className="size-3.5" />
            <span>{isLoggingOut ? "Signing out..." : "Sign Out"}</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-hairline bg-surface/90 px-4 backdrop-blur sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden inline-flex size-9 items-center justify-center rounded-lg border border-hairline text-navy hover:bg-cream"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline-block size-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-medium text-ink-muted">
                DataForge Lead Routing & Qualification Engine
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-hairline px-3.5 py-1.5 text-xs font-semibold text-navy hover:bg-cream transition-colors"
            >
              <Globe className="size-3.5 text-gold" />
              <span>Customer View</span>
            </Link>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1 text-xs font-semibold text-ink-muted hover:text-red-700 transition-colors"
            >
              <LogOut className="size-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        {/* Mobile Slide-down Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-b border-hairline bg-surface p-4 shadow-lg space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-ink-muted px-2 pb-1">
              DataForge Admin
            </div>
            {navItems.map((item) => (
              <div key={item.label}>
                {!item.disabled && (
                  <Link
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 rounded-xl bg-navy/5 p-2.5 text-xs font-semibold text-navy"
                  >
                    <item.icon className="size-4 text-gold" />
                    <span>{item.label}</span>
                  </Link>
                )}
              </div>
            ))}
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 rounded-xl p-2.5 text-xs font-medium text-ink hover:bg-cream"
            >
              <Globe className="size-4 text-gold" />
              <span>Back to Public Website</span>
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="w-full mt-2 flex items-center justify-center gap-2 rounded-xl bg-red-50 p-2.5 text-xs font-semibold text-red-700"
            >
              <LogOut className="size-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        )}

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
