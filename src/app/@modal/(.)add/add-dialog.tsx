"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useState } from "react";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CustomEntryTab } from "./custom-entry-tab";
import { EntryTab } from "./entry-tab";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getMeals } from "@/app/actions/meal-actions";

export const AddDialog = () => {
  const [addFoodTab, setAddFoodTab] = useState("choose");
  const searchParams = useSearchParams();
  const dateParam = searchParams.get("date");

  const { data: meals = [] } = useQuery({
    queryKey: ["meals"],
    queryFn: getMeals,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  const date = dateParam ? new Date(dateParam) : new Date();

  return (
    <DialogContent className="sm:max-w-[550px] max-w-[95vw] p-4 overflow-y-auto max-h-[90vh]">
      <DialogHeader>
        <DialogTitle>Add Food Entry</DialogTitle>
        <DialogDescription>
          Choose from your saved meals or add a custom entry
        </DialogDescription>
      </DialogHeader>
      <Tabs value={addFoodTab} onValueChange={setAddFoodTab} className="mt-2">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="choose">Choose Meal</TabsTrigger>
          <TabsTrigger value="custom">Custom Entry</TabsTrigger>
        </TabsList>

        <EntryTab meals={meals} selectedDate={date} />
        <CustomEntryTab selectedDate={date} />
      </Tabs>
    </DialogContent>
  );
};
