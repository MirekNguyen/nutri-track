"use client";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSearchParams } from "next/navigation";
import { FC } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { MealTypeDropdown } from "@/components/meals/meal-type-dropdown";
import { FieldErrors } from "react-hook-form";
import { toast } from "sonner";
import { createFoodEntry } from "@/actions/food-entry-actions";
import {
  CustomEntryFormValues,
  useCustomEntryForm,
} from "@/hooks/use-custom-entry-form";

type Props = {
  submitAction: () => void;
}
export const CustomEntryForm: FC<Props> = ({submitAction}) => {
  const searchParams = useSearchParams();
  const dateParam = searchParams.get("date");
  const selectedDate = dateParam ? new Date(dateParam) : new Date();

  const form = useCustomEntryForm();
  const { register } = form;

  const onSubmit = async (data: CustomEntryFormValues) => {
    console.log("Submitting custom entry:", data);
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

      form.reset();
      toast("Success", {
        description: "Food entry added successfully",
      });
      submitAction();
    } catch (error) {
      console.error("Error adding custom entry:", error);
      toast("Error", {
        description: "Failed to add food entry. Please try again.",
      });
    }
  };

  const onError = (errors: FieldErrors<CustomEntryFormValues>) => {
    console.log("Form validation errors:", errors);
    toast.error("Validation Error", {
      description: "Please fix the errors in the form before submitting.",
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, onError)}
        className="space-y-4"
      >
        <FormField
          name="foodName"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Food name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="e.g. Chicken Salad" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="calories"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Calories</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  step="0.01"
                  placeholder="e.g. 250"
                  {...register("calories", { valueAsNumber: true })}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="col-span-3 grid grid-cols-3 gap-2">
          <FormField
            name="protein"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Protein</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    step="0.01"
                    placeholder="e.g. 3.0"
                    {...register("protein", { valueAsNumber: true })}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="carbs"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Carbs</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    step="0.01"
                    placeholder="e.g. 2.8"
                    {...register("carbs", { valueAsNumber: true })}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="fat"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fat</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    step="0.01"
                    placeholder="e.g. 8.8"
                    {...register("fat", { valueAsNumber: true })}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex gap-2">
          <FormField
            name="amount"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    step="0.01"
                    placeholder="e.g. 8.8"
                    className="w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="unit"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Unit</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
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
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          name="mealType"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Meal type</FormLabel>
              <FormControl>
                <MealTypeDropdown
                  newMealType={field.value}
                  setNewMealType={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <DialogFooter className="mt-6 gap-2">
          <DialogClose asChild>
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="submit"
            className="bg-green-600 hover:bg-green-700"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? "Adding..." : "Add Entry"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};
