import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Hang Loose Ibiza | Boat Rental & Watersports",
  description: "The best boat rentals, boat trips and watersports in Ibiza. No license required for many of our boats.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <Header />
        <main>{children}</main>
        {/* A footer can be added here later */}
      </body>
    </html>
  );
}
