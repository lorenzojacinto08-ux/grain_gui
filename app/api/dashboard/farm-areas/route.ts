import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET() {
  try {
    const farmAreas = await query(`
      SELECT 
        a.area_id,
        a.area_name,
        a.region,
        a.province,
        a.organization,
        at.slope,
        at.masl as elevation,
        af.status,
        aa.status as approval_status,
        a.created_at
      FROM area a
      LEFT JOIN area_topography at ON a.area_id = at.area_id
      LEFT JOIN area_farm af ON a.area_id = af.area_id
      LEFT JOIN area_approval aa ON a.area_id = aa.area_id
      ORDER BY a.created_at DESC
      LIMIT 10
    `)

    return NextResponse.json(farmAreas)
  } catch (error) {
    console.error("[v0] Error fetching farm areas:", error)
    return NextResponse.json({ error: "Failed to fetch farm areas" }, { status: 500 })
  }
}
