"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import { BarChart3, Home, User, Utensils } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

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
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-20 pb-4 w-full items-center justify-around shadow-t bg-transparent backdrop-blur-md border dark:bg-background/50 dark:backdrop-blur-3xl rounded-2xl dark:shadow-t-gray-800">
      {items.map((item) => (
        <Link
          href={item.url}
          className={`flex flex-col items-center justify-center gap-1 ${pathname !== item.url ? "text-muted-foreground" : "text-foreground"} transition-colors hover:text-foreground`}
          key={item.title}
        >
          <item.icon className="text-xs"/>
          <span className="text-xs">{item.title}</span>
        </Link>
      ))}
    </nav>
  );
};
