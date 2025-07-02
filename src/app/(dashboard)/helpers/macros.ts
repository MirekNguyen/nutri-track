import { FoodEntry } from "@/db/schema";

export const macros = (entries: FoodEntry[]) => {
  return entries.reduce(
    (acc, entry) => {
      return {
        protein: acc.protein + (entry.protein || 0),
        carbs: acc.carbs + (entry.carbs || 0),
        fat: acc.fat + (entry.fat || 0),
      };
    },
    { protein: 0, carbs: 0, fat: 0 },
  );
};
