"use client";

import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { AddFoodEntry } from "./add-food-entry";

export const AddEntryButton = () => {
  const isMobile = useIsMobile();
  if (isMobile) return null;
  return (
    <AddFoodEntry>
      <Button className="bg-green-600 hover:bg-green-700 text-sm text-white sm:w-auto">
        <PlusCircle className="mr-2 h-4 w-4" /> Add Entry
      </Button>
    </AddFoodEntry>
  );
};
