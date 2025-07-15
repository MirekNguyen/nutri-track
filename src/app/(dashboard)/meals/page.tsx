import { getMeals } from "@/actions/meal-actions";
import MealsDashboard from "./meals-dashboard";

export default async function MealsPage() {
  const meals = await getMeals();
  return <MealsDashboard meals={meals} />;
}
