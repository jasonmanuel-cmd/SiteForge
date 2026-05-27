'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Sidebar from '@/components/Sidebar'
import DemoTour from '@/components/DemoTour'
import AIChatbot from '@/components/AIChatbot'
import { useAuth } from '@/lib/useAuth'
import { useToast } from '@/lib/toast'

export default function EstimatesPage() {
  const router = useRouter()
  const { user, account, isDemo, loading, logout, token } = useAuth()
  const { addToast } = useToast()
  const [estimates, setEstimates] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadEstimates = async () => {
      setIsLoading(true)
      try {
        if (isDemo) {
          // Load from localStorage for demo mode
          const saved = JSON.parse(localStorage.getItem('estimates') || '[]')
          setEstimates(saved)
        } else if (token) {
          // Load from database for authenticated users
          const response = await fetch('/api/estimates', {
            headers: { 'Authorization': `Bearer ${token}` },
          })
          const data = await response.json()
          if (data.success && Array.isArray(data.data)) {
            setEstimates(data.data)
          } else {
            addToast('Failed to load estimates', 'error')
          }
        }
      } catch (error) {
        console.error('Error loading estimates:', error)
        addToast('Error loading estimates', 'error')
      } finally {
        setIsLoading(false)
      }
    }

    if (!loading) {
      loadEstimates()
    }
  }, [loading, isDemo, token, addToast])

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

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center bg-sf-navy-dark"><div className="text-sf-orange font-semibold animate-pulse">Loading SiteForge...</div></div>
  }

  return (
    <div className="min-h-screen bg-sf-cream">
      <Sidebar currentPath="/estimates" user={user} account={account} onLogout={logout} isDemo={isDemo} />

      <div className="ml-64 blueprint-bg min-h-screen relative">
        <main className="px-8 py-6 relative z-10">
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-sf-navy font-heading tracking-wide">My Estimates</h1>
              <p className="text-gray-500 mt-1">Review and manage your saved estimates</p>
            </div>
            <Link
              href="/estimator"
              className="px-6 py-3 bg-sf-orange text-white rounded-lg hover:bg-sf-orange-dark transition-colors font-medium shadow-sm"
            >
              + New Estimate
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-l-sf-orange border border-gray-200">
              <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">Total Estimates</p>
              <p className="text-3xl font-bold text-sf-navy mt-2">{estimates.length}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-l-green-500 border border-gray-200">
              <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">Total Value</p>
              <p className="text-3xl font-bold text-sf-navy mt-2">${totalValue.toLocaleString()}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-l-sf-navy border border-gray-200">
              <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">Avg. Estimate</p>
              <p className="text-3xl font-bold text-sf-navy mt-2">
                {estimates.length > 0 ? `$${Math.round(totalValue / estimates.length).toLocaleString()}` : '$0'}
              </p>
            </div>
          </div>

          {estimates.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              {estimates.map((estimate) => (
                <div key={estimate.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center space-x-3">
                        <span className="text-4xl">{getTradeIcon(estimate.trade)}</span>
                        <div>
                          <h3 className="text-xl font-bold text-sf-navy">{getTradeName(estimate.trade)} Estimate</h3>
                          <p className="text-sm text-gray-500">
                            Created {new Date(estimate.createdAt).toLocaleDateString()} at {new Date(estimate.createdAt).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Total</p>
                        <p className="text-2xl font-bold text-sf-orange">${estimate.result?.total.toFixed(2)}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      {estimate.inputs.wallLength && (
                        <div className="bg-sf-cream p-3 rounded">
                          <p className="text-xs text-gray-500">Wall Length</p>
                          <p className="font-semibold text-sf-navy">{estimate.inputs.wallLength} ft</p>
                        </div>
                      )}
                      {estimate.inputs.wallHeight && (
                        <div className="bg-sf-cream p-3 rounded">
                          <p className="text-xs text-gray-500">Height</p>
                          <p className="font-semibold text-sf-navy">{estimate.inputs.wallHeight} ft</p>
                        </div>
                      )}
                      {estimate.inputs.studSpacing && (
                        <div className="bg-sf-cream p-3 rounded">
                          <p className="text-xs text-gray-500">Spacing</p>
                          <p className="font-semibold text-sf-navy">{estimate.inputs.studSpacing}" OC</p>
                        </div>
                      )}
                      {estimate.result?.labor?.hours && (
                        <div className="bg-sf-cream p-3 rounded">
                          <p className="text-xs text-gray-500">Labor Hours</p>
                          <p className="font-semibold text-sf-navy">{estimate.result.labor.hours} hrs</p>
                        </div>
                      )}
                    </div>

                    <div className="flex space-x-3">
                      <button
                        onClick={() => router.push(`/estimator/${estimate.trade}`)}
                        className="flex-1 px-4 py-2 bg-sf-orange/10 text-sf-orange rounded-lg hover:bg-sf-orange/20 transition-colors font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => window.print()}
                        className="flex-1 px-4 py-2 bg-sf-cream text-gray-600 rounded-lg hover:bg-gray-200 transition-colors font-medium"
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
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <svg className="w-24 h-24 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-xl font-semibold text-sf-navy mb-2">No estimates yet</h3>
              <p className="text-gray-500 mb-6">Create your first estimate to get started</p>
              <Link
                href="/estimator"
                className="inline-block px-6 py-3 bg-sf-orange text-white rounded-lg hover:bg-sf-orange-dark transition-colors font-medium shadow-sm"
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
