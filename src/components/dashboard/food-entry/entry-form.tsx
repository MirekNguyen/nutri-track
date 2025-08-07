"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { CommandLoading } from "cmdk";
import { ChevronDown, Loader, Plus, UtensilsCrossed } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { type FC, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { createFoodEntry } from "@/actions/food-entry-actions";
import { getMeals } from "@/actions/meal-actions";
import { MealTypeDropdown } from "@/components/meals/meal-type-dropdown";
import { NewMealDialog } from "@/components/meals/new-meal-dialog";
import { Badge } from "@/components/ui/badge";
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
import type { Meal } from "@/db/schema";
import { useIsMobile } from "@/hooks/use-mobile";
import { MealSelectResponsive } from "./meal-select";

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
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();

  const { data: meals = [], isLoading } = useQuery({
    queryKey: ["getMeals"],
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
      <div className="flex justify-between gap-4 md:gap-2 ">
        <div className="flex items-center gap-2">
          <UtensilsCrossed className="w-4 h-4 text-muted-foreground" />
          <h3 className="font-medium text-foreground">
            Choose from Saved Meals
          </h3>
        </div>
        <NewMealDialog>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="text-xs bg-transparent"
          >
            <Plus className="w-3 h-3 mr-1" />
            {!isMobile ? "Create New Meal" : "Create"}
          </Button>
        </NewMealDialog>
      </div>

      <Card className="p-4">
        <Form {...form}>
          <form
            onSubmit={handleSubmit(handleAddMealEntry)}
            className="space-y-4"
          >
            {/* Meal Search with Popover */}
            <FormField
              name="meal"
              control={control}
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="text-sm">Select Meal</FormLabel>
                  <MealSelectResponsive
                    open={open}
                    setOpen={setOpen}
                    meals={meals}
                    isLoading={isLoading}
                    selectedMeal={selectedMeal}
                    onSelect={(meal) => {
                      setValue("meal", meal);
                      field.onChange(meal);
                    }}
                    isMobile={isMobile}
                    triggerButton={
                      <Button
                        variant="outline"
                        className={`w-full justify-between h-9 ${!selectedMeal ? "text-muted-foreground" : ""}`}
                      >
                        {selectedMeal ? (
                          <div className="flex items-center gap-2">
                            <span>{selectedMeal.name}</span>
                            <Badge variant="secondary" className="text-xs">
                              {selectedMeal.calories} cal
                            </Badge>
                          </div>
                        ) : (
                          "Select a meal..."
                        )}
                        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    }
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Essential Fields */}
            <div className="grid grid-cols-2 gap-3">
              <FormField
                name="amount"
                control={control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">Amount</FormLabel>
                    <FormControl>
                      <div className="flex w-full max-w-sm items-center gap-2">
                        <Input
                          {...field}
                          type="number"
                          step="0.01"
                          placeholder="1.0"
                          className="h-9"
                          {...register("amount", { valueAsNumber: true })}
                        />
                        <Button variant="outline" disabled>
                          {meals.find((m) => m.id === selectedMeal?.id)?.unit ||
                            "serving"}
                        </Button>
                      </div>
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
      </Card>
    </div>
  );
};
