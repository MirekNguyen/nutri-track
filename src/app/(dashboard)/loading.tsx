import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      <span className="ml-2 text-lg text-gray-600">Loading...</span>
    </div>
  );
}
