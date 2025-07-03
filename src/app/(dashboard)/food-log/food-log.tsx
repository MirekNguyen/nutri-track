"use client";

import { deleteFoodEntry } from "@/app/actions/food-entry-actions";
import { MealTypeIcon } from "@/app/components/meal-type-icon";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { FoodEntry, Meal } from "@/db/schema";
import { format, parseISO } from "date-fns";
import { PlusCircle, Trash2 } from "lucide-react";
import { DeleteEntryButton } from "./delete-entry-button";

type Props = {
  entries: FoodEntry[];
  mealTypeTotals: {
    breakfast: number;
    lunch: number;
    dinner: number;
    snack: number;
  };
  meals: Meal[];
  openAddFoodDialog: (open: boolean) => void;
};

// Format date and time for display
const formatEntryDateTime = (dateStr: string, timeStr: string) => {
  try {
    const date = parseISO(dateStr);
    const time = timeStr.split(":");
    const hours = Number.parseInt(time[0]);
    const minutes = Number.parseInt(time[1]);

    const dateTime = new Date(date);
    dateTime.setHours(hours);
    dateTime.setMinutes(minutes);

    return format(dateTime, "h:mm a");
  } catch (error) {
    return timeStr;
  }
};

export const FoodLog = ({ entries, mealTypeTotals, meals, openAddFoodDialog }: Props) => {
  return (
    <>
      <Card className="lg:col-span-2 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="border-b pb-3 flex flex-row justify-between items-center">
          <CardTitle>Today's Food Log</CardTitle>
          <Button
            variant="outline"
            size="sm"
            className="text-green-600 border-green-600"
            onClick={() => openAddFoodDialog(true)}
          >
            <PlusCircle className="mr-2 h-4 w-4" /> Add Food
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {entries.length === 0 ? (
              <div
                className="text-center py-8 text-gray-500 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => openAddFoodDialog(true)}
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
                      {mealTypeTotals.breakfast} cal
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-gray-400 hover:text-green-600"
                      onClick={() => openAddFoodDialog(true)}
                    >
                      <PlusCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {entries
                  .filter((entry) => entry.mealType === "breakfast")
                  .map((entry) => (
                    <div
                      key={entry.id}
                      className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div>
                          <h3 className="font-medium text-gray-800">
                            {entry.foodName}
                          </h3>
                          <div className="flex flex-wrap gap-x-3 text-xs text-gray-500 mt-1">
                            <span>
                              {formatEntryDateTime(
                                entry.entryDate,
                                entry.entryTime,
                              )}
                            </span>
                            <span className="font-medium">
                              {entry.amount}{" "}
                              {entry.mealId
                                ? meals.find((m) => m.id === entry.mealId)
                                    ?.unit || "serving"
                                : "serving"}
                            </span>
                            {entry.protein && (
                              <span className="text-blue-600">
                                {entry.protein}g protein
                              </span>
                            )}
                            {entry.carbs && (
                              <span className="text-purple-600">
                                {entry.carbs}g carbs
                              </span>
                            )}
                            {entry.fat && (
                              <span className="text-yellow-600">
                                {entry.fat}g fat
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end gap-4 mt-2 sm:mt-0">
                        <span className="font-semibold text-gray-800">
                          {entry.calories} cal
                        </span>
                          <DeleteEntryButton entry={entry} />
                      </div>
                    </div>
                  ))}

                {/* Lunch section */}
                <div className="bg-purple-50/50 px-4 py-2 flex justify-between items-center">
                  <div className="flex items-center">
                    <MealTypeIcon type="lunch" />
                    <span className="ml-2 font-medium">Lunch</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">
                      {mealTypeTotals.lunch} cal
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-gray-400 hover:text-green-600"
                      onClick={() => openAddFoodDialog()}
                    >
                      <PlusCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {entries
                  .filter((entry) => entry.mealType === "lunch")
                  .map((entry) => (
                    <div
                      key={entry.id}
                      className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div>
                          <h3 className="font-medium text-gray-800">
                            {entry.foodName}
                          </h3>
                          <div className="flex flex-wrap gap-x-3 text-xs text-gray-500 mt-1">
                            <span>
                              {formatEntryDateTime(
                                entry.entryDate,
                                entry.entryTime,
                              )}
                            </span>
                            <span className="font-medium">
                              {entry.amount}{" "}
                              {entry.mealId
                                ? meals.find((m) => m.id === entry.mealId)
                                    ?.unit || "serving"
                                : "serving"}
                            </span>
                            {entry.protein && (
                              <span className="text-blue-600">
                                {entry.protein}g protein
                              </span>
                            )}
                            {entry.carbs && (
                              <span className="text-purple-600">
                                {entry.carbs}g carbs
                              </span>
                            )}
                            {entry.fat && (
                              <span className="text-yellow-600">
                                {entry.fat}g fat
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end gap-4 mt-2 sm:mt-0">
                        <span className="font-semibold text-gray-800">
                          {entry.calories} cal
                        </span>
                          <DeleteEntryButton entry={entry} />
                      </div>
                    </div>
                  ))}

                {/* Dinner section */}
                <div className="bg-indigo-50/50 px-4 py-2 flex justify-between items-center">
                  <div className="flex items-center">
                    <MealTypeIcon type="dinner" />
                    <span className="ml-2 font-medium">Dinner</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">
                      {mealTypeTotals.dinner} cal
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-gray-400 hover:text-green-600"
                      onClick={() => openAddFoodDialog()}
                    >
                      <PlusCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {entries
                  .filter((entry) => entry.mealType === "dinner")
                  .map((entry) => (
                    <div
                      key={entry.id}
                      className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div>
                          <h3 className="font-medium text-gray-800">
                            {entry.foodName}
                          </h3>
                          <div className="flex flex-wrap gap-x-3 text-xs text-gray-500 mt-1">
                            <span>
                              {formatEntryDateTime(
                                entry.entryDate,
                                entry.entryTime,
                              )}
                            </span>
                            <span className="font-medium">
                              {entry.amount}{" "}
                              {entry.mealId
                                ? meals.find((m) => m.id === entry.mealId)
                                    ?.unit || "serving"
                                : "serving"}
                            </span>
                            {entry.protein && (
                              <span className="text-blue-600">
                                {entry.protein}g protein
                              </span>
                            )}
                            {entry.carbs && (
                              <span className="text-purple-600">
                                {entry.carbs}g carbs
                              </span>
                            )}
                            {entry.fat && (
                              <span className="text-yellow-600">
                                {entry.fat}g fat
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end gap-4 mt-2 sm:mt-0">
                        <span className="font-semibold text-gray-800">
                          {entry.calories} cal
                        </span>
                          <DeleteEntryButton entry={entry} />
                      </div>
                    </div>
                  ))}

                {/* Snack section */}
                <div className="bg-orange-50/50 px-4 py-2 flex justify-between items-center">
                  <div className="flex items-center">
                    <MealTypeIcon type="snack" />
                    <span className="ml-2 font-medium">Snack</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">
                      {mealTypeTotals.snack} cal
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-gray-400 hover:text-green-600"
                      onClick={() => openAddFoodDialog()}
                    >
                      <PlusCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {entries
                  .filter((entry) => entry.mealType === "snack")
                  .map((entry) => (
                    <div
                      key={entry.id}
                      className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div>
                          <h3 className="font-medium text-gray-800">
                            {entry.foodName}
                          </h3>
                          <div className="flex flex-wrap gap-x-3 text-xs text-gray-500 mt-1">
                            <span>
                              {formatEntryDateTime(
                                entry.entryDate,
                                entry.entryTime,
                              )}
                            </span>
                            <span className="font-medium">
                              {entry.amount}{" "}
                              {entry.mealId
                                ? meals.find((m) => m.id === entry.mealId)
                                    ?.unit || "serving"
                                : "serving"}
                            </span>
                            {entry.protein && (
                              <span className="text-blue-600">
                                {entry.protein}g protein
                              </span>
                            )}
                            {entry.carbs && (
                              <span className="text-purple-600">
                                {entry.carbs}g carbs
                              </span>
                            )}
                            {entry.fat && (
                              <span className="text-yellow-600">
                                {entry.fat}g fat
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end gap-4 mt-2 sm:mt-0">
                        <span className="font-semibold text-gray-800">
                          {entry.calories} cal
                        </span>
                          <DeleteEntryButton entry={entry} />
                      </div>
                    </div>
                  ))}
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
};
