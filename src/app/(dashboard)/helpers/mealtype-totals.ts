import { FoodEntry } from "@/db/schema";

export const mealTypeTotals = (entries: FoodEntry[]) => {
  return {
    breakfast: entries
      .filter((e) => e.mealType === "breakfast")
      .reduce((sum, e) => sum + e.calories, 0),
    lunch: entries
      .filter((e) => e.mealType === "lunch")
      .reduce((sum, e) => sum + e.calories, 0),
    dinner: entries
      .filter((e) => e.mealType === "dinner")
      .reduce((sum, e) => sum + e.calories, 0),
    snack: entries
      .filter((e) => e.mealType === "snack")
      .reduce((sum, e) => sum + e.calories, 0),
  };
};
