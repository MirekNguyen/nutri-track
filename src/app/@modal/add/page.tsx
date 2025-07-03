import Modal from "@/components/modal";
import { AddDialog } from "./add-dialog";

export default function ModalPage({
}) {
  return (
    <Modal>
      <AddDialog selectedDate={new Date()} meals={[]} />
    </Modal>
  );
}
