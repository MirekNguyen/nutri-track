"use client";

import { Loader, Plus, UtensilsCrossed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useSearchParams } from "next/navigation";
import { type FC, useState } from "react";
import { getMeals } from "@/actions/meal-actions";
import { createFoodEntry } from "@/actions/food-entry-actions";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Skeleton } from "@/components/ui/skeleton";
import { CommandLoading } from "cmdk";
import type { Meal } from "@/db/schema";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { NewMealDialog } from "@/components/meals/new-meal-dialog";
import { MealTypeDropdown } from "@/components/meals/meal-type-dropdown";
import { ChevronDown } from "lucide-react";

type Props = {
  submitAction: () => void;
  type: "breakfast" | "lunch" | "dinner" | "snack";
};

type Entry = {
  amount: number;
  meal: Meal;
  mealType: "breakfast" | "lunch" | "dinner" | "snack";
};

export const EntrySchema = z.object({
  amount: z
    .number("Enter an amount.")
    .positive("Amount must be a positive number."),
  meal: z.object(
    {
      id: z.number(),
      userId: z.number().nullable(),
      name: z.string(),
      unit: z.string().nullable(),
      description: z.string().nullable(),
      calories: z.number(),
      protein: z.number(),
      carbs: z.number(),
      fat: z.number(),
      caffeine: z.number().nullable(),
      tags: z.array(z.string()).nullable(),
      isFavorite: z.boolean().nullable(),
      createdAt: z.date().nullable(),
    },
    "Please select a meal",
  ),
  mealType: z.enum(
    ["breakfast", "lunch", "dinner", "snack"],
    "Please select a meal type.",
  ),
});

