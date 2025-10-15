import { NextResponse } from "next/server"
import { query } from "@/lib/db"
import { hashPassword, createSession } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const { email, password, name, contact, user_type } = await request.json()

    // Validate required fields
    if (!email || !password || !name) {
      return NextResponse.json({ error: "Email, password, and name are required" }, { status: 400 })
    }

    // Check if user already exists
    const existingUsers = await query("SELECT user_id FROM users WHERE email = ?", [email])

    if (existingUsers.length > 0) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Insert new user
    const result = await query("INSERT INTO users (email, password, name, contact, user_type) VALUES (?, ?, ?, ?, ?)", [
      email,
      hashedPassword,
      name,
      contact || null,
      user_type || "User",
    ])

    // Create session for the new user
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
    console.error("Signup error:", error)
    return NextResponse.json({ error: "Failed to create account" }, { status: 500 })
  }
}
