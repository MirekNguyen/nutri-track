export type FoodEntry = {
  id: number;
  foodName: string;
  calories: number;
  mealType: string;
  amount: number;
  protein: number | null;
  carbs: number | null;
  fat: number | null;
  entryDate: string;
  entryTime: string;
};
