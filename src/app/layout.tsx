import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#075D44",
};

export const metadata: Metadata = {
  title: "Amazon. Diagnosed. | Neato",
  description:
    "Eight questions. Ninety seconds. We grade your Amazon against the top 10% in your category and put a dollar number on the gap.",
  openGraph: {
    title: "Amazon. Diagnosed. | Neato",
    description:
      "Free 9-question diagnostic. Grade your Amazon against the top 10% in your category. Get a dollar number on the gap.",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
