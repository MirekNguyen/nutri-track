"use client";

import { createMeal } from "@/actions/meal-actions";
import { toast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { NewMeal } from "@/db/schema";
import { MealDialog } from "../meal/meal-dialog";
import { FC, PropsWithChildren } from "react";

export const NewMealDialog: FC<PropsWithChildren> = ({ children }) => {
  const defaultValues: Partial<NewMeal> = {
    unit: "serving",
  };

  const queryClient = useQueryClient();
  const onSubmit = async (data: NewMeal) => {
    try {
      await createMeal({ ...data });
      queryClient.invalidateQueries({ queryKey: ["getMeals"] });
      toast({
        title: "Success",
        description: "Meal created successfully",
      });
    } catch (error) {
      console.error("Error creating new meal:", error);
      toast({
        title: "Error",
        description: "Failed to create meal. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <MealDialog
      onSubmitAction={onSubmit}
      submitText="Add Meal"
      title="Add New Meal"
      defaultValues={defaultValues}
    >
      {children}
    </MealDialog>
  );
};
