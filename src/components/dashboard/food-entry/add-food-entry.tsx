"use client";

import { AddDialog } from "@/app/(dashboard)/food-entry/add-dialog";
import { Dialog } from "@/components/ui/dialog";
import { FC, ReactNode, useState } from "react";
type Props = {
  type?: "breakfast" | "lunch" | "dinner" | "snack";
  children: ReactNode;
};
export const AddFoodEntry: FC<Props> = ({ children, type = "breakfast" }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <AddDialog
          submitAction={() => setIsOpen(false)}
          cancelAction={() => setIsOpen(false)}
          type={type}
        />
      </Dialog>
      <div onClick={() => setIsOpen(true)}>{children}</div>
    </>
  );
};
