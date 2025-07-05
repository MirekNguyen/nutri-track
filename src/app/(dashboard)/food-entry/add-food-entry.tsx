"use client";

import { AddDialog } from "@/app/@modal/(.)add/add-dialog";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { PlusCircle } from "lucide-react";
import { useState } from "react";

export const AddFoodEntry = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <AddDialog />
      </Dialog>
      <Button className="bg-green-600 hover:bg-green-700 text-sm w-full sm:w-auto" onClick={() => setIsOpen(true)}>
        <PlusCircle className="mr-2 h-4 w-4" /> Add Food Entry
      </Button>
    </>
  );
};
