"use client";

import { useForm, UseFormSetValue } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from "@/components/ui/form";
import { Macros, uploadAndAnalyze } from "@/actions/upload-actions";
import z from "zod";
import { toast } from "sonner";
import { CustomEntryFormValues } from "@/hooks/use-custom-entry-form";
import Image from "next/image";

export const imageUploadSchema = z.object({
  image: z
    .any()
    .refine(
      (file) => file instanceof File && file.size > 0,
      "Image is required",
    ),
});

type FormValues = { image: File | undefined };

type Props = {
  valueAction: UseFormSetValue<CustomEntryFormValues>
};

export default function ImageUploadForm({ valueAction }: Props) {
  const [result, setResult] = useState<Macros | null>(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(imageUploadSchema),
    defaultValues: { image: undefined },
  });

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    setResult(null);

    const formData = new FormData();
    if (data.image) formData.append("image", data.image);

    try {
      const res = await uploadAndAnalyze(formData);
      setResult(res);
      valueAction("foodName", res.name);
      valueAction("calories", res.calories);
      valueAction("protein", res.protein);
      valueAction("carbs", res.carbs);
      valueAction("fat", res.fats);
    } catch (error) {
      toast.error("Failed to analyze image. Please try again.");
      console.error("Error analyzing image:", error);
    }

    setLoading(false);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-w-md space-y-4"
      >
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Upload Food Image</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  capture="environment"
                                    onChange={e => {
                    const file = e.target.files?.[0];
                    field.onChange(file);
                    if (file) {
                      setPreview(URL.createObjectURL(file));
                    } else {
                      setPreview(null);
                    }
                  }}
                  disabled={loading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {preview && (
          <div className="mb-4">
            <img src={preview} alt="Preview" className="max-h-56 rounded shadow" />
          </div>
        )}
        <Button type="submit" disabled={loading}>
          {loading ? "Analyzing..." : "Analyze Image"}
        </Button>
        {result && (
          <div className="mt-4">
            <pre className="bg-muted rounded p-4 text-sm">
              {result.name && <strong>Meal Name:</strong>} {result.name}
              <br />
              <strong>Calories:</strong> {result.calories}
              <br />
              <strong>Protein:</strong> {result.protein}g<br />
              <strong>Carbs:</strong> {result.carbs}g<br />
              <strong>Fats:</strong> {result.fats}g
            </pre>
          </div>
        )}
      </form>
    </Form>
  );
}
