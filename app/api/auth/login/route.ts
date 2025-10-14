import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"
import { createSession, verifyPassword } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Get user from database
    const users = await query("SELECT * FROM users WHERE email = ?", [email])

    if (users.length === 0) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const user = users[0]

    // Verify password
    const isValid = await verifyPassword(password, user.password)

    if (!isValid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Create session
    await createSession(user.user_id)

    return NextResponse.json({
      user: {
        user_id: user.user_id,
        email: user.email,
        name: user.name,
        user_type: user.user_type,
        contact: user.contact,
      },
    })
  } catch (error) {
    console.error("[v0] Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
