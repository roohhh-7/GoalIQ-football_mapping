import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

import { Cabin } from "next/font/google";

const heming = localFont({
  src: "./fonts/heming-variable.ttf",
  variable: "--font-heming",
  display: "swap",
  weight: "100 900",
});

const cabin = Cabin({
  subsets: ["latin"],
  variable: "--font-cabin",
  display: "swap",
});

import Sidebar from "@/components/Sidebar";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/contexts/AuthContext";

export const metadata: Metadata = {
  title: "GoalIQ | Understand Every Shot",
  description: "World Cup Shot Intelligence Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${heming.variable} ${cabin.variable} font-sans h-full antialiased`}
    >
      <body suppressHydrationWarning className="min-h-full flex bg-app-bg text-text-main font-light transition-colors duration-300">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <Sidebar />
            <main className="flex-1 ml-64 min-h-screen">
              {children}
            </main>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
