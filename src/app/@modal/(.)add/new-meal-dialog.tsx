"use client";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UnitDropdown } from "@/app/(dashboard)/food-entry/unit-dropdown";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Plus } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { createMeal } from "@/app/actions/meal-actions";
import { toast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { NewMeal } from "@/db/schema";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const newMealSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().nullable(),
  unit: z.string().default("serving"),
  calories: z.number({ message: "Number is required" }).min(0),
  protein: z.number({ message: "Number is required" }).min(0),
  carbs: z.number({ message: "Number is required" }).min(0),
  fat: z.number({ message: "Number is required" }).min(0),
});

export const NewMealDialog = () => {
  const defaultValues: Partial<NewMeal> = {
    unit: "serving",
  };

  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NewMeal>({ defaultValues, resolver: zodResolver(newMealSchema) });

  const [open, setOpen] = useState(false);
  const router = useRouter();

  const onSubmit = async (data: NewMeal) => {
    try {
      await createMeal({ ...data });

      queryClient.invalidateQueries({ queryKey: ["getMeals"] });
      reset(defaultValues);
      setOpen(false);

      toast({
        title: "Success",
        description: "Meal created successfully",
      });
    } catch (error) {
      console.error("Error creating new meal:", error);
      toast({
        title: "Error",
        description: "Failed to create meal. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) reset(defaultValues);
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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <div className="col-span-3">
                <Input
                  id="name"
                  placeholder="e.g., Grilled Chicken Salad"
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>
            </div>

            <Controller
              name="unit"
              control={control}
              render={({ field }) => (
                <UnitDropdown
                  newUnit={field.value || "serving"}
                  setNewUnit={(value) => field.onChange(value)}
                />
              )}
            />

            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="description" className="text-right pt-2">
                Description
              </Label>
              <div className="col-span-3">
                <Textarea
                  id="description"
                  placeholder="Describe your meal..."
                  {...register("description")}
                />
                {errors.description && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.description.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="calories" className="text-right">
                Calories
              </Label>
              <div className="col-span-3">
                <Input
                  id="calories"
                  type="number"
                  inputMode="numeric"
                  placeholder="e.g., 350"
                  {...register("calories", { valueAsNumber: true })}
                />
                {errors.calories && (
                  <p className="text-red-500 text-xs mt-1">
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
                    Protein
                  </Label>
                  <Input
                    id="protein"
                    type="number"
                    inputMode="numeric"
                    placeholder="e.g., 30"
                    {...register("protein", { valueAsNumber: true })}
                  />
                  {errors.protein && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.protein.message}
                    </p>
                  )}
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
                    inputMode="numeric"
                    placeholder="e.g., 40"
                    {...register("carbs", { valueAsNumber: true })}
                  />
                  {errors.carbs && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.carbs.message}
                    </p>
                  )}
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
                    inputMode="numeric"
                    placeholder="e.g., 15"
                    {...register("fat", { valueAsNumber: true })}
                  />
                  {errors.fat && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.fat.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-green-600 hover:bg-green-700"
              disabled={isSubmitting}
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
        </form>
      </DialogContent>
    </Dialog>
  );
};
