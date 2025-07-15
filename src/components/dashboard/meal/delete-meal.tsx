"use client";

import { deleteMeal } from "@/actions/meal-actions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Meal } from "@/db/schema";
import { Trash2 } from "lucide-react";
import { FC, useState } from "react";

type Props = {
  meal: Meal;
};

export const DeleteMeal: FC<Props> = ({ meal }) => {
  const [open, setOpen] = useState(false);

  const handleDeleteMeal = async () => {
    try {
      await deleteMeal(meal.id);

      toast({
        title: "Success",
        description: "Meal deleted successfully",
      });
      setOpen(false);
    } catch (error) {
      console.error("Error deleting meal:", error);
      toast({
        title: "Error",
        description: "Failed to delete meal. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-gray-500 hover:text-red-500"
        onClick={() => setOpen(true)}
      >
        <Trash2 size={16} />
      </Button>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the meal &quot;{meal.name}
              &quot;. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteMeal}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
