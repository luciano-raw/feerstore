import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider, ThemeInitScript } from "@/components/theme-provider";
import { Header } from "@/components/header";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Feer Store",
  description: "Tu tienda favorita de joyas y cuidado capilar",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="es" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable}`}>
        <head>
          <ThemeInitScript />
        </head>
        <body className="min-h-screen flex flex-col antialiased" suppressHydrationWarning>
          <ThemeProvider>
            <Header />
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
