import { createFoodEntry } from "@/actions/food-entry-actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldErrors, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const customEntrySchema = z.object({
  foodName: z.string().min(2, "Food name is required"),
  calories: z.coerce
    .number("Calories are required")
    .min(1, "Calories must be a positive number"),
  protein: z.coerce
    .number("Protein is required")
    .min(0, "Protein must be a positive number"),
  carbs: z.coerce
    .number("Carbs are required")
    .min(0, "Carbs must be a positive number"),
  fat: z.coerce
    .number("Fat is required")
    .min(0, "Fat must be a positive integer"),
  amount: z.coerce
    .number("Amount is required")
    .min(0.1, "Amount must be at least 0.1"),
  unit: z.string(),
  mealType: z.string(),
});

export type CustomEntryFormValues = z.infer<typeof customEntrySchema>;

export const useCustomEntryForm = (selectedDate: Date) => {
  const form = useForm<CustomEntryFormValues>({
    resolver: zodResolver(customEntrySchema),
    mode: "onSubmit",
    defaultValues: {
      foodName: "",
      amount: 1,
      unit: "serving",
      mealType: "breakfast",
    },
  });

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

  const onError = (errors: FieldErrors<CustomEntryFormValues>) => {
    console.log("Form validation errors:", errors);
    toast.error("Validation Error", {
      description: "Please fix the errors in the form before submitting.",
    });
  };

  return {
    form,
    submitAction: () => form.handleSubmit(onSubmit, onError),
  };
};
