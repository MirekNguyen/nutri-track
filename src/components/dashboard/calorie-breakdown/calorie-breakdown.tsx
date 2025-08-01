import type { FC } from "react";
import { getFoodEntries } from "@/actions/food-entry-actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMealTotal } from "../../../hooks/use-meal-total";
import { CalorieBreadownChart } from "./calorie-breakdown-chart";

type Props = {
  selectedDate: string;
};

export const CalorieBreakdown: FC<Props> = async ({ selectedDate }) => {
  const entriesData = await getFoodEntries(selectedDate);
  const totals = useMealTotal(entriesData);
  const caffeine = entriesData.reduce((sum, entry) => {
    return sum + (entry.caffeine || 0);
  }, 0);

  return (
    <Card className="flex flex-col bg-background">
      <CardHeader className="items-center pb-0">
        <CardTitle>Calorie breakdown</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <CalorieBreadownChart chartData={totals} />
        {caffeine > 0 && (
          <div className="mt-4 text-sm text-muted-foreground">
            Total caffeine intake: {caffeine} mg
          </div>
        )}
      </CardContent>
    </Card>
  );
};
