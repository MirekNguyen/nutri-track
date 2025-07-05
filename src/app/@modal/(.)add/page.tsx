"use client";

import Modal from "@/components/modal";
import { AddDialog } from "./add-dialog";
import { useRouter } from "next/navigation";

export default function ModalPage() {
  const router = useRouter();
  return (
    <Modal>
      <AddDialog submitAction={() => router.back()}/>
    </Modal>
  );
}
