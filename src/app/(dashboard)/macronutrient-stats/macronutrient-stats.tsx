import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Info } from "lucide-react";

type Props = {
  macros: {
    protein: number;
    carbs: number;
    fat: number;
  };
  nutritionGoals: {
    calorieGoal: number;
    proteinGoal: number | null | undefined;
    carbsGoal: number | null | undefined;
    fatGoal?: number | null | undefined;
  };
  totalCalories: number;
};

export const MacronutrientStats = ({
  nutritionGoals,
  totalCalories,
  macros,
}: Props) => {
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

      <Card
        className="border-l-4 border-blue-600 shadow-sm hover:shadow-md transition-shadow"
      >
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">
            Protein
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl md:text-3xl font-bold text-blue-600">
              {macros.protein}g
            </div>
            <div className="text-sm text-gray-500">
              / {nutritionGoals.proteinGoal}g
            </div>
          </div>
          <div className="mt-2 h-2 w-full bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500"
              style={{
                width: `${Math.min(100, (macros.protein / (nutritionGoals.proteinGoal || 1)) * 100)}%`,
              }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2 flex items-center">
            <span className="inline-block w-2 h-2 bg-blue-600 rounded-full mr-1"></span>
            Important for muscle recovery
          </p>
        </CardContent>
      </Card>

      <Card
        className="border-l-4 border-purple-600 shadow-sm hover:shadow-md transition-shadow"
      >
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">
            Carbs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl md:text-3xl font-bold text-purple-600">
              {macros.carbs}g
            </div>
            <div className="text-sm text-gray-500">
              / {nutritionGoals.carbsGoal}g
            </div>
          </div>
          <div className="mt-2 h-2 w-full bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-purple-500"
              style={{
                width: `${Math.min(100, (macros.carbs / (nutritionGoals.carbsGoal || 1)) * 100)}%`,
              }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {Math.round((macros.carbs / (nutritionGoals.carbsGoal || 1)) * 100)}
            % of daily goal
          </p>
        </CardContent>
      </Card>

      <Card
        className="border-l-4 border-yellow-600 shadow-sm hover:shadow-md transition-shadow"
      >
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">
            Fats
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl md:text-3xl font-bold text-yellow-600">
              {macros.fat}g
            </div>
            <div className="text-sm text-gray-500">
              / {nutritionGoals.fatGoal}g
            </div>
          </div>
          <div className="mt-2 h-2 w-full bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-yellow-500"
              style={{
                width: `${Math.min(100, (macros.fat / (nutritionGoals.fatGoal || 1)) * 100)}%`,
              }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {Math.round((macros.fat / (nutritionGoals.fatGoal || 1)) * 100)}% of
            daily goal
          </p>
        </CardContent>
      </Card>
    </>
  );
};
