import Modal from "@/components/modal";
import { AddDialog } from "./add-dialog";
import { format } from "date-fns";
import { getMeals } from "@/app/actions/meal-actions";

export default async function ModalPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const date = (await searchParams).date ?? new Date();
  const selectedDate = format(date ?? new Date(), "yyyy-MM-dd");
  const meals = await getMeals();

  return (
    <Modal>
      <AddDialog selectedDate={new Date(selectedDate)} meals={meals} />
    </Modal>
  );
}
