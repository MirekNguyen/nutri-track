import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  newUnit: string;
  setNewUnit: (value: string) => void;
};
export const UnitDropdown = ({ newUnit, setNewUnit }: Props) => {
  return (
    <div className="grid grid-cols-4 items-center gap-4">
      <Label htmlFor="unit" className="text-right">
        Unit
      </Label>
      <Select value={newUnit} onValueChange={(value) => setNewUnit(value)}>
        <SelectTrigger id="unit">
          <SelectValue placeholder="Select unit" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="serving">serving</SelectItem>
          <SelectItem value="g">grams (g)</SelectItem>
          <SelectItem value="ml">milliliters (ml)</SelectItem>
          <SelectItem value="oz">ounces (oz)</SelectItem>
          <SelectItem value="cup">cup</SelectItem>
          <SelectItem value="tbsp">tablespoon</SelectItem>
          <SelectItem value="tsp">teaspoon</SelectItem>
          <SelectItem value="piece">piece</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
