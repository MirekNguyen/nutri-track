"use client";

import { useState, useEffect } from "react";
import { subDays, differenceInDays } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator, TrendingDown, Target, Calendar } from "lucide-react";
import { getWeightEntries } from "@/actions/weight-actions";
import { getFoodEntries } from "@/actions/food-entry-actions";
import { getNutritionGoals } from "@/actions/nutrition-goal-actions";
import { toast } from "sonner";
import type { FoodEntry, WeightEntry } from "@/db/schema";

export default function WeightLossPage() {
  const [weightEntries, setWeightEntries] = useState<WeightEntry[]>([]);
  const [foodEntries, setFoodEntries] = useState<FoodEntry[]>([]);
  const [nutritionGoals, setNutritionGoals] = useState({ calorieGoal: 2000 });
  const [, setIsLoading] = useState(true);

  // Calculator state
  const [currentWeight, setCurrentWeight] = useState("");
  const [targetWeight, setTargetWeight] = useState("");
  const [weeklyGoal, setWeeklyGoal] = useState("1");
  const [activityLevel, setActivityLevel] = useState("moderate");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("male");
  const [height, setHeight] = useState("");

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        // Load weight entries
        const weights = await getWeightEntries();
        setWeightEntries(weights);

        // Load recent food entries (last 30 days)
        const thirtyDaysAgo = subDays(new Date(), 30);
        const entries = await getFoodEntries(thirtyDaysAgo.toISOString());
        setFoodEntries(entries);

        // Load nutrition goals
        const goals = await getNutritionGoals();
        setNutritionGoals(goals);

        // Set current weight if available
        if (weights.length > 0) {
          setCurrentWeight(weights[0].weight.toString());
        }
      } catch (error) {
        console.error("Error loading data:", error);
        toast.error("Error", {
          description: "Failed to load data. Please try again.",
        });
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  // Calculate BMR using Mifflin-St Jeor Equation
  const calculateBMR = () => {
    if (!currentWeight || !height || !age) return 0;

    const weightKg = Number.parseFloat(currentWeight) * 0.453592; // Convert lbs to kg
    const heightCm = Number.parseFloat(height) * 2.54; // Convert inches to cm
    const ageYears = Number.parseInt(age);

    if (gender === "male") {
      return 10 * weightKg + 6.25 * heightCm - 5 * ageYears + 5;
    } else {
      return 10 * weightKg + 6.25 * heightCm - 5 * ageYears - 161;
    }
  };

  // Calculate TDEE (Total Daily Energy Expenditure)
  const calculateTDEE = () => {
    const bmr = calculateBMR();
    const multipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      extreme: 1.9,
    };
    return bmr * multipliers[activityLevel as keyof typeof multipliers];
  };

  // Calculate daily calorie deficit needed
  const calculateCalorieDeficit = () => {
    const weeklyGoalLbs = Number.parseFloat(weeklyGoal);
    return (weeklyGoalLbs * 3500) / 7; // 3500 calories = 1 lb
  };

  // Calculate recommended daily calories
  const calculateRecommendedCalories = () => {
    const tdee = calculateTDEE();
    const deficit = calculateCalorieDeficit();
    return Math.max(1200, tdee - deficit); // Don't go below 1200 calories
  };

  // Calculate time to reach goal
  const calculateTimeToGoal = () => {
    if (!currentWeight || !targetWeight || !weeklyGoal) return 0;

    const weightDifference =
      Number.parseFloat(currentWeight) - Number.parseFloat(targetWeight);
    const weeklyGoalLbs = Number.parseFloat(weeklyGoal);

    if (weightDifference <= 0) return 0;

    return Math.ceil(weightDifference / weeklyGoalLbs);
  };

  // Calculate current progress
  const calculateProgress = () => {
    if (weightEntries.length < 2) return null;

    const latestWeight = weightEntries[0].weight;
    const oldestWeight = weightEntries[weightEntries.length - 1].weight;
    const weightLoss = parseFloat(oldestWeight) - parseFloat(latestWeight);
    const daysBetween = differenceInDays(
      new Date(weightEntries[0].entryDate),
      new Date(weightEntries[weightEntries.length - 1].entryDate),
    );

    return {
      totalLoss: weightLoss,
      averagePerWeek: daysBetween > 0 ? (weightLoss / daysBetween) * 7 : 0,
      daysTracked: daysBetween,
    };
  };

  // Calculate average daily calories
  const calculateAverageDailyCalories = () => {
    if (foodEntries.length === 0) return 0;

    const totalCalories = foodEntries.reduce(
      (sum, entry) => sum + entry.calories,
      0,
    );
    const uniqueDates = new Set(foodEntries.map((entry) => entry.entryDate));
    return Math.round(totalCalories / uniqueDates.size);
  };

  const progress = calculateProgress();
  const recommendedCalories = calculateRecommendedCalories();
  const timeToGoal = calculateTimeToGoal();
  const averageDailyCalories = calculateAverageDailyCalories();

  return (
    <>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100">
          Weight Loss Calculator
        </h1>
      </div>

      <Tabs defaultValue="calculator" className="w-full">
        <TabsList className="grid w-full grid-cols-3 border-2 border-gray-200 dark:border-gray-600">
          <TabsTrigger value="calculator">Calculator</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="calculator" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-2 border-blue-200 dark:border-blue-700 bg-linear-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30">
              <CardHeader className="border-b-2 border-blue-200 dark:border-blue-700">
                <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                  <Calculator className="h-5 w-5" />
                  Weight Loss Calculator
                </CardTitle>
                <CardDescription>
                  Calculate your daily calorie needs for weight loss
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="currentWeight">Current Weight (lbs)</Label>
                    <Input
                      id="currentWeight"
                      type="number"
                      value={currentWeight}
                      onChange={(e) => setCurrentWeight(e.target.value)}
                      className="border-2 border-blue-300 dark:border-blue-600"
                    />
                  </div>
                  <div>
                    <Label htmlFor="targetWeight">Target Weight (lbs)</Label>
                    <Input
                      id="targetWeight"
                      type="number"
                      value={targetWeight}
                      onChange={(e) => setTargetWeight(e.target.value)}
                      className="border-2 border-blue-300 dark:border-blue-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      className="border-2 border-blue-300 dark:border-blue-600"
                    />
                  </div>
                  <div>
                    <Label htmlFor="height">Height (inches)</Label>
                    <Input
                      id="height"
                      type="number"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      className="border-2 border-blue-300 dark:border-blue-600"
                    />
                  </div>
                  <div>
                    <Label htmlFor="gender">Gender</Label>
                    <Select value={gender} onValueChange={setGender}>
                      <SelectTrigger className="border-2 border-blue-300 dark:border-blue-600">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="weeklyGoal">
                      Weekly Weight Loss Goal (lbs)
                    </Label>
                    <Select value={weeklyGoal} onValueChange={setWeeklyGoal}>
                      <SelectTrigger className="border-2 border-blue-300 dark:border-blue-600">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0.5">0.5 lbs/week (Slow)</SelectItem>
                        <SelectItem value="1">1 lb/week (Moderate)</SelectItem>
                        <SelectItem value="1.5">1.5 lbs/week (Fast)</SelectItem>
                        <SelectItem value="2">
                          2 lbs/week (Very Fast)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="activityLevel">Activity Level</Label>
                    <Select
                      value={activityLevel}
                      onValueChange={setActivityLevel}
                    >
                      <SelectTrigger className="border-2 border-blue-300 dark:border-blue-600">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sedentary">Sedentary</SelectItem>
                        <SelectItem value="light">Lightly Active</SelectItem>
                        <SelectItem value="moderate">
                          Moderately Active
                        </SelectItem>
                        <SelectItem value="active">Very Active</SelectItem>
                        <SelectItem value="extreme">
                          Extremely Active
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-200 dark:border-green-700 bg-linear-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30">
              <CardHeader className="border-b-2 border-green-200 dark:border-green-700">
                <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-300">
                  <Target className="h-5 w-5" />
                  Your Results
                </CardTitle>
                <CardDescription>
                  Personalized recommendations for your weight loss journey
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="grid grid-cols-1 gap-4">
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border-2 border-green-300 dark:border-green-600">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Daily Calorie Target
                    </div>
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {Math.round(recommendedCalories)} calories
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border-2 border-green-300 dark:border-green-600">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Daily Calorie Deficit
                    </div>
                    <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                      {Math.round(calculateCalorieDeficit())} calories
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border-2 border-green-300 dark:border-green-600">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Time to Reach Goal
                    </div>
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {timeToGoal} weeks
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border-2 border-green-300 dark:border-green-600">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Total Weight to Lose
                    </div>
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {currentWeight && targetWeight
                        ? (
                            Number.parseFloat(currentWeight) -
                            Number.parseFloat(targetWeight)
                          ).toFixed(1)
                        : 0}{" "}
                      lbs
                    </div>
                  </div>
                </div>

                {recommendedCalories < 1200 && (
                  <div className="bg-red-50 dark:bg-red-900/30 border-2 border-red-200 dark:border-red-700 p-4 rounded-lg">
                    <div className="text-sm text-red-600 dark:text-red-400 font-medium">
                      ⚠️ Warning: Your calculated calorie target is very low.
                      Consider a more moderate weight loss goal or consult a
                      healthcare professional.
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="progress" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-2 border-purple-200 dark:border-purple-700 bg-linear-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30">
              <CardHeader className="border-b-2 border-purple-200 dark:border-purple-700">
                <CardTitle className="flex items-center gap-2 text-purple-700 dark:text-purple-300">
                  <TrendingDown className="h-5 w-5" />
                  Weight Loss Progress
                </CardTitle>
                <CardDescription>
                  Your weight loss journey so far
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {progress ? (
                  <div className="space-y-4">
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border-2 border-purple-300 dark:border-purple-600">
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Total Weight Lost
                      </div>
                      <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                        {progress.totalLoss.toFixed(1)} lbs
                      </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border-2 border-purple-300 dark:border-purple-600">
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Average per Week
                      </div>
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {progress.averagePerWeek.toFixed(1)} lbs/week
                      </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border-2 border-purple-300 dark:border-purple-600">
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Days Tracked
                      </div>
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {progress.daysTracked} days
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>No progress data available yet.</p>
                    <p className="text-sm mt-2">
                      Add more weight entries to see your progress!
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-2 border-orange-200 dark:border-orange-700 bg-linear-to-br from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30">
              <CardHeader className="border-b-2 border-orange-200 dark:border-orange-700">
                <CardTitle className="flex items-center gap-2 text-orange-700 dark:text-orange-300">
                  <Calendar className="h-5 w-5" />
                  Calorie Tracking
                </CardTitle>
                <CardDescription>
                  Your recent calorie intake analysis
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border-2 border-orange-300 dark:border-orange-600">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Average Daily Calories
                    </div>
                    <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                      {averageDailyCalories} cal
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border-2 border-orange-300 dark:border-orange-600">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Target Calories
                    </div>
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {nutritionGoals.calorieGoal} cal
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border-2 border-orange-300 dark:border-orange-600">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Difference
                    </div>
                    <div
                      className={`text-2xl font-bold ${
                        averageDailyCalories > nutritionGoals.calorieGoal
                          ? "text-red-600 dark:text-red-400"
                          : "text-green-600 dark:text-green-400"
                      }`}
                    >
                      {averageDailyCalories > nutritionGoals.calorieGoal
                        ? "+"
                        : ""}
                      {averageDailyCalories - nutritionGoals.calorieGoal} cal
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="mt-6">
          <Card className="border-2 border-indigo-200 dark:border-indigo-700 bg-linear-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/30 dark:to-indigo-800/30">
            <CardHeader className="border-b-2 border-indigo-200 dark:border-indigo-700">
              <CardTitle className="text-indigo-700 dark:text-indigo-300">
                Weight Loss Insights & Tips
              </CardTitle>
              <CardDescription>
                Personalized recommendations based on your data
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg text-indigo-700 dark:text-indigo-300">
                    Key Insights
                  </h3>

                  {averageDailyCalories > nutritionGoals.calorieGoal && (
                    <div className="bg-red-50 dark:bg-red-900/30 border-2 border-red-200 dark:border-red-700 p-4 rounded-lg">
                      <h4 className="font-medium text-red-700 dark:text-red-300">
                        Calorie Intake Too High
                      </h4>
                      <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                        You&apos;re consuming{" "}
                        {averageDailyCalories - nutritionGoals.calorieGoal}{" "}
                        calories above your target. Consider reducing portion
                        sizes or choosing lower-calorie alternatives.
                      </p>
                    </div>
                  )}

                  {progress && progress.averagePerWeek > 2 && (
                    <div className="bg-yellow-50 dark:bg-yellow-900/30 border-2 border-yellow-200 dark:border-yellow-700 p-4 rounded-lg">
                      <h4 className="font-medium text-yellow-700 dark:text-yellow-300">
                        Rapid Weight Loss
                      </h4>
                      <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-1">
                        You&apos;re losing weight faster than recommended.
                        Consider increasing your calorie intake slightly to
                        ensure sustainable and healthy weight loss.
                      </p>
                    </div>
                  )}

                  {progress &&
                    progress.averagePerWeek < 0.5 &&
                    progress.daysTracked > 14 && (
                      <div className="bg-blue-50 dark:bg-blue-900/30 border-2 border-blue-200 dark:border-blue-700 p-4 rounded-lg">
                        <h4 className="font-medium text-blue-700 dark:text-blue-300">
                          Slow Progress
                        </h4>
                        <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                          Your weight loss is slower than expected. Consider
                          reducing your daily calorie intake by 100-200 calories
                          or increasing your physical activity.
                        </p>
                      </div>
                    )}
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-lg text-indigo-700 dark:text-indigo-300">
                    Tips for Success
                  </h3>

                  <div className="bg-white dark:bg-gray-800 border-2 border-indigo-300 dark:border-indigo-600 p-4 rounded-lg">
                    <h4 className="font-medium text-indigo-700 dark:text-indigo-300">
                      Stay Consistent
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Log your food and weight regularly. Consistency is key to
                      successful weight loss.
                    </p>
                  </div>

                  <div className="bg-white dark:bg-gray-800 border-2 border-indigo-300 dark:border-indigo-600 p-4 rounded-lg">
                    <h4 className="font-medium text-indigo-700 dark:text-indigo-300">
                      Focus on Protein
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Aim for 0.8-1g of protein per pound of body weight to
                      preserve muscle mass during weight loss.
                    </p>
                  </div>

                  <div className="bg-white dark:bg-gray-800 border-2 border-indigo-300 dark:border-indigo-600 p-4 rounded-lg">
                    <h4 className="font-medium text-indigo-700 dark:text-indigo-300">
                      Stay Hydrated
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Drink plenty of water throughout the day. Sometimes thirst
                      is mistaken for hunger.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}
