import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET() {
  try {
    const [totalRequestsResult] = await query<{ count: number }>("SELECT COUNT(*) as count FROM area_approval")
    const totalRequests = totalRequestsResult?.count || 0

    const [pendingResult] = await query<{ count: number }>(
      'SELECT COUNT(*) as count FROM area_approval WHERE status = "Pending"',
    )
    const pending = pendingResult?.count || 0

    const [approvedResult] = await query<{ count: number }>(
      'SELECT COUNT(*) as count FROM area_approval WHERE status = "Approved"',
    )
    const approved = approvedResult?.count || 0

    const [rejectedResult] = await query<{ count: number }>(
      'SELECT COUNT(*) as count FROM area_approval WHERE status = "Rejected"',
    )
    const rejected = rejectedResult?.count || 0

    return NextResponse.json({
      totalRequests,
      pending,
      approved,
      rejected,
    })
  } catch (error) {
    console.error("[v0] Error fetching approval stats:", error)
    return NextResponse.json({ error: "Failed to fetch approval stats" }, { status: 500 })
  }
}
