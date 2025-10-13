import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const { status } = await request.json()
    const approvalId = params.id

    if (!["Approved", "Rejected"].includes(status)) {
      return NextResponse.json({ error: 'Invalid status. Must be "Approved" or "Rejected"' }, { status: 400 })
    }

    await query("UPDATE area_approval SET status = ?, updated_at = NOW() WHERE approval_id = ?", [status, approvalId])

    return NextResponse.json({ success: true, status })
  } catch (error) {
    console.error("[v0] Error updating approval:", error)
    return NextResponse.json({ error: "Failed to update approval" }, { status: 500 })
  }
}
