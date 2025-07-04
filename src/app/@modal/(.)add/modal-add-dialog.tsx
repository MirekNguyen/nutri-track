"use client";

import { AddDialog } from "./add-dialog";
import { format } from "date-fns";
import { getMeals } from "@/app/actions/meal-actions";
import { useQuery } from "@tanstack/react-query";

export const ModalAddDialog = () => {
  const { data: meals = [], isLoading, error } = useQuery({
    queryKey: ['meals'],
    queryFn: getMeals,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const date = new Date();
  const selectedDate = format(date, "yyyy-MM-dd");

  if (isLoading) {
    return <div>Loading meals...</div>;
  }

  if (error) {
    return <div>Error loading meals</div>;
  }

  return <AddDialog selectedDate={new Date(selectedDate)} meals={meals} />;
};
