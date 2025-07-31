// ImageUploadForm.tsx
"use client";
import { useForm, UseFormSetValue } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useRef } from "react";
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
import z from "zod";
import { toast } from "sonner";
import { Macros, uploadAndAnalyze } from "@/actions/upload-actions";
import { CustomEntryFormValues } from "@/hooks/use-custom-entry-form";
import Image from "next/image";

// Zod schema for multiple images field
export const imageUploadSchema = z.object({
  images: z
    .array(z.instanceof(File))
    .min(1, "Please upload 1–3 photos.")
    .max(3, "Please upload 1–3 photos."),
});
type FormValues = z.infer<typeof imageUploadSchema>;

export default function ImageUploadForm({
  valueAction,
}: {
  valueAction: UseFormSetValue<CustomEntryFormValues>;
}) {
  const [result, setResult] = useState<Macros | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(imageUploadSchema),
    defaultValues: { images: [] },
    mode: "onChange",
  });

  // Add files from input
  const handleFiles = (newFiles: FileList | null) => {
    if (!newFiles) return;
    const filesArray = Array.from(newFiles);
    // Don't exceed 3
    const prev = form.getValues("images");
    const stillAllowed = Math.max(0, 3 - prev.length);
    const toAdd = filesArray.slice(0, stillAllowed);
    const updated = prev.concat(toAdd);
    form.setValue("images", updated, { shouldValidate: true });
  };

  // Remove by index
  const handleRemove = (idx: number) => {
    const prev = form.getValues("images");
    const updated = prev.filter((_, i) => i !== idx);
    form.setValue("images", updated, { shouldValidate: true });
  };

  // Submit using RHF values
  const onSubmit = async (data: FormValues) => {
    console.log("Submitting images:", data.images);
    setLoading(true);
    setResult(null);
    try {
      const res = await uploadAndAnalyze(data.images);
      setResult(res);
      // Use setValue to propagate to parent if using RHF parent, or valueAction as a prop function
      valueAction("foodName", res.name);
      valueAction("calories", res.calories);
      valueAction("protein", res.protein);
      valueAction("carbs", res.carbs);
      valueAction("fat", res.fats);
      valueAction("amount", res.amount);
      valueAction("unit", res.unit);
    } catch (error) {
      toast.error(`Failed to analyze images. Please try again. ${error}`);
      console.error("Error analyzing images:", error);
    }
    setLoading(false);
  };

  // Previews: from RHF images field
  const images = form.watch("images") || [];
  const preview =
    images.length > 0 ? images.map((file) => URL.createObjectURL(file)) : [];

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-w-md space-y-4"
      >
        <FormField
          control={form.control}
          name="images"
          render={() => (
            <FormItem>
              <FormLabel>Upload 1–3 Meal Photos</FormLabel>
              <FormControl>
                <div>
                  {/* Hidden input for mobile/desktop multiple-pick */}
                  <Input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    capture="environment"
                    onChange={(e) => handleFiles(e.target.files)}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    disabled={loading || images.length >= 3}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {images.length === 0 ? "Add Photo" : "Add Another Photo"}
                  </Button>
                  <div className="text-xs text-muted-foreground mt-1">
                    Take or select up to 3 photos (include nutrition labels if
                    possible).
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Previews from form's values array */}
        {preview.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {preview.map((src, idx) => (
              <div key={idx} className="relative group">
                <div className="relative w-32 h-32">
                  <Image
                    src={src}
                    alt={`Preview ${idx + 1}`}
                    fill
                    className="object-cover rounded shadow border"
                  />
                </div>
                <Button
                  type="button"
                  size="icon"
                  variant="destructive"
                  className="absolute top-1 right-1 opacity-80"
                  onClick={() => handleRemove(idx)}
                  tabIndex={-1}
                >
                  ✕
                </Button>
              </div>
            ))}
          </div>
        )}

        <Button type="submit" disabled={loading || images.length === 0}>
          {loading ? "Analyzing..." : "Analyze Images"}
        </Button>
        {result && (
          <div className="mt-4">
            <pre className="bg-muted rounded p-4 text-sm">
              <strong>Meal Name:</strong> {result.name}
              <br />
              <strong>Calories:</strong> {result.calories}
              <br />
              <strong>Protein:</strong> {result.protein}g<br />
              <strong>Carbs:</strong> {result.carbs}g<br />
              <strong>Fats:</strong> {result.fats}g<br />
            </pre>
          </div>
        )}
      </form>
    </Form>
  );
}
