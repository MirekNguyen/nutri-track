"use server";

import { and, eq, gte, lte } from "drizzle-orm";
import { db } from "@/db";
import { mealPlans, type NewMealPlan } from "@/db/schema";
import { getCurrentUser } from "./user-actions";

export async function getMealPlans(startDate: Date, endDate: Date) {
  try {
    const user = await getCurrentUser();

    const start = startDate.toISOString().slice(0, 10);
    const end = endDate.toISOString().slice(0, 10);
    const plans = await db
      .select()
      .from(mealPlans)
      .where(
        and(
          eq(mealPlans.userId, user.id),
          and(gte(mealPlans.planDate, start), lte(mealPlans.planDate, end)),
        ),
      )
      .orderBy(mealPlans.planDate, mealPlans.mealType);

    return plans;
  } catch (error) {
    console.error("Error getting meal plans:", error);
    throw new Error("Failed to get meal plans");
  }
}

export async function createMealPlan(
  planData: Omit<NewMealPlan, "id" | "userId" | "createdAt">,
) {
  try {
    const user = await getCurrentUser();

    const [plan] = await db
      .insert(mealPlans)
      .values({
        ...planData,
        userId: user.id,
      })
      .returning();

    return plan;
  } catch (error) {
    console.error("Error creating meal plan:", error);
    throw new Error("Failed to create meal plan");
  }
}

export async function deleteMealPlan(id: number) {
  try {
    const user = await getCurrentUser();

    const [deletedPlan] = await db
      .delete(mealPlans)
      .where(and(eq(mealPlans.id, id), eq(mealPlans.userId, user.id)))
      .returning();

    if (!deletedPlan) {
      throw new Error("Meal plan not found");
    }

    return deletedPlan;
  } catch (error) {
    console.error("Error deleting meal plan:", error);
    throw new Error("Failed to delete meal plan");
  }
}
