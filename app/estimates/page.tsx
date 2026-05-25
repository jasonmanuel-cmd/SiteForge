'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import DemoTour from '@/components/DemoTour'
import AIChatbot from '@/components/AIChatbot'

export default function EstimatesPage() {
  const router = useRouter()
  const [estimates, setEstimates] = useState<any[]>([])

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('estimates') || '[]')
    setEstimates(saved.reverse()) // Most recent first
  }, [])

  const getTradeName = (trade: string) => {
    const names: any = {
      framing: 'Framing',
      drywall: 'Drywall',
      concrete: 'Concrete',
      painting: 'Painting',
      electrical: 'Electrical',
      plumbing: 'Plumbing',
      roofing: 'Roofing',
      landscaping: 'Landscaping'
    }
    return names[trade] || trade
  }

  const getTradeIcon = (trade: string) => {
    const icons: any = {
      framing: '🔨',
      drywall: '🧱',
      concrete: '🏗️',
      painting: '🎨',
      electrical: '⚡',
      plumbing: '🚰',
      roofing: '🏠',
      landscaping: '🌳'
    }
    return icons[trade] || '📋'
  }

  const deleteEstimate = (id: string) => {
    if (confirm('Are you sure you want to delete this estimate?')) {
      const updated = estimates.filter(e => e.id !== id)
      setEstimates(updated)
      localStorage.setItem('estimates', JSON.stringify(updated))
    }
  }

  const totalValue = estimates.reduce((sum, est) => sum + (est.result?.total || 0), 0)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar Navigation */}
      <div className="fixed inset-y-0 left-0 w-64 bg-gray-900 text-white">
        <div className="flex flex-col h-full">
          <div className="p-6">
            <h1 className="text-xl font-bold">Construction SaaS</h1>
            <p className="text-sm text-gray-400 mt-1">My Estimates</p>
          </div>

          <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
            <Link href="/dashboard" className="flex items-center px-4 py-2.5 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors text-sm">
              🏠 <span className="ml-3">Dashboard</span>
            </Link>
            <div className="pt-2 pb-1 px-4 text-xs text-gray-500 uppercase tracking-wider">Sales</div>
            <Link href="/crm" className="flex items-center px-4 py-2.5 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors text-sm">
              👥 <span className="ml-3">CRM & Pipeline</span>
            </Link>
            <Link href="/estimator" className="flex items-center px-4 py-2.5 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors text-sm">
              🔧 <span className="ml-3">AI Estimator</span>
            </Link>
            <Link href="/estimates" className="flex items-center px-4 py-2.5 bg-gray-800 rounded-lg text-sm">
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
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">My Estimates</h2>
              <p className="text-gray-600 mt-1">Review and manage your saved estimates</p>
            </div>
            <Link
              href="/estimator"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              + New Estimate
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <p className="text-sm text-gray-600">Total Estimates</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{estimates.length}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <p className="text-sm text-gray-600">Total Value</p>
              <p className="text-3xl font-bold text-green-600 mt-1">${totalValue.toLocaleString()}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <p className="text-sm text-gray-600">Avg. Estimate</p>
              <p className="text-3xl font-bold text-blue-600 mt-1">
                {estimates.length > 0 ? `$${Math.round(totalValue / estimates.length).toLocaleString()}` : '$0'}
              </p>
            </div>
          </div>

          {/* Estimates List */}
          {estimates.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              {estimates.map((estimate) => (
                <div key={estimate.id} className="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center space-x-3">
                        <span className="text-4xl">{getTradeIcon(estimate.trade)}</span>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{getTradeName(estimate.trade)} Estimate</h3>
                          <p className="text-sm text-gray-500">
                            Created {new Date(estimate.createdAt).toLocaleDateString()} at {new Date(estimate.createdAt).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Total</p>
                        <p className="text-2xl font-bold text-blue-600">${estimate.result?.total.toFixed(2)}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      {estimate.inputs.wallLength && (
                        <div className="bg-gray-50 p-3 rounded">
                          <p className="text-xs text-gray-600">Wall Length</p>
                          <p className="font-semibold">{estimate.inputs.wallLength} ft</p>
                        </div>
                      )}
                      {estimate.inputs.wallHeight && (
                        <div className="bg-gray-50 p-3 rounded">
                          <p className="text-xs text-gray-600">Height</p>
                          <p className="font-semibold">{estimate.inputs.wallHeight} ft</p>
                        </div>
                      )}
                      {estimate.inputs.studSpacing && (
                        <div className="bg-gray-50 p-3 rounded">
                          <p className="text-xs text-gray-600">Spacing</p>
                          <p className="font-semibold">{estimate.inputs.studSpacing}" OC</p>
                        </div>
                      )}
                      {estimate.result?.labor?.hours && (
                        <div className="bg-gray-50 p-3 rounded">
                          <p className="text-xs text-gray-600">Labor Hours</p>
                          <p className="font-semibold">{estimate.result.labor.hours} hrs</p>
                        </div>
                      )}
                    </div>

                    <div className="flex space-x-3">
                      <button
                        onClick={() => router.push(`/estimator/${estimate.trade}`)}
                        className="flex-1 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => window.print()}
                        className="flex-1 px-4 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors font-medium"
                      >
                        Print PDF
                      </button>
                      <button
                        onClick={() => deleteEstimate(estimate.id)}
                        className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-12 text-center">
              <svg className="w-24 h-24 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No estimates yet</h3>
              <p className="text-gray-500 mb-6">Create your first estimate to get started</p>
              <Link
                href="/estimator"
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Create Estimate
              </Link>
            </div>
          )}
        </main>
      </div>
      <DemoTour />
      <AIChatbot />
    </div>
  )
}
