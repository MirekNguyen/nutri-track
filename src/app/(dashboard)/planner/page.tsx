"use client";

import { useState } from "react";
import { format, addDays, startOfWeek } from "date-fns";
import { ChevronLeft, ChevronRight, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useMobile } from "@/hooks/use-mobile";
import { useSidebar } from "@/hooks/use-sidebar";

export default function PlannerPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedMealTime, setSelectedMealTime] = useState<string>("breakfast");
  const [selectedDay, setSelectedDay] = useState<Date>(new Date());
  const [dialogOpen, setDialogOpen] = useState(false);

  const isMobile = useMobile();
  const { collapsed } = useSidebar();

  // Generate week days starting from Sunday
  const weekStart = startOfWeek(currentDate);
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const handlePreviousWeek = () => {
    setCurrentDate(addDays(currentDate, -7));
  };

  const handleNextWeek = () => {
    setCurrentDate(addDays(currentDate, 7));
  };

  const openAddMealDialog = (day: Date, mealTime: string) => {
    setSelectedDay(day);
    setSelectedMealTime(mealTime);
    setDialogOpen(true);
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Meal Planner
        </h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handlePreviousWeek}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium px-2">
            {format(weekStart, "MMM d")} -{" "}
            {format(addDays(weekStart, 6), "MMM d, yyyy")}
          </span>
          <Button variant="outline" size="icon" onClick={handleNextWeek}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Mobile view - stacked layout */}
      <div className="block md:hidden mb-6 space-y-6">
        {weekDays.map((day) => (
          <div key={day.toString()} className="w-full">
            <div className="text-center p-3 bg-white rounded-t-lg border border-gray-200 border-b-0 shadow-sm">
              <p className="text-sm font-medium text-gray-500">
                {format(day, "EEEE")}
              </p>
              <p
                className={`text-xl font-bold ${format(day, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd") ? "text-green-600" : "text-gray-800"}`}
              >
                {format(day, "MMMM d")}
              </p>
            </div>
            <Card className="rounded-t-none shadow-sm">
              <CardContent className="p-4 space-y-4">
                {["breakfast", "lunch", "dinner", "snack"].map((mealTime) => (
                  <div
                    key={mealTime}
                    className="p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-gray-700 capitalize">
                        {mealTime}
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 px-2 text-xs"
                        onClick={() => openAddMealDialog(day, mealTime)}
                      >
                        <PlusCircle className="h-3.5 w-3.5 mr-1" />
                        Add
                      </Button>
                    </div>
                    <div className="text-sm text-gray-500 italic">
                      No meal planned
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      {/* Desktop view - grid layout with improved spacing */}
      <div className="hidden md:grid md:grid-cols-7 gap-4 mb-6">
        {weekDays.map((day) => (
          <div key={day.toString()} className="flex flex-col min-h-[420px]">
            <div className="text-center p-2 bg-white rounded-t-lg border border-gray-200 border-b-0 shadow-sm">
              <p className="text-sm font-medium text-gray-500">
                {format(day, "EEE")}
              </p>
              <p
                className={`text-lg font-bold ${format(day, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd") ? "text-green-600" : "text-gray-800"}`}
              >
                {format(day, "d")}
              </p>
            </div>
            <Card className="rounded-t-none flex-1 shadow-sm">
              <CardContent className="p-3 space-y-3">
                {["breakfast", "lunch", "dinner", "snack"].map((mealTime) => (
                  <div
                    key={mealTime}
                    className="p-2.5 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <p className="text-xs font-medium text-gray-700 capitalize">
                        {mealTime}
                      </p>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => openAddMealDialog(day, mealTime)}
                      >
                        <PlusCircle className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                    <div className="text-xs text-gray-500 italic">
                      No meal planned
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Shopping List</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">
            Your shopping list based on your meal plan will appear here.
          </p>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Meal to Plan</DialogTitle>
            <DialogDescription>
              {format(selectedDay, "EEEE, MMMM d")} -{" "}
              {selectedMealTime.charAt(0).toUpperCase() +
                selectedMealTime.slice(1)}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="meal" className="text-right">
                Meal
              </Label>
              <Select>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a meal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="grilled-chicken">
                    Grilled Chicken Salad
                  </SelectItem>
                  <SelectItem value="protein-smoothie">
                    Protein Smoothie Bowl
                  </SelectItem>
                  <SelectItem value="salmon">
                    Salmon with Roasted Vegetables
                  </SelectItem>
                  <SelectItem value="avocado-toast">
                    Avocado Toast with Eggs
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button className="bg-green-600 hover:bg-green-700">
              Add to Plan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
