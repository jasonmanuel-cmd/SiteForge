import type { Metadata } from "next";
import { Inter, Oswald } from "next/font/google";
import { ToastProvider } from "@/lib/toast";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const oswald = Oswald({ subsets: ["latin"], variable: "--font-oswald" });

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
    <html lang="en" className={`${inter.variable} ${oswald.variable}`}>
      <body className="antialiased font-sans">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:text-sf-navy focus:rounded focus:shadow-lg focus:outline-2 focus:outline-sf-orange">
          Skip to main content
        </a>
        <ErrorBoundary>
          <ToastProvider>
            <main id="main-content">{children}</main>
          </ToastProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
