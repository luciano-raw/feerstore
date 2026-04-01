import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/header";
import { ChatWidget } from "@/components/chat-widget";
import { DiscountProvider } from "@/components/discount-provider";
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
  metadataBase: new URL("https://ferlu.store"),
  title: "FerLu Store",
  description: "Tu tienda especializada en cuidado capilar y corporal, envíos a todo Chile.",
  openGraph: {
    title: "FerLu Store | Cuidado Capilar y Corporal",
    description: "Tu tienda de belleza favorita. Envíos nacionales y entregas en Región del Maule (Talca, Linares, Longaví).",
    url: "https://ferlu.store",
    siteName: "FerLu Store",
    locale: "es_CL",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FerLu Store",
    description: "Tu tienda especializada en cuidado capilar y corporal, envíos a todo Chile.",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await currentUser();
  const discount = (user?.publicMetadata?.discount as number) || 0;

  return (
    <ClerkProvider>
      <html lang="es" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable}`}>
        <head>
          <script
            dangerouslySetInnerHTML={{
              __html: `
                try {
                  var theme = localStorage.getItem('theme');
                  var isSysDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (theme === 'dark' || (!theme && isSysDark)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              `,
            }}
          />
        </head>
        <body className="min-h-screen flex flex-col antialiased" suppressHydrationWarning>
          <ThemeProvider>
            <DiscountProvider discount={discount} />
            <Header />
            {children}
            <ChatWidget />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
