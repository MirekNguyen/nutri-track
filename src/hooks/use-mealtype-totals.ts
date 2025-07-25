import { FoodEntry } from "@/db/schema";

export const useMealTypeTotals = (entries: FoodEntry[]) => {
  return {
    breakfast: entries
      .filter((entry) => entry.mealType === "breakfast")
      .reduce((sum, entry) => sum + entry.calories, 0),
    lunch: entries
      .filter((e) => e.mealType === "lunch")
      .reduce((sum, entry) => sum + entry.calories, 0),
    dinner: entries
      .filter((e) => e.mealType === "dinner")
      .reduce((sum, entry) => sum + entry.calories, 0),
    snack: entries
      .filter((e) => e.mealType === "snack")
      .reduce((sum, entry) => sum + entry.calories, 0),
  };
};
