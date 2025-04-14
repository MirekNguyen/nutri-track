"use server"

import { db } from "@/db"
import { users } from "@/db/schema"
import { auth } from "@clerk/nextjs/server"
import { eq } from "drizzle-orm"

// For demo purposes, we'll use a fixed user ID
// In a real app, you would get this from authentication
export async function getCurrentUser() {
  try {
    // Use db.select instead of db.query for type safety
    const result = await db.select().from(users).limit(1)
    const clerkUser = await auth();
    console.log("Clerk user:", clerkUser.userId);
    const user = result[0]

    if (!user) {
      throw new Error("User not found")
    }

    return user
  } catch (error) {
    console.error("Error getting current user:", error)
    throw new Error("Failed to get current user")
  }
}

export async function getUserById(id: number) {
  try {
    const result = await db.select().from(users).where(eq(users.id, id))
    const user = result[0]

    if (!user) {
      throw new Error("User not found")
    }

    return user
  } catch (error) {
    console.error("Error getting user:", error)
    throw new Error("Failed to get user")
  }
}
