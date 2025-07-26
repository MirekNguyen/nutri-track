"use client";

import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { useRouter } from "next/navigation";
import { useUser, useClerk } from "@clerk/nextjs";
import { ThemeToggle } from "@/components/common/theme-toggle";

export function AppHeader() {
  const router = useRouter();
  const { user } = useUser();
  const { signOut } = useClerk();

  // Get user initials for avatar fallback
  const getInitials = () => {
    if (!user) return "U";
    const firstName = user.firstName || "";
    const lastName = user.lastName || "";
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || "U";
  };

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
  };

  return (
    <header className="bg-background border-b border-border px-4 md:px-6 py-3 shadow-sm">
      <div className="flex items-center justify-between">
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
}
