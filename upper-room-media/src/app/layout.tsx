import type { Metadata } from "next";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "Upper Room Media - AI-Powered Church Presentation",
  description:
    "Turn spoken Bible references into beautiful on-screen Scripture in seconds. Built for churches.",
  icons: {
    icon: [{ type: "image/svg+xml", url: "/favicon.svg" }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}