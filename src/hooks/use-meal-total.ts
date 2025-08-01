import type { FoodEntry } from "@/db/schema";

const mealTypes = ["breakfast", "lunch", "dinner", "snack"] as const;

export type MealTotal = {
  mealType: typeof mealTypes[number];
  calories: number;
}

export const useMealTotal = (entries: FoodEntry[]): MealTotal[] => {
  return mealTypes.map((mealType) => {
    const calories = entries
      .filter((entry) => entry.mealType === mealType)
      .reduce((sum, entry) => sum + entry.calories, 0);

    return {
      mealType,
      calories,
    };
  });
};
