"use server"

import { db } from "@/db"
import { foodEntries, type NewFoodEntry } from "@/db/schema"
import { eq, and, desc } from "drizzle-orm"
import { getCurrentUser } from "./user-actions"

export async function getFoodEntries(date: Date) {
  try {
    const user = await getCurrentUser()

    // Format date to YYYY-MM-DD for comparison
    const formattedDate = date.toISOString().split("T")[0]

    // Use tagged template literal for raw SQL
    const entries = await db
      .select()
      .from(foodEntries)
      .where(and(eq(foodEntries.userId, user.id), eq(foodEntries.entryDate, formattedDate)))
      .orderBy(desc(foodEntries.entryTime))

    return entries.map(entry => ({
      ...entry,
      carbs: entry.carbs ? parseFloat(entry.carbs.toString()) : null,
      protein: entry.protein ? parseFloat(entry.protein.toString()) : null,
      fat: entry.fat ? parseFloat(entry.fat.toString()) : null,
      calories: entry.calories ? parseFloat(entry.calories.toString()) : null,
    }))
  } catch (error) {
    console.error("Error getting food entries:", error)
    throw new Error("Failed to get food entries")
  }
}

// Update the createFoodEntry function to include the amount field
export async function createFoodEntry(entryData: Omit<NewFoodEntry, "id" | "userId" | "createdAt">) {
  try {
    const user = await getCurrentUser()

    const [entry] = await db
      .insert(foodEntries)
      .values({
        ...entryData,
        userId: user.id,
      })
      .returning()

    return entry
  } catch (error) {
    console.error("Error creating food entry:", error)
    throw new Error("Failed to create food entry")
  }
}

export async function deleteFoodEntry(id: number) {
  try {
    const user = await getCurrentUser()

    const [deletedEntry] = await db
      .delete(foodEntries)
      .where(and(eq(foodEntries.id, id), eq(foodEntries.userId, user.id)))
      .returning()

    if (!deletedEntry) {
      throw new Error("Food entry not found")
    }

    return deletedEntry
  } catch (error) {
    console.error("Error deleting food entry:", error)
    throw new Error("Failed to delete food entry")
  }
}
