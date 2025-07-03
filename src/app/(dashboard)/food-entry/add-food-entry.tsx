"use client";

import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";

type Props = {
  selectedDate: string;
};

export const AddFoodEntry = ({ selectedDate }: Props) => {
  return (
    <>
      <Link href={`/add?date=${selectedDate}`}>
        <Button className="bg-green-600 hover:bg-green-700 text-sm w-full sm:w-auto">
          <PlusCircle className="mr-2 h-4 w-4" /> Add Food Entry
        </Button>
      </Link>
    </>
  );
};
