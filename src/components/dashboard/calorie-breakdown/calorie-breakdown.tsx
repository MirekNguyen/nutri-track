import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FC } from "react";
import { getFoodEntries } from "@/actions/food-entry-actions";
import { mealTotal } from "../helpers/meal-total";
import { CalorieBreadownChart } from "./calorie-breakdown-chart";

type Props = {
  selectedDate: string;
};

export const CalorieBreakdown: FC<Props> = async ({ selectedDate }) => {
  const entriesData = await getFoodEntries(selectedDate);
  const totals = mealTotal(entriesData);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Calorie breakdown</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <CalorieBreadownChart chartData={totals} />
      </CardContent>
    </Card>
  );
};
