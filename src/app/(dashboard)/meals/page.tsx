"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  ChevronDown,
  X,
  Loader2,
  Edit,
  Trash2,
  Heart,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "@/components/ui/use-toast";
import {
  getMeals,
  toggleFavoriteMeal,
  deleteMeal,
} from "@/actions/meal-actions";
import { EditMealDialog } from "@/components/dashboard/meal/edit-meal-dialog";
import { Meal } from "@/db/schema";

export default function MealsPage() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [sortBy, setSortBy] = useState<
    "name" | "calories" | "protein" | "createdAt"
  >("createdAt");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [mealToDelete, setMealToDelete] = useState<Meal | null>(null);

  const allTags = Array.from(
    new Set(
      meals
        .filter((meal) => meal.tags !== null)
        .flatMap((meal) => meal.tags || []),
    ),
  );

  // Filter and sort meals
  const filteredMeals = meals
    .filter((meal) => {
      // Search filter
      const matchesSearch =
        meal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (meal.description &&
          meal.description.toLowerCase().includes(searchQuery.toLowerCase()));

      // Tags filter
      const matchesTags =
        selectedTags.length === 0 ||
        (meal.tags && selectedTags.every((tag) => meal.tags?.includes(tag)));

      // Favorites filter
      const matchesFavorite = !showFavoritesOnly || meal.isFavorite;

      return matchesSearch && matchesTags && matchesFavorite;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "calories":
          return b.calories - a.calories;
        case "protein":
          return (b.protein || 0) - (a.protein || 0);
        case "createdAt":
        default:
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
      }
    });

  // Load meals from the database
  useEffect(() => {
    async function loadMeals() {
      setIsLoading(true);
      try {
        const mealsData = await getMeals();
        setMeals(mealsData);
      } catch (error) {
        console.error("Error loading meals:", error);
        toast({
          title: "Error",
          description: "Failed to load meals. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }

    loadMeals();
  }, []);

  const handleToggleFavorite = async (id: number) => {
    try {
      const updatedMeal = await toggleFavoriteMeal(id);

      // Update the meals list
      setMeals(
        meals.map((meal) =>
          meal.id === id ? { ...meal, isFavorite: !meal.isFavorite } : meal,
        ),
      );

      toast({
        title: updatedMeal.isFavorite
          ? "Added to favorites"
          : "Removed from favorites",
        description: `${updatedMeal.name} has been ${updatedMeal.isFavorite ? "added to" : "removed from"} your favorites.`,
      });
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast({
        title: "Error",
        description: "Failed to update favorite status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteMeal = async () => {
    if (!mealToDelete) return;

    try {
      await deleteMeal(mealToDelete.id);

      // Remove the meal from the list
      setMeals(meals.filter((meal) => meal.id !== mealToDelete.id));

      toast({
        title: "Success",
        description: "Meal deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting meal:", error);
      toast({
        title: "Error",
        description: "Failed to delete meal. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setMealToDelete(null);
    }
  };

  const confirmDeleteMeal = (meal: Meal) => {
    setMealToDelete(meal);
    setDeleteDialogOpen(true);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedTags([]);
    setShowFavoritesOnly(false);
    setSortBy("createdAt");
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Meals</h1>
      </div>

      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
              size={18}
            />
            <Input
              placeholder="Search meals..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter size={16} />
                  Filter
                  {(selectedTags.length > 0 || showFavoritesOnly) && (
                    <Badge variant="secondary" className="ml-1 h-5 px-1.5">
                      {selectedTags.length + (showFavoritesOnly ? 1 : 0)}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Filter Options</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem
                  checked={showFavoritesOnly}
                  onCheckedChange={setShowFavoritesOnly}
                >
                  Favorites Only
                </DropdownMenuCheckboxItem>
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
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  Sort
                  <ChevronDown size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Sort By</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem
                  checked={sortBy === "createdAt"}
                  onCheckedChange={(checked) =>
                    checked && setSortBy("createdAt")
                  }
                >
                  Newest First
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={sortBy === "name"}
                  onCheckedChange={(checked) => checked && setSortBy("name")}
                >
                  Name (A-Z)
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={sortBy === "calories"}
                  onCheckedChange={(checked) =>
                    checked && setSortBy("calories")
                  }
                >
                  Highest Calories
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={sortBy === "protein"}
                  onCheckedChange={(checked) => checked && setSortBy("protein")}
                >
                  Highest Protein
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
            {(searchQuery ||
              selectedTags.length > 0 ||
              showFavoritesOnly ||
              sortBy !== "createdAt") && (
              <Button
                variant="ghost"
                size="icon"
                onClick={clearFilters}
                title="Clear filters"
              >
                <X size={16} />
              </Button>
            )}
          </div>
        </div>
        {selectedTags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selectedTags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="flex items-center gap-1"
              >
                {tag}
                <X
                  size={14}
                  className="cursor-pointer"
                  onClick={() => toggleTag(tag)}
                />
              </Badge>
            ))}
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-green-600" />
          <span className="ml-2 text-lg text-gray-600">Loading meals...</span>
        </div>
      ) : filteredMeals.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <div className="text-gray-400 mb-4">
            <Search size={48} className="mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            No meals found
          </h3>
          <p className="text-gray-500">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMeals.map((meal) => (
            <Card
              key={meal.id}
              className="overflow-hidden flex flex-col shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Update the meal card display to show the unit */}
              {/* Find the CardHeader section in the meal card and update it to include the unit */}
              <CardHeader className="pb-2 flex flex-row justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{meal.name}</CardTitle>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Per {meal.unit || "serving"}
                  </p>
                  {meal.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                      {meal.description}
                    </p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`h-8 w-8 ${meal.isFavorite ? "text-red-500" : "text-gray-400"}`}
                  onClick={() => handleToggleFavorite(meal.id)}
                >
                  <Heart
                    className={meal.isFavorite ? "fill-current" : ""}
                    size={18}
                  />
                </Button>
              </CardHeader>
              <CardContent className="pb-2 flex-1">
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="bg-gray-50 dark:bg-muted/50 p-2 rounded-md">
                    <p className="text-xs text-gray-500">Calories</p>
                    <p className="font-semibold">{meal.calories}</p>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-950/20 p-2 rounded-md">
                    <p className="text-xs text-gray-500">Protein</p>
                    <p className="font-semibold text-blue-600">
                      {meal.protein || 0}g
                    </p>
                  </div>
                  <div className="bg-purple-50 dark:bg-purple-950/20 p-2 rounded-md">
                    <p className="text-xs text-gray-500">Carbs</p>
                    <p className="font-semibold text-purple-600">
                      {meal.carbs || 0}g
                    </p>
                  </div>
                  <div className="bg-orange-50 dark:bg-orange-950/20 p-2 rounded-md">
                    <p className="text-xs text-gray-500">Fat</p>
                    <p className="font-semibold text-orange-600">
                      {meal.fat || 0}g
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between items-center pt-2 border-t">
                <div className="flex flex-wrap gap-1">
                  {meal.tags &&
                    meal.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                </div>
                <div className="flex gap-1">
                  <EditMealDialog id={meal.id} meal={meal}>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-gray-500 hover:text-blue-500"
                    >
                      <Edit size={16} />
                    </Button>
                  </EditMealDialog>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-500 hover:text-red-500"
                    onClick={() => confirmDeleteMeal(meal)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the meal "{mealToDelete?.name}". This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteMeal}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
