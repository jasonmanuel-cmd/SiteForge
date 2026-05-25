'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to login page for demo
    router.push('/login')
  }, [router])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-gray-600">Loading demo...</div>
    </div>
  )
}
