import { CalorieChart } from "@/app/components/calorie-chart";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

type Props = {
  mealTypeTotals: {
    breakfast: number;
    lunch: number;
    dinner: number;
    snack: number;
  };
};

export const CalorieBreakdown = ({ mealTypeTotals }: Props) => {
  return (
    <Card
      className="shadow-sm hover:shadow-md transition-shadow cursor-pointer"
    >
      <CardHeader className="border-b pb-3">
        <CardTitle>Calorie Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <CalorieChart
          breakfast={mealTypeTotals.breakfast}
          lunch={mealTypeTotals.lunch}
          dinner={mealTypeTotals.dinner}
          snack={mealTypeTotals.snack}
        />
      </CardContent>
    </Card>
  );
};
