import { CalorieTracker } from "./(dashboard)/calorie-tracker";
import { getMeals } from "./actions/meal-actions";
import { getFoodEntries } from "./actions/food-entry-actions";
import { format } from "date-fns";

type Props = {
  searchParams: Promise<{ date?: string }>;
}
export default async function CalorieTrackerPage({searchParams}: Props) {
  const date = (await searchParams).date ?? new Date();
  const selectedDate = format(date ?? new Date(), "yyyy-MM-dd");
  const mealsData = await getMeals();
  const entriesData = await getFoodEntries(selectedDate);

{/*   <div className="flex items-center justify-center h-64"> */}
{/*   <Loader2 className="h-8 w-8 animate-spin text-green-600" /> */}
{/*   <span className="ml-2 text-lg text-gray-600">Loading...</span> */}
{/* </div> */}

  return <CalorieTracker meals={mealsData} entriesData={entriesData} selectedDate={selectedDate} />;
}
