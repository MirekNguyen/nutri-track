"use client";

import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { FC, ReactNode, useState } from "react";
import { AddDialog } from "./add-dialog";
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
          type={type}
        />
          <DialogTrigger asChild>
            {children}
          </DialogTrigger>
      </Dialog>
      {/* <div onClick={() => setIsOpen(true)}>{children}</div> */}
    </>
  );
};
