import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import { calculateMealTypeTotals } from "../../../hooks/calculate-mealtype-totals";
import { AddFoodEntry } from "../food-entry/add-food-entry";
import { FoodRecordSection } from "./food-record-section";
import { getFoodEntries } from "@/actions/food-entry-actions";
import type { FC } from "react";

type Props = {
  date: string;
};

export const FoodLog: FC<Props> = async ({ date }) => {
  const entries = await getFoodEntries(date);
  const mealTypeTotalsData = calculateMealTypeTotals(entries);

  return (
    <Card className="lg:col-span-2 shadow-sm hover:shadow-md transition-shadow bg-background">
      <CardHeader className="border-b pb-3 flex flex-row justify-between items-center">
        <CardTitle>Today&apos;s Food Log</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {entries.length === 0 ? (
            <AddFoodEntry>
              <div className="text-center py-8 text-muted-foreground cursor-pointer hover:bg-muted/50 transition-colors">
                <div className="mb-2">
                  <PlusCircle className="h-10 w-10 mx-auto text-muted-foreground/50" />
                </div>
                <p>No entries for this date.</p>
                <p className="text-sm">Click here to add some food!</p>
              </div>
            </AddFoodEntry>
          ) : (
            <>
              <FoodRecordSection
                className="bg-blue-50/50 dark:bg-blue-950/20"
                entries={entries}
                totals={mealTypeTotalsData.breakfast}
                type="breakfast"
                title="Breakfast"
              />
              <FoodRecordSection
                className="bg-purple-50/50 dark:bg-purple-950/20"
                entries={entries}
                totals={mealTypeTotalsData.lunch}
                type="lunch"
                title="Lunch"
              />
              <FoodRecordSection
                className="bg-indigo-50/50 dark:bg-indigo-950/20"
                entries={entries}
                totals={mealTypeTotalsData.dinner}
                type="dinner"
                title="Dinner"
              />
              <FoodRecordSection
                className="bg-orange-50/50 dark:bg-orange-950/20"
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
  );
};
