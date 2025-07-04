"use client";


import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useState } from "react";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Meal } from "@/db/schema";
import { CustomEntryTab } from "./custom-entry-tab";
import { EntryTab } from "./entry-tab";

type Props = {
  selectedDate: Date;
  meals: Meal[];
};
export const AddDialog = ({ selectedDate, meals }: Props) => {
  const [addFoodTab, setAddFoodTab] = useState("choose");

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

        <EntryTab meals={meals} selectedDate={selectedDate} />
        <CustomEntryTab selectedDate={selectedDate} />
      </Tabs>
    </DialogContent>
  );
};
