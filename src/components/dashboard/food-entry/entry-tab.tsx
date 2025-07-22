"use client";

import { Search, Loader } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

import { DialogFooter } from "@/components/ui/dialog";
import { useSearchParams } from "next/navigation";
import { FC, useState } from "react";
import { getMeals } from "@/actions/meal-actions";
import { createFoodEntry } from "@/actions/food-entry-actions";
import { toast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { NewMealDialog } from "../meal/new-meal-dialog";
import { MealTypeDropdown } from "../meal/meal-type-dropdown";

type Props = {
  submitAction: () => void;
  cancelAction: () => void;
  type: "breakfast" | "lunch" | "dinner" | "snack";
};

export const EntryTab: FC<Props> = ({ submitAction, cancelAction, type }) => {
  const searchParams = useSearchParams();
  const dateParam = searchParams.get("date");
  const selectedDate = dateParam ? new Date(dateParam) : new Date();

  const { data: meals = [], isLoading: mealsAreLoading } = useQuery({
    queryKey: ["meals"],
    queryFn: getMeals,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  const [newMealType, setNewMealType] = useState<string>(type);
  const [addFoodTab, setAddFoodTab] = useState("choose");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Food entry dialog state
  const [mealSearchQuery, setMealSearchQuery] = useState("");
  const [selectedMealId, setSelectedMealId] = useState<number | null>(null);

  const [newAmount, setNewAmount] = useState(1);

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

      // Format date and time for database
      // const entryDate = selectedDate.toISOString().split("T")[0];
      const entryDate = selectedDate.toLocaleDateString("en-CA");
      const entryTime = new Date().toTimeString().split(" ")[0];
      console.log(selectedMeal);

      await createFoodEntry({
        foodName: selectedMeal.name,
        calories: selectedMeal.calories * newAmount,
        protein: selectedMeal.protein * newAmount,
        carbs: selectedMeal.carbs * newAmount,
        fat: selectedMeal.fat * newAmount,
        amount: newAmount,
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
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
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
                  className={`p-3 flex justify-between items-center cursor-pointer hover:bg-muted/50 transition-colors ${
                    selectedMealId === meal.id
                    ? "bg-green-50 dark:bg-green-950/20 border-l-4 border-green-600 dark:border-green-400"
                    : ""
                    }`}
                  onClick={() => setSelectedMealId(meal.id)}
                >
                  <div>
                      <h4 className="font-medium text-foreground">{meal.name}</h4>
                      <div className="text-sm text-muted-foreground flex gap-3 mt-1">
                      <span>{meal.calories} cal</span>
                      <span className="text-blue-600 dark:text-blue-400">
                        {meal.protein}g protein
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">
                      <span>C: {meal.carbs}g</span> •{" "}
                      <span>F: {meal.fat}g</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-4 text-muted-foreground">
              <p>No meals found</p>
              <div className="flex gap-2 mt-2">
                <Button
                  variant="link"
                  className="text-green-600 dark:text-green-400"
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
            onChange={(e) => setNewAmount(e.target.valueAsNumber)}
            className="flex-1"
          />
          {selectedMealId && (
            <div className="flex items-center bg-muted px-3 py-2 rounded-md text-sm text-foreground min-w-24">
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
