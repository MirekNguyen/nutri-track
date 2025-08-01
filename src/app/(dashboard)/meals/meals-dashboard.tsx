"use client";

import { useState } from "react";
import {
  Search,
  Filter,
  ChevronDown,
  X,
  Edit,
  Heart,
  PlusCircle,
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

import { toggleFavoriteMeal } from "@/actions/meal-actions";
import type { Meal } from "@/db/schema";
import { toast } from "sonner";
import { DeleteMeal } from "@/components/meals/delete-meal";
import { EditMealDialog } from "@/components/meals/edit-meal-dialog";
import { NewMealDialog } from "@/components/meals/new-meal-dialog";

type Props = {
  meals: Meal[];
};

export default function MealsDashboard({ meals }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [sortBy, setSortBy] = useState<
    "name" | "calories" | "protein" | "createdAt"
  >("createdAt");
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
        meal.description?.toLowerCase().includes(searchQuery.toLowerCase());

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
        default:
          return (
            new Date(b.createdAt ?? new Date()).getTime() -
            new Date(a.createdAt ?? new Date()).getTime()
          );
      }
    });

  const handleToggleFavorite = async (id: number) => {
    try {
      const updatedMeal = await toggleFavoriteMeal(id);

      toast(
        updatedMeal.isFavorite
          ? "Added to favorites"
          : "Removed from favorites",
        {
          description: `${updatedMeal.name} has been ${updatedMeal.isFavorite ? "added to" : "removed from"} your favorites.`,
        },
      );
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast("Error", {
        description: "Failed to update favorite status. Please try again.",
      });
    }
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
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          Meals
        </h1>
        <NewMealDialog>
          <Button className="bg-green-600 hover:bg-green-700 text-sm w-full sm:w-auto">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Meal
          </Button>
        </NewMealDialog>
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

      {filteredMeals.length === 0 ? (
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
                  {meal.tags?.map((tag) => (
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
                  <DeleteMeal meal={meal} />
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
