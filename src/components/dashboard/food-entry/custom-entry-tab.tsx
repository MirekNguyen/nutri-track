"use client";
import { createFoodEntry } from "@/actions/food-entry-actions";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
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
import { useForm, FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { MealTypeDropdown } from "../meal/meal-type-dropdown";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const customEntrySchema = z.object({
  foodName: z.string().min(2, "Food name is required"),
  calories: z.coerce.number("Calories are required").min(1, "Calories must be a positive number"),
  protein: z.coerce.number("Protein is required").min(0, "Protein must be a positive number"),
  carbs: z.coerce.number("Carbs are required").min(0, "Carbs must be a positive number"),
  fat: z.coerce.number("Fat is required").min(0, "Fat must be a positive integer"),
  amount: z.coerce.number("Amount is required").min(0.1, "Amount must be at least 0.1"),
  unit: z.string(),
  mealType: z.string(),
});

type CustomEntryFormData = z.infer<typeof customEntrySchema>;

export const CustomEntryTab: FC = () => {
  const searchParams = useSearchParams();
  const dateParam = searchParams.get("date");
  const selectedDate = dateParam ? new Date(dateParam) : new Date();

  const form = useForm<CustomEntryFormData>({
    resolver: zodResolver(customEntrySchema),
    mode: "onSubmit",
    defaultValues: {
      foodName: "",
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

      form.reset();
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
    <TabsContent value="custom">
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
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="col-span-2 flex gap-2 items-center">
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
                      <SelectTrigger>
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

          <DialogFooter className="mt-6 gap-2 md:gap-0">
            <Button type="button" variant="outline" onClick={() => form.reset()}>
              Cancel
            </Button>
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
    </TabsContent>
  );
};
