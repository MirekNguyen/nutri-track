"use client";
import { FoodEntry, Meal } from "@/db/schema";
import { DeleteEntryButton } from "./delete-entry-button";
import { format, parseISO } from "date-fns";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useIsMobile } from "@/hooks/use-mobile";

type Props = {
  entry: FoodEntry;
  meals: Meal[];
};

const formatEntryDateTime = (dateStr: string, timeStr: string) => {
  const date = parseISO(dateStr);
  const time = timeStr.split(":");
  const hours = Number.parseInt(time[0]);
  const minutes = Number.parseInt(time[1]);

  const dateTime = new Date(date);
  dateTime.setHours(hours);
  dateTime.setMinutes(minutes);

  return format(dateTime, "h:mm a");
};

export const FoodRecord = ({ entry, meals }: Props) => {
  const isMobile = useIsMobile();
  if (isMobile) {
    return <MobileFoodRecord entry={entry} meals={meals} />;
  }
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 hover:bg-muted/50 transition-colors">
      <div className="flex items-center gap-3">
        <div>
          <h3 className="font-medium text-foreground">{entry.foodName}</h3>
          <div className="flex flex-wrap gap-x-3 text-xs text-muted-foreground mt-1">
            <span>{formatEntryDateTime(entry.entryDate, entry.entryTime)}</span>
            <span className="font-medium">
              {entry.amount}{" "}
              {entry.mealId
                ? meals.find((m) => m.id === entry.mealId)?.unit || "serving"
                : "serving"}
            </span>
            <span className="text-blue-600 dark:text-blue-400">
              {entry.protein.toFixed(0)}g protein
            </span>
            <span className="text-purple-600 dark:text-purple-400">
              {entry.carbs.toFixed(0)}g carbs
            </span>
            <span className="text-yellow-600 dark:text-yellow-400">
              {entry.fat.toFixed(0)}g fat
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between sm:justify-end gap-4 mt-2 sm:mt-0">
        <span className="font-semibold text-foreground">
          {entry.calories.toFixed(0)} kcal
        </span>
        <DeleteEntryButton entry={entry} />
      </div>
    </div>
  );
};

const MobileFoodRecord = ({ entry, meals }: Props) => {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center px-4 hover:bg-muted/50 transition-colors">
      <div>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value={entry.id.toString()}>
            <AccordionTrigger>
              <div className="flex items-center justify-between w-full">
                <h3 className="font-medium text-foreground">
                  {entry.foodName}
                </h3>
                <p>{entry.calories.toFixed(0)} kcal</p>
              </div>
            </AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4 text-balance">
              <div className="flex flex-col gap-1">
              <div className="flex flex-wrap gap-x-3 text-xs text-muted-foreground mt-1">
                <span>
                  {formatEntryDateTime(entry.entryDate, entry.entryTime)}
                </span>
                <span className="font-medium">
                  {entry.amount}{" "}
                  {entry.mealId
                    ? meals.find((m) => m.id === entry.mealId)?.unit ||
                      "serving"
                    : "serving"}
                </span>
              </div>
              <div className="flex flex-wrap gap-x-3 text-xs text-muted-foreground">
                <span className="text-blue-600 dark:text-blue-400">
                  {entry.protein.toFixed(0)}g protein
                </span>
                <span className="text-purple-600 dark:text-purple-400">
                  {entry.carbs.toFixed(0)}g carbs
                </span>
                <span className="text-yellow-600 dark:text-yellow-400">
                  {entry.fat.toFixed(0)}g fat
                </span>
              </div></div>
              <DeleteEntryButton
                entry={entry}
                className="border hover:border-red-600 dark:hover:border-red-400"
              >
                <p className="text-sm">Delete Entry</p>
              </DeleteEntryButton>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};
