import { CalorieTracker } from "./(dashboard)/calorie-tracker";
import { getMeals } from "./actions/meal-actions";
import { getFoodEntries } from "./actions/food-entry-actions";
import { format } from "date-fns";

export default async function CalorieTrackerPage({searchParams}) {
  const date = (await searchParams).date;
  const mealsData = await getMeals();
  const entriesData = await getFoodEntries(
    format(date ?? new Date(), "yyyy-MM-dd"),
  );

{/*   <div className="flex items-center justify-center h-64"> */}
{/*   <Loader2 className="h-8 w-8 animate-spin text-green-600" /> */}
{/*   <span className="ml-2 text-lg text-gray-600">Loading...</span> */}
{/* </div> */}
  return <CalorieTracker meals={mealsData} entriesData={entriesData} />;
}
