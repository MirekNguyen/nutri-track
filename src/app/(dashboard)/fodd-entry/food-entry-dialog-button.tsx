import { getMeals } from "@/app/actions/meal-actions";
import { FoodEntryComponent } from "./food-entry";
import { PropsWithChildren } from "react";

export const FoodEntryDialogButton = async ({children} : PropsWithChildren) => {
  const meals = await getMeals();
  return (
    <FoodEntryComponent meals={meals}>
      {children}
    </FoodEntryComponent>

  );
}
