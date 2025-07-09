"use client"

import { Button } from "@/components/ui/button"

import { useState, useEffect } from "react"
import { BarChart3, Calendar, Home, Utensils, User, Weight, Menu, ChevronLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import { useMobile } from "@/hooks/use-mobile"
import Link from "next/link"
import { usePathname } from "next/navigation"
import React from "react"

interface NavItem {
  icon: React.ElementType
  label: string
  href: string
  active?: boolean
}

export const SidebarContext = React.createContext<{ collapsed: boolean }>({ collapsed: false })

export function SidebarContent() {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()
  const isMobile = useMobile()

  const navItems: NavItem[] = [
    { icon: Home, label: "Dashboard", href: "/" },
    { icon: Utensils, label: "Meals", href: "/meals" },
    { icon: BarChart3, label: "Statistics", href: "/statistics" },
    { icon: Calendar, label: "Planner", href: "/planner" },
    { icon: Weight, label: "Progress", href: "/progress" },
    { icon: User, label: "Profile", href: "/profile" },
  ]

  // Set active state based on current path
  useEffect(() => {
    navItems.forEach((item) => {
      item.active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
    })
  }, [pathname])

  // Create a new array with active states based on current path
  const navItemsWithActive = navItems.map((item) => ({
    ...item,
    active: pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href)),
  }))

  return (
    <div className="py-4 flex flex-col h-full">
      <div className="px-3 mb-4 flex items-center justify-between">
        {!collapsed && <h2 className="text-lg font-semibold text-gray-600">Menu</h2>}
        {!isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="h-8 w-8 text-gray-500 hover:bg-gray-100"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <Menu className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </Button>
        )}
      </div>
      <nav className="space-y-1 px-3 flex-1">
        {navItemsWithActive.map((item) => (
          <Button
            key={item.href}
            variant={item.active ? "default" : "ghost"}
            className={cn(
              "w-full justify-start transition-all",
              item.active
                ? "bg-green-600 text-white hover:bg-green-700"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
              collapsed ? "px-2" : "px-4",
            )}
            asChild
          >
            <Link href={item.href}>
              <item.icon className={cn("h-5 w-5", collapsed ? "mr-0" : "mr-2")} />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          </Button>
        ))}
      </nav>
      <div className="mt-auto px-3 py-2">
        {!collapsed && (
          <div className="bg-green-50 text-green-800 rounded-md p-3 text-sm">
            <p className="font-medium mb-1">Pro Tip</p>
            <p className="text-xs text-green-700">
              Track your meals consistently for better insights into your nutrition habits.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export function Sidebar() {
  return (
    <SidebarContext.Provider value={{collapsed: false}}>
      <aside
        className={cn(
          "fixed top-[60px] h-[calc(100vh-60px)] bg-background border-r border-border transition-all duration-300 z-20 hidden md:block shadow-sm overflow-y-auto",
          "w-64",
        )}
      >
        <SidebarContent />
      </aside>
    </SidebarContext.Provider>
  )
}
