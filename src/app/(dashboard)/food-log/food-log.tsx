"use client";

import { MealTypeIcon } from "@/app/components/meal-type-icon";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FoodEntry, Meal } from "@/db/schema";
import { PlusCircle } from "lucide-react";
import { FoodEntryDialog2 } from "../food-entry/food-entry-dialog";
import { useState } from "react";
import { mealTypeTotals } from "../helpers/mealtype-totals";
import { FoodRecord } from "./food-entry";

type Props = {
  entries: FoodEntry[];
  meals: Meal[];
};

export const FoodLog = ({ entries, meals }: Props) => {
  const mealTypeTotalsData = mealTypeTotals(entries);
  const [open, setOpen] = useState(false);
  return (
    <>
      <FoodEntryDialog2
        meals={meals}
        foodEntryDialogOpen={open}
        setOpenAction={setOpen}
      />
      <Card className="lg:col-span-2 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="border-b pb-3 flex flex-row justify-between items-center">
          <CardTitle>Today&apos;s Food Log</CardTitle>
          <Button
            variant="outline"
            size="sm"
            className="text-green-600 border-green-600"
            onClick={() => setOpen(true)}
          >
            <PlusCircle className="mr-2 h-4 w-4" /> Add Food
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {entries.length === 0 ? (
              <div
                className="text-center py-8 text-gray-500 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setOpen(true)}
              >
                <div className="mb-2">
                  <PlusCircle className="h-10 w-10 mx-auto text-gray-300" />
                </div>
                <p>No entries for this date.</p>
                <p className="text-sm">Click here to add some food!</p>
              </div>
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
                      {mealTypeTotalsData.breakfast} cal
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-gray-400 hover:text-green-600"
                      onClick={() => setOpen(true)}
                    >
                      <PlusCircle className="h-4 w-4" />
                    </Button>
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
                      {mealTypeTotalsData.lunch} cal
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-gray-400 hover:text-green-600"
                      onClick={() => setOpen(true)}
                    >
                      <PlusCircle className="h-4 w-4" />
                    </Button>
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
                      {mealTypeTotalsData.dinner} cal
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-gray-400 hover:text-green-600"
                      onClick={() => setOpen(true)}
                    >
                      <PlusCircle className="h-4 w-4" />
                    </Button>
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
                      {mealTypeTotalsData.snack} cal
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-gray-400 hover:text-green-600"
                      onClick={() => setOpen(true)}
                    >
                      <PlusCircle className="h-4 w-4" />
                    </Button>
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
