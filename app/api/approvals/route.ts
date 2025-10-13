import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET() {
  try {
    const approvals = await query(`
      SELECT 
        aa.approval_id,
        aa.area_id,
        a.area_name,
        a.region,
        a.province,
        a.organization,
        aa.status,
        aa.created_at,
        aa.updated_at
      FROM area_approval aa
      JOIN area a ON aa.area_id = a.area_id
      ORDER BY aa.created_at DESC
    `)

    return NextResponse.json(approvals)
  } catch (error) {
    console.error("[v0] Error fetching approvals:", error)
    return NextResponse.json({ error: "Failed to fetch approvals" }, { status: 500 })
  }
}