export const EntryForm: FC<Props> = ({ submitAction, type }) => {
  const searchParams = useSearchParams();
  const dateParam = searchParams.get("date");
  const selectedDate = dateParam ? new Date(dateParam) : new Date();
  const [showAdvanced, setShowAdvanced] = useState(false);

  const { data: meals = [], isLoading } = useQuery({
    queryKey: ["meals"],
    queryFn: getMeals,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  const form = useForm({
    resolver: zodResolver(EntrySchema),
    defaultValues: {
      amount: 1,
      mealType: type,
    },
  });
  const amount = form.watch("amount");

  const { register, control, handleSubmit, formState, setValue, watch } = form;
  const isSubmitting = formState.isSubmitting;

  const handleAddMealEntry = async ({ amount, mealType, meal }: Entry) => {
    try {
      const entryDate = selectedDate.toLocaleDateString("en-CA");
      const entryTime = new Date().toTimeString().split(" ")[0];

      await createFoodEntry({
        foodName: meal.name,
        mealId: meal.id,
        calories: meal.calories * amount,
        protein: meal.protein * amount,
        carbs: meal.carbs * amount,
        fat: meal.fat * amount,
        caffeine: meal.caffeine ? meal.caffeine * amount : 0,
        amount,
        mealType,
        entryDate,
        entryTime,
        createdAt: selectedDate,
      });

      toast.success("Success!", {
        description: "Food entry added successfully",
      });
      submitAction();
    } catch (error) {
      console.error("Error adding meal entry:", error);
      toast.error("Error", {
        description: "Failed to add food entry. Please try again.",
      });
    }
  };

  const selectedMeal = watch("meal");

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between gap-4 md:gap-2 flex-col sm:flex-row">
        <div className="flex items-center gap-2">
          <UtensilsCrossed className="w-4 h-4 text-muted-foreground" />
          <h3 className="font-medium text-foreground">
            Choose from Saved Meals
          </h3>
        </div>
        <div className="flex justify-center">
          <NewMealDialog>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-xs bg-transparent w-full"
            >
              <Plus className="w-3 h-3 mr-1" />
              Create New Meal
            </Button>
          </NewMealDialog>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={handleSubmit(handleAddMealEntry)} className="space-y-4">
          {/* Meal Search */}
          <Card>
            <Command>
              <CommandInput placeholder="Search meals..." className="h-9" />
              {isLoading ? (
                <CommandLoading className="border rounded-md h-[180px] mt-2">
                  <div className="p-2 space-y-2">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <Skeleton key={i} className="h-12 w-full" />
                    ))}
                  </div>
                </CommandLoading>
              ) : (
                <CommandList className="rounded-md h-[180px] mt-2">
                  <CommandEmpty className="py-6 text-center text-sm text-muted-foreground">
                    No meals found.
                  </CommandEmpty>
                  <CommandGroup>
                    {meals.map((meal) => (
                      <CommandItem
                        key={meal.id}
                        value={meal.name}
                        onSelect={() => setValue("meal", meal)}
                        className={`
                          flex justify-between items-center cursor-pointer md:p-3 rounded-lg my-1
                          ${
                            selectedMeal?.id === meal.id
                              ? "bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800"
                              : "hover:bg-muted/50"
                          }
                        `}
                      >
                        <div className="flex-1">
                          <h4 className="font-medium text-foreground text-sm">
                            {meal.name}
                          </h4>
                          <div className="flex items-center gap-3 mt-1">
                            <Badge variant="secondary" className="text-xs">
                              {meal.calories} cal
                            </Badge>
                            <span className="text-xs text-blue-600 dark:text-blue-400">
                              {meal.protein}g protein
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-muted-foreground">
                            <div>C: {meal.carbs}g</div>
                            <div>F: {meal.fat}g</div>
                          </div>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              )}
            </Command>

            {formState.errors.meal && (
              <div className="mt-2 p-2 bg-destructive/10 border border-destructive/30 rounded-md">
                <p className="text-destructive text-xs">
                  {formState.errors.meal.message}
                </p>
              </div>
            )}
          </Card>

          {/* Essential Fields */}
          <div className="grid grid-cols-2 gap-3">
            <FormField
              name="amount"
              control={control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Amount</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      step="0.01"
                      placeholder="1.0"
                      className="h-9"
                      {...register("amount", { valueAsNumber: true })}
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
                      newMealType={field.value ?? type}
                      setNewMealType={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Unit Display */}
          {selectedMeal && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Unit:</span>
              <Badge variant="outline" className="text-xs">
                {meals.find((m) => m.id === selectedMeal?.id)?.unit ||
                  "serving"}
              </Badge>
            </div>
          )}

          {/* Advanced Details - Collapsible */}
          {selectedMeal && (
            <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
              <CollapsibleTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full h-8 text-xs text-muted-foreground"
                >
                  Nutritional Details
                  <ChevronDown
                    className={`w-3 h-3 ml-2 transition-transform ${showAdvanced ? "rotate-180" : ""}`}
                  />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-3">
                <Card className="p-3 bg-muted/30">
                  <div className="text-xs text-muted-foreground mb-2">
                    Per {amount} {selectedMeal.unit}:
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex justify-between">
                      <span>Calories:</span>
                      <span className="font-medium">
                        {(selectedMeal.calories * amount).toFixed(0)} kcal
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Protein:</span>
                      <span className="font-medium">
                        {(selectedMeal.protein * amount).toFixed(0)}g
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Carbs:</span>
                      <span className="font-medium">
                        {(selectedMeal.carbs * amount).toFixed(0)}g
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Fat:</span>
                      <span className="font-medium">
                        {(selectedMeal.fat * amount).toFixed(0)}g
                      </span>
                    </div>
                  </div>
                </Card>
              </CollapsibleContent>
            </Collapsible>
          )}

          {/* Footer */}
          <DialogFooter className="pt-4 gap-2">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                disabled={isSubmitting}
                className="h-9 text-sm bg-transparent"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              className="bg-green-600 hover:bg-green-700 h-9 text-sm font-medium"
              type="submit"
              disabled={isSubmitting || !selectedMeal}
            >
              {isSubmitting ? (
                <>
                  <Loader className="mr-2 h-3 w-3 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Entry"
              )}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </div>
  );
};
