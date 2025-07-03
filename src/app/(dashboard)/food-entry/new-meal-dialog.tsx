import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { UnitDropdown } from "./unit-dropdown";
import { Textarea } from "@/components/ui/textarea";

export const NewMealDialog = ({newMealDialogOpen, setNewMealDialogOpen, resetNewMealForm, newName, setNewName, newUnit, setNewUnit}) => {
  return (
    <Dialog
      open={newMealDialogOpen}
      onOpenChange={(isOpen) => {
        setNewMealDialogOpen(isOpen);
        if (!isOpen) resetNewMealForm();
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="ml-2 whitespace-nowrap">
          <Plus className="h-4 w-4 mr-1" /> New Meal
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-w-[95vw]">
        <DialogHeader>
          <DialogTitle>Add New Meal</DialogTitle>
          <DialogDescription>
            Enter the details of your meal including nutritional information.
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
  );
};
