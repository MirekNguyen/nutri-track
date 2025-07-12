"use client";

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { differenceInCalendarDays } from "date-fns";

const chartConfig = {
  calories: {
    label: "Calories",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

type CaloriesEntry = {
  date: string;
  calories: number;
  formattedDate: string;
}

type Props = {
  data: CaloriesEntry[];
}

export function CaloriesChart({ data }: Props) {
  const total = data.reduce((sum, entry) => sum + entry.calories, 0);
  const avg = data.length > 0 ? Math.round(total / data.length) : 0;
  const minDate = new Date(Math.min(...data.map(entry => new Date(entry.date).getTime())));
  const maxDate = new Date(Math.max(...data.map(entry => new Date(entry.date).getTime())));
  const daysSpan = differenceInCalendarDays(maxDate, minDate) + 1;
  const maintenanceCalories = 2000;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Calorie Intake</CardTitle>
        <CardDescription>Your calorie consumption over time</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={data}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="formattedDate"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              ticks={[2600, 2400, 2200, 2000, 1800, 1600, 1400, 1200]}
              domain={[1200, 2000]}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey="calories"
              type="natural"
              stroke="var(--color-calories, var(--chart-1))"
              strokeWidth={2}
              dot={false}
              name="Calories"
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex justify-between w-full">
        <div className="flex gap-2 leading-none font-medium">
          Average calories: {avg} kcal
        </div>
        <div className="flex gap-2 leading-none font-medium">
          Total Deficit: {avg * daysSpan} kcal ({(avg * daysSpan / 7700).toFixed(2)} kg)
        </div>
        </div>
        <div className="text-muted-foreground leading-none">
          Showing daily calories for the past {daysSpan} days
        </div>
      </CardFooter>
    </Card>
  );
}
