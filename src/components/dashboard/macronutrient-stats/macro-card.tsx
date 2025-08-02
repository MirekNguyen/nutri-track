import { AlertCircle, TrendingUp } from "lucide-react";
import type React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface MacroCardProps {
  title: string;
  current: number;
  goal: number;
  unit: string;
  color: string;
  border: string;
  icon: React.ComponentType<{ className?: string }>;
  subtitle?: string;
  isOverLimit?: boolean;
}

export function MacroCard({
  title,
  current,
  goal,
  unit,
  color,
  border,
  icon: Icon,
  subtitle,
  isOverLimit,
}: MacroCardProps) {
  const percentage = Math.min(100, (current / (goal || 1)) * 100);
  const isMobile = true;

  return (
    <Card
      className={cn(
        "relative overflow-hidden transition-all hover:shadow-md",
        "border-l-4",
        border,
        isOverLimit ? "border-l-red-500" : `border-l-${color}-500`,
      )}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "rounded-full p-2",
                isOverLimit
                  ? "bg-red-100 dark:bg-red-900/20"
                  : `bg-${color}-100 dark:bg-${color}-900/20`,
              )}
            >
              <Icon
                className={cn(
                  "h-4 w-4",
                  isOverLimit
                    ? "text-red-600 dark:text-red-400"
                    : `text-${color}-600 dark:text-${color}-400`,
                )}
              />
            </div>
            <h3 className="font-semibold text-sm">{title}</h3>
          </div>
          {isOverLimit && <AlertCircle className="h-4 w-4 text-red-500" />}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="flex md:items-end justify-between flex-col md:flex-row">
            <span
              className={cn(
                "text-2xl font-bold",
                isOverLimit
                  ? "text-red-600 dark:text-red-400"
                  : `text-${color}-600 dark:text-${color}-400`,
              )}
            >
              {current.toFixed(0)}
              {unit}
            </span>
            <span className="text-sm text-muted-foreground">
              of {goal.toFixed(0)}
              {unit}
            </span>
          </div>

          <div className="mt-2 h-2 w-full bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full bg-${color}-500 dark:bg-${color}-400`}
              style={{
                width: `${percentage}%`,
              }}
            />
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            {!isMobile && (
              <span className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                {percentage.toFixed(0)}%
              </span>
            )}
            {subtitle && <span>{subtitle}</span>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
