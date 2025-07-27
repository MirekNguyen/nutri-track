"use client";

import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { FC, ReactNode, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CustomEntryForm } from "./custom-entry-form";
import { EntryForm } from "./entry-form";

type Props = {
  type?: "breakfast" | "lunch" | "dinner" | "snack";
  children: ReactNode;
};
export const AddFoodEntry: FC<Props> = ({ children, type = "breakfast" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [foodTab, setFoodTab] = useState<string>("choose");
  const isMobile = useIsMobile();

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[550px] max-w-[95vw] p-4 overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Add Food Entry</DialogTitle>
            {!isMobile && (
              <DialogDescription>
                Choose from your saved meals or add a custom entry
              </DialogDescription>
            )}
          </DialogHeader>
          <Tabs value={foodTab} onValueChange={setFoodTab} className="mt-2">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="choose">Choose Meal</TabsTrigger>
              <TabsTrigger value="custom">Custom Entry</TabsTrigger>
            </TabsList>
            <TabsContent value="choose">
              <EntryForm submitAction={() => setIsOpen(false)} type={type} />
            </TabsContent>
            <TabsContent value="custom">
              <CustomEntryForm submitAction={() => setIsOpen(false)}  />
            </TabsContent>
          </Tabs>
        </DialogContent>
        <DialogTrigger asChild>{children}</DialogTrigger>
      </Dialog>
    </>
  );
};
