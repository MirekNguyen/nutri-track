import { MacronutrientStats } from "./macronutrient-stats/macronutrient-stats";
import { FoodLog } from "./food-log/food-log";
import { DateSelector } from "./date-selector/date-selector";
import { AddFoodEntry } from "./food-entry/add-food-entry";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { CalorieBreakdown } from "./calorie-breakdown/calorie-breakdown";

type Props = {
  selectedDate: string;
};

export const CalorieTracker = async ({ selectedDate }: Props) => {
  return (
    <>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          Dashboard
        </h1>
        <div className="flex items-center gap-2 w-full sm:w-auto justify-between">
          <DateSelector date={new Date(selectedDate)} />
          <AddFoodEntry>
            <Button className="bg-green-600 hover:bg-green-700 text-sm text-white sm:w-auto">
              <PlusCircle className="mr-2 h-4 w-4" /> Add Entry
            </Button>
          </AddFoodEntry>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
        <MacronutrientStats date={selectedDate} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <FoodLog date={selectedDate} />
        <CalorieBreakdown selectedDate={selectedDate} />
      </div>
    </>
  );
};
