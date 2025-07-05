"use client";

import { AddDialog } from "@/app/@modal/(.)add/add-dialog";
import { Dialog } from "@/components/ui/dialog";
import { FC, PropsWithChildren, useState } from "react";

export const AddFoodEntry: FC<PropsWithChildren> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <AddDialog submitAction={() => setIsOpen(false)} />
      </Dialog>
      <div onClick={() => setIsOpen(true)}>{children}</div>
    </>
  );
};
