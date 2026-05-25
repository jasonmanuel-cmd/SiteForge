'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { mockUsers, mockAccount } from '@/lib/mockData'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const demoUser = mockUsers[0]
    const demoAccount = mockAccount

    localStorage.setItem('token', 'demo-token-' + Date.now())
    localStorage.setItem('user', JSON.stringify(demoUser))
    localStorage.setItem('account', JSON.stringify(demoAccount))

    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1C2B3A] to-[#0f1a24] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">

        {/* SiteForge Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <svg width="44" height="44" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
              <polygon points="32,4 56,18 56,46 32,60 8,46 8,18" fill="#D97706"/>
              <polygon points="32,13 48,22 48,42 32,51 16,42 16,22" fill="#92400E" opacity="0.4"/>
              <text x="32" y="37" textAnchor="middle" fontFamily="Georgia, serif" fontSize="22" fontWeight="700" fill="white" letterSpacing="-1">SF</text>
            </svg>
            <h1 className="text-3xl font-bold text-gray-900">SiteForge</h1>
          </div>
          <p className="text-gray-500 text-sm font-medium tracking-wide uppercase">Forge your operation.</p>
        </div>

        {/* Demo badge */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-amber-800 font-semibold">🎯 Demo Mode</p>
          <p className="text-xs text-amber-700 mt-1">
            Enter any email and password to explore the platform
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@yourcompany.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter any password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#D97706] hover:bg-[#B45309] text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-lg hover:shadow-xl"
          >
            Enter SiteForge
          </button>
        </form>

        <div className="mt-6 text-center space-y-1">
          <p className="text-sm text-gray-500">
            Demo account: <span className="font-semibold text-gray-700">John Martinez — Premier Construction</span>
          </p>
          <p className="text-xs text-gray-400">$10.5M in active projects loaded automatically</p>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-400">Powered by <span className="font-semibold text-[#D97706]">COAI</span> · Chaotically Organized AI · Bakersfield, CA</p>
        </div>
      </div>
    </div>
  )
}
