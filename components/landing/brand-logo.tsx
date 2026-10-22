import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { siteConfig } from "@/lib/site.config"

export function BrandLogo({
  className,
  tone = "light",
  showSubtext = false,
}: {
  className?: string
  tone?: "light" | "dark"
  showSubtext?: boolean
}) {
  return (
    <Link
      href="/"
      className={cn(
        "group inline-flex items-center gap-3 font-heading text-lg font-bold tracking-tight transition-opacity hover:opacity-95",
        tone === "light" ? "text-white" : "text-navy",
        className,
      )}
      aria-label={`${siteConfig.name} — home`}
    >
      <div className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-gold/30 bg-navy shadow-sm transition-transform duration-300 group-hover:scale-105">
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
        <span className="font-heading text-lg font-bold tracking-tight">{siteConfig.name}</span>
        {showSubtext && (
          <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-gold">
            Real Estate Division
          </span>
        )}
      </div>
    </Link>
  )
}
