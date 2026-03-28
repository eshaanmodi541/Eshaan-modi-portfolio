import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Sidebar } from "@/components/layout/Sidebar";
import { Footer } from "@/components/layout/Footer";
import { CircuitTraceBackground } from "@/components/ui/CircuitTrace";
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
    default: "Eshaan Modi",
    template: "%s — Eshaan Modi",
  },
  description: "Engineer. Builder. Tinkerer.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body className="min-h-screen bg-bg-primary text-fg-primary">
        <CircuitTraceBackground />
        <Sidebar />
        <main className="relative z-10 md:ml-14 pb-20 md:pb-0">
          {children}
        </main>
        <div className="md:ml-14">
          <Footer />
        </div>
      </body>
    </html>
  );
}
