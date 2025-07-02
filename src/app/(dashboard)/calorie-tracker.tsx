import { Toaster } from "@/components/ui/toaster";
import { Header } from "../components/header";
import { Sidebar } from "../components/sidebar";

import { MacronutrientStats } from "../(dashboard)/macronutrient-stats/macronutrient-stats";
import { FoodLog } from "../(dashboard)/food-log/food-log";
import { CalorieBreakdown } from "../(dashboard)/calorie-breakdown/calorie-breakdown";
import { DateSelector } from "../(dashboard)/date-selector/date-selector";
import { mealTypeTotals } from "../(dashboard)/helpers/mealtype-totals";
import { macros } from "../(dashboard)/helpers/macros";
import { FoodEntryDialogButton } from "./fodd-entry/food-entry-dialog-button";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { FoodEntry, Meal } from "@/db/schema";

type Props = {
  meals: Meal[];
  entriesData: FoodEntry[];
};

export const CalorieTracker = ({ meals, entriesData }: Props) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="flex flex-col md:flex-row flex-1">
        <Sidebar />
        <main className="flex-1 p-4 md:p-6 overflow-auto md:ml-64 transition-all duration-300">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              Dashboard
            </h1>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <DateSelector />
              <FoodEntryDialogButton>
                <Button className="bg-green-600 hover:bg-green-700 text-sm w-full sm:w-auto">
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Food Entry
                </Button>
              </FoodEntryDialogButton>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
            <MacronutrientStats
              totalCalories={entriesData.reduce(
                (sum, entry) => sum + entry.calories,
                0,
              )}
              macros={macros(entriesData)}
              nutritionGoals={{
                calorieGoal: 2000,
                proteinGoal: 150,
                carbsGoal: 200,
                fatGoal: 65,
              }}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
            <FoodLog
              entries={entriesData}
              mealTypeTotals={mealTypeTotals(entriesData)}
              meals={meals}
            />
            <CalorieBreakdown mealTypeTotals={mealTypeTotals(entriesData)} />
          </div>
        </main>
      </div>
      <Toaster />
    </div>
  );
};
