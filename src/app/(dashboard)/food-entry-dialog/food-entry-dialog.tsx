import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Meal } from "@/types/meal";
import { Loader, Loader2, Plus, PlusCircle, Search } from "lucide-react";

type Props = {
  foodEntryDialogOpen: boolean;
  setFoodEntryDialogOpen: (isOpen: boolean) => void;
  meals: Meal[];
  addFoodTab: string;
  setAddFoodTab: (tab: string) => void;
  mealSearchQuery: string;
  setMealSearchQuery: (query: string) => void;
  selectedMealId: number | null;
  setSelectedMealId: (id: number | null) => void;
  newMealDialogOpen: boolean;
  setNewMealDialogOpen: (isOpen: boolean) => void;
  newName: string;
  setNewName: (name: string) => void;
  newUnit: string;
  setNewUnit: (unit: string) => void;
  newDescription: string;
  setNewDescription: (description: string) => void;
  newCalories: string;
  setNewCalories: (calories: string) => void;
  newProtein: string;
  setNewProtein: (protein: string) => void;
  newCarbs: string;
  setNewCarbs: (carbs: string) => void;
  newFat: string;
  handleAddMealEntry: () => void;
  handleAddCustomEntry: () => void;
  handleAddNewMeal: () => void;
  isSubmitting: boolean;
  newFood: string;
  resetFoodEntryForm: () => void;
  newTags: string;
  setNewTags: (tags: string) => void;
  newAmount: string;
  setNewAmount: (amount: string) => void;
  filteredMeals: Meal[];
  setNewMealType: (type: string) => void;
  setNewFat: (fat: string) => void;
  resetNewMealForm: () => void;
  newMealType: string;
  setNewFood: (food: string) => void;
}

export const FoodEntryDialog = (
  {
    foodEntryDialogOpen,
    setFoodEntryDialogOpen,
    meals,
    addFoodTab,
    setAddFoodTab,
    mealSearchQuery,
    setMealSearchQuery,
    selectedMealId,
    setSelectedMealId,
    newMealDialogOpen,
    setNewMealDialogOpen,
    newName,
    setNewName,
    newUnit,
    setNewUnit,
    newDescription,
    setNewDescription,
    newCalories,
    setNewCalories,
    newProtein,
    setNewProtein,
    newCarbs,
    setNewCarbs,
    handleAddCustomEntry,
    handleAddMealEntry,
    handleAddNewMeal,
    isSubmitting,
    newFood,
    resetFoodEntryForm,
    newFat,
    setNewFat,
    newTags,
    setNewTags,
    resetNewMealForm,
    filteredMeals,
    newAmount,
    newMealType,
    setNewMealType,
    setNewAmount,
    setNewFood,
}: Props) => {
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
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="unit" className="text-right">
                        Unit
                      </Label>
                      <Select
                        value={newUnit}
                        onValueChange={(value) => setNewUnit(value)}
                      >
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

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="mealType" className="text-right">
                Meal Type
              </Label>
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
            </div>
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
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="mealType" className="text-right">
                Meal Type
              </Label>
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
            </div>
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
