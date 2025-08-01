"use client";

import { deleteFoodEntry } from "@/actions/food-entry-actions";
import { Button } from "@/components/ui/button";
import type { FoodEntry } from "@/db/schema";
import { Trash2 } from "lucide-react";
import type { PropsWithChildren } from "react";
import { toast } from "sonner";

type Props = {
  entry: FoodEntry;
  className?: string;
} & PropsWithChildren;
export const DeleteEntryButton = ({ entry, children, className }: Props) => {
  const handleDeleteEntry = async (id: number) => {
    try {
      await deleteFoodEntry(id);

      // Refresh the entries list

      toast("Success", {
        description: "Food entry deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting food entry:", error);
      toast("Error", {
        description: "Failed to delete food entry. Please try again.",
      });
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => handleDeleteEntry(entry.id)}
      className={`text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950 w-auto ${className}`}
    >
      <Trash2 className="h-4 w-4" /> {children}
    </Button>
  );
};
