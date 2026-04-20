import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: {
    default: "AutoHub — Premium Automotive Management",
    template: "%s | AutoHub",
  },
  description:
    "The most advanced automotive management platform. Track vehicles, schedule services, and manage your fleet with elegance.",
  keywords: ["automotive", "car management", "vehicle service", "fleet management"],
};

import { Providers } from "@/components/providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#080808]`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
