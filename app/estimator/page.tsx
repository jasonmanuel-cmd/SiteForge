'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import DemoTour from '@/components/DemoTour'
import AIChatbot from '@/components/AIChatbot'

const TRADES = [
  {
    id: 'framing',
    name: 'Framing',
    icon: '🔨',
    description: 'Residential & commercial framing estimates',
    difficulty: 'Medium',
    avgTime: '5-10 min'
  },
  {
    id: 'drywall',
    name: 'Drywall',
    icon: '🧱',
    description: 'Hanging, taping, mudding, finishing',
    difficulty: 'Easy',
    avgTime: '3-5 min'
  },
  {
    id: 'concrete',
    name: 'Concrete',
    icon: '🏗️',
    description: 'Slabs, foundations, flatwork',
    difficulty: 'Medium',
    avgTime: '5-8 min'
  },
  {
    id: 'painting',
    name: 'Painting',
    icon: '🎨',
    description: 'Interior & exterior painting',
    difficulty: 'Easy',
    avgTime: '3-5 min'
  },
  {
    id: 'electrical',
    name: 'Electrical',
    icon: '⚡',
    description: 'Wiring, panels, fixtures, outlets',
    difficulty: 'Hard',
    avgTime: '10-15 min'
  },
  {
    id: 'plumbing',
    name: 'Plumbing',
    icon: '🚰',
    description: 'Rough-in, fixtures, water lines',
    difficulty: 'Hard',
    avgTime: '10-15 min'
  },
  {
    id: 'roofing',
    name: 'Roofing',
    icon: '🏠',
    description: 'Shingles, underlayment, flashing',
    difficulty: 'Medium',
    avgTime: '5-8 min'
  },
  {
    id: 'landscaping',
    name: 'Landscaping',
    icon: '🌳',
    description: 'Grading, plants, irrigation, hardscape',
    difficulty: 'Medium',
    avgTime: '8-12 min'
  }
]

export default function EstimatorPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')

  const filteredTrades = TRADES.filter(trade =>
    trade.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trade.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-700'
      case 'Medium': return 'bg-yellow-100 text-yellow-700'
      case 'Hard': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar Navigation */}
      <div className="fixed inset-y-0 left-0 w-64 bg-gray-900 text-white">
        <div className="flex flex-col h-full">
          <div className="p-6">
            <h1 className="text-xl font-bold">Construction SaaS</h1>
            <p className="text-sm text-gray-400 mt-1">AI Estimator</p>
          </div>

          <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
            <Link href="/dashboard" className="flex items-center px-4 py-2.5 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors text-sm">
              🏠 <span className="ml-3">Dashboard</span>
            </Link>
            <div className="pt-2 pb-1 px-4 text-xs text-gray-500 uppercase tracking-wider">Sales</div>
            <Link href="/crm" className="flex items-center px-4 py-2.5 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors text-sm">
              👥 <span className="ml-3">CRM & Pipeline</span>
            </Link>
            <Link href="/estimator" className="flex items-center px-4 py-2.5 bg-gray-800 rounded-lg text-sm">
              🔧 <span className="ml-3">AI Estimator</span>
            </Link>
            <Link href="/estimates" className="flex items-center px-4 py-2.5 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors text-sm">
              📋 <span className="ml-3">My Estimates</span>
            </Link>
            <div className="pt-2 pb-1 px-4 text-xs text-gray-500 uppercase tracking-wider">Operations</div>
            <Link href="/projects" className="flex items-center px-4 py-2.5 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors text-sm">
              🏗️ <span className="ml-3">Projects</span>
            </Link>
            <Link href="/invoices" className="flex items-center px-4 py-2.5 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors text-sm">
              📄 <span className="ml-3">Invoices</span>
            </Link>
            <Link href="/invoices/create" className="flex items-center px-4 py-2.5 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors text-sm">
              ✏️ <span className="ml-3">Create Invoice</span>
            </Link>
            <Link href="/rfis" className="flex items-center px-4 py-2.5 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors text-sm">
              ❓ <span className="ml-3">RFIs</span>
            </Link>
            <Link href="/change-orders" className="flex items-center px-4 py-2.5 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors text-sm">
              📝 <span className="ml-3">Change Orders</span>
            </Link>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64">
        <main className="px-8 py-6">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">AI Trade Estimator</h2>
            <p className="text-gray-600">Select a trade to generate instant, accurate estimates powered by AI</p>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Estimates Created</p>
                  <p className="text-3xl font-bold mt-1">0</p>
                </div>
                <div className="bg-white/20 p-3 rounded-lg">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Total Value</p>
                  <p className="text-3xl font-bold mt-1">$0</p>
                </div>
                <div className="bg-white/20 p-3 rounded-lg">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Avg. Estimate</p>
                  <p className="text-3xl font-bold mt-1">-</p>
                </div>
                <div className="bg-white/20 p-3 rounded-lg">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">Time Saved</p>
                  <p className="text-3xl font-bold mt-1">0 hrs</p>
                </div>
                <div className="bg-white/20 p-3 rounded-lg">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="mb-8">
            <div className="relative max-w-md">
              <input
                type="text"
                placeholder="Search trades..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
              />
              <svg className="w-6 h-6 text-gray-400 absolute left-4 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Trade Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredTrades.map((trade) => (
              <div
                key={trade.id}
                onClick={() => router.push(`/estimator/${trade.id}`)}
                className="bg-white rounded-xl shadow-md border border-gray-200 hover:shadow-xl hover:border-blue-400 transition-all cursor-pointer group"
              >
                <div className="p-6">
                  <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">
                    {trade.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{trade.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">{trade.description}</p>

                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(trade.difficulty)}`}>
                      {trade.difficulty}
                    </span>
                    <span className="text-xs text-gray-500 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {trade.avgTime}
                    </span>
                  </div>

                  <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium group-hover:bg-blue-700">
                    Start Estimate →
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredTrades.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No trades found matching "{searchTerm}"</p>
            </div>
          )}
        </main>
      </div>
      <DemoTour />
      <AIChatbot />
    </div>
  )
}
