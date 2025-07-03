import { AddDialog } from "./add-dialog";
import { format } from "date-fns";
import { getMeals } from "@/app/actions/meal-actions";

export const ModalAddDialog = async () => {
  const date = new Date();
  const selectedDate = format(date ?? new Date(), "yyyy-MM-dd");
  const mealsData = await getMeals();

  return <AddDialog selectedDate={new Date(selectedDate)} meals={mealsData} />;
};
