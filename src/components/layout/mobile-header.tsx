"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import { ThemeToggle } from "../theme-toggle";

export const MobileHeader = () => {
  const isMobile = useIsMobile();
  if (!isMobile) return null;
  return (
    <header className="sticky top-0 z-30 bg-transparent backdrop-blur-md border rounded-b-2xl border-b border-border px-4 md:px-6 py-3 shadow-sm">
      <div className="sticky flex items-center gap-2 justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-green-600 text-white p-1.5 rounded">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="md:w-5 md:h-5"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <h1 className="text-lg md:text-xl font-bold text-foreground">
            NutriTrack
          </h1>
        </div>
        <div className="flex items-center gap-2 md:gap-4">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};
