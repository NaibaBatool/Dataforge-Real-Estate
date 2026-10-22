import assert from "node:assert"
import { verifyCredentials, createSessionToken, verifySessionToken } from "../lib/auth.ts"

console.log("=== Running DataForge Estates Auth Tests ===")

// 1. Verify valid administrator credentials
assert.strictEqual(
  verifyCredentials("admin@dataforge.com", "1234dataforge"),
  true,
  "Should accept correct credentials"
)
assert.strictEqual(
  verifyCredentials("ADMIN@DATAFORGE.COM", "1234dataforge"),
  true,
  "Should be case-insensitive for email"
)

// 2. Reject invalid credentials
assert.strictEqual(
  verifyCredentials("admin@dataforge.com", "wrongpassword"),
  false,
  "Should reject incorrect password"
)
assert.strictEqual(
  verifyCredentials("intruder@example.com", "1234dataforge"),
  false,
  "Should reject unauthorized email"
)
assert.strictEqual(
  verifyCredentials("", ""),
  false,
  "Should reject empty credentials"
)
console.log("✓ Credential verification tests passed.")

// 3. Token generation & verification
const token = createSessionToken("admin@dataforge.com")
assert.ok(token && token.includes("."), "Token should be signed and formatted correctly")
const verified = verifySessionToken(token)
assert.ok(verified, "Token should verify successfully")
assert.strictEqual(verified?.email, "admin@dataforge.com")
assert.strictEqual(verified?.role, "admin")

// Tampered token test
const tamperedToken = token + "xyz"
assert.strictEqual(verifySessionToken(tamperedToken), null, "Tampered token should be rejected")
console.log("✓ Session token security and signature tests passed.")

console.log("=== ALL AUTH TESTS PASSED SUCCESSFULLY! ===")
