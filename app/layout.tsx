import { Analytics } from "@vercel/analytics/next"
import type { Metadata, Viewport } from "next"
import { Playfair_Display, Inter } from "next/font/google"
import { siteConfig } from "@/lib/site.config"
import "./globals.css"

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-playfair",
  display: "swap",
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: `${siteConfig.name} — ${siteConfig.tagline}`,
  description: siteConfig.description,
  icons: {
    icon: [
      { url: siteConfig.logo, type: "image/jpeg" },
      { url: "/icon-light-32x32.png", media: "(prefers-color-scheme: light)" },
      { url: "/icon-dark-32x32.png", media: "(prefers-color-scheme: dark)" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: siteConfig.logo,
  },
  openGraph: {
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: [{ url: siteConfig.logo, width: 1024, height: 1024, alt: `${siteConfig.name} Logo` }],
    type: "website",
  },
}

export const viewport: Viewport = {
  themeColor: siteConfig.colors.navy,
}

/** Injects brand colors as CSS variables so the whole site re-skins from site.config.ts */
function BrandStyle() {
  const c = siteConfig.colors
  const css = `:root{--brand-navy:${c.navy};--brand-gold:${c.gold};--brand-gold-hover:${c.goldHover};--brand-background:${c.background};--brand-surface:${c.surface};--brand-text:${c.text};--brand-muted-text:${c.mutedText};--brand-border:${c.border};--brand-hot:${c.hot};--brand-warm:${c.warm};--brand-cold:${c.cold};}`
  return <style dangerouslySetInnerHTML={{ __html: css }} />
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <head>
        <BrandStyle />
      </head>
      <body className="antialiased">
        {children}
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  )
}
