import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { PropsWithChildren } from "react";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <>
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex flex-col md:flex-row flex-1">
          <Sidebar />
          <main className="flex-1 p-4 md:p-6 overflow-auto md:ml-64 transition-all duration-300">
            {children}
          </main>
        </div>
        <Toaster />
      </div>
    </>
  );
}
