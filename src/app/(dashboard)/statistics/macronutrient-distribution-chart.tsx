"use client";

import { Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { TrendingUp } from "lucide-react";

export const description = "A pie chart with a legend";
type Props = {
  macroDistribution: {
    protein: number;
    carbs: number;
    fat: number;
    caffeine: number;
  }
}

export function MacronutrientDistributionChart({ macroDistribution}: Props) {
  const chartData = [
    { macro: "protein", amount: macroDistribution.protein, fill: "var(--color-protein)" },
    { macro: "carbs", amount: macroDistribution.carbs, fill: "var(--color-carbs)" },
    { macro: "fat", amount: macroDistribution.fat, fill: "var(--color-fat)" },
  ];
  const chartConfig = {
    protein: {
      label: `Protein (${macroDistribution.protein}g)`,
      color: "var(--chart-1)",
    },
    carbs: {
      label: `Carbs (${macroDistribution.carbs}g)`,
      color: "var(--chart-2)",
    },
    fat: {
      label: `Fat (${macroDistribution.fat}g)`,
      color: "var(--chart-3)",
    },
  } satisfies ChartConfig;
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Macronutrient distribution</CardTitle>
        <CardDescription>Your average macronutrient breakdown</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[300px]"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie data={chartData} dataKey="amount" nameKey="macro" />
            <ChartLegend
              content={<ChartLegendContent nameKey="macro" />}
              className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center text-sm"
            />
          </PieChart>
        </ChartContainer>
        {macroDistribution.caffeine > 0 && (
          <CardFooter className="flex-col gap-2 text-sm items-center">
            <div className="flex gap-2 leading-none font-medium text-center">
              Average caffeine intake {macroDistribution.caffeine} mg <TrendingUp className="h-4 w-4" />
            </div>
        </CardFooter>
      )}

      </CardContent>
    </Card>
  );
}
