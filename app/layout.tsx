import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SiteForge — AI-Powered Construction Management",
  description: "Run every job. Own every dollar. AI invoice processing, RFI management, and QuickBooks sync built for contractors.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
