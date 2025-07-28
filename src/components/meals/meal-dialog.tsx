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
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useForm, Controller } from "react-hook-form";
import { NewMeal } from "@/db/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { UnitDropdown } from "./unit-dropdown";
import { ReactNode, useState } from "react";
import { mealZodSchema } from "./meal-zod-schema";
import { Form } from "../ui/form";

type Props = {
  defaultValues: Partial<NewMeal>;
  title: string;
  onSubmitAction: (data: NewMeal) => Promise<void>;
  submitText: string;
  children: ReactNode;
};

export const MealDialog = ({
  defaultValues,
  onSubmitAction,
  title,
  submitText,
  children,
}: Props) => {
  const [open, setOpen] = useState(false);

  const form = useForm<NewMeal>({ defaultValues, resolver: zodResolver(mealZodSchema) });
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting }
  } = form;

  const handleFormSubmit = async (data: NewMeal) => {
    await onSubmitAction(data);
    reset(defaultValues);
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) reset(defaultValues);
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-w-[95vw]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Enter the details of your meal including nutritional information.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="space-y-4"
          noValidate
        >
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
                  formNoValidate
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
              onClick={() => setOpen(false)}
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
                submitText
              )}
            </Button>
          </DialogFooter>
        </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
