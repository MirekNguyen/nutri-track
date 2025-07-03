"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Info } from "lucide-react";
import { macros } from "../helpers/macros";
import { FoodEntry } from "@/db/schema";

type Props = {
  entriesData: FoodEntry[];
};

export const MacronutrientStats = ({ entriesData }: Props) => {
  const totalCalories= entriesData.reduce(
    (sum, entry) => sum + parseFloat(entry.calories),
    0,
  )
  const macrosData = macros(entriesData);
  const mappedMacros = {
    protein: parseFloat(macrosData.protein),
    carbs: parseFloat(macrosData.carbs),
    fat: macrosData.fat,
  }

  const nutritionGoals = {
    calorieGoal: 2000,
    proteinGoal: 150,
    carbsGoal: 200,
    fatGoal: 65,
  };
  return (
    <>
      <Card
        className={cn(
          "shadow-sm hover:shadow-md transition-shadow",
          totalCalories > nutritionGoals.calorieGoal
            ? "border-red-300"
            : "border-green-300",
        )}
      >
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500 flex items-center justify-between">
            Calories
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-gray-400"
            >
              <Info size={14} />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl md:text-3xl font-bold text-green-600">
              {totalCalories}
            </div>
            <div className="text-sm text-gray-500">
              / {nutritionGoals.calorieGoal}
            </div>
          </div>
          <div className="mt-2 h-2 w-full bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full ${totalCalories > nutritionGoals.calorieGoal ? "bg-red-500" : "bg-green-500"}`}
              style={{
                width: `${Math.min(100, (totalCalories / nutritionGoals.calorieGoal) * 100)}%`,
              }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {Math.round((totalCalories / nutritionGoals.calorieGoal) * 100)}% of
            daily goal
          </p>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-blue-600 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">
            Protein
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl md:text-3xl font-bold text-blue-600">
              {mappedMacros.protein.toFixed(0)}g
            </div>
            <div className="text-sm text-gray-500">
              / {nutritionGoals.proteinGoal}g
            </div>
          </div>
          <div className="mt-2 h-2 w-full bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500"
              style={{
                width: `${Math.min(100, (mappedMacros.protein / (nutritionGoals.proteinGoal || 1)) * 100)}%`,
              }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2 flex items-center">
            <span className="inline-block w-2 h-2 bg-blue-600 rounded-full mr-1"></span>
            Important for muscle recovery
          </p>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-purple-600 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">
            Carbs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl md:text-3xl font-bold text-purple-600">
              {mappedMacros.carbs.toFixed(0)}g
            </div>
            <div className="text-sm text-gray-500">
              / {nutritionGoals.carbsGoal}g
            </div>
          </div>
          <div className="mt-2 h-2 w-full bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-purple-500"
              style={{
                width: `${Math.min(100, (mappedMacros.carbs / (nutritionGoals.carbsGoal || 1)) * 100)}%`,
              }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {Math.round((mappedMacros.carbs / (nutritionGoals.carbsGoal || 1)) * 100)}
            % of daily goal
          </p>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-yellow-600 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">
            Fats
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl md:text-3xl font-bold text-yellow-600">
              {mappedMacros.fat}g
            </div>
            <div className="text-sm text-gray-500">
              / {nutritionGoals.fatGoal}g
            </div>
          </div>
          <div className="mt-2 h-2 w-full bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-yellow-500"
              style={{
                width: `${Math.min(100, (mappedMacros.fat / (nutritionGoals.fatGoal || 1)) * 100)}%`,
              }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {Math.round((mappedMacros.fat / (nutritionGoals.fatGoal || 1)) * 100)}% of
            daily goal
          </p>
        </CardContent>
      </Card>
    </>
  );
};
