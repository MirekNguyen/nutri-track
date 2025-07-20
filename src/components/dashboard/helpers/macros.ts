import { FoodEntry } from "@/db/schema";

export const macros = (entries: FoodEntry[]) => {
  return entries.reduce(
    (acc, entry) => {
      return {
        protein: acc.protein + (parseFloat(entry.protein ?? '0') || 0),
        carbs: acc.carbs + (parseFloat(entry.carbs ?? '0') || 0),
        fat: acc.fat + (parseFloat(entry.fat ?? '0') || 0),
      };
    },
    { protein: 0, carbs: 0, fat: 0 },
  );
};
