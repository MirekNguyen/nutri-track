"use client";

import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { FoodEntryDialog2 } from "./food-entry-dialog";
import { Meal } from "@/db/schema";

type Props = {
  meals: Meal[];
};

export const AddFoodEntry = ({ meals }: Props) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <FoodEntryDialog2
        meals={meals}
        foodEntryDialogOpen={open}
        setOpenAction={setOpen}
      />
      <Button
        className="bg-green-600 hover:bg-green-700 text-sm w-full sm:w-auto"
        onClick={() => setOpen(true)}
      >
        <PlusCircle className="mr-2 h-4 w-4" /> Add Food Entry
      </Button>
    </>
  );
};
