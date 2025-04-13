"use client"

import { BookOpen, User, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useMobile } from "@/hooks/use-mobile"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { SidebarContent } from "./sidebar"

export function Header() {
  const isMobile = useMobile()
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 md:px-6 py-3 shadow-sm">
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
          <h1 className="text-lg md:text-xl font-bold text-gray-800">NutriTrack</h1>
        </div>
        <div className="flex items-center gap-2 md:gap-4">
          {isMobile && (
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-500 hover:bg-gray-100 transition-transform transform hover:scale-110 active:scale-95"
                >
                  <Menu
                    className={cn(
                      "h-5 w-5",
                      pathname === "/" ||
                        pathname === "/meals" ||
                        pathname === "/statistics" ||
                        pathname === "/planner" ||
                        pathname === "/progress" ||
                        pathname === "/profile" ||
                        pathname === "/settings"
                        ? "text-green-600"
                        : "",
                    )}
                  />
                  <span className="sr-only">Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-64 shadow-xl">
                <SidebarContent />
              </SheetContent>
            </Sheet>
          )}
          <Button variant="ghost" size="icon" className="text-gray-500 hidden md:flex hover:bg-gray-100">
            <BookOpen className="h-5 w-5" />
            <span className="sr-only">Nutrition Guide</span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8 border border-gray-200">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" alt="@user" />
                  <AvatarFallback className="bg-green-100 text-green-800">JD</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">John Doe</p>
                  <p className="text-xs leading-none text-gray-500">john.doe@example.com</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
