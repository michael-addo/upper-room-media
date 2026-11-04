import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}