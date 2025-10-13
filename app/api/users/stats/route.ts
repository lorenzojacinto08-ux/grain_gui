import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET() {
  try {
    const [totalUsersResult] = await query<{ count: number }>("SELECT COUNT(*) as count FROM users")
    const totalUsers = totalUsersResult?.count || 0

    const [adminsResult] = await query<{ count: number }>(
      'SELECT COUNT(*) as count FROM users WHERE user_type = "Admin"',
    )
    const admins = adminsResult?.count || 0

    const [regularUsersResult] = await query<{ count: number }>(
      'SELECT COUNT(*) as count FROM users WHERE user_type = "User"',
    )
    const regularUsers = regularUsersResult?.count || 0

    return NextResponse.json({
      totalUsers,
      admins,
      regularUsers,
    })
  } catch (error) {
    console.error("[v0] Error fetching user stats:", error)
    return NextResponse.json({ error: "Failed to fetch user stats" }, { status: 500 })
  }
}
