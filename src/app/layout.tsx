import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Stackshift — Redefine Your Digital Presence",
  description:
    "Stackshift delivers cutting-edge digital experiences that push the boundaries of what's possible on the web.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} font-[var(--font-outfit)] antialiased`}>
        {children}
      </body>
    </html>
  );
}
