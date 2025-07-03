import { getFoodEntries } from "@/app/actions/food-entry-actions";
import { CalorieChart } from "@/app/components/calorie-chart";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { mealTypeTotals } from "../helpers/mealtype-totals";

type Props = {
  selectedDate: string;
};

export const CalorieBreakdown = async ({ selectedDate }: Props) => {
  const entriesData = await getFoodEntries(selectedDate);
  const totals = mealTypeTotals(entriesData);

  return (
    <Card
      className="shadow-sm hover:shadow-md transition-shadow cursor-pointer"
    >
      <CardHeader className="border-b pb-3">
        <CardTitle>Calorie Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <CalorieChart
          breakfast={totals.breakfast}
          lunch={totals.lunch}
          dinner={totals.dinner}
          snack={totals.snack}
        />
      </CardContent>
    </Card>
  );
};
