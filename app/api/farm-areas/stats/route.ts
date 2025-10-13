import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET() {
  try {
    const [totalAreasResult] = await query<{ count: number }>("SELECT COUNT(*) as count FROM area")
    const totalAreas = totalAreasResult?.count || 0

    const [pendingApprovalsResult] = await query<{ count: number }>(
      'SELECT COUNT(*) as count FROM area_approval WHERE status = "Pending"',
    )
    const pendingApprovals = pendingApprovalsResult?.count || 0

    const [avgSlopeResult] = await query<{ avg: number }>("SELECT AVG(slope) as avg FROM area_topography")
    const avgSlope = avgSlopeResult?.avg || 0

    const [avgElevationResult] = await query<{ avg: number }>("SELECT AVG(masl) as avg FROM area_topography")
    const avgElevation = avgElevationResult?.avg || 0

    return NextResponse.json({
      totalAreas,
      pendingApprovals,
      avgSlope: Math.round(avgSlope * 10) / 10,
      avgElevation: Math.round(avgElevation),
    })
  } catch (error) {
    console.error("[v0] Error fetching farm area stats:", error)
    return NextResponse.json({ error: "Failed to fetch farm area stats" }, { status: 500 })
  }
}
