"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Eye, EyeOff, Lock, Mail, ArrowLeft, Loader2, AlertCircle, ShieldCheck } from "lucide-react"
import { siteConfig } from "@/lib/site.config"

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTarget = searchParams.get("redirect") || "/admin/leads"

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(true)

  // If already logged in, redirect directly to /admin/leads
  useEffect(() => {
    async function checkExistingSession() {
      try {
        const res = await fetch("/api/admin/auth/me")
        if (res.ok) {
          const data = await res.json()
          if (data.authenticated) {
            router.replace(redirectTarget)
            return
          }
        }
      } catch {
        // Not authenticated
      } finally {
        setCheckingAuth(false)
      }
    }
    checkExistingSession()
  }, [router, redirectTarget])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Invalid administrator credentials.")
      }

      router.push(redirectTarget)
      router.refresh()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Authentication failed."
      setError(msg)
      setIsLoading(false)
    }
  }

  if (checkingAuth) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-gold" />
      </div>
    )
  }

  return (
    <div className="w-full max-w-md">
      {/* Brand Header */}
      <div className="text-center mb-8">
        <Link href="/" className="inline-block group">
          <div className="mx-auto flex size-16 items-center justify-center overflow-hidden rounded-2xl border border-gold/40 bg-navy shadow-lg transition-transform group-hover:scale-105">
            <Image
              src={siteConfig.logo}
              alt="DataForge Estates Logo"
              width={64}
              height={64}
              priority
              className="object-contain p-1"
            />
          </div>
        </Link>
        <h1 className="mt-4 font-heading text-2xl sm:text-3xl font-bold text-navy">
          {siteConfig.name}
        </h1>
        <p className="mt-1 text-sm font-semibold uppercase tracking-[0.18em] text-gold">
          Admin Portal
        </p>
        <p className="mt-2 text-xs text-ink-muted">
          Sign in to review qualified property leads, manage pipeline status, and access client dossiers.
        </p>
      </div>

      {/* Login Card */}
      <div className="rounded-2xl border border-hairline bg-surface p-6 sm:p-8 shadow-md">
        {error && (
          <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs font-medium text-red-800">
            <AlertCircle className="size-4 shrink-0 text-red-600 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="admin-email"
              className="block text-xs font-semibold uppercase tracking-wider text-ink-muted mb-1.5"
            >
              Administrator Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-gold" />
              <input
                id="admin-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@dataforge.com"
                className="w-full rounded-xl border border-hairline bg-surface pl-10 pr-4 py-2.5 text-sm font-medium text-navy placeholder:text-ink-muted outline-none transition-colors focus:border-navy focus:ring-2 focus:ring-gold/30 shadow-xs"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="admin-password"
                className="text-xs font-semibold uppercase tracking-wider text-ink-muted"
              >
                Password
              </label>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-gold" />
              <input
                id="admin-password"
                type={showPassword ? "text" : "password"}
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full rounded-xl border border-hairline bg-surface pl-10 pr-11 py-2.5 text-sm font-medium text-navy placeholder:text-ink-muted outline-none transition-colors focus:border-navy focus:ring-2 focus:ring-gold/30 shadow-xs"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-muted hover:text-navy transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-navy px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-navy/90 hover:shadow disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="size-4 animate-spin text-gold" />
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="size-4 text-gold" />
                <span>Sign In to Admin Portal</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-6 border-t border-hairline pt-4 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-muted hover:text-navy transition-colors"
          >
            <ArrowLeft className="size-3.5" />
            <span>Return to public website</span>
          </Link>
        </div>
      </div>

      <div className="mt-6 text-center text-xs text-ink-muted">
        Protected administrator system • DataForge Real Estate Automation
      </div>
    </div>
  )
}

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <Suspense
        fallback={
          <div className="flex items-center justify-center">
            <Loader2 className="size-8 animate-spin text-gold" />
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  )
}
