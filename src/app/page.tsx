import { Suspense } from "react";
import { CalorieTracker } from "./(dashboard)/calorie-tracker";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";

type Props = {
  searchParams: Promise<{ date?: string }>;
};
export default async function CalorieTrackerPage({ searchParams }: Props) {
  const date = (await searchParams).date ?? new Date();
  const selectedDate = format(date ?? new Date(), "yyyy-MM-dd");

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-green-600" />
          <span className="ml-2 text-lg text-gray-600">Loading...</span>
        </div>
      }
    >
      <CalorieTracker selectedDate={selectedDate} />;
    </Suspense>
  );
}
