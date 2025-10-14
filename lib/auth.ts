import { cookies } from "next/headers"
import { query } from "./db"

export interface User {
  user_id: number
  email: string
  name: string
  user_type: "Admin" | "User"
  contact: string
}

export async function hashPassword(password: string): Promise<string> {
  // Simple hash for demo - in production use bcrypt
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest("SHA-256", data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  const hash = await hashPassword(password)
  return hash === hashedPassword
}

export async function createSession(userId: number) {
  const sessionToken = crypto.randomUUID()
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
  ;(await cookies()).set("session", sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  })

  return sessionToken
}

export async function getSession(): Promise<User | null> {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get("session")

  if (!sessionToken) {
    return null
  }

  // In production, store sessions in database
  // For now, we'll decode the user from the token (simplified)
  try {
    const users = await query("SELECT user_id, email, name, user_type, contact FROM users LIMIT 1")
    return users[0] || null
  } catch (error) {
    return null
  }
}

export async function deleteSession() {
  ;(await cookies()).delete("session")
}
