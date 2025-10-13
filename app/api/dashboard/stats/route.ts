import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET() {
  try {
    // Get total areas
    const [totalAreasResult] = await query<{ count: number }>("SELECT COUNT(*) as count FROM area")
    const totalAreas = totalAreasResult?.count || 0

    // Get active farms
    const [activeFarmsResult] = await query<{ count: number }>(
      'SELECT COUNT(*) as count FROM area_farm WHERE status = "Active"',
    )
    const activeFarms = activeFarmsResult?.count || 0

    // Get pending approvals
    const [pendingApprovalsResult] = await query<{ count: number }>(
      'SELECT COUNT(*) as count FROM area_approval WHERE status = "Pending"',
    )
    const pendingApprovals = pendingApprovalsResult?.count || 0

    // Get total hectares
    const [totalHectaresResult] = await query<{ total: number }>("SELECT SUM(hectares) as total FROM area_farm")
    const totalHectares = totalHectaresResult?.total || 0

    return NextResponse.json({
      totalAreas,
      activeFarms,
      pendingApprovals,
      totalHectares,
    })
  } catch (error) {
    console.error("[v0] Error fetching dashboard stats:", error)
    return NextResponse.json({ error: "Failed to fetch dashboard stats" }, { status: 500 })
  }
}
