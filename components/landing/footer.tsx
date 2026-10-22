import Link from "next/link"
import { siteConfig } from "@/lib/site.config"
import { BrandLogo } from "./brand-logo"
import { FacebookIcon, InstagramIcon, LinkedinIcon, TwitterIcon } from "./social-icons"

const columns = [
  {
    title: "Explore",
    links: [
      { label: "Browse All Properties", href: "/properties" },
      { label: "Get Matched to Home", href: "/qualify" },
      { label: "How It Works", href: "/#how-it-works" },
      { label: "Our Services", href: "/#services" },
    ],
  },
  {
    title: "Services",
    links: [
      { label: "Buying a Home", href: "/#services" },
      { label: "Renting Made Easy", href: "/#services" },
      { label: "Plots & Land", href: "/#services" },
      { label: "Investment Advisory", href: "/#services" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Meet the Team", href: "/#team" },
      { label: "Contact Us", href: "/#contact" },
      { label: "Book a Consultation", href: "/qualify" },
      { label: "Admin Portal", href: "/admin/login" },
    ],
  },
]

const socials = [
  { icon: InstagramIcon, label: "Instagram", href: siteConfig.socials.instagram },
  { icon: FacebookIcon, label: "Facebook", href: siteConfig.socials.facebook },
  { icon: TwitterIcon, label: "Twitter", href: siteConfig.socials.twitter },
  { icon: LinkedinIcon, label: "LinkedIn", href: siteConfig.socials.linkedin },
]

export function Footer() {
  return (
    <footer className="bg-navy text-white/70">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div className="max-w-sm">
            <BrandLogo />
            <p className="mt-4 text-pretty leading-relaxed">{siteConfig.description}</p>
            <div className="mt-6 flex gap-3">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="flex size-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-gold hover:text-navy"
                  aria-label={social.label}
                >
                  <social.icon className="size-4.5" />
                </a>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-white">
                {col.title}
              </h3>
              <ul className="mt-4 space-y-3 text-sm">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="transition-colors hover:text-gold"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs sm:flex-row">
          <p>© {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</p>
          <p className="text-white/50">
            A boutique real estate solution by DataForge.
          </p>
        </div>
      </div>
    </footer>
  )
}
