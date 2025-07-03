import { FoodEntry, Meal } from "@/db/schema";
import { DeleteEntryButton } from "./delete-entry-button";
import { format, parseISO } from "date-fns";

type Props = {
  entry: FoodEntry;
  meals: Meal[];
};

const formatEntryDateTime = (dateStr: string, timeStr: string) => {
  const date = parseISO(dateStr);
  const time = timeStr.split(":");
  const hours = Number.parseInt(time[0]);
  const minutes = Number.parseInt(time[1]);

  const dateTime = new Date(date);
  dateTime.setHours(hours);
  dateTime.setMinutes(minutes);

  return format(dateTime, "h:mm a");
};



export const FoodRecord = ({ entry, meals }: Props) => {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 hover:bg-gray-50 transition-colors">
      <div className="flex items-center gap-3">
        <div>
          <h3 className="font-medium text-gray-800">{entry.foodName}</h3>
          <div className="flex flex-wrap gap-x-3 text-xs text-gray-500 mt-1">
            <span>{formatEntryDateTime(entry.entryDate, entry.entryTime)}</span>
            <span className="font-medium">
              {entry.amount}{" "}
              {entry.mealId
                ? meals.find((m) => m.id === entry.mealId)?.unit || "serving"
                : "serving"}
            </span>
            {entry.protein && (
              <span className="text-blue-600">{entry.protein}g protein</span>
            )}
            {entry.carbs && (
              <span className="text-purple-600">{entry.carbs}g carbs</span>
            )}
            {entry.fat && (
              <span className="text-yellow-600">{entry.fat}g fat</span>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between sm:justify-end gap-4 mt-2 sm:mt-0">
        <span className="font-semibold text-gray-800">
          {entry.calories} cal
        </span>
        <DeleteEntryButton entry={entry} />
      </div>
    </div>
  );
};
