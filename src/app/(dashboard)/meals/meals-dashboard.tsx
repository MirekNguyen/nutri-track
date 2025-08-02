"use client"

import {
  ChevronDown,
  Edit,
  Filter,
  Heart,
  PlusCircle,
  Search,
  X,
  Calendar,
  Zap,
  Target,
  Beef,
  Wheat,
  Loader2,
} from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toggleFavoriteMeal } from "@/actions/meal-actions"
import { DeleteMeal } from "@/components/meals/delete-meal"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import type { Meal } from "@/db/schema"

// Zod Schema for Meal Form
const mealFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  description: z.string().optional(),
  calories: z.number().min(0, "Calories must be positive").max(10000, "Calories must be less than 10,000"),
  protein: z.number().min(0, "Protein must be positive").max(1000, "Protein must be less than 1,000g").optional(),
  carbs: z.number().min(0, "Carbs must be positive").max(1000, "Carbs must be less than 1,000g").optional(),
  fat: z.number().min(0, "Fat must be positive").max(1000, "Fat must be less than 1,000g").optional(),
  unit: z.string().min(1, "Unit is required").max(50, "Unit must be less than 50 characters"),
  tags: z.string().optional(),
})

type MealFormValues = z.infer<typeof mealFormSchema>

type Props = {
  meals: Meal[]
}

