"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles } from "lucide-react";
import { getHealthSummaryWithUser } from "@/actions/ai-summary-actions";

type HealthSummaryDialogProps = {
  date: string;
};

export function AISummary({ date }: HealthSummaryDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [summary, setSummary] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  async function handleSummarize() {
    setLoading(true);
    setSummary(null);
    setError(null);
    try {
      const res = await getHealthSummaryWithUser({ date });
      setSummary(res);
    } catch {
      setError("Sorry, something went wrong.");
    }
    setLoading(false);
  }

  // Optionally: load summary only when dialog opens
  React.useEffect(() => {
    if (open) {
      handleSummarize();
    } else {
      setSummary(null);
      setError(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-blue-50 hover:bg-blue-100 text-blue-700 text-sm sm:w-auto">
          <Sparkles className="w-4 h-4" />
          AI Summarize
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>AI Health Summary</DialogTitle>
        <div className="min-h-[80px]">
          {loading && (
            <div className="flex items-center space-x-2">
              <Loader2 className="animate-spin" size={20} />
              <span>Summarizing...</span>
            </div>
          )}
          {error && <div className="text-red-500">{error}</div>}
          {summary && <p>{summary}</p>}
        </div>
      </DialogContent>
    </Dialog>
  );
}
