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

// არ დამავიწყდეს რეალური დომეინის ჩასმა როცა ვიყიდი
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL
    ? new URL(process.env.NEXT_PUBLIC_SITE_URL)
    : new URL("https://furniture-master-sigma.vercel.app/");

export const metadata: Metadata = {
  metadataBase: siteUrl,

  title: {
    default: "Furniture Master – პროფესიონალი ავეჯის ხელოსანი",
    template: "%s | Furniture Master",
  },

  description:
    "პროფესიონალი ავეჯის ხელოსანი – სამზარეულოები, გარდერობები, კარადები და სხვა ინდივიდუალური ავეჯის პროექტები ",

  keywords: [
    //ჩემი ენა ქართული და შემოქარგული
    "ავეჯი",
    "სამზარეულო",
    "გარდერობი",
    "საძინებელი",
    "შკაფი",
    "კარადები",
    "ხელოსანი",
    "ავეჯის დამზადება",
    "საძნებელი",
    "ავეჯი ბათუმი",
    "სამზარეულოს ავეჯი",
    "საძინებლის ავეჯი",
//ინგლისური
    "custom furniture",
  "kitchen furniture",
  "wardrobe design",
  "bespoke furniture",
  "handmade furniture",
  "interior projects",
  "furniture master georgia",
  "modern kitchen design",

  //რურული
"мебель на заказ",
  "кухонная мебель",
  "шкафы на заказ",
  "гардероб на заказ",
  "мебель в Батуми",
  "изготовление мебели",
  "индивидуальная мебель",
  "мастер мебели",
  ],

  openGraph: {
    type: "website",
    url: "/",
    siteName: "mebelisaxli",
    title: " პროფესიონალი ავეჯის ხელოსანი",
    description:
      "გადამწყვეტი ხარისხი, ზუსტი ზომები და ინდივიდუალური დიზაინი",
    images: [
      {
        url: "/og/kitchen.jpg", 
        width: 1200,
        height: 630,
        alt: "თანამედროვე სამზარეულო და ავეჯის ნამუშევრები",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Furniture Master – პროფესიონალი ავეჯის ხელოსანი",
    description:
      "მოტივირებული ხელოსანი, რომელიც ქმნის ინდივიდუალურ სამზარეულოსა და ავეჯს მაღალი ხარისხით.",
    images: ["/og/kitchen.jpg"],
  },
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
          <Header />
          {children}
          <Footer />
        </AdminAuthProvider>
      </body>
    </html>
  );
}
