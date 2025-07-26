import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  newMealType: string;
  setNewMealType: (value: string) => void;
};

export const MealTypeDropdown = ({ newMealType, setNewMealType }: Props) => {
  return (
    <Select
      value={newMealType}
      onValueChange={(value) => setNewMealType(value)}
    >
      <SelectTrigger className="col-span-3">
        <SelectValue placeholder="Select meal type" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="breakfast">Breakfast</SelectItem>
        <SelectItem value="lunch">Lunch</SelectItem>
        <SelectItem value="dinner">Dinner</SelectItem>
        <SelectItem value="snack">Snack</SelectItem>
      </SelectContent>
    </Select>
  );
};
