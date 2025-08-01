import type { FoodEntry } from "@/db/schema";

export const useMacros = (entries: FoodEntry[]) => {
  return entries.reduce(
    (acc, entry) => {
      return {
        protein: acc.protein + entry.protein,
        carbs: acc.carbs + entry.carbs,
        fat: acc.fat + entry.fat,
      };
    },
    { protein: 0, carbs: 0, fat: 0 },
  );
};
