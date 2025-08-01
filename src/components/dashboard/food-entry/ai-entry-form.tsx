"use client"

import React from "react"

import { Button } from "@/components/ui/button"
import { DialogClose, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { useSearchParams } from "next/navigation"
import type { FC } from "react"
import { useState } from "react"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { MealTypeDropdown } from "@/components/meals/meal-type-dropdown"
import type { FieldErrors } from "react-hook-form"
import { toast } from "sonner"
import { createFoodEntry } from "@/actions/food-entry-actions"
import { type CustomEntryFormValues, useCustomEntryForm } from "@/hooks/use-custom-entry-form"
import ImageUploadForm from "@/components/image-upload-form"
import { Edit3, Check, ChevronDown } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

type Props = {
  submitAction: () => void
}

export const AIEntryForm: FC<Props> = ({ submitAction }) => {
  const searchParams = useSearchParams()
  const dateParam = searchParams.get("date")
  const selectedDate = dateParam ? new Date(dateParam) : new Date()
  const [hasAnalyzed, setHasAnalyzed] = useState(false)

  const form = useCustomEntryForm()
  const { register, watch } = form

  // Watch for changes to detect when AI has populated the form
  const foodName = watch("foodName")
  const calories = watch("calories")

  // Update hasAnalyzed when AI populates the form
  React.useEffect(() => {
    if (foodName && calories && !hasAnalyzed) {
      setHasAnalyzed(true)
    }
  }, [foodName, calories, hasAnalyzed])

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
      })
      form.reset()
      setHasAnalyzed(false)
      toast.success("Success!", {
        description: "Food entry added successfully",
      })
      submitAction()
    } catch (error) {
      console.error("Error adding AI entry:", error)
      toast.error("Error", {
        description: "Failed to add food entry. Please try again.",
      })
    }
  }

  const onError = (_errors: FieldErrors<CustomEntryFormValues>) => {
    toast.error("Please fix form errors")
  }

  return (
    <div className="space-y-4">
      {/* AI Upload Section */}
      <ImageUploadForm valueAction={form.setValue} />

      {/* Results Form - Collapsible after analysis */}
      {(hasAnalyzed || foodName) && (
        <Card className="p-4">
          <Collapsible defaultOpen={!hasAnalyzed}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                {hasAnalyzed ? (
                  <>
                    <Check className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-600">AI Results</span>
                  </>
                ) : (
                  <>
                    <Edit3 className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-muted-foreground">Manual Entry</span>
                  </>
                )}
              </div>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 px-2">
                  <span className="text-xs mr-1">Details</span>
                  <ChevronDown className="w-3 h-3 transition-transform data-[state=open]:rotate-180" />
                </Button>
              </CollapsibleTrigger>
            </div>

            {/* Collapsed Summary */}
            <CollapsibleContent className="space-y-4">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit, onError)} className="space-y-4">
                  {/* Food Name & Meal Type */}
                  <div className="grid grid-cols-1 gap-3">
                    <FormField
                      name="foodName"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm">Food Name</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="e.g. Grilled Chicken" className="h-9" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Calories & Meal Type */}
                  <div className="grid grid-cols-2 gap-3">
                    <FormField
                      name="calories"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm">Calories</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              step="0.01"
                              placeholder="250"
                              className="h-9"
                              {...register("calories", { valueAsNumber: true })}
                            />
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
                            <MealTypeDropdown newMealType={field.value} setNewMealType={field.onChange} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Macros */}
                  <div className="space-y-2">
                    <FormLabel className="text-sm text-muted-foreground">Macronutrients (grams)</FormLabel>
                    <div className="grid grid-cols-3 gap-2">
                      <FormField
                        name="protein"
                        control={form.control}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs">Protein</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="number"
                                step="0.01"
                                placeholder="25"
                                className="h-8 text-xs"
                                {...register("protein", { valueAsNumber: true })}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        name="carbs"
                        control={form.control}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs">Carbs</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="number"
                                step="0.01"
                                placeholder="5"
                                className="h-8 text-xs"
                                {...register("carbs", { valueAsNumber: true })}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        name="fat"
                        control={form.control}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs">Fat</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="number"
                                step="0.01"
                                placeholder="8"
                                className="h-8 text-xs"
                                {...register("fat", { valueAsNumber: true })}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Amount and Unit */}
                  <div className="grid grid-cols-2 gap-3">
                    <FormField
                      name="amount"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm">Amount</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" step="0.01" placeholder="1" className="h-9" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      name="unit"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm">Unit</FormLabel>
                          <FormControl>
                            <Select value={field.value} onValueChange={field.onChange}>
                              <SelectTrigger className="h-9">
                                <SelectValue placeholder="Unit" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="serving">serving</SelectItem>
                                <SelectItem value="g">grams</SelectItem>
                                <SelectItem value="ml">ml</SelectItem>
                                <SelectItem value="oz">oz</SelectItem>
                                <SelectItem value="cup">cup</SelectItem>
                                <SelectItem value="tbsp">tbsp</SelectItem>
                                <SelectItem value="tsp">tsp</SelectItem>
                                <SelectItem value="piece">piece</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </form>
              </Form>
            </CollapsibleContent>

            {/* Quick Summary when collapsed */}
            <div className="data-[state=closed]:block data-[state=open]:hidden">
              {(foodName || calories) && (
                <div className="flex items-center justify-between py-2 px-3 bg-muted/50 rounded-lg mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{foodName || "Food Item"}</span>
                    {calories && (
                      <>
                        <span className="text-muted-foreground">•</span>
                        <span className="text-sm text-muted-foreground">{calories} cal</span>
                      </>
                    )}
                  </div>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                      Edit
                    </Button>
                  </CollapsibleTrigger>
                </div>
              )}
            </div>

            {/* Footer - Always visible */}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit, onError)}>
                <DialogFooter className="pt-2 gap-2">
                  <DialogClose asChild>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        form.reset()
                        setHasAnalyzed(false)
                      }}
                      className="h-9 text-sm"
                    >
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 h-9 text-sm font-medium"
                    disabled={form.formState.isSubmitting}
                  >
                    {form.formState.isSubmitting ? "Adding..." : "Add Entry"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </Collapsible>
        </Card>
      )}

      {/* Manual Entry Fallback */}
      {!hasAnalyzed && !foodName && (
        <Card className="p-4 border-dashed">
          <div className="text-center py-6 text-muted-foreground">
            <Edit3 className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm mb-1">No photos uploaded yet</p>
            <p className="text-xs">Upload photos above or enter details manually</p>
            {/* <Button */}
            {/*   type="button" */}
            {/*   variant="ghost" */}
            {/*   size="sm" */}
            {/*   className="mt-2 text-xs" */}
            {/*   onClick={() => setHasAnalyzed(true)} */}
            {/* > */}
            {/*   Enter Manually */}
            {/* </Button> */}
          </div>
        </Card>
      )}
    </div>
  )
}

