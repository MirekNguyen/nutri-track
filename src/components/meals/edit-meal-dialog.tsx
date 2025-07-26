"use client";

import { updateMeal } from "@/actions/meal-actions";
import { useQueryClient } from "@tanstack/react-query";
import { NewMeal } from "@/db/schema";
import { FC, ReactNode } from "react";
import { toast } from "sonner";
import { MealDialog } from "./meal-dialog";

type Props = {
  id: number;
  meal: Partial<NewMeal>;
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
      toast("Success", {
        description: "Meal updated successfully",
      });
    } catch (error) {
      console.error("Error updating new meal:", error);
      toast("Error", {
        description: "Failed to update meal. Please try again.",
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
