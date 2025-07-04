"use client";

import { MealTypeDropdown } from "@/app/(dashboard)/food-entry/meal-type-dropdown";
import { createFoodEntry } from "@/app/actions/food-entry-actions";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TabsContent } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { useSearchParams } from "next/navigation";
import { FC, useState } from "react";

export const CustomEntryTab: FC = () => {
  const searchParams = useSearchParams();
  const dateParam = searchParams.get("date");
  const selectedDate = dateParam ? new Date(dateParam) : new Date();

  const [newMealType, setNewMealType] = useState<string>("breakfast");
  const [newCalories, setNewCalories] = useState("");
  const [newProtein, setNewProtein] = useState("");
  const [newCarbs, setNewCarbs] = useState("");
  const [newFat, setNewFat] = useState("");
  const [newFood, setNewFood] = useState("");
  const [newAmount, setNewAmount] = useState("1");
  const [newUnit, setNewUnit] = useState("serving");

  const resetFoodEntryForm = () => {
    setNewFood("");
    setNewCalories("");
    setNewProtein("");
    setNewCarbs("");
    setNewFat("");
    setNewAmount("1");
  };
  const handleAddCustomEntry = async () => {
    if (newFood.trim() === "" || newCalories.trim() === "") return;

    try {
      const calories = Number.parseInt(newCalories);
      const protein = newProtein ? Number.parseInt(newProtein) : null;
      const carbs = newCarbs ? Number.parseInt(newCarbs) : null;
      const fat = newFat ? Number.parseInt(newFat) : null;
      const amount = Number.parseFloat(newAmount) || 1;

      if (isNaN(calories)) throw new Error("Invalid calories value");

      // Format date and time for database
      const entryDate = selectedDate.toISOString().split("T")[0];
      const entryTime = new Date().toTimeString().split(" ")[0];

      await createFoodEntry({
        foodName: newFood,
        calories,
        protein,
        carbs,
        fat,
        amount,
        mealType: newMealType,
        entryDate,
        entryTime,
        mealId: null,
      });

      resetFoodEntryForm();

      toast({
        title: "Success",
        description: "Food entry added successfully",
      });
    } catch (error) {
      console.error("Error adding custom entry:", error);
      toast({
        title: "Error",
        description: "Failed to add food entry. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
      <TabsContent value="custom" className="space-y-4 mt-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="food" className="text-right">
            Food Name
          </Label>
          <Input
            id="food"
            value={newFood}
            onChange={(e) => setNewFood(e.target.value)}
            className="col-span-3"
            placeholder="e.g., Grilled Chicken Salad"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="calories" className="text-right">
            Calories
          </Label>
          <Input
            id="calories"
            value={newCalories}
            onChange={(e) => setNewCalories(e.target.value)}
            className="col-span-3"
            type="number"
            placeholder="e.g., 450"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label className="text-right">Macros (g)</Label>
          <div className="col-span-3 grid grid-cols-3 gap-2">
            <div>
              <Label
                htmlFor="protein"
                className="text-xs text-gray-500 mb-1 block"
              >
                Protein
              </Label>
              <Input
                id="protein"
                value={newProtein}
                onChange={(e) => setNewProtein(e.target.value)}
                type="number"
                placeholder="0"
              />
            </div>
            <div>
              <Label
                htmlFor="carbs"
                className="text-xs text-gray-500 mb-1 block"
              >
                Carbs
              </Label>
              <Input
                id="carbs"
                value={newCarbs}
                onChange={(e) => setNewCarbs(e.target.value)}
                type="number"
                placeholder="0"
              />
            </div>
            <div>
              <Label htmlFor="fat" className="text-xs text-gray-500 mb-1 block">
                Fat
              </Label>
              <Input
                id="fat"
                value={newFat}
                onChange={(e) => setNewFat(e.target.value)}
                type="number"
                placeholder="0"
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="amount" className="text-right">
            Amount
          </Label>
          <div className="col-span-3 flex gap-2 items-center">
            <Input
              id="amount"
              type="number"
              step="0.1"
              min="0.1"
              placeholder="1"
              value={newAmount}
              onChange={(e) => setNewAmount(e.target.value)}
              className="flex-1"
            />
            <Select
              value={newUnit}
              onValueChange={(value) => setNewUnit(value)}
            >
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Unit" />
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
        </div>
        <MealTypeDropdown
          newMealType={newMealType}
          setNewMealType={setNewMealType}
        />
        <DialogFooter className="mt-6">
          <Button variant="outline">Cancel</Button>
          <Button
            className="bg-green-600 hover:bg-green-700"
            onClick={handleAddCustomEntry}
          >
            Add Entry
          </Button>
        </DialogFooter>
      </TabsContent>
  );
};
