import { PlusCircle, Search, Loader2, Plus, Loader } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";

import { useState } from "react";
import { createFoodEntry } from "@/app/actions/food-entry-actions";
import { toast } from "@/components/ui/use-toast";
import { UnitDropdown } from "../food-entry-dialog/unit-dropdown";
import { MealTypeDropdown } from "../food-entry-dialog/meal-type-dropdown";

export const FoodEntryComponent = ({ meals, setMeals, loadFoodEntries, setNewMealType, newMealType, foodEntryDialogOpen, setFoodEntryDialogOpen }) => {
  const [addFoodTab, setAddFoodTab] = useState("choose");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Food entry dialog state
  const [mealSearchQuery, setMealSearchQuery] = useState("");
  const [selectedMealId, setSelectedMealId] = useState<number | null>(null);

  // New meal dialog state
  const [newMealDialogOpen, setNewMealDialogOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newCalories, setNewCalories] = useState("");
  const [newProtein, setNewProtein] = useState("");
  const [newCarbs, setNewCarbs] = useState("");
  const [newFat, setNewFat] = useState("");
  const [newTags, setNewTags] = useState("");

  // Custom entry form state
  const [newFood, setNewFood] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Add state for the new fields
  // Add these after the other state declarations
  const [newAmount, setNewAmount] = useState("1");
  const [newUnit, setNewUnit] = useState("serving");

  const handleAddCustomEntry = async () => {
    if (newFood.trim() === "" || newCalories.trim() === "") return;

    setIsSubmitting(true);

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

      // Refresh the entries list
      await loadFoodEntries();

      resetFoodEntryForm();
      setFoodEntryDialogOpen(false);

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
    } finally {
      setIsSubmitting(false);
    }
  };
  const resetNewMealForm = () => {
    setNewName("");
    setNewDescription("");
    setNewCalories("");
    setNewProtein("");
    setNewCarbs("");
    setNewFat("");
    setNewTags("");
    setNewUnit("serving");
    setNewAmount("1");
  };
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

      // Refresh the entries list
      await loadFoodEntries();

      resetFoodEntryForm();
      setFoodEntryDialogOpen(false);

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
  };

  // Update the handleAddNewMeal function to include the unit field
  const handleAddNewMeal = async () => {
    if (newName.trim() === "" || newCalories.trim() === "") return;

    setIsSubmitting(true);

    try {
      const calories = Number.parseInt(newCalories);
      const protein = newProtein ? Number.parseInt(newProtein) : null;
      const carbs = newCarbs ? Number.parseInt(newCarbs) : null;
      const fat = newFat ? Number.parseInt(newFat) : null;
      const amount = Number.parseFloat(newAmount) || 1;

      if (isNaN(calories)) throw new Error("Invalid calories value");

      // Parse tags
      const tags = newTags.trim()
        ? newTags.split(",").map((tag) => tag.trim())
        : [];

      // Create the meal
      const newMealData = await createMeal({
        name: newName,
        unit: newUnit,
        description: newDescription || null,
        calories,
        protein,
        carbs,
        fat,
        tags: tags.length > 0 ? tags : null,
        isFavorite: false,
      });

      // Add the new meal to the meals list
      setMeals([newMealData, ...meals]);

      // Format date and time for database
      const entryDate = selectedDate.toISOString().split("T")[0];
      console.log("Selected date:", entryDate);
      const entryTime = new Date().toTimeString().split(" ")[0];

      // Create a food entry with this meal
      await createFoodEntry({
        foodName: newName,
        calories,
        protein,
        carbs,
        fat,
        amount,
        mealType: newMealType,
        entryDate,
        entryTime,
        mealId: newMealData.id,
      });

      // Refresh the entries list
      await loadFoodEntries();

      resetNewMealForm();
      setNewMealDialogOpen(false);
      setFoodEntryDialogOpen(false);

      toast({
        title: "Success",
        description: "Meal created and added to your food log",
      });
    } catch (error) {
      console.error("Error creating new meal:", error);
      toast({
        title: "Error",
        description: "Failed to create meal. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetFoodEntryForm = () => {
    setNewFood("");
    setNewCalories("");
    setNewProtein("");
    setNewCarbs("");
    setNewFat("");
    setNewAmount("1");
    setSelectedMealId(null);
    setMealSearchQuery("");
    setAddFoodTab("choose");
  };

  return (
    <Dialog
      open={foodEntryDialogOpen}
      onOpenChange={(isOpen) => {
        setFoodEntryDialogOpen(isOpen);
        if (!isOpen) resetFoodEntryForm();
      }}
    >
      <DialogTrigger asChild>
        <Button className="bg-green-600 hover:bg-green-700 text-sm w-full sm:w-auto">
          <PlusCircle className="mr-2 h-4 w-4" /> Add Food
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] max-w-[95vw] p-4 overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Add Food Entry</DialogTitle>
          <DialogDescription>
            Choose from your saved meals or add a custom entry
          </DialogDescription>
        </DialogHeader>

        <Tabs value={addFoodTab} onValueChange={setAddFoodTab} className="mt-2">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="choose">Choose Meal</TabsTrigger>
            <TabsTrigger value="custom">Custom Entry</TabsTrigger>
          </TabsList>

          <TabsContent
            value="choose"
            className="space-y-4 mt-4 overflow-x-hidden"
          >
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
              <Dialog
                open={newMealDialogOpen}
                onOpenChange={(isOpen) => {
                  setNewMealDialogOpen(isOpen);
                  if (!isOpen) resetNewMealForm();
                }}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="ml-2 whitespace-nowrap"
                  >
                    <Plus className="h-4 w-4 mr-1" /> New Meal
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px] max-w-[95vw]">
                  <DialogHeader>
                    <DialogTitle>Add New Meal</DialogTitle>
                    <DialogDescription>
                      Enter the details of your meal including nutritional
                      information.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">
                        Name
                      </Label>
                      <Input
                        id="name"
                        placeholder="e.g., Grilled Chicken Salad"
                        className="col-span-3"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                      />
                    </div>
                    <UnitDropdown newUnit={newUnit} setNewUnit={setNewUnit} />
                    <div className="grid grid-cols-4 items-start gap-4">
                      <Label htmlFor="description" className="text-right pt-2">
                        Description
                      </Label>
                      <Textarea
                        id="description"
                        placeholder="Describe your meal..."
                        className="col-span-3"
                        value={newDescription}
                        onChange={(e) => setNewDescription(e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="calories" className="text-right">
                        Calories
                      </Label>
                      <Input
                        id="calories"
                        type="number"
                        placeholder="e.g., 350"
                        className="col-span-3"
                        value={newCalories}
                        onChange={(e) => setNewCalories(e.target.value)}
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
                            type="number"
                            placeholder="e.g., 30"
                            value={newProtein}
                            onChange={(e) => setNewProtein(e.target.value)}
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
                            type="number"
                            placeholder="e.g., 40"
                            value={newCarbs}
                            onChange={(e) => setNewCarbs(e.target.value)}
                          />
                        </div>
                        <div>
                          <Label
                            htmlFor="fat"
                            className="text-xs text-gray-500 mb-1 block"
                          >
                            Fat
                          </Label>
                          <Input
                            id="fat"
                            type="number"
                            placeholder="e.g., 15"
                            value={newFat}
                            onChange={(e) => setNewFat(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="tags" className="text-right">
                        Tags
                      </Label>
                      <Input
                        id="tags"
                        placeholder="e.g., high-protein, lunch (comma separated)"
                        className="col-span-3"
                        value={newTags}
                        onChange={(e) => setNewTags(e.target.value)}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setNewMealDialogOpen(false)}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="bg-green-600 hover:bg-green-700"
                      onClick={handleAddNewMeal}
                      disabled={isSubmitting || !newName || !newCalories}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        "Save & Add to Log"
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="border rounded-md">
              <ScrollArea className="h-[200px] w-full">
                {filteredMeals.length > 0 ? (
                  <div className="divide-y">
                    {filteredMeals.map((meal) => (
                      <div
                        key={meal.id}
                        className={`p-3 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition-colors ${selectedMealId === meal.id ? "bg-green-50 border-l-4 border-green-600" : ""}`}
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
                      <span className="text-gray-400">or</span>
                      <Button
                        variant="link"
                        className="text-green-600"
                        onClick={() => setNewMealDialogOpen(true)}
                      >
                        Create a new meal
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
                      {meals.find((m) => m.id === selectedMealId)?.unit ||
                        "serving"}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <MealTypeDropdown
              newMealType={newMealType}
              setNewMealType={setNewMealType}
            />
          </TabsContent>

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
                  <Label
                    htmlFor="fat"
                    className="text-xs text-gray-500 mb-1 block"
                  >
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
            <div className="flex justify-end">
              <Button
                variant="outline"
                size="sm"
                className="text-green-600"
                onClick={() => setNewMealDialogOpen(true)}
              >
                <Plus className="h-4 w-4 mr-1" /> Save as Meal
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-6">
          <Button
            variant="outline"
            onClick={() => setFoodEntryDialogOpen(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            className="bg-green-600 hover:bg-green-700"
            onClick={
              addFoodTab === "custom"
                ? handleAddCustomEntry
                : handleAddMealEntry
            }
            disabled={
              isSubmitting ||
              (addFoodTab === "custom"
                ? !newFood || !newCalories
                : !selectedMealId)
            }
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
      </DialogContent>
    </Dialog>
  );
};
