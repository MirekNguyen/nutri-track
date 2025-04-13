"use server"

import { db } from "@/db"
import { bodyMeasurements, type NewBodyMeasurement } from "@/db/schema"
import { eq, and, desc } from "drizzle-orm"
import { getCurrentUser } from "./user-actions"

export async function getBodyMeasurements() {
  try {
    const user = await getCurrentUser()

    const measurements = await db
      .select()
      .from(bodyMeasurements)
      .where(eq(bodyMeasurements.userId, user.id))
      .orderBy(desc(bodyMeasurements.entryDate))

    return measurements
  } catch (error) {
    console.error("Error getting body measurements:", error)
    throw new Error("Failed to get body measurements")
  }
}

export async function createBodyMeasurement(measurementData: Omit<NewBodyMeasurement, "id" | "userId" | "createdAt">) {
  try {
    const user = await getCurrentUser()

    const [measurement] = await db
      .insert(bodyMeasurements)
      .values({
        ...measurementData,
        userId: user.id,
      })
      .returning()

    return measurement
  } catch (error) {
    console.error("Error creating body measurement:", error)
    throw new Error("Failed to create body measurement")
  }
}

export async function deleteBodyMeasurement(id: number) {
  try {
    const user = await getCurrentUser()

    const [deletedMeasurement] = await db
      .delete(bodyMeasurements)
      .where(and(eq(bodyMeasurements.id, id), eq(bodyMeasurements.userId, user.id)))
      .returning()

    if (!deletedMeasurement) {
      throw new Error("Body measurement not found")
    }

    return deletedMeasurement
  } catch (error) {
    console.error("Error deleting body measurement:", error)
    throw new Error("Failed to delete body measurement")
  }
}
