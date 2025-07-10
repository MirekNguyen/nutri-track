import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import { mealTypeTotals } from "../helpers/mealtype-totals";
import { AddFoodEntry } from "../food-entry/add-food-entry";
import { FoodRecordSection } from "./food-record-section";
import { getFoodEntries } from "@/actions/food-entry-actions";
import { FC } from "react";

type Props = {
  date: string;
};

export const FoodLog: FC<Props> = async ({ date }) => {
  const entries = await getFoodEntries(date);
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
                <FoodRecordSection
                  className="bg-blue-50/50"
                  entries={entries}
                  totals={mealTypeTotalsData.breakfast}
                  type="breakfast"
                  title="Breakfast"
                />
                <FoodRecordSection
                  className="bg-purple-50/50"
                  entries={entries}
                  totals={mealTypeTotalsData.lunch}
                  type="lunch"
                  title="Lunch"
                />
                <FoodRecordSection
                  className="bg-indigo-50/50"
                  entries={entries}
                  totals={mealTypeTotalsData.dinner}
                  type="dinner"
                  title="Dinner"
                />
                <FoodRecordSection
                  className="bg-orange-50/50"
                  entries={entries}
                  totals={mealTypeTotalsData.snack}
                  type="snack"
                  title="Snack"
                />
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
};
