import crypto from "crypto"

export const ADMIN_COOKIE_NAME = "dataforge_admin_session"

// Default authorized credentials (configurable via env variables)
const DEFAULT_ADMIN_EMAIL = "admin@dataforge.com"
const DEFAULT_ADMIN_PASSWORD = "1234dataforge"
const SECRET_KEY = process.env.ADMIN_AUTH_SECRET || "dataforge-estates-secret-key-2026-auth"

export type AdminUser = {
  email: string
  role: "admin"
}

export function getAuthorizedAdminEmail(): string {
  return process.env.ADMIN_EMAIL || DEFAULT_ADMIN_EMAIL
}

export function verifyCredentials(email: string, pass: string): boolean {
  if (!email || !pass) return false
  const targetEmail = getAuthorizedAdminEmail().toLowerCase().trim()
  const targetPassword = process.env.ADMIN_PASSWORD || DEFAULT_ADMIN_PASSWORD

  const cleanEmail = email.toLowerCase().trim()
  return cleanEmail === targetEmail && pass === targetPassword
}

/**
 * Creates a signed token: payload.signature
 */
export function createSessionToken(email: string): string {
  const payload = {
    email,
    role: "admin",
    exp: Date.now() + 1000 * 60 * 60 * 24, // 24 hours
  }
  const payloadStr = Buffer.from(JSON.stringify(payload)).toString("base64url")
  const signature = crypto.createHmac("sha256", SECRET_KEY).update(payloadStr).digest("base64url")
  return `${payloadStr}.${signature}`
}

/**
 * Verifies the signed session token and returns the admin user if valid.
 */
export function verifySessionToken(token: string): AdminUser | null {
  if (!token || typeof token !== "string" || !token.includes(".")) return null

  const [payloadStr, signature] = token.split(".")
  if (!payloadStr || !signature) return null

  const expectedSignature = crypto.createHmac("sha256", SECRET_KEY).update(payloadStr).digest("base64url")
  if (signature !== expectedSignature) {
    return null
  }

  try {
    const payload = JSON.parse(Buffer.from(payloadStr, "base64url").toString("utf-8"))
    if (payload.exp && Date.now() > payload.exp) {
      return null // Expired
    }
    if (payload.email && payload.role === "admin") {
      return { email: payload.email, role: "admin" }
    }
  } catch {
    return null
  }

  return null
}

/**
 * Server-side helper to check if the current incoming request has an authenticated admin session.
 */
export async function getAuthenticatedAdmin(): Promise<AdminUser | null> {
  const { cookies } = await import("next/headers")
  const cookieStore = await cookies()
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value
  if (!token) return null
  return verifySessionToken(token)
}
