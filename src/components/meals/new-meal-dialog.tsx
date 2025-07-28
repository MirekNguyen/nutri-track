"use client";

import { createMeal } from "@/actions/meal-actions";
import { useQueryClient } from "@tanstack/react-query";
import { NewMeal } from "@/db/schema";
import { FC, PropsWithChildren } from "react";
import { toast } from "sonner";
import { MealDialog } from "./meal-dialog";

export const NewMealDialog: FC<PropsWithChildren> = ({ children }) => {
  const defaultValues = {
    description: null,
    unit: "serving",
  };

  const queryClient = useQueryClient();
  const onSubmit = async (data: NewMeal) => {
    try {
      await createMeal({ ...data });
      queryClient.invalidateQueries({ queryKey: ["getMeals"] });
      toast("Success", {
        description: "Meal created successfully",
      });
    } catch (error) {
      console.error("Error creating new meal:", error);
      toast.error("Error", {
        description: "Failed to create meal. Please try again.",
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
