"use client";
import { useSearchParams } from "next/navigation";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import Modal from "@/components/modal";
import { AddDialog } from "./add-dialog";
import { getMeals } from "@/app/actions/meal-actions";

export default function ModalPage() {
  const searchParams = useSearchParams();
  const dateParam = searchParams.get('date');
  
  const { data: meals = [], isLoading, error } = useQuery({
    queryKey: ['meals'],
    queryFn: getMeals,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  const date = dateParam ? new Date(dateParam) : new Date();
  const selectedDate = format(date, "yyyy-MM-dd");

  if (isLoading) {
    return (
      <Modal>
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <span className="ml-2">Loading meals...</span>
        </div>
      </Modal>
    );
  }

  if (error) {
    return (
      <Modal>
        <div className="flex items-center justify-center p-8 text-red-500">
          <span>Error loading meals. Please try again.</span>
        </div>
      </Modal>
    );
  }

  return (
    <Modal>
      <AddDialog 
        selectedDate={new Date(selectedDate)} 
        meals={meals} 
      />
    </Modal>
  );
}
