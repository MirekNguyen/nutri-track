import { AppSidebar } from "@/components/app-sidebar";
import { MobileMenu } from "@/components/mobile-menu";
import { MobileNavMenu } from "@/components/mobile-nav-menu";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { cookies } from "next/headers";
import { PropsWithChildren } from "react";

export default async function Layout({ children }: PropsWithChildren) {
  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"

  return (
    <>
      <SidebarProvider defaultOpen={defaultOpen}>
        <AppSidebar />
        <div className="min-h-screen bg-background flex flex-col w-full">
          {/* <Header /> */}
          <MobileNavMenu />
          <div className="flex flex-col md:flex-row flex-1 pb-20 md:pb-0">
            {/* <Sidebar /> */}
            <main className="flex-1 p-4 md:p-6 overflow-auto transition-all duration-300">
              <SidebarTrigger />
              {children}
            </main>
          </div>
          <MobileMenu />
          <Toaster />
        </div>
      </SidebarProvider>
    </>
  );
}
