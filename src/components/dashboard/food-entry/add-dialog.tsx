"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { FC, useState } from "react";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CustomEntryTab } from "./custom-entry-tab";
import { EntryTab } from "./entry-tab";

type Props = {
  submitAction: () => void;
  cancelAction: () => void;
  type: "breakfast" | "lunch" | "dinner" | "snack";
}
export const AddDialog: FC<Props> = ({submitAction, cancelAction, type}) => {
  const [foodTab, setFoodTab] = useState<string>("choose");

  return (
    <DialogContent className="sm:max-w-[550px] max-w-[95vw] p-4 overflow-y-auto max-h-[90vh]">
      <DialogHeader>
        <DialogTitle>Add Food Entry</DialogTitle>
        <DialogDescription>
          Choose from your saved meals or add a custom entry
        </DialogDescription>
      </DialogHeader>
      <Tabs value={foodTab} onValueChange={setFoodTab} className="mt-2">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="choose">Choose Meal</TabsTrigger>
          <TabsTrigger value="custom">Custom Entry</TabsTrigger>
        </TabsList>
        <EntryTab submitAction={submitAction} cancelAction={cancelAction} type={type}/>
        <CustomEntryTab />
      </Tabs>
    </DialogContent>
  );
};
