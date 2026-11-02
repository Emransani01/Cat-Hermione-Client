import type { Metadata } from "next";
import { Suspense } from "react";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

import ThemeProvider from "@/providers/theme-provider";
import Navbar from "@/components/shared/navbar";
import Footer from "@/components/shared/footer";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Cat-Hermione | Social Development Events",
  description:
    "Join local social development events, volunteer activities, and community initiatives with Cat-Hermione.",
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
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <Suspense
            fallback={
              <div className="h-[73px] border-b border-base-300 bg-base-100" />
            }
          >
            <Navbar />
          </Suspense>

          <main className="flex-1">{children}</main>

          <Footer />

          <Toaster position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
