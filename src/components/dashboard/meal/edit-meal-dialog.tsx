"use client";

import { updateMeal } from "@/actions/meal-actions";
import { toast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Meal, NewMeal } from "@/db/schema";
import { MealDialog } from "../meal/meal-dialog";
import { FC, ReactNode } from "react";

type Props = {
  id: number;
  meal: Meal;
  children: ReactNode;
};

export const EditMealDialog: FC<Props> = ({ id, children, meal }) => {
  const defaultValues: Partial<NewMeal> = {
    ...meal,
  };

  const queryClient = useQueryClient();
  const onSubmit = async (data: NewMeal) => {
    try {
      await updateMeal(id, { ...data });
      queryClient.invalidateQueries({ queryKey: ["getMeals"] });
      toast({
        title: "Success",
        description: "Meal updated successfully",
      });
    } catch (error) {
      console.error("Error updating new meal:", error);
      toast({
        title: "Error",
        description: "Failed to update meal. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <MealDialog
      onSubmitAction={onSubmit}
      submitText="Update"
      title="Update Meal"
      defaultValues={defaultValues}
    >
      {children}
    </MealDialog>
  );
};
