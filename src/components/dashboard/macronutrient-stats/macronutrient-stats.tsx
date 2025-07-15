import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Info } from "lucide-react";
import { macros } from "../helpers/macros";
import { getFoodEntries } from "@/actions/food-entry-actions";

type Props = {
  date: string;
};

export const MacronutrientStats = async ({ date }: Props) => {
  const entries = await getFoodEntries(date);
  const totalCalories = entries.reduce(
    (sum, entry) => sum + parseFloat(entry.calories),
    0,
  );
  const macrosData = macros(entries);

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
          "border-l-4 shadow-sm hover:shadow-md transition-shadow",
          "bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950/20 dark:to-green-900/10",
          totalCalories > nutritionGoals.calorieGoal
            ? "border-red-300"
            : "border-green-300 dark:border-green-700",
        )}
      >
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-foreground flex items-center justify-between">
            Calories
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-muted-foreground"
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
            <div className="text-sm text-muted-foreground">
              / {nutritionGoals.calorieGoal}
            </div>
          </div>
          <div className="mt-2 h-2 w-full bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full ${totalCalories > nutritionGoals.calorieGoal ? "bg-red-500" : "bg-green-500"}`}
              style={{
                width: `${Math.min(100, (totalCalories / nutritionGoals.calorieGoal) * 100)}%`,
              }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {Math.round((totalCalories / nutritionGoals.calorieGoal) * 100)}% of
            daily goal
          </p>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-blue-600 dark:border-blue-400 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-foreground">
            Protein
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-400">
              {macrosData.protein.toFixed(0)}g
            </div>
            <div className="text-sm text-muted-foreground">
              / {nutritionGoals.proteinGoal}g
            </div>
          </div>
          <div className="mt-2 h-2 w-full bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500"
              style={{
                width: `${Math.min(100, (macrosData.protein / (nutritionGoals.proteinGoal || 1)) * 100)}%`,
              }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2 flex items-center">
            <span className="inline-block w-2 h-2 bg-blue-600 rounded-full mr-1"></span>
            Important for muscle recovery
          </p>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-purple-600 dark:border-purple-400 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-foreground">
            Carbs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl md:text-3xl font-bold text-purple-600 dark:text-purple-400">
              {macrosData.carbs.toFixed(0)}g
            </div>
            <div className="text-sm text-muted-foreground">
              / {nutritionGoals.carbsGoal}g
            </div>
          </div>
          <div className="mt-2 h-2 w-full bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-purple-500"
              style={{
                width: `${Math.min(100, (macrosData.carbs / (nutritionGoals.carbsGoal || 1)) * 100)}%`,
              }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {Math.round(
              (macrosData.carbs / (nutritionGoals.carbsGoal || 1)) * 100,
            )}
            % of daily goal
          </p>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-yellow-600 dark:border-yellow-400 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-foreground">
            Fats
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl md:text-3xl font-bold text-yellow-600 dark:text-yellow-400">
              {macrosData.fat}g
            </div>
            <div className="text-sm text-muted-foreground">
              / {nutritionGoals.fatGoal}g
            </div>
          </div>
          <div className="mt-2 h-2 w-full bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-yellow-500"
              style={{
                width: `${Math.min(100, (macrosData.fat / (nutritionGoals.fatGoal || 1)) * 100)}%`,
              }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {Math.round((macrosData.fat / (nutritionGoals.fatGoal || 1)) * 100)}
            % of daily goal
          </p>
        </CardContent>
      </Card>
    </>
  );
};
