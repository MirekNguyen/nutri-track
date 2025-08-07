import { Beef, Droplets, Wheat, Zap } from "lucide-react";
import { getFoodEntries } from "@/actions/food-entry-actions";
import { getUserData } from "@/actions/user-actions";
import { useMacros } from "../../../hooks/use-macros";
import { MacroCard } from "./macro-card";

type Props = {
  date: string;
};

export const MacronutrientStats = async ({ date }: Props) => {
  const entries = await getFoodEntries(date);
  const userData = await getUserData();
  const totalCalories = entries.reduce((sum, entry) => sum + entry.calories, 0);
  const macrosData = useMacros(entries);
  const totalProtein = macrosData.protein;
  const totalCarbs = macrosData.carbs;
  const totalFat = macrosData.fat;

  const nutritionGoals = {
    calorieGoal: userData?.calorieGoal ?? 2000,
    proteinGoal: userData?.proteinGoal ?? 150,
    carbsGoal: userData?.carbsGoal ?? 200,
    fatGoal: userData?.fatsGoal ?? 65,
  };
  const macros = [
    {
      title: "Calories",
      current: totalCalories,
      goal: nutritionGoals.calorieGoal,
      unit: " kcal",
      color: "green",
      border: "border-green-500",
      icon: Zap,
      isOverLimit: totalCalories > nutritionGoals.calorieGoal,
      subtitle: `${Math.round((totalCalories / nutritionGoals.calorieGoal) * 100)}% of daily intake`,
    },
    {
      title: "Protein",
      current: totalProtein,
      goal: nutritionGoals.proteinGoal,
      unit: "g",
      color: "blue",
      border: "border-blue-500",
      icon: Beef,
      isOverLimit: false,
      subtitle: `${(totalProtein / (userData?.weight ?? 70)).toFixed(1)}g per kg`,
    },
    {
      title: "Carbs",
      current: totalCarbs,
      goal: nutritionGoals.carbsGoal,
      unit: "g",
      color: "purple",
      border: "border-purple-500",
      icon: Wheat,
      isOverLimit: false,
      subtitle: `${Math.round((totalCarbs / nutritionGoals.carbsGoal) * 100)}% of daily limit`,
    },
    {
      title: "Fats",
      current: totalFat,
      goal: nutritionGoals.fatGoal,
      unit: "g",
      color: "orange",
      border: "border-orange-500",
      icon: Droplets,
      isOverLimit: false,
      subtitle: `${Math.round((totalFat / nutritionGoals.fatGoal) * 100)}% of daily limit`,
    },
  ];
  return (
    <>
      {macros.map((macro) => (
        <MacroCard key={macro.title} {...macro} />
      ))}
    </>
  );
};
