// app/layout.tsx

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.scss";
import Header from "@/src/components/Header/Header";
import Footer from "@/src/components/Footer/Footer";
import { AdminAuthProvider } from "@/src/Context/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Furniture Master",
  description: "ავეჯის ხელოსნის პორტფოლიო",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ka">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <AdminAuthProvider>
        <Header/>
        {children}
        <Footer/>
        </AdminAuthProvider>
      </body>
    </html>
  );
}
