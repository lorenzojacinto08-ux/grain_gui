import { NextResponse } from "next/server"
import { query } from "@/lib/db"
import { hashPassword, createSession } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const { email, password, name, contact, user_type } = await request.json()

    console.log("[v0] Signup attempt:", { email, name, user_type, hasContact: !!contact })

    // Validate required fields
    if (!email || !password || !name) {
      console.log("[v0] Validation failed: missing required fields")
      return NextResponse.json({ error: "Email, password, and name are required" }, { status: 400 })
    }

    // Check if user already exists
    console.log("[v0] Checking for existing user...")
    const existingUsers = await query("SELECT user_id FROM users WHERE email = ?", [email])

    if (existingUsers.length > 0) {
      console.log("[v0] User already exists")
      return NextResponse.json({ error: "Email already registered" }, { status: 400 })
    }

    // Hash password
    console.log("[v0] Hashing password...")
    const hashedPassword = await hashPassword(password)

    // Insert new user
    console.log("[v0] Inserting new user into database...")
    const result = await query("INSERT INTO users (email, password, name, contact, user_type) VALUES (?, ?, ?, ?, ?)", [
      email,
      hashedPassword,
      name,
      contact || null,
      user_type || "User",
    ])

    console.log("[v0] User created successfully:", result.insertId)

    // Create session for the new user
    console.log("[v0] Creating session...")
    await createSession(result.insertId)

    return NextResponse.json({
      success: true,
      user: {
        user_id: result.insertId,
        email,
        name,
        user_type: user_type || "User",
      },
    })
  } catch (error) {
    console.error("[v0] Signup error details:", error)
    console.error("[v0] Error message:", error instanceof Error ? error.message : "Unknown error")
    console.error("[v0] Error stack:", error instanceof Error ? error.stack : "No stack trace")
    return NextResponse.json(
      { error: "Failed to create account", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
