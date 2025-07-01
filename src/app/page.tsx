"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";

import { toast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { useMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

import { Header } from "./components/header";
import { Sidebar } from "./components/sidebar";

import { getMeals } from "./actions/meal-actions";
import { getFoodEntries, deleteFoodEntry } from "./actions/food-entry-actions";

import { MacronutrientStats } from "./(dashboard)/macronutrient-stats/macronutrient-stats";
import { FoodLog } from "./(dashboard)/food-log/food-log";
import { Meal } from "@/types/meal";
import { CalorieBreakdown } from "./(dashboard)/calorie-breakdown/calorie-breakdown";
import { FoodEntry } from "@/types/food-entry";
import { DateSelector } from "./(dashboard)/date-selector/date-selector";
import { mealTypeTotals } from "./(dashboard)/helpers/mealtype-totals";
import { macros } from "./(dashboard)/helpers/macros";
import { FoodEntryComponent } from "./(dashboard)/fodd-entry/food-entry";

export default function CalorieTracker() {
  const [foodEntryDialogOpen, setFoodEntryDialogOpen] = useState(false);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [entries, setEntries] = useState<FoodEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [newMealType, setNewMealType] = useState<string>("breakfast");

  // Load data from the database
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        // Load meals
        const mealsData = await getMeals();
        setMeals(mealsData);

        // Load food entries for the selected date
        await loadFoodEntries();
      } catch (error) {
        console.error("Error loading data:", error);
        toast({
          title: "Error",
          description: "Failed to load data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  // Load food entries when the selected date changes
  useEffect(() => {
    loadFoodEntries();
  }, [selectedDate]);

  async function loadFoodEntries() {
    try {
      console.log(
        "Loading food entries for date:",
        format(selectedDate, "yyyy-MM-dd"),
      );
      const entriesData = await getFoodEntries(
        format(selectedDate, "yyyy-MM-dd"),
      );
      setEntries(entriesData);
    } catch (error) {
      console.error("Error loading food entries:", error);
      toast({
        title: "Error",
        description: "Failed to load food entries. Please try again.",
        variant: "destructive",
      });
    }
  }

  // Update the resetNewMealForm function to reset the unit field
  const handleDeleteEntry = async (id: number) => {
    try {
      await deleteFoodEntry(id);

      // Refresh the entries list
      await loadFoodEntries();

      toast({
        title: "Success",
        description: "Food entry deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting food entry:", error);
      toast({
        title: "Error",
        description: "Failed to delete food entry. Please try again.",
        variant: "destructive",
      });
    }
  };

  const openAddFoodDialog = (mealType?: string) => {
    if (mealType) {
      setNewMealType(mealType);
    }
    setFoodEntryDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="flex flex-col md:flex-row flex-1">
        <Sidebar />
        <main
          className={cn(
            "flex-1 p-4 md:p-6 overflow-auto",
            "md:ml-64",
            "transition-all duration-300",
          )}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              Dashboard
            </h1>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <DateSelector
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
              />

              <FoodEntryComponent
                meals={meals}
                setMeals={setMeals}
                loadFoodEntries={loadFoodEntries}
                newMealType={newMealType}
                setNewMealType={setNewMealType}
                foodEntryDialogOpen={foodEntryDialogOpen}
                setFoodEntryDialogOpen={setFoodEntryDialogOpen}
              />
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-green-600" />
              <span className="ml-2 text-lg text-gray-600">Loading...</span>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
                <MacronutrientStats
                  totalCalories={entries.reduce(
                    (sum, entry) => sum + entry.calories,
                    0,
                  )}
                  macros={macros(entries)}
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
                  entries={entries}
                  handleDeleteEntry={handleDeleteEntry}
                  mealTypeTotals={mealTypeTotals(entries)}
                  openAddFoodDialog={openAddFoodDialog}
                  meals={meals}
                />
                <CalorieBreakdown mealTypeTotals={mealTypeTotals(entries)} />
              </div>
            </>
          )}
        </main>
      </div>
      <Toaster />
    </div>
  );
}
