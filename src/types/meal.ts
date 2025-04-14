export interface Meal {
  id: number;
  name: string;
  unit: string;
  description?: string | null;
  calories: number;
  protein: number | null;
  carbs: number | null;
  fat: number | null;
  tags: string[] | null;
  isFavorite: boolean;
}
