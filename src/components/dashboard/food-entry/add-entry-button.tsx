"use client";

import { PlusCircle } from "lucide-react";
import { AddFoodEntry } from "./add-food-entry";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

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
