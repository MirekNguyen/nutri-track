"use client";

import { format } from "date-fns";
import { Camera, Loader2, PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  createBodyMeasurement,
  deleteBodyMeasurement,
  getBodyMeasurements,
} from "@/actions/measurement-actions";
import {
  createWeightEntry,
  deleteWeightEntry,
  getWeightEntries,
} from "@/actions/weight-actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { BodyMeasurement, WeightEntry } from "@/db/schema";

export default function ProgressPage() {
  const [activeTab, setActiveTab] = useState("weight");
  const [weightEntries, setWeightEntries] = useState<WeightEntry[]>([]);
  const [measurements, setMeasurements] = useState<BodyMeasurement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state for weight entry
  const [newWeight, setNewWeight] = useState("");
  const [newWeightNote, setNewWeightNote] = useState("");

  // Form state for body measurements
  const [newChest, setNewChest] = useState("");
  const [newWaist, setNewWaist] = useState("");
  const [newHips, setNewHips] = useState("");
  const [newArms, setNewArms] = useState("");
  const [newThighs, setNewThighs] = useState("");

  // Load data from the database
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        if (activeTab === "weight") {
          const entries = await getWeightEntries();
          setWeightEntries(entries);
        } else if (activeTab === "measurements") {
          const measurements = await getBodyMeasurements();
          setMeasurements(measurements);
        }
      } catch (error) {
        console.error("Error loading data:", error);
        toast.error("Error", {
          description: "Failed to load data. Please try again.",
        });
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [activeTab]);

  const handleAddWeightEntry = async () => {
    if (!newWeight) return;

    setIsSubmitting(true);

    try {
      const weight = Number.parseFloat(newWeight);
      if (Number.isNaN(weight)) throw new Error("Invalid weight value");

      const today = new Date();

      const newEntry = await createWeightEntry({
        weight: weight.toString(),
        entryDate: today.toISOString(),
        note: newWeightNote || null,
      });

      // Add the new entry to the list
      setWeightEntries([newEntry, ...weightEntries]);

      // Reset form
      setNewWeight("");
      setNewWeightNote("");

      toast("Success", {
        description: "Weight entry added successfully",
      });
    } catch (error) {
      console.error("Error adding weight entry:", error);
      toast.error("Error", {
        description: "Failed to add weight entry. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteWeightEntry = async (id: number) => {
    try {
      await deleteWeightEntry(id);

      // Remove the entry from the list
      setWeightEntries(weightEntries.filter((entry) => entry.id !== id));

      toast("Success", {
        description: "Weight entry deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting weight entry:", error);
      toast.error("Error", {
        description: "Failed to delete weight entry. Please try again.",
      });
    }
  };

  const handleAddMeasurement = async () => {
    if (!newChest && !newWaist && !newHips && !newArms && !newThighs) {
      toast.error("Error", {
        description: "Please enter at least one measurement",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const today = new Date();

      const newMeasurement = await createBodyMeasurement({
        entryDate: new Date(today).toISOString(),
        chest: newChest,
        waist: newWaist,
        hips: newHips,
        arms: newArms,
        thighs: newThighs,
      });

      // Add the new measurement to the list
      setMeasurements([newMeasurement, ...measurements]);

      // Reset form
      setNewChest("");
      setNewWaist("");
      setNewHips("");
      setNewArms("");
      setNewThighs("");

      toast("Success", {
        description: "Measurements added successfully",
      });
    } catch (error) {
      console.error("Error adding measurements:", error);
      toast.error("Error", {
        description: "Failed to add measurements. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteMeasurement = async (id: number) => {
    try {
      await deleteBodyMeasurement(id);

      // Remove the measurement from the list
      setMeasurements(
        measurements.filter((measurement) => measurement.id !== id),
      );

      toast("Success", {
        description: "Measurement deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting measurement:", error);
      toast.error("Error", {
        description: "Failed to delete measurement. Please try again.",
      });
    }
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          Progress Tracking
        </h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="weight">Weight</TabsTrigger>
          <TabsTrigger value="measurements">Measurements</TabsTrigger>
          <TabsTrigger value="photos">Progress Photos</TabsTrigger>
        </TabsList>

        <TabsContent value="weight" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Weight Trend</CardTitle>
                  <CardDescription>
                    Track your weight changes over time
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-80 flex items-center justify-center">
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <Loader2 className="h-8 w-8 animate-spin text-green-600" />
                      <span className="ml-2 text-gray-600">Loading...</span>
                    </div>
                  ) : weightEntries.length > 0 ? (
                    <div className="w-full h-full">
                      <div className="flex flex-col h-full">
                        <div className="flex-1 relative">
                          {weightEntries
                            .slice(0, 10)
                            .reverse()
                            .map((entry, index, arr) => {
                              const minWeight = Math.min(
                                ...arr.map((e) => Number(e.weight)),
                              );
                              const maxWeight = Math.max(
                                ...arr.map((e) => Number(e.weight)),
                              );
                              const range = maxWeight - minWeight || 10;
                              const height =
                                ((Number(entry.weight) - minWeight) / range) *
                                  80 +
                                10;

                              return (
                                <div
                                  key={entry.id}
                                  className="absolute flex flex-col items-center"
                                  style={{
                                    left: `${(index / (arr.length - 1 || 1)) * 100}%`,
                                    bottom: `${height}%`,
                                    transform: "translateX(-50%)",
                                  }}
                                >
                                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                                  {index === 0 || index === arr.length - 1 ? (
                                    <div className="text-xs font-medium mt-1">
                                      {entry.weight}
                                    </div>
                                  ) : null}
                                </div>
                              );
                            })}
                          {weightEntries
                            .slice(0, 10)
                            .reverse()
                            .map((entry, index, arr) => {
                              if (index === 0) return null;

                              const prev = arr[index - 1];
                              const minWeight = Math.min(
                                ...arr.map((e) => Number(e.weight)),
                              );
                              const maxWeight = Math.max(
                                ...arr.map((e) => Number(e.weight)),
                              );
                              const range = maxWeight - minWeight || 10;

                              const startHeight =
                                ((Number(prev.weight) - minWeight) / range) *
                                  80 +
                                10;
                              const endHeight =
                                ((Number(entry.weight) - minWeight) / range) *
                                  80 +
                                10;

                              return (
                                <svg
                                  key={`line-${entry.id}`}
                                  className="absolute inset-0 w-full h-full"
                                  style={{ zIndex: -1 }}
                                >
                                  <line
                                    x1={`${((index - 1) / (arr.length - 1 || 1)) * 100}%`}
                                    y1={`${100 - startHeight}%`}
                                    x2={`${(index / (arr.length - 1 || 1)) * 100}%`}
                                    y2={`${100 - endHeight}%`}
                                    stroke="#22c55e"
                                    strokeWidth="2"
                                  />
                                </svg>
                              );
                            })}
                        </div>
                        <div className="h-6 mt-4 flex justify-between text-xs text-gray-500">
                          {weightEntries
                            .slice(0, 10)
                            .reverse()
                            .map((entry, index, arr) => (
                              <div
                                key={`date-${entry.id}`}
                                className="text-center"
                                style={{
                                  width: `${100 / arr.length}%`,
                                  display:
                                    arr.length > 7 &&
                                    index % 2 !== 0 &&
                                    index !== arr.length - 1
                                      ? "none"
                                      : "block",
                                }}
                              >
                                {format(new Date(entry.entryDate), "MMM d")}
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500">
                      No weight entries yet. Add your first entry!
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
            <div>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Weight Log
                  </CardTitle>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="icon" className="h-8 w-8">
                        <PlusCircle className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Weight Entry</DialogTitle>
                        <DialogDescription>
                          Record your current weight
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="weight" className="text-right">
                            Weight
                          </Label>
                          <Input
                            id="weight"
                            type="number"
                            step="0.1"
                            placeholder="Weight in lbs"
                            className="col-span-3"
                            value={newWeight}
                            onChange={(e) => setNewWeight(e.target.value)}
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="note" className="text-right">
                            Note
                          </Label>
                          <Input
                            id="note"
                            placeholder="Optional note"
                            className="col-span-3"
                            value={newWeightNote}
                            onChange={(e) => setNewWeightNote(e.target.value)}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          className="bg-green-600 hover:bg-green-700"
                          onClick={handleAddWeightEntry}
                          disabled={isSubmitting || !newWeight}
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            "Save Entry"
                          )}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex items-center justify-center h-40">
                      <Loader2 className="h-6 w-6 animate-spin text-green-600" />
                    </div>
                  ) : weightEntries.length > 0 ? (
                    <div className="space-y-4">
                      {weightEntries.map((entry) => (
                        <div
                          key={entry.id}
                          className="flex justify-between items-center border-b pb-2 last:border-0"
                        >
                          <div>
                            <p className="text-sm font-medium">
                              {format(new Date(entry.entryDate), "MMM d, yyyy")}
                            </p>
                            {entry.note && (
                              <p className="text-xs text-gray-500">
                                {entry.note}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <p className="font-bold">{entry.weight} lbs</p>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-gray-400 hover:text-red-500"
                              onClick={() => handleDeleteWeightEntry(entry.id)}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M3 6h18" />
                                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                              </svg>
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-gray-500">
                      <p>No weight entries yet</p>
                      <p className="text-sm">
                        Click the + button to add your first entry
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="measurements" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Body Measurements</CardTitle>
                  <CardDescription>
                    Track changes in your body measurements
                  </CardDescription>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="bg-green-600 hover:bg-green-700">
                      <PlusCircle className="mr-2 h-4 w-4" /> Add Measurements
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Measurements</DialogTitle>
                      <DialogDescription>
                        Record your current body measurements
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="chest" className="block mb-2">
                            Chest (in)
                          </Label>
                          <Input
                            id="chest"
                            type="number"
                            step="0.1"
                            value={newChest}
                            onChange={(e) => setNewChest(e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="waist" className="block mb-2">
                            Waist (in)
                          </Label>
                          <Input
                            id="waist"
                            type="number"
                            step="0.1"
                            value={newWaist}
                            onChange={(e) => setNewWaist(e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="hips" className="block mb-2">
                            Hips (in)
                          </Label>
                          <Input
                            id="hips"
                            type="number"
                            step="0.1"
                            value={newHips}
                            onChange={(e) => setNewHips(e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="arms" className="block mb-2">
                            Arms (in)
                          </Label>
                          <Input
                            id="arms"
                            type="number"
                            step="0.1"
                            value={newArms}
                            onChange={(e) => setNewArms(e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="thighs" className="block mb-2">
                            Thighs (in)
                          </Label>
                          <Input
                            id="thighs"
                            type="number"
                            step="0.1"
                            value={newThighs}
                            onChange={(e) => setNewThighs(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        className="bg-green-600 hover:bg-green-700"
                        onClick={handleAddMeasurement}
                        disabled={
                          isSubmitting ||
                          (!newChest &&
                            !newWaist &&
                            !newHips &&
                            !newArms &&
                            !newThighs)
                        }
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          "Save Measurements"
                        )}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center h-40">
                  <Loader2 className="h-8 w-8 animate-spin text-green-600" />
                  <span className="ml-2 text-gray-600">
                    Loading measurements...
                  </span>
                </div>
              ) : measurements.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-4 font-medium text-gray-500">
                          Date
                        </th>
                        <th className="text-center py-2 px-4 font-medium text-gray-500">
                          Chest
                        </th>
                        <th className="text-center py-2 px-4 font-medium text-gray-500">
                          Waist
                        </th>
                        <th className="text-center py-2 px-4 font-medium text-gray-500">
                          Hips
                        </th>
                        <th className="text-center py-2 px-4 font-medium text-gray-500">
                          Arms
                        </th>
                        <th className="text-center py-2 px-4 font-medium text-gray-500">
                          Thighs
                        </th>
                        <th className="text-center py-2 px-4 font-medium text-gray-500">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {measurements.map((measurement) => (
                        <tr
                          key={measurement.id}
                          className="border-b last:border-0"
                        >
                          <td className="py-3 px-4 font-medium">
                            {format(
                              new Date(measurement.entryDate),
                              "MMM d, yyyy",
                            )}
                          </td>
                          <td className="py-3 px-4 text-center">
                            {measurement.chest ? `${measurement.chest}"` : "-"}
                          </td>
                          <td className="py-3 px-4 text-center">
                            {measurement.waist ? `${measurement.waist}"` : "-"}
                          </td>
                          <td className="py-3 px-4 text-center">
                            {measurement.hips ? `${measurement.hips}"` : "-"}
                          </td>
                          <td className="py-3 px-4 text-center">
                            {measurement.arms ? `${measurement.arms}"` : "-"}
                          </td>
                          <td className="py-3 px-4 text-center">
                            {measurement.thighs
                              ? `${measurement.thighs}"`
                              : "-"}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-gray-400 hover:text-red-500"
                              onClick={() =>
                                handleDeleteMeasurement(measurement.id)
                              }
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M3 6h18" />
                                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                              </svg>
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No measurements recorded yet</p>
                  <p className="text-sm mt-1">
                    Add your first measurement to start tracking your progress
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="photos" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Progress Photos</CardTitle>
                  <CardDescription>
                    Visual record of your transformation
                  </CardDescription>
                </div>
                <Button className="bg-green-600 hover:bg-green-700">
                  <Camera className="mr-2 h-4 w-4" /> Add Photos
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col items-center">
                  <div className="bg-gray-100 w-full aspect-square rounded-md flex items-center justify-center mb-2">
                    <p className="text-gray-500">Front view</p>
                  </div>
                  <p className="text-sm text-gray-500">No photos yet</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="bg-gray-100 w-full aspect-square rounded-md flex items-center justify-center mb-2">
                    <p className="text-gray-500">Side view</p>
                  </div>
                  <p className="text-sm text-gray-500">No photos yet</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="bg-gray-100 w-full aspect-square rounded-md flex items-center justify-center mb-2">
                    <p className="text-gray-500">Back view</p>
                  </div>
                  <p className="text-sm text-gray-500">No photos yet</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-6">
              <p className="text-sm text-gray-500">
                Tip: Take photos in the same lighting, position, and clothing
                for the most accurate comparison.
              </p>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}
