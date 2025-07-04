"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { FC, useState } from "react";

type Props = {
  date: Date;
}
export const DateSelector: FC<Props> = ({date}) => {
  const [selectedDate, setSelectedDate] = useState<Date>(date);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2 text-sm">
          <CalendarIcon className="h-4 w-4" />
          {format(selectedDate, "PPP")}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(date) => {
            if (date) {
              setSelectedDate(date);
              setOpen(false);
              router.push(`?date=${format(date, "yyyy-MM-dd")}`);
            }
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};
