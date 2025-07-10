"use client";

import { deleteFoodEntry } from "@/actions/food-entry-actions";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { FoodEntry } from "@/db/schema";
import { Trash2 } from "lucide-react";

type Props = {
  entry: FoodEntry;
};
export const DeleteEntryButton = ({ entry }: Props) => {
  const handleDeleteEntry = async (id: number) => {
    try {
      await deleteFoodEntry(id);

      // Refresh the entries list

      toast({
        title: "Success",
        description: "Food entry deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting food entry:", error);
      toast({
        title: "Error",
        description: "Failed to delete food entry. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => handleDeleteEntry(entry.id)}
      className="text-gray-400 hover:text-red-500 hover:bg-red-50"
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
};
