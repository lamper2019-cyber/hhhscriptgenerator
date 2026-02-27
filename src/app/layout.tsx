import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Script Generator",
  description: "5-layer content script generator for short-form video",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${spaceGrotesk.variable} font-sans antialiased bg-[#0A0F0A] text-[#E2E8F0]`}
        style={{ fontFamily: "var(--font-space), system-ui, sans-serif" }}
      >
        {children}
      </body>
    </html>
  );
}
