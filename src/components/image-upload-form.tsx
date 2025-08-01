"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Camera, Loader2, Sparkles, Upload, X } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { type UseFormSetValue, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { type Macros, uploadAndAnalyze } from "@/actions/upload-actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { CustomEntryFormValues } from "@/hooks/use-custom-entry-form";

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

      // Use setValue to propagate to parent
      valueAction("foodName", res.name);
      valueAction("calories", res.calories);
      valueAction("protein", res.protein);
      valueAction("carbs", res.carbs);
      valueAction("fat", res.fats);
      valueAction("amount", res.amount);
      valueAction("unit", res.unit);

      toast.success("Images analyzed successfully!", {
        description: "Form fields have been auto-filled with nutritional data.",
      });
    } catch (error) {
      toast.error("Analysis failed", {
        description: "Please try again or fill the form manually.",
      });
      console.error("Error analyzing images:", error);
    }

    setLoading(false);
  };

  // Previews: from RHF images field
  const images = form.watch("images") || [];
  const preview =
    images.length > 0 ? images.map((file) => URL.createObjectURL(file)) : [];

  return (
    <Card className="p-6 mb-6 bg-blue-50/50 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900/50">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Sparkles className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">AI-Powered Analysis</h3>
          <p className="text-sm text-muted-foreground">
            Upload photos to auto-fill nutritional information
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="images"
            render={() => (
              <FormItem>
                <FormControl>
                  <div className="space-y-4">
                    {/* Hidden input for mobile/desktop multiple-pick */}
                    <Input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => handleFiles(e.target.files)}
                    />

                    {/* Upload Area */}
                    {images.length === 0 ? (
                      <div
                        className="border-2 border-dashed border-blue-200 dark:border-blue-800 rounded-xl p-8 text-center cursor-pointer hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50/50 dark:hover:bg-blue-950/30 transition-colors"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <div className="flex flex-col items-center gap-3">
                          <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-full">
                            <Camera className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground mb-1">
                              Take or upload photos
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Include nutrition labels for best results
                            </p>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            Up to 3 photos
                          </Badge>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {/* Image Previews */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {preview.map((src, idx) => (
                            <div key={idx} className="relative group">
                              <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                                <Image
                                  src={src || "/placeholder.svg"}
                                  alt={`Preview ${idx + 1}`}
                                  fill
                                  className="object-cover"
                                />
                                <Button
                                  type="button"
                                  size="icon"
                                  variant="destructive"
                                  className="absolute top-2 right-2 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                  onClick={() => handleRemove(idx)}
                                >
                                  <X className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Add More Button */}
                        {images.length < 3 && (
                          <Button
                            type="button"
                            variant="outline"
                            className="w-full border-dashed border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 bg-transparent"
                            onClick={() => fileInputRef.current?.click()}
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            Add Another Photo
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Analyze Button */}
          {images.length > 0 && (
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-3"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing Images...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Analyze with AI
                </>
              )}
            </Button>
          )}

          {/* Success State */}
          {result && !loading && (
            <div className="p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900/50 rounded-lg">
              <div className="flex items-center gap-2 text-green-800 dark:text-green-400">
                <Sparkles className="w-4 h-4" />
                <span className="font-medium">Analysis Complete!</span>
              </div>
              <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                Detected: {result.name} • {result.calories} calories
              </p>
            </div>
          )}
        </form>
      </Form>
    </Card>
  );
}
