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
} from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { toggleFavoriteMeal } from "@/actions/meal-actions"
import { DeleteMeal } from "@/components/meals/delete-meal"
import { EditMealDialog } from "@/components/meals/edit-meal-dialog"
import { NewMealDialog } from "@/components/meals/new-meal-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import type { Meal } from "@/db/schema"

type Props = {
  meals: Meal[]
}

export default function MealsDashboard({ meals }: Props) {
  const [searchQuery, setSearchQuery] = useState("")
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
  const [sortBy, setSortBy] = useState<"name" | "calories" | "protein" | "createdAt">("createdAt")

  // Filter and sort meals
  const filteredMeals = meals
    .filter((meal) => {
      const matchesSearch =
        meal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        meal.description?.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesFavorite = !showFavoritesOnly || meal.isFavorite

      return matchesSearch && matchesFavorite
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

  const clearFilters = () => {
    setSearchQuery("")
    setShowFavoritesOnly(false)
    setSortBy("createdAt")
  }

  const hasActiveFilters = showFavoritesOnly || searchQuery || sortBy !== "createdAt"

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Meals</h1>
          <p className="text-muted-foreground">Manage your meal database and track nutrition information</p>
        </div>
        <NewMealDialog>
          <Button size="lg" className="gap-2">
            <PlusCircle className="h-4 w-4" />
            Add Meal
          </Button>
        </NewMealDialog>
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
                    {showFavoritesOnly && (
                      <span className="ml-1 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                        1
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

          {showFavoritesOnly && (
            <>
              <Separator />
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">Active filters:</span>
                <div className="inline-flex items-center gap-1 rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors border-transparent bg-secondary text-secondary-foreground">
                  <Heart className="h-3 w-3" />
                  Favorites Only
                  <X className="h-3 w-3 cursor-pointer" onClick={() => setShowFavoritesOnly(false)} />
                </div>
              </div>
            </>
          )}
        </CardHeader>
      </Card>

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
        <>
          {/* Meals Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredMeals.map((meal) => (
              <Card key={meal.id} className="group overflow-hidden transition-all hover:shadow-lg border-0 shadow-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1 flex-1 min-w-0">
                      <CardTitle className="text-lg leading-tight">{meal.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">Per {meal.unit || "serving"}</p>
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
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/20">
                        <div className="rounded-full bg-orange-500 p-1.5">
                          <Zap className="h-3 w-3 text-white" />
                        </div>
                        <div>
                          <p className="text-xs font-medium text-orange-700 dark:text-orange-300">Calories</p>
                          <p className="text-lg font-bold text-orange-800 dark:text-orange-200">{meal.calories}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20">
                        <div className="rounded-full bg-purple-500 p-1.5">
                          <Wheat className="h-3 w-3 text-white" />
                        </div>
                        <div>
                          <p className="text-xs font-medium text-purple-700 dark:text-purple-300">Carbs</p>
                          <p className="text-lg font-bold text-purple-800 dark:text-purple-200">{meal.carbs || 0}g</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20">
                        <div className="rounded-full bg-blue-500 p-1.5">
                          <Target className="h-3 w-3 text-white" />
                        </div>
                        <div>
                          <p className="text-xs font-medium text-blue-700 dark:text-blue-300">Protein</p>
                          <p className="text-lg font-bold text-blue-800 dark:text-blue-200">{meal.protein || 0}g</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20">
                        <div className="rounded-full bg-green-500 p-1.5">
                          <Beef className="h-3 w-3 text-white" />
                        </div>
                        <div>
                          <p className="text-xs font-medium text-green-700 dark:text-green-300">Fat</p>
                          <p className="text-lg font-bold text-green-800 dark:text-green-200">{meal.fat || 0}g</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="flex items-center justify-between pt-4 border-t bg-muted/20">
                  <div className="text-xs text-muted-foreground">
                    Added {new Date(meal.createdAt ?? new Date()).toLocaleDateString()}
                  </div>
                  <div className="flex gap-1">
                    <EditMealDialog id={meal.id} meal={meal}>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-blue-100 hover:text-blue-600"
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit meal</span>
                      </Button>
                    </EditMealDialog>
                    <DeleteMeal meal={meal} />
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* Results Summary */}
      {filteredMeals.length > 0 && (
        <div className="flex items-center justify-center text-sm text-muted-foreground border-t pt-8">
          Showing {filteredMeals.length} of {meals.length} meals
        </div>
      )}
    </div>
  )
}

