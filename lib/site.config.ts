/**
 * Single source of truth for brand identity.
 * DataForge Estates branding configuration.
 */

export const siteConfig = {
  name: "DataForge Estates",
  tagline: "Intelligent Real Estate & Property Matching",
  description:
    "A premier real estate solution by DataForge helping people buy, rent, and invest with clarity through automated qualification and verified property matching.",
  logo: "/images/dataforge_logo.jpeg",
  contact: {
    phone: "+92 300 0000000",
    whatsapp: "+92 300 0000000",
    email: "contact@dataforgeestates.com",
    address: "DataForge Plaza, Central District, Metropolis",
  },
  socials: {
    facebook: "https://facebook.com",
    instagram: "https://instagram.com",
    linkedin: "https://linkedin.com",
    twitter: "https://twitter.com",
  },
  admin: {
    loginPath: "/admin/login",
    leadsPath: "/admin/leads",
  },
  /**
   * Brand color tokens. These hex values are injected as CSS variables
   * (see BrandStyle in app/layout.tsx) so the whole site re-skins from here.
   */
  colors: {
    navy: "#0B1F3A",
    gold: "#C9A24B",
    goldHover: "#B38E3C",
    background: "#F7F5F0",
    surface: "#FFFFFF",
    text: "#1A1F2B",
    mutedText: "#6B7280",
    border: "#E5E1D8",
    hot: "#E5484D",
    warm: "#F5A524",
    cold: "#3B82F6",
  },
} as const

export type SiteConfig = typeof siteConfig

/** Build a WhatsApp deep link from the configured number. */
export function whatsappHref(message = "Hi! I'd like help finding a property with DataForge Estates.") {
  const digits = siteConfig.contact.whatsapp.replace(/[^\d]/g, "")
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`
}
