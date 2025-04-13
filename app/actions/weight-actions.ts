"use server"

import { db } from "@/db"
import { weightEntries, type NewWeightEntry } from "@/db/schema"
import { eq, and, desc } from "drizzle-orm"
import { getCurrentUser } from "./user-actions"

export async function getWeightEntries() {
  try {
    const user = await getCurrentUser()

    const entries = await db
      .select()
      .from(weightEntries)
      .where(eq(weightEntries.userId, user.id))
      .orderBy(desc(weightEntries.entryDate))

    return entries
  } catch (error) {
    console.error("Error getting weight entries:", error)
    throw new Error("Failed to get weight entries")
  }
}

export async function createWeightEntry(entryData: Omit<NewWeightEntry, "id" | "userId" | "createdAt">) {
  try {
    const user = await getCurrentUser()

    const [entry] = await db
      .insert(weightEntries)
      .values({
        ...entryData,
        userId: user.id,
      })
      .returning()

    return entry
  } catch (error) {
    console.error("Error creating weight entry:", error)
    throw new Error("Failed to create weight entry")
  }
}

export async function deleteWeightEntry(id: number) {
  try {
    const user = await getCurrentUser()

    const [deletedEntry] = await db
      .delete(weightEntries)
      .where(and(eq(weightEntries.id, id), eq(weightEntries.userId, user.id)))
      .returning()

    if (!deletedEntry) {
      throw new Error("Weight entry not found")
    }

    return deletedEntry
  } catch (error) {
    console.error("Error deleting weight entry:", error)
    throw new Error("Failed to delete weight entry")
  }
}
