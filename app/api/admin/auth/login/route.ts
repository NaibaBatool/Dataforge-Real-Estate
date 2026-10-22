import { NextResponse } from "next/server"
import { verifyCredentials, createSessionToken, ADMIN_COOKIE_NAME } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Please enter both email and password." },
        { status: 400 }
      )
    }

    const isValid = verifyCredentials(email, password)
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: "Invalid administrator credentials. Access denied." },
        { status: 401 }
      )
    }

    const token = createSessionToken(email.toLowerCase().trim())
    const response = NextResponse.json({
      success: true,
      message: "Authentication successful",
      user: { email: email.toLowerCase().trim(), role: "admin" },
    })

    // Set secure HTTP-only session cookie
    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24, // 24 hours
    })

    return response
  } catch (err) {
    console.error("Login route error:", err)
    return NextResponse.json(
      { success: false, error: "An unexpected authentication error occurred." },
      { status: 500 }
    )
  }
}
