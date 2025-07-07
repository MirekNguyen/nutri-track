
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FC } from "react";
import { CalorieBreadownChartNew } from "./calorie-breakdown-chart-new";
import { getFoodEntries } from "@/app/actions/food-entry-actions";
import { mealTotal } from "../helpers/meal-total";

export const description = "A donut chart with text";

type Props = {
  selectedDate: string;
};

export const CalorieBreakdownNew: FC<Props> = async ({ selectedDate }) => {
  const entriesData = await getFoodEntries(selectedDate);
  const totals = mealTotal(entriesData);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Calorie breakdown</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <CalorieBreadownChartNew chartData={totals} />
      </CardContent>
    </Card>
  );
};
