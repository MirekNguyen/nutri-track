import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "NutriTrack",
  description: "App to track your nutrition and calories",
};

export default function RootLayout({
  modal,
  children,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          {modal}
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
