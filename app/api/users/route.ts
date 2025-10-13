import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET() {
  try {
    const users = await query(`
      SELECT 
        user_id,
        name,
        email,
        contact,
        user_type,
        created_at
      FROM users
      ORDER BY created_at DESC
    `)

    return NextResponse.json(users)
  } catch (error) {
    console.error("[v0] Error fetching users:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}
