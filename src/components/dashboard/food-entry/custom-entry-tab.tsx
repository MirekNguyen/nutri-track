"use client";
import { createFoodEntry } from "@/actions/food-entry-actions";
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
import { useSearchParams } from "next/navigation";
import { FC } from "react";
import { useForm, Controller, FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { MealTypeDropdown } from "../meal/meal-type-dropdown";
import { toast } from "sonner";

const customEntrySchema = z.object({
  foodName: z.string().min(1, "Food name is required"),
  calories: z.number().min(1, "Calories is required"),
  protein: z.number().min(0, "Protein must be a positive number"),
  carbs: z.number().min(0, "Carbs must be a positive number"),
  fat: z.number().min(0, "Fat must be a positive integer"),
  amount: z.number().min(0.1, "Amount must be at least 0.1"),
  unit: z.string(),
  mealType: z.string(),
});

type CustomEntryFormData = z.infer<typeof customEntrySchema>;

export const CustomEntryTab: FC = () => {
  const searchParams = useSearchParams();
  const dateParam = searchParams.get("date");
  const selectedDate = dateParam ? new Date(dateParam) : new Date();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CustomEntryFormData>({
    resolver: zodResolver(customEntrySchema),
    mode: "onSubmit",
    defaultValues: {
      foodName: "",
      calories: undefined,
      protein: undefined,
      carbs: undefined,
      fat: undefined,
      amount: 1,
      unit: "serving",
      mealType: "breakfast",
    },
  });

  const onSubmit = async (data: CustomEntryFormData) => {
    try {
      await createFoodEntry({
        foodName: data.foodName,
        calories: data.calories,
        protein: data.protein,
        carbs: data.carbs,
        fat: data.fat,
        amount: data.amount,
        mealType: data.mealType,
        entryDate: selectedDate.toISOString().split("T")[0],
        entryTime: new Date().toTimeString().split(" ")[0],
        mealId: null,
      });

      reset();
      toast("Success", {
        description: "Food entry added successfully",
      });
    } catch (error) {
      console.error("Error adding custom entry:", error);
      toast("Error", {
        description: "Failed to add food entry. Please try again.",
      });
    }
  };

  const onError = (errors: FieldErrors<CustomEntryFormData>) => {
    console.log("Form validation errors:", errors);
    toast.error("Validation Error", {
      description: "Please fix the errors in the form before submitting.",
    });
  };

  return (
    <TabsContent value="custom" className="space-y-4 mt-4">
      <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="foodName" className="text-right">
            Food Name
          </Label>
          <div className="col-span-3">
            <Controller
              name="foodName"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="foodName"
                  placeholder="Enter food name (e.g., Grilled Chicken Salad)"
                />
              )}
            />
            {errors.foodName && (
              <p className="text-sm text-red-500 mt-1">
                {errors.foodName.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="calories" className="text-right">
            Calories
          </Label>
          <div className="col-span-3">
            <Controller
              name="calories"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="calories"
                  type="number"
                  step="0.01"
                  value={field.value || ""}
                  placeholder="Enter calories (e.g., 450)"
                />
              )}
            />
            {errors.calories && (
              <p className="text-sm text-red-500 mt-1">
                {errors.calories.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label className="text-right">Macros (g)</Label>
          <div className="col-span-3 grid grid-cols-3 gap-2">
            <div>
              <Label
                htmlFor="protein"
                className="text-xs text-gray-500 mb-1 block"
              >
                Protein *
              </Label>
              <Controller
                name="protein"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="protein"
                    type="number"
                    step="0.01"
                    value={field.value || ""}
                    placeholder="e.g., 25.5"
                  />
                )}
              />
              {errors.protein && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.protein.message}
                </p>
              )}
            </div>
            <div>
              <Label
                htmlFor="carbs"
                className="text-xs text-gray-500 mb-1 block"
              >
                Carbs *
              </Label>
              <Controller
                name="carbs"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="carbs"
                    type="number"
                    step="0.01"
                    value={field.value || ""}
                    placeholder="e.g., 15.2"
                  />
                )}
              />
              {errors.carbs && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.carbs.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="fat" className="text-xs text-gray-500 mb-1 block">
                Fat *
              </Label>
              <Controller
                name="fat"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="fat"
                    type="number"
                    onChange={e => e.target.valueAsNumber}
                    step="1"
                    placeholder="e.g., 8"
                  />
                )}
              />
              {errors.fat && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.fat.message}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="amount" className="text-right">
            Amount
          </Label>
          <div className="col-span-3 flex gap-2 items-center">
            <div className="flex-1">
              <Controller
                name="amount"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="amount"
                    type="number"
                    step="0.01"
                    min="0.1"
                    onChange={e => field.onChange(e.target.valueAsNumber)}
                    placeholder="1.5"
                  />
                )}
              />
              {errors.amount && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.amount.message}
                </p>
              )}
            </div>
            <Controller
              name="unit"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
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
              )}
            />
          </div>
        </div>

        <Controller
          name="mealType"
          control={control}
          render={({ field }) => (
            <MealTypeDropdown
              newMealType={field.value}
              setNewMealType={field.onChange}
            />
          )}
        />

        <DialogFooter className="mt-6">
          <Button type="button" variant="outline" onClick={() => reset()}>
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-green-600 hover:bg-green-700"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Adding..." : "Add Entry"}
          </Button>
        </DialogFooter>
      </form>
    </TabsContent>
  );
};
