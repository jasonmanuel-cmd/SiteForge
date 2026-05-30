import type { Metadata } from "next"
import Link from "next/link"
import "./globals.css"

export const metadata: Metadata = {
  title: "Page Not Found — SiteForge",
  description: "The page you're looking for doesn't exist.",
}

export default function NotFound() {
  return (
    <div className="min-h-screen bg-sf-navy-dark flex items-center justify-center p-8">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-white/10 rounded-3xl mb-8">
          <span className="text-5xl font-bold text-sf-orange font-heading">404</span>
        </div>
        <h1 className="text-3xl font-bold text-white font-heading tracking-wide mb-4">Page Not Found</h1>
        <p className="text-white/50 mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved. Let's get you back on track.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/landing"
            className="bg-sf-orange hover:bg-sf-orange-dark text-white font-bold px-6 py-3 rounded-xl transition-colors font-heading tracking-wide"
          >
            Go to Homepage
          </Link>
          <Link
            href="/dashboard"
            className="border-2 border-white/20 hover:border-white/40 text-white font-semibold px-6 py-3 rounded-xl transition-colors font-heading tracking-wide"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
