import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
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
  title: "MangaVerse Vietnam - Doc truyen tranh online",
  description:
    "Doc truyen tranh online mien phi. Hang ngan bo manga cap nhat lien tuc tu MangaDex.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="relative min-h-screen overflow-hidden bg-dark-950">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.12),_transparent_30%),radial-gradient(circle_at_80%_20%,_rgba(249,115,22,0.16),_transparent_25%),linear-gradient(180deg,_rgba(15,23,42,0)_0%,_rgba(2,6,23,0.85)_100%)]" />
          <Navbar />
          <main className="relative z-10">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
