"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import { BarChart3, Home, User, Utensils } from "lucide-react";
import Link from "next/link";

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
  if (!isMobile) return null;
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-20 w-full items-center justify-around shadow-t bg-transparent backdrop-blur-md border dark:bg-background/50 dark:backdrop-blur-3xl rounded-3xl dark:shadow-t-gray-800">
      {items.map((item) => (
        <Link
          href={item.url}
          className="flex flex-col items-center justify-center gap-1 text-gray-500 transition-colors hover:text-gray-900 focus:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50 dark:focus:text-gray-50"
          key={item.title}
        >
          <item.icon className="text-xs"/>
          <span className="text-xs">{item.title}</span>
        </Link>
      ))}
    </nav>
  );
};
