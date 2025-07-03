"use client";

import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";

type Props = {
  selectedDate: string;
};

export const AddFoodEntry = ({ selectedDate }: Props) => {
  const router = useRouter();
  return (
    <>
      <Button
        className="bg-green-600 hover:bg-green-700 text-sm w-full sm:w-auto"
        onClick={() => router.push(`/add?date=${selectedDate}`)}
      >
        <PlusCircle className="mr-2 h-4 w-4" /> Add Food Entry
      </Button>
    </>
  );
};
