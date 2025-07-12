import { CalorieTracker } from "../components/dashboard/calorie-tracker";
import { format } from "date-fns";

type Props = {
  searchParams: Promise<{ date?: string }>;
};
export default async function CalorieTrackerPage({ searchParams }: Props) {
  const date = (await searchParams).date ?? new Date();
  const selectedDate = format(date ?? new Date(), "yyyy-MM-dd");

  return <CalorieTracker selectedDate={selectedDate} />;
}
