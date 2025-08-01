import { PlusCircle } from "lucide-react";
import type { FC } from "react";
import { getMeals } from "@/actions/meal-actions";
import { MealTypeIcon } from "@/components/common/meal-type-icon";
import { Button } from "@/components/ui/button";
import type { FoodEntry } from "@/db/schema";
import { AddFoodEntry } from "../food-entry/add-food-entry";
import { FoodRecord } from "./food-record";

type Props = {
  entries: FoodEntry[];
  totals: number;
  type: "breakfast" | "lunch" | "dinner" | "snack";
  title: string;
  className: string;
};
export const FoodRecordSection: FC<Props> = async ({
  entries,
  totals,
  type,
  title,
  className,
}) => {
  const meals = await getMeals();
  return (
    <>
      <div
        className={`bg-blue-50/50 px-4 py-2 flex justify-between items-center ${className}`}
      >
        <div className="flex items-center">
          <MealTypeIcon type={type} />
          <span className="ml-2 font-medium">{title}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{totals.toFixed(0)} kcal</span>
          <AddFoodEntry type={type}>
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
        .filter((entry) => entry.mealType === type)
        .map((entry) => (
          <FoodRecord key={entry.id} entry={entry} meals={meals} />
        ))}
    </>
  );
};
