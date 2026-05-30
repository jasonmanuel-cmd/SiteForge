'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to landing page for sales
    router.push('/landing')
  }, [router])

  return (
    <div className="flex min-h-screen items-center justify-center bg-sf-navy-dark">
      <div className="text-white/60 font-heading tracking-wide animate-pulse">Loading SiteForge...</div>
    </div>
  )
}
