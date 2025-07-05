"use client";

import { Search, Loader } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

import { DialogFooter } from "@/components/ui/dialog";
import { MealTypeDropdown } from "@/app/(dashboard)/food-entry/meal-type-dropdown";
import { useSearchParams } from "next/navigation";
import { FC, useState } from "react";
import { getMeals } from "@/app/actions/meal-actions";
import { createFoodEntry } from "@/app/actions/food-entry-actions";
import { toast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { NewMealDialog } from "./new-meal-dialog";

type Props = {
  submitAction: () => void;
  cancelAction: () => void;
};

export const EntryTab: FC<Props> = ({ submitAction, cancelAction }) => {
  const searchParams = useSearchParams();
  const dateParam = searchParams.get("date");
  const selectedDate = dateParam ? new Date(dateParam) : new Date();

  const { data: meals = [], isLoading: mealsAreLoading } = useQuery({
    queryKey: ["meals"],
    queryFn: getMeals,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  const [newMealType, setNewMealType] = useState<string>("breakfast");
  const [addFoodTab, setAddFoodTab] = useState("choose");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Food entry dialog state
  const [mealSearchQuery, setMealSearchQuery] = useState("");
  const [selectedMealId, setSelectedMealId] = useState<number | null>(null);

  const [newAmount, setNewAmount] = useState("1");

  // Filter meals based on search query
  const filteredMeals = meals.filter((meal) =>
    meal.name.toLowerCase().includes(mealSearchQuery.toLowerCase()),
  );

  // Update the handleAddMealEntry function to include the amount field
  const handleAddMealEntry = async () => {
    if (!selectedMealId) return;

    setIsSubmitting(true);

    try {
      const selectedMeal = meals.find((meal) => meal.id === selectedMealId);
      if (!selectedMeal) throw new Error("Meal not found");

      const amount = Number.parseFloat(newAmount) || 1;

      // Format date and time for database
      // const entryDate = selectedDate.toISOString().split("T")[0];
      const entryDate = selectedDate.toLocaleDateString("en-CA");
      const entryTime = new Date().toTimeString().split(" ")[0];

      await createFoodEntry({
        foodName: selectedMeal.name,
        calories: Math.round(selectedMeal.calories * amount),
        protein: selectedMeal.protein
          ? Math.round(selectedMeal.protein * amount)
          : null,
        carbs: selectedMeal.carbs
          ? Math.round(selectedMeal.carbs * amount)
          : null,
        fat: selectedMeal.fat ? Math.round(selectedMeal.fat * amount) : null,
        amount,
        mealType: newMealType,
        entryDate,
        entryTime,
        mealId: selectedMeal.id,
      });

      toast({
        title: "Success",
        description: "Food entry added successfully",
      });
    } catch (error) {
      console.error("Error adding meal entry:", error);
      toast({
        title: "Error",
        description: "Failed to add food entry. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
    submitAction();
  };

  return (
    <TabsContent value="choose" className="space-y-4 mt-4 overflow-x-hidden">
      <div className="flex justify-between items-center">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={16}
          />
          <Input
            placeholder="Search meals..."
            className="pl-9"
            value={mealSearchQuery}
            onChange={(e) => setMealSearchQuery(e.target.value)}
          />
        </div>
        <NewMealDialog />
      </div>

      <div className="border rounded-md">
        <ScrollArea className="h-[200px] w-full">
          {mealsAreLoading ? (
            <div className="flex items-center justify-center h-[200px] text-gray-500">
              <Loader className="animate-spin mr-2" />
              Loading meals...
            </div>
          ) : filteredMeals.length > 0 ? (
            <div className="divide-y">
              {filteredMeals.map((meal) => (
                <div
                  key={meal.id}
                  className={`p-3 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedMealId === meal.id
                      ? "bg-green-50 border-l-4 border-green-600"
                      : ""
                  }`}
                  onClick={() => setSelectedMealId(meal.id)}
                >
                  <div>
                    <h4 className="font-medium">{meal.name}</h4>
                    <div className="text-sm text-gray-500 flex gap-3 mt-1">
                      <span>{meal.calories} cal</span>
                      <span className="text-blue-600">
                        {meal.protein}g protein
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">
                      <span>C: {meal.carbs}g</span> •{" "}
                      <span>F: {meal.fat}g</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-4 text-gray-500">
              <p>No meals found</p>
              <div className="flex gap-2 mt-2">
                <Button
                  variant="link"
                  className="text-green-600"
                  onClick={() => setAddFoodTab("custom")}
                >
                  Add a custom entry
                </Button>
              </div>
            </div>
          )}
        </ScrollArea>
      </div>

      <div className="grid grid-cols-4 items-center gap-4 mt-4">
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
          {selectedMealId && (
            <div className="flex items-center bg-gray-100 px-3 py-2 rounded-md text-sm text-gray-700 min-w-24">
              <span className="font-medium">
                {meals.find((m) => m.id === selectedMealId)?.unit || "serving"}
              </span>
            </div>
          )}
        </div>
      </div>
      <MealTypeDropdown
        newMealType={newMealType}
        setNewMealType={setNewMealType}
      />
      <DialogFooter className="mt-6">
        <Button variant="outline" disabled={isSubmitting} onClick={cancelAction}>
          Cancel
        </Button>
        <Button
          className="bg-green-600 hover:bg-green-700"
          onClick={addFoodTab === "custom" ? () => {} : handleAddMealEntry}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Add Entry"
          )}
        </Button>
      </DialogFooter>
    </TabsContent>
  );
};
