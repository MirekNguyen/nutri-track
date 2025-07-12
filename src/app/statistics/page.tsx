"use client";

import { useState, useEffect } from "react";
import { format, subDays, eachDayOfInterval } from "date-fns";
import { Header } from "../../components/header";
import { Sidebar } from "../../components/sidebar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarIcon, Loader2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { getFoodEntries } from "../../actions/food-entry-actions";
import { getNutritionGoals } from "../../actions/nutrition-goal-actions";
import { useMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
// Import the useSidebar hook
import { useSidebar } from "@/hooks/use-sidebar";
import { FoodEntry } from "@/db/schema";
import { CaloriesChart } from "./calories-chart";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { MacronutrientChart } from "./macronutrient-chart";

interface NutritionGoal {
  calorieGoal: number;
  proteinGoal: number | null;
  carbsGoal: number | null;
  fatGoal: number | null;
}

interface DateRange {
  from: Date | undefined
  to: Date | undefined
}

export default function StatisticsPage() {
  const [timeRange, setTimeRange] = useState<"week" | "month" | "year" | "custom">("week");
  const [entries, setEntries] = useState<FoodEntry[]>([]);
  const [nutritionGoals, setNutritionGoals] = useState<NutritionGoal>({
    calorieGoal: 2000,
    proteinGoal: 150,
    carbsGoal: 200,
    fatGoal: 65,
  });
  const [customDateRange, setCustomDateRange] = useState<DateRange>({
    from: undefined,
    to: undefined,
  })
  const [isLoading, setIsLoading] = useState(true);

  const isMobile = useMobile();
  // Inside the StatisticsPage component, add:
  const { collapsed } = useSidebar();

  // Calculate date range based on selected time range
  const getDateRange = () => {
    const today = new Date();
    switch (timeRange) {
      case "week":
        return { start: subDays(today, 6), end: today };
      case "month":
        return { start: subDays(today, 29), end: today };
      case "year":
        return { start: subDays(today, 364), end: today };
      case "custom":
        if (customDateRange.from && customDateRange.to) {
          return { start: customDateRange.from, end: customDateRange.to }
        }
        return { start: subDays(today, 6), end: today }
      default:
        return { start: subDays(today, 6), end: today }
    }
  };

  // Load data from the database
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        // Load nutrition goals
        const goalsData = await getNutritionGoals();
        setNutritionGoals(goalsData);

        // Load food entries for the selected date range
        const { start, end } = getDateRange();
        const days = eachDayOfInterval({ start, end });

        const allEntries: FoodEntry[] = [];

        // Fetch entries for each day in the range
        for (const day of days) {
          const entriesForDay = await getFoodEntries(format(day, "yyyy-MM-dd"));
          allEntries.push(...entriesForDay);
        }

        setEntries(allEntries);
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
  }, [timeRange, customDateRange]);

  // Calculate daily calorie data for the chart
  const getDailyCalorieData = () => {
    const { start, end } = getDateRange();
    const days = eachDayOfInterval({ start, end });

    return days.map((day) => {
      const dateStr = format(day, "yyyy-MM-dd");
      const entriesForDay = entries.filter(
        (entry) => entry.entryDate === dateStr,
      );
      const calories = entriesForDay.reduce(
        (sum, entry) => sum + parseFloat(entry.calories),
        0,
      );

      return {
        date: dateStr,
        calories,
        formattedDate: format(day, "MMM d"),
      };
    });
  };

  // Calculate average macronutrient distribution
  const getMacroDistribution = () => {
    if (entries.length === 0) return { protein: 0, carbs: 0, fat: 0 };
    const { start, end } = getDateRange();
    const days = eachDayOfInterval({ start, end });

    const stats = days
      .map((day) => {
        const dateStr = format(day, "yyyy-MM-dd");
        const entriesForDay = entries.filter(
          (entry) => entry.entryDate === dateStr,
        );
        const calories = entriesForDay.reduce(
          (sum, entry) => sum + parseFloat(entry.calories),
          0,
        );
        const proteins = entriesForDay.reduce(
          (sum, entry) => sum + (parseFloat(entry.protein) || 0),
          0,
        );
        const carbs = entriesForDay.reduce(
          (sum, entry) => sum + (parseFloat(entry.carbs) || 0),
          0,
        );
        const fat = entriesForDay.reduce(
          (sum, entry) => sum + (entry.fat || 0),
          0,
        );

        return {
          date: dateStr,
          calories,
          proteins,
          carbs,
          fat,
          formattedDate: format(day, "MMM d"),
        };
      })
      .filter((stat) => stat.calories >= 1200);

    return {
      protein: Math.round(
        stats.reduce((sum, stat) => sum + stat.proteins, 0) / stats.length,
      ),
      carbs: Math.round(
        stats.reduce((sum, stat) => sum + stat.carbs, 0) / stats.length,
      ),
      fat: Math.round(
        stats.reduce((sum, stat) => sum + stat.fat, 0) / stats.length,
      ),
    };
  };

  // Get daily macro data for the charts
  const getDailyMacroData = (macroType: "protein" | "carbs" | "fat") => {
    const { start, end } = getDateRange();
    const days = eachDayOfInterval({ start, end });

    return days.map((day) => {
      const dateStr = format(day, "yyyy-MM-dd");
      const entriesForDay = entries.filter(
        (entry) => entry.entryDate === dateStr,
      );
      const macroValue = entriesForDay.reduce(
        (sum, entry) => sum + (parseFloat(entry[macroType]) || 0),
        0,
      );

      return {
        date: dateStr,
        value: macroValue,
        formattedDate: format(day, "MMM d"),
      };
    });
  };

  const dailyCalorieData = getDailyCalorieData();
  console.log("Daily Calorie Data:", dailyCalorieData);
  const macroDistribution = getMacroDistribution();
  console.log("Macro Distribution:", macroDistribution);
  const proteinData = getDailyMacroData("protein");
  console.log("Protein Data:", proteinData);
  const carbsData = getDailyMacroData("carbs");
  const fatData = getDailyMacroData("fat");

  return (
    <div className="min-h-screen bg-inherit flex flex-col">
      <Header />
      <div className="flex flex-col md:flex-row flex-1">
        <Sidebar />
        <main
          className={cn(
            "flex-1 p-4 md:p-6 overflow-auto",
            !isMobile && (collapsed ? "md:ml-16" : "md:ml-64"),
            "transition-all duration-300",
          )}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              Statistics
            </h1>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Tabs
              value={timeRange}
              onValueChange={(v) => setTimeRange(v as any)}
              className="w-full sm:w-auto"
            >
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="week">Week</TabsTrigger>
                <TabsTrigger value="month">Month</TabsTrigger>
                <TabsTrigger value="year">Year</TabsTrigger>
                <TabsTrigger value="custom">Custom</TabsTrigger>
              </TabsList>
            </Tabs>
            {timeRange === "custom" && (
                <div className="flex gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-[140px] justify-start text-left font-normal border-2 border-gray-300 dark:border-gray-600",
                          !customDateRange.from && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {customDateRange.from ? format(customDateRange.from, "MMM d") : <span>From date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 border-2 border-gray-200 dark:border-gray-600" align="start">
                      <Calendar
                        mode="single"
                        selected={customDateRange.from}
                        onSelect={(date) => setCustomDateRange((prev) => ({ ...prev, from: date }))}
                        disabled={(date) => date > new Date() || (customDateRange.to && date > customDateRange.to)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-[140px] justify-start text-left font-normal border-2 border-gray-300 dark:border-gray-600",
                          !customDateRange.to && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {customDateRange.to ? format(customDateRange.to, "MMM d") : <span>To date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 border-2 border-gray-200 dark:border-gray-600" align="start">
                      <Calendar
                        mode="single"
                        selected={customDateRange.to}
                        onSelect={(date) => setCustomDateRange((prev) => ({ ...prev, to: date }))}
                        disabled={(date) => date > new Date() || (customDateRange.from && date < customDateRange.from)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              )}
          </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-green-600" />
              <span className="ml-2 text-lg text-gray-600">
                Loading statistics...
              </span>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <CaloriesChart
                  data={dailyCalorieData.filter(
                    (entry) => entry.calories >= 1000,
                  )}
                />
                <Card>
                  <CardHeader>
                    <CardTitle>Macronutrient Distribution</CardTitle>
                    <CardDescription>
                      Your average macronutrient breakdown
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="h-80 flex items-center justify-center">
                    {entries.length > 0 ? (
                      <div className="w-full h-full flex flex-col justify-center items-center">
                        <div className="relative w-48 h-48">
                          <svg viewBox="0 0 100 100" className="w-full h-full">
                            {/* Protein slice */}
                            <circle
                              cx="50"
                              cy="50"
                              r="40"
                              fill="transparent"
                              stroke="#3b82f6"
                              strokeWidth="20"
                              strokeDasharray={`${(macroDistribution.protein / (macroDistribution.protein + macroDistribution.carbs + macroDistribution.fat)) * 251.2} 251.2`}
                              transform="rotate(-90) translate(-100, 0)"
                            />
                            {/* Carbs slice */}
                            <circle
                              cx="50"
                              cy="50"
                              r="40"
                              fill="transparent"
                              stroke="#8b5cf6"
                              strokeWidth="20"
                              strokeDasharray={`${(macroDistribution.carbs / (macroDistribution.protein + macroDistribution.carbs + macroDistribution.fat)) * 251.2} 251.2`}
                              strokeDashoffset={`${-(macroDistribution.protein / (macroDistribution.protein + macroDistribution.carbs + macroDistribution.fat)) * 251.2}`}
                              transform="rotate(-90) translate(-100, 0)"
                            />
                            {/* Fat slice */}
                            <circle
                              cx="50"
                              cy="50"
                              r="40"
                              fill="transparent"
                              stroke="#f97316"
                              strokeWidth="20"
                              strokeDasharray={`${(macroDistribution.fat / (macroDistribution.protein + macroDistribution.carbs + macroDistribution.fat)) * 251.2} 251.2`}
                              strokeDashoffset={`${-((macroDistribution.protein + macroDistribution.carbs) / (macroDistribution.protein + macroDistribution.carbs + macroDistribution.fat)) * 251.2}`}
                              transform="rotate(-90) translate(-100, 0)"
                            />
                            <circle cx="50" cy="50" r="30" fill="white" />
                          </svg>
                        </div>
                        <div className="flex justify-center gap-6 mt-4">
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                            <div className="text-sm">
                              <div className="font-medium">Protein</div>
                              <div className="text-gray-500">
                                {macroDistribution.protein}g
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                            <div className="text-sm">
                              <div className="font-medium">Carbs</div>
                              <div className="text-gray-500">
                                {macroDistribution.carbs}g
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
                            <div className="text-sm">
                              <div className="font-medium">Fat</div>
                              <div className="text-gray-500">
                                {macroDistribution.fat}g
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-500">
                        No data available for the selected time range
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <MacronutrientChart title="Protein intake" chartData={proteinData} description="Daily protein consumption"/>
                <MacronutrientChart title="Carbohydrate intake" chartData={carbsData} description="Daily carb consumption"/>
                <MacronutrientChart title="Fat intake" chartData={fatData} description="Daily fat consumption"/>
              </div>
            </>
          )}
        </main>
      </div>
      <Toaster />
    </div>
  );
}
