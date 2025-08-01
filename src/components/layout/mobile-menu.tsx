"use client";

import { BarChart3, Home, Plus, User, Utensils } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useIsMobile } from "@/hooks/use-mobile";
import { AddFoodEntry } from "../dashboard/food-entry/add-food-entry";

const items = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    title: "Meals",
    url: "/meals",
    icon: Utensils,
  },
  {
    title: "Statistics",
    url: "/statistics",
    icon: BarChart3,
  },
  {
    title: "Profile",
    url: "/profile",
    icon: User,
  },
];

export const MobileMenu = () => {
  const isMobile = useIsMobile();
  const pathname = usePathname();

  if (!isMobile) return null;

  const firstHalf = items.slice(0, 2);
  const secondHalf = items.slice(2);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-20 pb-4 w-full items-center justify-around shadow-t bg-transparent backdrop-blur-md border dark:bg-background/50 dark:backdrop-blur-3xl rounded-2xl dark:shadow-t-gray-800">
      {firstHalf.map((item) => (
        <Link
          href={item.url}
          className={`flex flex-col items-center justify-center gap-1 ${
            pathname !== item.url ? "text-muted-foreground" : "text-foreground"
          } transition-colors hover:text-foreground`}
          key={item.title}
        >
          <item.icon className="text-xs" />
          <span className="text-xs">{item.title}</span>
        </Link>
      ))}

      <AddFoodEntry>
        <button className="flex flex-col items-center justify-center gap-1 group">
          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-lg transition-all duration-200 group-hover:scale-105 group-active:scale-95">
            <Plus className="w-6 h-6 text-primary-foreground" />
          </div>
        </button>
      </AddFoodEntry>

      {secondHalf.map((item) => (
        <Link
          href={item.url}
          className={`flex flex-col items-center justify-center gap-1 ${
            pathname !== item.url ? "text-muted-foreground" : "text-foreground"
          } transition-colors hover:text-foreground`}
          key={item.title}
        >
          <item.icon className="text-xs" />
          <span className="text-xs">{item.title}</span>
        </Link>
      ))}
    </nav>
  );
};
