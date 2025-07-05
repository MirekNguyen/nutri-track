"use client";

import { MealTypeIcon } from "@/app/components/meal-type-icon";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FoodEntry, Meal } from "@/db/schema";
import { PlusCircle } from "lucide-react";
import { mealTypeTotals } from "../helpers/mealtype-totals";
import { FoodRecord } from "./food-entry";
import { AddFoodEntry } from "../food-entry/add-food-entry";

type Props = {
  entries: FoodEntry[];
  meals: Meal[];
};

export const FoodLog = ({ entries, meals }: Props) => {
  const mealTypeTotalsData = mealTypeTotals(entries);
  return (
    <>
      <Card className="lg:col-span-2 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="border-b pb-3 flex flex-row justify-between items-center">
          <CardTitle>Today&apos;s Food Log</CardTitle>
          <AddFoodEntry>
            <Button
              variant="outline"
              size="sm"
              className="text-green-600 border-green-600"
            >
              <PlusCircle className="mr-2 h-4 w-4" /> Add Food
            </Button>
          </AddFoodEntry>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {entries.length === 0 ? (
              <AddFoodEntry>
                <div className="text-center py-8 text-gray-500 cursor-pointer hover:bg-gray-50 transition-colors">
                  <div className="mb-2">
                    <PlusCircle className="h-10 w-10 mx-auto text-gray-300" />
                  </div>
                  <p>No entries for this date.</p>
                  <p className="text-sm">Click here to add some food!</p>
                </div>
              </AddFoodEntry>
            ) : (
              <>
                {/* Breakfast section */}
                <div className="bg-blue-50/50 px-4 py-2 flex justify-between items-center">
                  <div className="flex items-center">
                    <MealTypeIcon type="breakfast" />
                    <span className="ml-2 font-medium">Breakfast</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">
                      {mealTypeTotalsData.breakfast} kcal
                    </span>
                    <AddFoodEntry>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-gray-400 hover:text-green-600"
                      >
                        <PlusCircle className="h-4 w-4" />
                      </Button>
                    </AddFoodEntry>
                  </div>
                </div>
                {entries
                  .filter((entry) => entry.mealType === "breakfast")
                  .map((entry) => (
                    <FoodRecord key={entry.id} entry={entry} meals={meals} />
                  ))}

                {/* Lunch section */}
                <div className="bg-purple-50/50 px-4 py-2 flex justify-between items-center">
                  <div className="flex items-center">
                    <MealTypeIcon type="lunch" />
                    <span className="ml-2 font-medium">Lunch</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">
                      {mealTypeTotalsData.lunch} kcal
                    </span>
                    <AddFoodEntry>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-gray-400 hover:text-green-600"
                      >
                        <PlusCircle className="h-4 w-4" />
                      </Button>
                    </AddFoodEntry>
                  </div>
                </div>
                {entries
                  .filter((entry) => entry.mealType === "lunch")
                  .map((entry) => (
                    <FoodRecord key={entry.id} entry={entry} meals={meals} />
                  ))}

                {/* Dinner section */}
                <div className="bg-indigo-50/50 px-4 py-2 flex justify-between items-center">
                  <div className="flex items-center">
                    <MealTypeIcon type="dinner" />
                    <span className="ml-2 font-medium">Dinner</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">
                      {mealTypeTotalsData.dinner} kcal
                    </span>
                    <AddFoodEntry>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-gray-400 hover:text-green-600"
                      >
                        <PlusCircle className="h-4 w-4" />
                      </Button>
                    </AddFoodEntry>
                  </div>
                </div>
                {entries
                  .filter((entry) => entry.mealType === "dinner")
                  .map((entry) => (
                    <FoodRecord key={entry.id} entry={entry} meals={meals} />
                  ))}

                {/* Snack section */}
                <div className="bg-orange-50/50 px-4 py-2 flex justify-between items-center">
                  <div className="flex items-center">
                    <MealTypeIcon type="snack" />
                    <span className="ml-2 font-medium">Snack</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">
                      {mealTypeTotalsData.snack} kcal
                    </span>
                    <AddFoodEntry>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-gray-400 hover:text-green-600"
                      >
                        <PlusCircle className="h-4 w-4" />
                      </Button>
                    </AddFoodEntry>
                  </div>
                </div>
                {entries
                  .filter((entry) => entry.mealType === "snack")
                  .map((entry) => (
                    <FoodRecord key={entry.id} entry={entry} meals={meals} />
                  ))}
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
};
