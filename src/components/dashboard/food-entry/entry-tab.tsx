"use client";

import { Loader } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TabsContent } from "@/components/ui/tabs";

import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import { useSearchParams } from "next/navigation";
import { FC } from "react";
import { getMeals } from "@/actions/meal-actions";
import { createFoodEntry } from "@/actions/food-entry-actions";
import { useQuery } from "@tanstack/react-query";
import { NewMealDialog } from "../meal/new-meal-dialog";
import { MealTypeDropdown } from "../meal/meal-type-dropdown";
import { Controller, useForm } from "react-hook-form";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Skeleton } from "@/components/ui/skeleton";
import { CommandLoading } from "cmdk";
import { Meal } from "@/db/schema";
import { toast } from "sonner";

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
    .number({ required_error: "Enter an amount." })
    .positive("Amount must be a positive number."),
  meal: z.unknown(),
  mealType: z.enum(["breakfast", "lunch", "dinner", "snack"], {
    required_error: "Please select a meal type.",
  }),
});

export const EntryTab: FC<Props> = ({ submitAction, type }) => {
  const searchParams = useSearchParams();
  const dateParam = searchParams.get("date");
  const selectedDate = dateParam ? new Date(dateParam) : new Date();

  const { data: meals = [], isLoading } = useQuery({
    queryKey: ["meals"],
    queryFn: getMeals,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  const { register, control, handleSubmit, formState, setValue, watch } =
    useForm<Entry>({
      resolver: zodResolver(EntrySchema),
      defaultValues: {
        amount: 1,
        mealType: type,
      },
    });
  const isSubmitting = formState.isSubmitting;

  // Update the handleAddMealEntry function to include the amount field
  const handleAddMealEntry = async ({ amount, mealType, meal }: Entry) => {
    try {
      // Format date and time for database
      // const entryDate = selectedDate.toISOString().split("T")[0];
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

      toast("Success", {
        description: "Food entry added successfully",
      });
    } catch (error) {
      console.error("Error adding meal entry:", error);
      toast("Error", {
        description: "Failed to add food entry. Please try again.",
      });
    }
    submitAction();
  };
  const selectedMeal = watch("meal");
  return (
    <TabsContent value="choose" className="space-y-4 mt-4 overflow-x-hidden">
      <Command>
        <CommandInput placeholder="Search meals..." className="h-9" />
        {isLoading ? (
          <CommandLoading className="border rounded-md h-[200px]">
            {Array.from({ length: 5 }).map((_, i) => (
              <CommandItem
                key={i}
                className="flex justify-between items-center cursor-pointer"
              >
                <Skeleton className="h-8 w-full" />
              </CommandItem>
            ))}
          </CommandLoading>
        ) : (
          <CommandList className="border rounded-md h-[200px]">
            <CommandEmpty>No meal found.</CommandEmpty>
            <CommandGroup>
              {meals.map((meal) => (
                <CommandItem
                  key={meal.id}
                  value={meal.name}
                  onSelect={() => setValue("meal", meal)}
                  className={`
            flex justify-between items-center cursor-pointer
            ${
              selectedMeal?.id === meal.id
                ? "bg-green-50 dark:bg-green-950/20 border-l-4 border-green-600 dark:border-green-400"
                : ""
            }
          `}
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
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        )}
      </Command>
      <NewMealDialog />

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
            {...register("amount", { valueAsNumber: true })}
            className="flex-1"
          />
          <div className="flex items-center bg-muted px-3 py-2 rounded-md text-sm text-foreground min-w-24">
            <span className="font-medium">
              {meals.find((m) => m.id === selectedMeal?.id)?.unit || "serving"}
            </span>
          </div>
        </div>
      </div>
      <Controller
        name="mealType"
        control={control}
        render={({ field }) => (
          <MealTypeDropdown
            newMealType={field.value ?? type}
            setNewMealType={field.onChange}
          />
        )}
      />

      <DialogFooter className="mt-6">
        <DialogClose asChild>
          <Button variant="outline" disabled={isSubmitting}>
            Cancel
          </Button>
        </DialogClose>
        <Button
          className="bg-green-600 hover:bg-green-700"
          onClick={handleSubmit(handleAddMealEntry)}
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
      {Object.keys(formState.errors).length > 0 && (
        <div className="rounded border border-destructive/30 bg-destructive/10 p-2 text-destructive space-y-1 text-sm">
          {Object.entries(formState.errors).map(([field, error]) =>
            error?.message ? (
              <div key={field}>{error.message.toString()}</div>
            ) : null,
          )}
        </div>
      )}
    </TabsContent>
  );
};
