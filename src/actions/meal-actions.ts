"use server";

import { db } from "@/db";
import { meals, type NewMeal } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { getCurrentUser } from "./user-actions";
import { revalidatePath } from "next/cache";

export const getMeals = async () => {
  try {
    const user = await getCurrentUser();

    const userMeals = await getMealsHelper(user.id);

    return userMeals;
  } catch (error) {
    console.error("Error getting meals:", error);
    throw new Error("Failed to get meals");
  }
};
const getMealsHelper = async (userId: number) => {
  try {
    const userMeals = await db
      .select()
      .from(meals)
      .where(eq(meals.userId, userId))
      .orderBy(desc(meals.createdAt));

    return userMeals;
  } catch (error) {
    console.error("Error getting meals:", error);
    throw new Error("Failed to get meals");
  }
};

export async function getMealById(id: number) {
  try {
    const user = await getCurrentUser();

    const result = await db
      .select()
      .from(meals)
      .where(and(eq(meals.id, id), eq(meals.userId, user.id)))
      .limit(1);

    const meal = result[0];

    if (!meal) {
      throw new Error("Meal not found");
    }

    return meal;
  } catch (error) {
    console.error("Error getting meal:", error);
    throw new Error("Failed to get meal");
  }
}

// Update the createMeal function to include the unit field
export async function createMeal(
  mealData: Omit<NewMeal, "id" | "userId" | "createdAt">,
) {
  try {
    const user = await getCurrentUser();

    const [meal] = await db
      .insert(meals)
      .values({
        ...mealData,
        userId: user.id,
      })
      .returning();
    revalidatePath("/");
    revalidatePath("/meals");
    return meal;
  } catch (error) {
    console.error("Error creating meal:", error);
    throw new Error("Failed to create meal");
  }
}

// Update the updateMeal function to handle the unit field
export async function updateMeal(
  id: number,
  mealData: Partial<Omit<NewMeal, "id" | "userId" | "createdAt">>,
) {
  try {
    const user = await getCurrentUser();

    const [updatedMeal] = await db
      .update(meals)
      .set(mealData)
      .where(and(eq(meals.id, id), eq(meals.userId, user.id)))
      .returning();

    if (!updatedMeal) {
      throw new Error("Meal not found");
    }
    revalidatePath("/");
    revalidatePath("/meals");

    return updatedMeal;
  } catch (error) {
    console.error("Error updating meal:", error);
    throw new Error("Failed to update meal");
  }
}

export async function toggleFavoriteMeal(id: number) {
  try {
    const meal = await getMealById(id);

    const [updatedMeal] = await db
      .update(meals)
      .set({ isFavorite: !meal.isFavorite })
      .where(eq(meals.id, id))
      .returning();

    return updatedMeal;
  } catch (error) {
    console.error("Error toggling favorite meal:", error);
    throw new Error("Failed to toggle favorite meal");
  }
}

export async function deleteMeal(id: number) {
  try {
    const user = await getCurrentUser();

    const [deletedMeal] = await db
      .delete(meals)
      .where(and(eq(meals.id, id), eq(meals.userId, user.id)))
      .returning();

    if (!deletedMeal) {
      throw new Error("Meal not found");
    }

    return deletedMeal;
  } catch (error) {
    console.error("Error deleting meal:", error);
    throw new Error("Failed to delete meal");
  }
}
