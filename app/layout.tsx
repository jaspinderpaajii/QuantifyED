import type { Metadata } from "next";
import { Manrope, Space_Grotesk } from "next/font/google";

import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "QuantifyED",
    template: "%s | QuantifyED",
  },
  description:
    "QuantifyED is a study platform for PDF resources, video links, and admin-managed learning content.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${spaceGrotesk.variable} h-full scroll-smooth`}
    >
      <body className="min-h-full bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
