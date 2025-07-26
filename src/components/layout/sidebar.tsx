"use client";

import {
  BarChart3,
  Calendar,
  Home,
  User,
  Utensils,
  Weight,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { AppHeader } from "./header";
import { usePathname } from "next/navigation";
import { UserAvatar } from "../common/user-avatar";

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
    title: "Planner",
    url: "/planner",
    icon: Calendar,
  },
  {
    title: "Progress",
    url: "/progress",
    icon: Weight,
  },
  {
    title: "Profile",
    url: "/profile",
    icon: User,
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { state, isMobile } = useSidebar();
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            { (state === "expanded" || isMobile) && (
            <AppHeader />
            )}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton isActive={item.url === pathname} asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        {state === "expanded" && (<div className="mt-auto px-3 py-2">
          <div className="bg-green-50 dark:bg-green-950/20 text-green-800 dark:text-green-200 rounded-md p-3 text-sm">
            <p className="font-medium mb-1">Pro Tip</p>
            <p className="text-xs text-green-700 dark:text-green-300">
              Track your meals consistently for better insights into your
              nutrition habits.
            </p>
          </div>
        </div>)}
        <UserAvatar />
      </SidebarFooter>
    </Sidebar>
  );
}
