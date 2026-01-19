import type { Metadata } from "next";
import { Space_Grotesk, Unbounded } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
  display: "swap"
});

const unbounded = Unbounded({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap"
});

export const metadata: Metadata = {
  title: "Igris Flow Builder",
  description: "A flexible flow builder for designing diagrams and system maps."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${spaceGrotesk.variable} ${unbounded.variable}`}>
        {children}
      </body>
    </html>
  );
}
