
import { CalorieBreakdown } from "@/components/dashboard/calorie-breakdown/calorie-breakdown";
import { CalorieTracker } from "@/components/dashboard/calorie-tracker";
import { FoodLog } from "@/components/dashboard/food-log/food-log";
import { MacronutrientStats } from "@/components/dashboard/macronutrient-stats/macronutrient-stats";
import { format } from "date-fns";

type Props = {
  searchParams: Promise<{ date?: string }>;
};
export default async function CalorieTrackerPage({ searchParams }: Props) {
  const date = (await searchParams).date ?? new Date();
  const selectedDate = format(date ?? new Date(), "yyyy-MM-dd");

  return (
    <CalorieTracker selectedDate={selectedDate}>
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-6 mb-6">
        <MacronutrientStats date={selectedDate} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <FoodLog date={selectedDate} />
        <CalorieBreakdown selectedDate={selectedDate} />
      </div>
    </CalorieTracker>
  );
}
