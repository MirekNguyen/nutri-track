import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";

export const customEntrySchema = z.object({
  foodName: z
    .string("Food name is required")
    .min(2, "Food name must be at least 2 characters"),
  calories: z
    .number("Calories are required")
    .min(1, "Calories must be a positive number"),
  protein: z
    .number("Protein is required")
    .min(0, "Protein must be a positive number"),
  carbs: z
    .number("Carbs are required")
    .min(0, "Carbs must be a positive number"),
  fat: z.number("Fat is required").min(0, "Fat must be a positive integer"),
  amount: z
    .number("Amount is required")
    .min(0.1, "Amount must be at least 0.1"),
  unit: z.string(),
  mealType: z.string(),
});

export type CustomEntryFormValues = z.infer<typeof customEntrySchema>;

export const useCustomEntryForm = () => {
  return useForm<CustomEntryFormValues>({
    resolver: zodResolver(customEntrySchema),
    defaultValues: {
      foodName: "",
      amount: 1,
      unit: "serving",
      mealType: "breakfast",
    },
  });
};