export default function MealsDashboard({ meals }: Props) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
  const [sortBy, setSortBy] = useState<"name" | "calories" | "protein" | "createdAt">("createdAt")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingMeal, setEditingMeal] = useState<Meal | null>(null)

  const allTags = Array.from(new Set(meals.filter((meal) => meal.tags !== null).flatMap((meal) => meal.tags || [])))

  // Add Meal Form
  const addForm = useForm<MealFormValues>({
    resolver: zodResolver(mealFormSchema),
    defaultValues: {
      name: "",
      description: "",
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      unit: "serving",
      tags: "",
    },
  })

  // Edit Meal Form
  const editForm = useForm<MealFormValues>({
    resolver: zodResolver(mealFormSchema),
  })

  // Filter and sort meals
  const filteredMeals = meals
    .filter((meal) => {
      const matchesSearch =
        meal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        meal.description?.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesTags =
        selectedTags.length === 0 || (meal.tags && selectedTags.every((tag) => meal.tags?.includes(tag)))

      const matchesFavorite = !showFavoritesOnly || meal.isFavorite

      return matchesSearch && matchesTags && matchesFavorite
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name)
        case "calories":
          return b.calories - a.calories
        case "protein":
          return (b.protein || 0) - (a.protein || 0)
        default:
          return new Date(b.createdAt ?? new Date()).getTime() - new Date(a.createdAt ?? new Date()).getTime()
      }
    })

  const handleToggleFavorite = async (id: number) => {
    try {
      const updatedMeal = await toggleFavoriteMeal(id)
      toast(updatedMeal.isFavorite ? "Added to favorites" : "Removed from favorites", {
        description: `${updatedMeal.name} has been ${updatedMeal.isFavorite ? "added to" : "removed from"} your favorites.`,
      })
    } catch (error) {
      console.error("Error toggling favorite:", error)
      toast("Error", {
        description: "Failed to update favorite status. Please try again.",
      })
    }
  }

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedTags([])
    setShowFavoritesOnly(false)
    setSortBy("createdAt")
  }

  const onAddSubmit = async (values: MealFormValues) => {
    try {
      // Convert tags string to array
      const tagsArray = values.tags
        ? values.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean)
        : []

      // Here you would call your add meal action
      // await addMeal({ ...values, tags: tagsArray })

      toast("Meal added successfully")
      addForm.reset()
      setIsAddDialogOpen(false)
    } catch (error) {
      toast("Error adding meal")
    }
  }

  const onEditSubmit = async (values: MealFormValues) => {
    if (!editingMeal) return

    try {
      // Convert tags string to array
      const tagsArray = values.tags
        ? values.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean)
        : []

      // Here you would call your update meal action
      // await updateMeal(editingMeal.id, { ...values, tags: tagsArray })

      toast("Meal updated successfully")
      setEditingMeal(null)
    } catch (error) {
      toast("Error updating meal")
    }
  }

  const openEditDialog = (meal: Meal) => {
    setEditingMeal(meal)
    editForm.reset({
      name: meal.name,
      description: meal.description || "",
      calories: meal.calories,
      protein: meal.protein || 0,
      carbs: meal.carbs || 0,
      fat: meal.fat || 0,
      unit: meal.unit || "serving",
      tags: meal.tags?.join(", ") || "",
    })
  }

  const activeFiltersCount = selectedTags.length + (showFavoritesOnly ? 1 : 0)
  const hasActiveFilters = activeFiltersCount > 0 || searchQuery || sortBy !== "createdAt"

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Meals</h1>
          <p className="text-muted-foreground">Manage your meal database and track nutrition information</p>
        </div>

        {/* Add Meal Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="gap-2">
              <PlusCircle className="h-4 w-4" />
              Add Meal
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add New Meal</DialogTitle>
              <DialogDescription>Add a new meal to your database with nutrition information.</DialogDescription>
            </DialogHeader>
            <Form {...addForm}>
              <form onSubmit={addForm.handleSubmit(onAddSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={addForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Meal name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={addForm.control}
                    name="unit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Unit</FormLabel>
                        <FormControl>
                          <Input placeholder="serving, cup, etc." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={addForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Optional description" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={addForm.control}
                    name="calories"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Calories</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={addForm.control}
                    name="protein"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Protein (g)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={addForm.control}
                    name="carbs"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Carbs (g)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={addForm.control}
                    name="fat"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fat (g)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={addForm.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tags</FormLabel>
                      <FormControl>
                        <Input placeholder="breakfast, healthy, quick (comma separated)" {...field} />
                      </FormControl>
                      <FormDescription>Separate multiple tags with commas</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={addForm.formState.isSubmitting}>
                    {addForm.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Add Meal
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search meals by name or description..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2 bg-transparent">
                    <Filter className="h-4 w-4" />
                    Filter
                    {activeFiltersCount > 0 && (
                      <span className="ml-1 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                        {activeFiltersCount}
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel>Filter Options</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem checked={showFavoritesOnly} onCheckedChange={setShowFavoritesOnly}>
                    <Heart className="mr-2 h-4 w-4" />
                    Favorites Only
                  </DropdownMenuCheckboxItem>
                  {allTags.length > 0 && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuLabel>Tags</DropdownMenuLabel>
                      {allTags.map((tag) => (
                        <DropdownMenuCheckboxItem
                          key={tag}
                          checked={selectedTags.includes(tag)}
                          onCheckedChange={() => toggleTag(tag)}
                        >
                          {tag}
                        </DropdownMenuCheckboxItem>
                      ))}
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2 bg-transparent">
                    Sort
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Sort By</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuRadioGroup value={sortBy} onValueChange={(value) => setSortBy(value as typeof sortBy)}>
                    <DropdownMenuRadioItem value="createdAt">
                      <Calendar className="mr-2 h-4 w-4" />
                      Newest First
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="name">Name (A-Z)</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="calories">
                      <Zap className="mr-2 h-4 w-4" />
                      Highest Calories
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="protein">
                      <Target className="mr-2 h-4 w-4" />
                      Highest Protein
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>

              {hasActiveFilters && (
                <Button variant="ghost" size="icon" onClick={clearFilters} className="h-10 w-10">
                  <X className="h-4 w-4" />
                  <span className="sr-only">Clear filters</span>
                </Button>
              )}
            </div>
          </div>

          {selectedTags.length > 0 && (
            <>
              <Separator />
              <div className="flex flex-wrap gap-2">
                <span className="text-sm font-medium text-muted-foreground">Active tags:</span>
                {selectedTags.map((tag) => (
                  <div
                    key={tag}
                    className="inline-flex items-center gap-1 rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  >
                    {tag}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => toggleTag(tag)} />
                  </div>
                ))}
              </div>
            </>
          )}
        </CardHeader>
      </Card>

      {/* Edit Meal Dialog */}
      <Dialog open={!!editingMeal} onOpenChange={() => setEditingMeal(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Meal</DialogTitle>
            <DialogDescription>Update the meal information and nutrition details.</DialogDescription>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={editForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Meal name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="unit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unit</FormLabel>
                      <FormControl>
                        <Input placeholder="serving, cup, etc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={editForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Optional description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={editForm.control}
                  name="calories"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Calories</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="protein"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Protein (g)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={editForm.control}
                  name="carbs"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Carbs (g)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="fat"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fat (g)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={editForm.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <FormControl>
                      <Input placeholder="breakfast, healthy, quick (comma separated)" {...field} />
                    </FormControl>
                    <FormDescription>Separate multiple tags with commas</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setEditingMeal(null)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={editForm.formState.isSubmitting}>
                  {editForm.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Update Meal
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Results */}
      {filteredMeals.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="rounded-full bg-muted p-4 mb-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No meals found</h3>
            <p className="text-muted-foreground text-center max-w-sm">
              {hasActiveFilters
                ? "Try adjusting your search terms or filters to find what you're looking for."
                : "Get started by adding your first meal to the database."}
            </p>
            {hasActiveFilters && (
              <Button variant="outline" onClick={clearFilters} className="mt-4 gap-2 bg-transparent">
                <X className="h-4 w-4" />
                Clear filters
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredMeals.map((meal) => (
            <Card key={meal.id} className="group overflow-hidden transition-all hover:shadow-md">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1 flex-1 min-w-0">
                    <CardTitle className="text-lg leading-tight truncate">{meal.name}</CardTitle>
                    <p className="text-xs text-muted-foreground">Per {meal.unit || "serving"}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`h-8 w-8 shrink-0 ${
                      meal.isFavorite ? "text-red-500 hover:text-red-600" : "text-muted-foreground hover:text-red-500"
                    }`}
                    onClick={() => handleToggleFavorite(meal.id)}
                  >
                    <Heart className={`h-4 w-4 ${meal.isFavorite ? "fill-current" : ""}`} />
                    <span className="sr-only">{meal.isFavorite ? "Remove from favorites" : "Add to favorites"}</span>
                  </Button>
                </div>
                {meal.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-2">{meal.description}</p>
                )}
              </CardHeader>

              <CardContent className="pb-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-orange-50 dark:bg-orange-950/20">
                      <Zap className="h-4 w-4 text-orange-600" />
                      <div>
                        <p className="text-xs font-medium text-orange-600">Calories</p>
                        <p className="text-sm font-bold text-orange-700">{meal.calories}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-purple-50 dark:bg-purple-950/20">
                      <Wheat className="h-4 w-4 text-purple-600" />
                      <div>
                        <p className="text-xs font-medium text-purple-600">Carbs</p>
                        <p className="text-sm font-bold text-purple-700">{meal.carbs || 0}g</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20">
                      <Target className="h-4 w-4 text-blue-600" />
                      <div>
                        <p className="text-xs font-medium text-blue-600">Protein</p>
                        <p className="text-sm font-bold text-blue-700">{meal.protein || 0}g</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-green-50 dark:bg-green-950/20">
                      <Beef className="h-4 w-4 text-green-600" />
                      <div>
                        <p className="text-xs font-medium text-green-600">Fat</p>
                        <p className="text-sm font-bold text-green-700">{meal.fat || 0}g</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex items-center justify-between pt-4 border-t">
                <div className="flex flex-wrap gap-1 flex-1 min-w-0 text-xs text-muted-foreground">
                  {meal.tags?.slice(0, 3).join(", ")}
                  {meal.tags && meal.tags.length > 3 && ` +${meal.tags.length - 3} more`}
                </div>
                <div className="flex gap-1 ml-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => openEditDialog(meal)}
                  >
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Edit meal</span>
                  </Button>
                  <DeleteMeal meal={meal} />
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Results Summary */}
      {filteredMeals.length > 0 && (
        <div className="flex items-center justify-center text-sm text-muted-foreground">
          Showing {filteredMeals.length} of {meals.length} meals
        </div>
      )}
    </div>
  )
}

