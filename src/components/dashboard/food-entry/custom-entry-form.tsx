"use client";

import { ChevronDown, Edit3 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import type { FC } from "react";
import { useState } from "react";
import type { FieldErrors } from "react-hook-form";
import { toast } from "sonner";
import { createFoodEntry } from "@/actions/food-entry-actions";
import { MealTypeDropdown } from "@/components/meals/meal-type-dropdown";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  type CustomEntryFormValues,
  useCustomEntryForm,
} from "@/hooks/use-custom-entry-form";

type Props = {
  submitAction: () => void;
};

export const CustomEntryForm: FC<Props> = ({ submitAction }) => {
  const searchParams = useSearchParams();
  const dateParam = searchParams.get("date");
  const selectedDate = dateParam ? new Date(dateParam) : new Date();
  const [showAdvanced, setShowAdvanced] = useState(false);

  const form = useCustomEntryForm();
  const { register } = form;

  const onSubmit = async (data: CustomEntryFormValues) => {
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
      toast.success("Success!", {
        description: "Food entry added successfully",
      });
      submitAction();
    } catch (error) {
      console.error("Error adding custom entry:", error);
      toast.error("Error", {
        description: "Failed to add food entry. Please try again.",
      });
    }
  };

  const onError = (_errors: FieldErrors<CustomEntryFormValues>) => {
    toast.error("Please fix form errors");
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Edit3 className="w-4 h-4 text-muted-foreground" />
        <h3 className="font-medium text-foreground">Manual Entry</h3>
      </div>

      <Card className="p-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, onError)}
            className="space-y-4"
          >
            {/* Essential Fields */}
            <div className="space-y-4">
              <FormField
                name="foodName"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">Food Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="e.g. Grilled Chicken Breast"
                        className="h-9 text-sm"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-3">
                <FormField
                  name="calories"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">Calories</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          step="0.01"
                          placeholder="250"
                          className="h-9 text-sm"
                          {...register("calories", { valueAsNumber: true })}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="mealType"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">Meal Type</FormLabel>
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
              </div>
              <div className="space-y-2">
                <div className="grid grid-cols-3 gap-2">
                  <FormField
                    name="protein"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm">Protein</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            step="0.01"
                            placeholder="25"
                            className="h-8 text-sm"
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
                        <FormLabel className="text-sm">Carbs</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            step="0.01"
                            placeholder="5"
                            className="h-8 text-sm"
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
                        <FormLabel className="text-sm">Fat</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            step="0.01"
                            placeholder="8"
                            className="h-8 text-sm"
                            {...register("fat", { valueAsNumber: true })}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Advanced Fields - Collapsible */}
            <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
              <CollapsibleTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full h-8 text-xs text-muted-foreground"
                >
                  Advanced Details
                  <ChevronDown
                    className={`w-3 h-3 ml-2 transition-transform ${showAdvanced ? "rotate-180" : ""}`}
                  />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-4 mt-4">
                {/* Macros */}

                {/* Amount and Unit */}
                <div className="grid grid-cols-2 gap-3">
                  <FormField
                    name="amount"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm">Amount</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            step="0.01"
                            placeholder="1"
                            className="h-9 text-sm"
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
                        <FormLabel className="text-sm">Unit</FormLabel>
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger className="h-9">
                              <SelectValue placeholder="Unit" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="serving">serving</SelectItem>
                              <SelectItem value="g">grams</SelectItem>
                              <SelectItem value="ml">ml</SelectItem>
                              <SelectItem value="oz">oz</SelectItem>
                              <SelectItem value="cup">cup</SelectItem>
                              <SelectItem value="tbsp">tbsp</SelectItem>
                              <SelectItem value="tsp">tsp</SelectItem>
                              <SelectItem value="piece">piece</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* Footer */}
            <DialogFooter className="pt-4 gap-2">
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => form.reset()}
                  className="h-9 text-sm"
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                className="bg-green-600 hover:bg-green-700 h-9 text-sm font-medium"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? "Adding..." : "Add Entry"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
};
