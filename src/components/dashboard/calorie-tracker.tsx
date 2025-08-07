"use client";

import { format } from "date-fns";
import { PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import type { PropsWithChildren } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { AISummary } from "../ai-summary";
import { DateSelector } from "../common/date-selector";
import { Button } from "../ui/button";
import {
  MiniCalendar,
  MiniCalendarDay,
  MiniCalendarDays,
  MiniCalendarNavigation,
} from "../ui/kibo-ui/mini-calendar";
import { AddFoodEntry } from "./food-entry/add-food-entry";

type Props = {
  selectedDate: string;
} & PropsWithChildren;

export const CalorieTracker = ({ selectedDate, children }: Props) => {
  const isMobile = useIsMobile();
  const router = useRouter();
  return (
    <>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        {!isMobile && (
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            Dashboard
          </h1>
        )}
        <MiniCalendar
          value={new Date(selectedDate)}
          onValueChange={(date) => {
            if (!date) return;
            router.push(`?date=${format(date, "yyyy-MM-dd")}`);
          }}
        >
          <MiniCalendarNavigation direction="prev" />
          <MiniCalendarDays>
            {(selectedDate) => (
              <MiniCalendarDay
                date={selectedDate}
                key={selectedDate.toISOString()}
              />
            )}
          </MiniCalendarDays>
          <MiniCalendarNavigation direction="next" />
        </MiniCalendar>
        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-between">
          <AISummary date={selectedDate} />
          <DateSelector date={new Date(selectedDate)} />
          {!isMobile && (
            <AddFoodEntry>
              <Button className="bg-green-600 hover:bg-green-700 text-sm text-white sm:w-auto">
                <PlusCircle className="mr-2 h-4 w-4" /> Add Entry
              </Button>
            </AddFoodEntry>
          )}
        </div>
      </div>
      {children}
    </>
  );
};
