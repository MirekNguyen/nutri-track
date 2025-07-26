import { z } from "zod";

export const mealZodSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().nullable(),
  unit: z.string().default("serving"),
  calories: z.number({ message: "Number is required" }).min(0),
  protein: z.number({ message: "Number is required" }).min(0),
  carbs: z.number({ message: "Number is required" }).min(0),
  fat: z.number({ message: "Number is required" }).min(0),
});

