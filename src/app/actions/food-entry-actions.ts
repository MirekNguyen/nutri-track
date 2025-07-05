"use server"

import { db } from "@/db"
import { foodEntries, FoodEntry, type NewFoodEntry } from "@/db/schema"
import { eq, and, desc } from "drizzle-orm"
import { getCurrentUser } from "./user-actions"
import { revalidatePath } from "next/cache"

export async function getFoodEntries(formattedDate: string): Promise<FoodEntry[]> {
  try {
    const user = await getCurrentUser()

    const entries = await db
      .select()
      .from(foodEntries)
      .where(and(eq(foodEntries.userId, user.id), eq(foodEntries.entryDate, formattedDate)))
      .orderBy(desc(foodEntries.entryTime))
    return entries;

  } catch {
    throw new Error("Failed to get food entries")
  }
}

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

    revalidatePath("/")
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

    revalidatePath("/")
    return deletedEntry
  } catch (error) {
    console.error("Error deleting food entry:", error)
    throw new Error("Failed to delete food entry")
  }
}
