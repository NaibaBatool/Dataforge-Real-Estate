"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import {
  Building2,
  Home,
  LandPlot,
  Briefcase,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  DollarSign,
  Calendar,
  User,
  Phone,
  Mail,
  FileText,
  ShieldCheck,
  Sparkles,
  AlertCircle,
  Loader2,
} from "lucide-react"
import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"
import { WhatsappButton } from "@/components/landing/whatsapp-button"
import { AVAILABLE_AREAS, PROPERTY_TYPES } from "@/lib/properties-data"
import { siteConfig } from "@/lib/site.config"

type FormData = {
  purpose: "buy" | "rent" | "invest" | ""
  propertyType: "house" | "apartment" | "plot" | "commercial" | ""
  areas: string[]
  budgetMin: number
  budgetMax: number
  timeline: "immediately" | "1-3_months" | "3-6_months" | "exploring" | ""
  name: string
  phone: string
  email: string
  notes: string
  consent: boolean
}

function QualifyForm() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [step, setStep] = useState<number>(1)
  const [error, setError] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  const [formData, setFormData] = useState<FormData>({
    purpose: "",
    propertyType: "",
    areas: [],
    budgetMin: 300000,
    budgetMax: 700000,
    timeline: "",
    name: "",
    phone: "",
    email: "",
    notes: "",
    consent: false,
  })

  // Prefill from URL query params (e.g. from quick-search)
  useEffect(() => {
    const pPurpose = searchParams.get("purpose")
    const pArea = searchParams.get("area")
    const pType = searchParams.get("type")
    const pBudget = searchParams.get("budget")

    setFormData((prev) => {
      const next = { ...prev }

      if (pPurpose && ["buy", "rent", "invest"].includes(pPurpose)) {
        next.purpose = pPurpose as FormData["purpose"]
      }

      if (pType && ["house", "apartment", "plot", "commercial"].includes(pType)) {
        next.propertyType = pType as FormData["propertyType"]
      }

      if (pArea && AVAILABLE_AREAS.includes(pArea as (typeof AVAILABLE_AREAS)[number])) {
        if (!next.areas.includes(pArea)) {
          next.areas = [pArea]
        }
      }

      if (pBudget) {
        if (pBudget.includes("150k") && !pBudget.includes("400k")) {
          next.budgetMin = 50000
          next.budgetMax = 150000
        } else if (pBudget.includes("150k") && pBudget.includes("400k")) {
          next.budgetMin = 150000
          next.budgetMax = 400000
        } else if (pBudget.includes("400k") && pBudget.includes("700k")) {
          next.budgetMin = 400000
          next.budgetMax = 700000
        } else if (pBudget.includes("700k") && pBudget.includes("1M")) {
          next.budgetMin = 700000
          next.budgetMax = 1000000
        } else if (pBudget.includes("1M+")) {
          next.budgetMin = 1000000
          next.budgetMax = 2500000
        }
      }

      // If user came for rent, default sensible budget
      if (next.purpose === "rent" && next.budgetMax > 20000) {
        next.budgetMin = 1000
        next.budgetMax = 3500
      }

      return next
    })
  }, [searchParams])

  const toggleArea = (area: string) => {
    setFormData((prev) => {
      const exists = prev.areas.includes(area)
      if (exists) {
        return { ...prev, areas: prev.areas.filter((a) => a !== area) }
      } else {
        return { ...prev, areas: [...prev.areas, area] }
      }
    })
    setError("")
  }

  const validateStep = (currentStep: number): boolean => {
    setError("")

    if (currentStep === 1) {
      if (!formData.purpose) {
        setError("Please choose whether you want to buy, rent, or invest.")
        return false
      }
    }

    if (currentStep === 2) {
      if (!formData.propertyType) {
        setError("Please select the property type you are looking for.")
        return false
      }
    }

    if (currentStep === 3) {
      if (formData.areas.length === 0) {
        setError("Please select at least one preferred neighborhood or district.")
        return false
      }
    }

    if (currentStep === 4) {
      if (
        formData.budgetMin < 0 ||
        formData.budgetMax <= 0 ||
        formData.budgetMax < formData.budgetMin
      ) {
        setError("Please ensure maximum budget is higher than minimum budget.")
        return false
      }
    }

    if (currentStep === 5) {
      if (!formData.timeline) {
        setError("Please select your ideal timeline for moving or purchasing.")
        return false
      }
    }

    if (currentStep === 6) {
      if (!formData.name.trim() || formData.name.trim().length < 2) {
        setError("Please provide your full name.")
        return false
      }
      const digits = formData.phone.replace(/\D/g, "")
      if (digits.length < 7 || digits.length > 15) {
        setError("Please enter a valid phone number (including area code) so we can send matches.")
        return false
      }
      if (!formData.consent) {
        setError("Please check the consent box to proceed with receiving your tailored matches.")
        return false
      }
    }

    return true
  }

  const handleContinue = () => {
    if (validateStep(step)) {
      setStep((prev) => prev + 1)
      window.scrollTo({ top: 120, behavior: "smooth" })
    }
  }

  const handleBack = () => {
    setError("")
    setStep((prev) => Math.max(1, prev - 1))
    window.scrollTo({ top: 120, behavior: "smooth" })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateStep(6)) return

    setIsSubmitting(true)
    setError("")

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Unable to submit your qualification profile.")
      }

      // Route to property matches page with lead ID
      router.push(`/matches?leadId=${encodeURIComponent(data.leadId)}`)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong. Please try again."
      setError(msg)
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-8">
      {/* Progress Bar & Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-ink-muted mb-2">
          <span>Step {step} of 6</span>
          <span className="text-gold font-bold">{Math.round((step / 6) * 100)}% Completed</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-cream border border-hairline">
          <div
            className="h-full bg-gradient-to-r from-gold to-gold-hover transition-all duration-300 ease-out"
            style={{ width: `${(step / 6) * 100}%` }}
          />
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-xs font-medium text-red-800">
          <AlertCircle className="size-4 shrink-0 text-red-600 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Step Form Container */}
      <div className="rounded-2xl border border-hairline bg-surface p-6 sm:p-8 shadow-sm">
        {/* STEP 1: PURPOSE */}
        {step === 1 && (
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-gold">
              Step 1 — Purpose
            </span>
            <h2 className="mt-2 font-heading text-2xl sm:text-3xl font-bold text-navy">
              What is your primary goal?
            </h2>
            <p className="mt-2 text-sm text-ink-muted">
              Choose the option that best describes what you are seeking right now.
            </p>

            <div className="mt-6 grid gap-4">
              {[
                {
                  id: "buy",
                  title: "Buy a Home",
                  desc: "Looking to purchase a primary residence, second home, or luxury retreat.",
                  icon: Home,
                },
                {
                  id: "rent",
                  title: "Rent a Residence",
                  desc: "Seeking an apartment or villa lease with flexible or annual terms.",
                  icon: Building2,
                },
                {
                  id: "invest",
                  title: "Real Estate Investment",
                  desc: "Interested in plots, rental yields, capital growth, or commercial opportunities.",
                  icon: Briefcase,
                },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setFormData({ ...formData, purpose: item.id as FormData["purpose"] })
                    setError("")
                  }}
                  className={`flex items-start gap-4 rounded-xl border p-4 text-left transition-all cursor-pointer ${
                    formData.purpose === item.id
                      ? "border-navy bg-navy/5 shadow-xs"
                      : "border-hairline bg-surface hover:border-gold/60"
                  }`}
                >
                  <div
                    className={`flex size-11 shrink-0 items-center justify-center rounded-xl transition-colors ${
                      formData.purpose === item.id ? "bg-navy text-gold" : "bg-cream text-navy"
                    }`}
                  >
                    <item.icon className="size-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-heading text-base font-bold text-navy">{item.title}</h3>
                    <p className="mt-0.5 text-xs text-ink-muted">{item.desc}</p>
                  </div>
                  {formData.purpose === item.id && (
                    <CheckCircle2 className="size-5 text-gold shrink-0 self-center" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: PROPERTY TYPE */}
        {step === 2 && (
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-gold">
              Step 2 — Property Type
            </span>
            <h2 className="mt-2 font-heading text-2xl sm:text-3xl font-bold text-navy">
              What type of property do you prefer?
            </h2>
            <p className="mt-2 text-sm text-ink-muted">
              Select the architectural category you want us to match you with.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {[
                { id: "house", title: "House / Villa", desc: "Detached homes, townhouses, estates", icon: Home },
                { id: "apartment", title: "Apartment / Penthouse", desc: "Condos, flats, high-rises", icon: Building2 },
                { id: "plot", title: "Plot / Land", desc: "Residential parcels & custom lots", icon: LandPlot },
                { id: "commercial", title: "Commercial Space", desc: "Offices, retail, warehouses", icon: Briefcase },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setFormData({ ...formData, propertyType: item.id as FormData["propertyType"] })
                    setError("")
                  }}
                  className={`flex flex-col rounded-xl border p-5 text-left transition-all cursor-pointer ${
                    formData.propertyType === item.id
                      ? "border-navy bg-navy/5 shadow-xs"
                      : "border-hairline bg-surface hover:border-gold/60"
                  }`}
                >
                  <div
                    className={`flex size-10 items-center justify-center rounded-xl mb-3 ${
                      formData.propertyType === item.id ? "bg-navy text-gold" : "bg-cream text-navy"
                    }`}
                  >
                    <item.icon className="size-5" />
                  </div>
                  <h3 className="font-heading text-base font-bold text-navy">{item.title}</h3>
                  <p className="mt-1 text-xs text-ink-muted">{item.desc}</p>
                  {formData.propertyType === item.id && (
                    <span className="mt-3 text-xs font-semibold text-gold inline-flex items-center gap-1">
                      <CheckCircle2 className="size-3.5" /> Selected
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3: PREFERRED LOCATIONS */}
        {step === 3 && (
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-gold">
              Step 3 — Location
            </span>
            <h2 className="mt-2 font-heading text-2xl sm:text-3xl font-bold text-navy">
              Where would you like to be located?
            </h2>
            <p className="mt-2 text-sm text-ink-muted">
              Select one or more preferred neighborhoods. You can change this anytime.
            </p>

            <div className="mt-6 grid gap-2.5 sm:grid-cols-2">
              {AVAILABLE_AREAS.map((area) => {
                const selected = formData.areas.includes(area)
                return (
                  <button
                    key={area}
                    type="button"
                    onClick={() => toggleArea(area)}
                    className={`flex items-center justify-between rounded-xl border p-3.5 text-left transition-all cursor-pointer ${
                      selected
                        ? "border-navy bg-navy text-white shadow-xs"
                        : "border-hairline bg-surface text-ink hover:border-navy/40"
                    }`}
                  >
                    <span className="text-sm font-semibold">{area}</span>
                    {selected ? (
                      <CheckCircle2 className="size-4.5 text-gold shrink-0" />
                    ) : (
                      <span className="size-4.5 rounded-full border border-hairline" />
                    )}
                  </button>
                )
              })}
            </div>

            <p className="mt-4 text-xs text-ink-muted">
              Selected: <span className="font-semibold text-navy">{formData.areas.length} area(s)</span>
            </p>
          </div>
        )}

        {/* STEP 4: BUDGET RANGE */}
        {step === 4 && (
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-gold">
              Step 4 — Budget
            </span>
            <h2 className="mt-2 font-heading text-2xl sm:text-3xl font-bold text-navy">
              What is your target budget range?
            </h2>
            <p className="mt-2 text-sm text-ink-muted">
              Specify your minimum and maximum comfortable price in USD ($).
            </p>

            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-ink-muted mb-2">
                  Minimum Budget ($)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-navy">
                    $
                  </span>
                  <input
                    type="number"
                    min="0"
                    step={formData.purpose === "rent" ? "100" : "10000"}
                    value={formData.budgetMin}
                    onChange={(e) => setFormData({ ...formData, budgetMin: Number(e.target.value) })}
                    className="w-full rounded-xl border border-hairline bg-surface pl-8 pr-4 py-3 text-base font-semibold text-navy outline-none transition-colors focus:border-navy focus:ring-2 focus:ring-gold/30 shadow-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-ink-muted mb-2">
                  Maximum Budget ($)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-navy">
                    $
                  </span>
                  <input
                    type="number"
                    min="0"
                    step={formData.purpose === "rent" ? "100" : "10000"}
                    value={formData.budgetMax}
                    onChange={(e) => setFormData({ ...formData, budgetMax: Number(e.target.value) })}
                    className="w-full rounded-xl border border-hairline bg-surface pl-8 pr-4 py-3 text-base font-semibold text-navy outline-none transition-colors focus:border-navy focus:ring-2 focus:ring-gold/30 shadow-xs"
                  />
                </div>
              </div>
            </div>

            {/* Quick Presets */}
            <div className="mt-6">
              <span className="block text-xs font-medium text-ink-muted mb-2">Popular Presets:</span>
              <div className="flex flex-wrap gap-2">
                {(formData.purpose === "rent"
                  ? [
                      { label: "$1k – $2k/mo", min: 1000, max: 2000 },
                      { label: "$2k – $3.5k/mo", min: 2000, max: 3500 },
                      { label: "$3.5k – $6k/mo", min: 3500, max: 6000 },
                    ]
                  : [
                      { label: "$150k – $400k", min: 150000, max: 400000 },
                      { label: "$400k – $700k", min: 400000, max: 700000 },
                      { label: "$700k – $1.2M", min: 700000, max: 1200000 },
                      { label: "$1.2M+", min: 1200000, max: 2500000 },
                    ]
                ).map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, budgetMin: preset.min, budgetMax: preset.max })
                    }
                    className="rounded-full border border-hairline bg-cream px-3.5 py-1.5 text-xs font-medium text-navy hover:border-gold hover:text-gold transition-colors"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: TIMELINE */}
        {step === 5 && (
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-gold">
              Step 5 — Timeline
            </span>
            <h2 className="mt-2 font-heading text-2xl sm:text-3xl font-bold text-navy">
              When are you planning to make a move?
            </h2>
            <p className="mt-2 text-sm text-ink-muted">
              This helps our advisory team prioritize urgent viewings and off-market opportunities.
            </p>

            <div className="mt-6 grid gap-3">
              {[
                { id: "immediately", label: "Immediately", sub: "Ready to tour and make an offer this month" },
                { id: "1-3_months", label: "Within 1 to 3 Months", sub: "Planning actively for upcoming move" },
                { id: "3-6_months", label: "Within 3 to 6 Months", sub: "Researching market & securing financing" },
                { id: "exploring", label: "Just Exploring", sub: "Browsing possibilities without fixed deadline" },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setFormData({ ...formData, timeline: item.id as FormData["timeline"] })
                    setError("")
                  }}
                  className={`flex items-center justify-between rounded-xl border p-4 text-left transition-all cursor-pointer ${
                    formData.timeline === item.id
                      ? "border-navy bg-navy text-white shadow-xs"
                      : "border-hairline bg-surface text-ink hover:border-navy/40"
                  }`}
                >
                  <div>
                    <span className="font-heading text-base font-bold">{item.label}</span>
                    <p className={`text-xs mt-0.5 ${formData.timeline === item.id ? "text-white/80" : "text-ink-muted"}`}>
                      {item.sub}
                    </p>
                  </div>
                  {formData.timeline === item.id && (
                    <CheckCircle2 className="size-5 text-gold shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 6: CONTACT DETAILS & CONSENT */}
        {step === 6 && (
          <form onSubmit={handleSubmit}>
            <span className="text-xs font-semibold uppercase tracking-widest text-gold">
              Step 6 — Final Step
            </span>
            <h2 className="mt-2 font-heading text-2xl sm:text-3xl font-bold text-navy">
              Where should we send your matched properties?
            </h2>
            <p className="mt-2 text-sm text-ink-muted">
              Provide your direct contact details. Your matched recommendations will display immediately on the next screen.
            </p>

            <div className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-ink-muted mb-1.5">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-gold" />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Sarah Jenkins"
                    className="w-full rounded-xl border border-hairline bg-surface pl-10 pr-4 py-2.5 text-sm font-medium text-navy placeholder:text-ink-muted outline-none transition-colors focus:border-navy focus:ring-2 focus:ring-gold/30 shadow-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-ink-muted mb-1.5">
                  Phone Number (WhatsApp capable) *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-gold" />
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                    className="w-full rounded-xl border border-hairline bg-surface pl-10 pr-4 py-2.5 text-sm font-medium text-navy placeholder:text-ink-muted outline-none transition-colors focus:border-navy focus:ring-2 focus:ring-gold/30 shadow-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-ink-muted mb-1.5">
                  Email Address (Optional)
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-gold" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="sarah@example.com"
                    className="w-full rounded-xl border border-hairline bg-surface pl-10 pr-4 py-2.5 text-sm font-medium text-navy placeholder:text-ink-muted outline-none transition-colors focus:border-navy focus:ring-2 focus:ring-gold/30 shadow-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-ink-muted mb-1.5">
                  Specific Requirements or Notes (Optional)
                </label>
                <div className="relative">
                  <FileText className="absolute left-3.5 top-3 size-4 text-gold" />
                  <textarea
                    rows={3}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="e.g. Need 2 parking spaces, south-facing garden, close to international school..."
                    className="w-full rounded-xl border border-hairline bg-surface pl-10 pr-4 py-2.5 text-sm font-medium text-navy placeholder:text-ink-muted outline-none transition-colors focus:border-navy focus:ring-2 focus:ring-gold/30 shadow-xs resize-none"
                  />
                </div>
              </div>

              {/* Consent Checkbox */}
              <div className="pt-2">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    checked={formData.consent}
                    onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                    className="mt-1 size-4 rounded accent-navy"
                  />
                  <span className="text-xs text-ink-muted leading-relaxed">
                    I agree to allow {siteConfig.name} to contact me regarding tailored property matches and viewings.
                    No spam, and you may opt-out at any time.
                  </span>
                </label>
              </div>
            </div>

            <div className="mt-8">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gold px-6 py-3.5 text-base font-semibold text-navy shadow-md transition-all hover:bg-gold-hover hover:shadow-lg disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-5 animate-spin" />
                    Calculating Matches...
                  </>
                ) : (
                  <>
                    <Sparkles className="size-5" />
                    Submit & View Matched Properties →
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* Navigation Buttons (for Steps 1-5) */}
        {step < 6 && (
          <div className="mt-8 flex items-center justify-between border-t border-hairline pt-6">
            {step > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="inline-flex items-center gap-1.5 rounded-xl border border-hairline bg-surface px-5 py-2.5 text-xs font-semibold text-navy hover:bg-cream transition-colors cursor-pointer"
              >
                <ArrowLeft className="size-4" />
                Back
              </button>
            ) : (
              <Link
                href="/properties"
                className="text-xs font-semibold text-ink-muted hover:text-navy transition-colors"
              >
                Cancel & Browse Listings
              </Link>
            )}

            <button
              type="button"
              onClick={handleContinue}
              className="inline-flex items-center gap-1.5 rounded-xl bg-navy px-6 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-navy/90 transition-all cursor-pointer"
            >
              Continue
              <ArrowRight className="size-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function QualifyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-ink">
      <Navbar variant="solid" />

      <main className="flex-1 pt-24 pb-20">
        <section className="border-b border-hairline bg-surface py-8">
          <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-gold">
              <Sparkles className="size-3.5" />
              Automated Property Matching
            </span>
            <h1 className="mt-2 font-heading text-3xl font-bold text-navy sm:text-4xl">
              Find Your Ideal Property Match
            </h1>
            <p className="mt-2 text-sm text-ink-muted max-w-xl mx-auto">
              Answer 6 quick questions so our matching engine can filter hundreds of properties down to
              the shortlist that actually fits your criteria.
            </p>
          </div>
        </section>

        <Suspense
          fallback={
            <div className="py-20 text-center text-sm text-ink-muted">
              Loading qualification form...
            </div>
          }
        >
          <QualifyForm />
        </Suspense>
      </main>

      <Footer />
      <WhatsappButton />
    </div>
  )
}
