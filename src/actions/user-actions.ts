"use server";

import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { type User, users, weightEntries } from "@/db/schema";

export async function getCurrentUser(): Promise<User> {
  try {
    // const clerkUser = await auth();
    const result = await db.select().from(users).limit(1);
    const user = result[0];

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  } catch (error) {
    console.error("Error getting current user:", error);
    throw new Error("Failed to get current user");
  }
}

export async function getUserById(id: number) {
  try {
    const result = await db.select().from(users).where(eq(users.id, id));
    const user = result[0];

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  } catch (error) {
    console.error("Error getting user:", error);
    throw new Error("Failed to get user");
  }
}

export const getUserData = async () => {
  try {
    const user = await db.query.users.findFirst({
      with: {
        weightEntries: {
          orderBy: desc(weightEntries.entryDate),
        },
      },
    });
    if (!user) {
      throw new Error("User not found");
    }
    const weight = parseFloat(user?.weightEntries[0]?.weight ?? "0");
    const height = user?.height || 0;
    const age = user?.age || 0;
    const bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    const tdee = bmr * 1.5;
    const proteinGoal = 1.8 * weight;
    const calorieGoal = tdee - 500;
    const carbsGoal = (calorieGoal * 0.35) / 4;
    const fatsGoal = (calorieGoal * 0.35) / 9;
    return {
      weight,
      bmr,
      tdee,
      calorieGoal,
      proteinGoal,
      carbsGoal,
      fatsGoal,
      user,
    };
  } catch (error) {
    console.error("Error getting user data:", error);
  }
};
