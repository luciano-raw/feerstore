import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/header";
import { ChatWidget } from "@/components/chat-widget";
import { DiscountProvider } from "@/components/discount-provider";
import { OrganizationSchema } from "@/components/json-ld";
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
  title: {
    default: "FerLu Store | Cuidado Capilar y Corporal en Chile",
    template: "%s | FerLu Store"
  },
  description: "Tu tienda de belleza favorita en Chile. Especialistas en cuidado capilar, corporal y productos Bubbaluu. Envíos a todo el país y entregas en Región del Maule (Talca, Linares, Longaví).",
  keywords: ["belleza", "cuidado capilar", "cuidado corporal", "bubbaluu chile", "bubbaluu talca", "tienda de belleza talca", "cosméticos chile"],
  authors: [{ name: "FerLu Store" }],
  creator: "FerLu Store",
  publisher: "FerLu Store",
  formatDetection: {
    email: false,
    address: true,
    telephone: true,
  },
  openGraph: {
    title: "FerLu Store | Belleza y Cuidado Personal en Chile",
    description: "Encuentra los mejores productos Bubbaluu y cuidado capilar. Envíos nacionales y entregas locales en Talca, Linares y Longaví.",
    url: "https://ferlu.store",
    siteName: "FerLu Store",
    locale: "es_CL",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FerLu Store | Tu Tienda de Belleza en Chile",
    description: "Tienda especializada en cuidado capilar y corporal con lo mejor de Bubbaluu. Envíos a todo Chile.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: "https://ferlu.store",
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
            <OrganizationSchema />
            <ChatWidget />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
