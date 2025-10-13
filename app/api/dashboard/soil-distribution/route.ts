import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET() {
  try {
    const soilData = await query<{ soil_type: string; count: number }>(`
      SELECT 
        soil_type,
        COUNT(*) as count
      FROM area_farm
      WHERE soil_type IS NOT NULL
      GROUP BY soil_type
    `)

    return NextResponse.json(soilData)
  } catch (error) {
    console.error("[v0] Error fetching soil distribution:", error)
    return NextResponse.json({ error: "Failed to fetch soil distribution" }, { status: 500 })
  }
}
