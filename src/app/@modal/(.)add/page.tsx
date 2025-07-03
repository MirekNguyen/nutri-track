import Modal from "@/components/modal";
import { AddDialog } from "./add-dialog";
import { format } from "date-fns";

export default async function ModalPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const date = (await searchParams).date ?? new Date();
  const selectedDate = format(date ?? new Date(), "yyyy-MM-dd");

  return (
    <Modal>
      <AddDialog selectedDate={new Date(selectedDate)} meals={[]} />
    </Modal>
  );
}
