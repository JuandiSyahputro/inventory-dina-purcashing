import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { SpeedInsights } from "@vercel/speed-insights/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Inventory - Leny Skincare",
  description: "Leny Skincare - High-quality skincare products for healthy, radiant skin.",
  icons: {
    icon: "/logo-leny.webp",
    apple: "/logo-leny.webp",
    shortcut: "/logo-leny.webp",
  },
  openGraph: {
    title: "Leny Skincare",
    description: "Discover Leny Skincare's premium range of skincare solutions—crafted for healthy, radiant skin.",
    url: "https://www.lenyskincare.com/",
    siteName: "Leny Skincare",
    images: [
      {
        url: "/logo-leny.webp",
        width: 1200,
        height: 630,
        alt: "Leny Skincare hero product",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Leny Skincare",
    description: "Explore Leny Skincare's premium skincare range for healthy, radiant skin.",
    images: ["/logo-leny.webp"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
        <Toaster position="top-center" />
        <SpeedInsights />
      </body>
    </html>
  );
}
