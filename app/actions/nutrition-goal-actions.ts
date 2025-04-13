"use server"

import { db } from "@/db"
import { nutritionGoals, type NewNutritionGoal } from "@/db/schema"
import { eq } from "drizzle-orm"
import { getCurrentUser } from "./user-actions"

export async function getNutritionGoals() {
  try {
    const user = await getCurrentUser()

    const result = await db.select().from(nutritionGoals).where(eq(nutritionGoals.userId, user.id)).limit(1)

    const goals = result[0]

    if (!goals) {
      // Create default goals if none exist
      return createNutritionGoals({
        calorieGoal: 2000,
        proteinGoal: 150,
        carbsGoal: 200,
        fatGoal: 65,
      })
    }

    return goals
  } catch (error) {
    console.error("Error getting nutrition goals:", error)
    throw new Error("Failed to get nutrition goals")
  }
}

export async function createNutritionGoals(
  goalsData: Omit<NewNutritionGoal, "id" | "userId" | "createdAt" | "updatedAt">,
) {
  try {
    const user = await getCurrentUser()

    // Check if goals already exist
    const existingGoalsResult = await db
      .select()
      .from(nutritionGoals)
      .where(eq(nutritionGoals.userId, user.id))
      .limit(1)

    const existingGoals = existingGoalsResult[0]

    if (existingGoals) {
      // Update existing goals
      return updateNutritionGoals(goalsData)
    }

    // Create new goals
    const [goals] = await db
      .insert(nutritionGoals)
      .values({
        ...goalsData,
        userId: user.id,
      })
      .returning()

    return goals
  } catch (error) {
    console.error("Error creating nutrition goals:", error)
    throw new Error("Failed to create nutrition goals")
  }
}

export async function updateNutritionGoals(
  goalsData: Partial<Omit<NewNutritionGoal, "id" | "userId" | "createdAt" | "updatedAt">>,
) {
  try {
    const user = await getCurrentUser()

    const [updatedGoals] = await db
      .update(nutritionGoals)
      .set({
        ...goalsData,
        updatedAt: new Date(),
      })
      .where(eq(nutritionGoals.userId, user.id))
      .returning()

    if (!updatedGoals) {
      throw new Error("Nutrition goals not found")
    }

    return updatedGoals
  } catch (error) {
    console.error("Error updating nutrition goals:", error)
    throw new Error("Failed to update nutrition goals")
  }
}
