import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";

type Props = {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
};

export const DateSelector = ({ selectedDate, setSelectedDate }: Props) => {
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  return (
    <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
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
              setDatePickerOpen(false);
            }
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};
