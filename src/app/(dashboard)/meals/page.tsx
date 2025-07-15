import { getMeals } from "@/actions/meal-actions";
import MealsDashboard from "./meals-dashboard";

export const dynamic = "force-dynamic";

export default async function MealsPage() {
  const meals = await getMeals();
  return <MealsDashboard meals={meals} />;
}
