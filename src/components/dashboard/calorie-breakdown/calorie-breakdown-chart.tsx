"use client";

import { Cell, Label, Pie, PieChart } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { MealTotal } from "../helpers/meal-total";
import { FC } from "react";

const chartConfig = {
  breakfast: {
    label: "Breakfast",
    color: "var(--chart-1)",
  },
  lunch: {
    label: "Lunch",
    color: "var(--chart-5)",
  },
  dinner: {
    label: "Dinner",
    color: "var(--chart-3)",
  },
  snack: {
    label: "Snack",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

type Props = {
  chartData: MealTotal[];
};

export const CalorieBreadownChart: FC<Props> = ({ chartData }) => {
  const totalCalories = chartData.reduce((sum, entry) => sum + entry.calories, 0).toFixed(0);

  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square max-h-[250px]"
    >
      <PieChart>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Pie
          data={chartData}
          dataKey="calories"
          nameKey="mealType"
          innerRadius={60}
          strokeWidth={5}
        >
          {chartData.map((entry) => (
            <Cell
              key={entry.mealType}
              fill={chartConfig[entry.mealType]?.color || "#ccc"}
            />
          ))}
          <Label
            content={({ viewBox }) => {
              if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                return (
                  <text
                    x={viewBox.cx}
                    y={viewBox.cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy}
                      className="fill-foreground text-3xl font-bold"
                    >
                      {totalCalories.toLocaleString()}
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 24}
                      className="fill-muted-foreground"
                    >
                      Calories
                    </tspan>
                  </text>
                );
              }
            }}
          />
        </Pie>
      </PieChart>
    </ChartContainer>
  );
};
