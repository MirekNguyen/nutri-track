import { getMeals } from "@/app/actions/meal-actions";
import { FoodEntryComponent } from "./food-entry";
import { PropsWithChildren, ReactNode } from "react";
import { Meal } from "@/db/schema";

type Props = {
  meals: Meal[];
  children: ReactNode;
};

export const FoodEntryDialogButton = ({ meals, children }: Props) => {
  return <FoodEntryComponent meals={meals}>{children}</FoodEntryComponent>;
};
