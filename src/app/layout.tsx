import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Dancing_Script } from "next/font/google";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

const dancingScript = Dancing_Script({
  subsets: ["latin"],
  variable: "--font-dancing-script",
});

export const metadata: Metadata = {
  title: "Casamento Henrique e Paloma",
  description: "Lista de presentes do casamento de Henrique e Paloma",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geist.variable} ${dancingScript.variable} antialiased bg-background`}>
        {children}
      </body>
    </html>
  );
}