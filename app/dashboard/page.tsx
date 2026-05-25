'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getMockData } from '@/lib/mockData'
import Link from 'next/link'
import DemoTour from '@/components/DemoTour'
import AIChatbot from '@/components/AIChatbot'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [account, setAccount] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    const accountData = localStorage.getItem('account')

    if (!token || !userData || !accountData) {
      router.push('/login')
      return
    }

    setUser(JSON.parse(userData))
    setAccount(JSON.parse(accountData))
    setLoading(false)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('account')
    router.push('/')
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0f1a24]">
        <div className="text-amber-400 font-semibold">Loading SiteForge...</div>
      </div>
    )
  }

  const stats = getMockData.getProjectStats(account?.id || '')
  const rfis = getMockData.getRFIs(account?.id || '')
  const openRFIs = rfis.filter(r => r.status === 'sent' || r.status === 'draft').length
  const invoices = getMockData.getInvoices(account?.id || '')
  const pendingInvoices = invoices.filter(i => i.status === 'pending').length
  const recentActivity = getMockData.getRecentActivity(account?.id || '', 5)
  const changeOrders = getMockData.getChangeOrders(account?.id || '')
  const pendingCOs = changeOrders.filter(co => co.status === 'pending').length

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-[#1C2B3A] text-white">
        <div className="flex flex-col h-full">

          {/* SiteForge Brand */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center gap-3 mb-1">
              <svg width="32" height="32" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
                <polygon points="32,4 56,18 56,46 32,60 8,46 8,18" fill="#D97706"/>
                <polygon points="32,13 48,22 48,42 32,51 16,42 16,22" fill="#92400E" opacity="0.5"/>
                <text x="32" y="37" textAnchor="middle" fontFamily="Georgia, serif" fontSize="20" fontWeight="700" fill="white" letterSpacing="-1">SF</text>
              </svg>
              <div>
                <h1 className="text-lg font-bold text-white leading-tight">SiteForge</h1>
                <p className="text-xs text-amber-400 font-medium">Forge your operation.</p>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-2">{account?.companyName}</p>
          </div>

          <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
            <Link href="/dashboard" className="flex items-center px-4 py-2.5 bg-amber-600/20 border border-amber-500/30 rounded-lg text-sm text-amber-300">
              🏠 <span className="ml-3">Dashboard</span>
            </Link>
            <div className="pt-3 pb-1 px-4 text-xs text-gray-500 uppercase tracking-wider">Sales</div>
            <Link href="/crm" className="flex items-center px-4 py-2.5 text-gray-300 hover:bg-white/10 rounded-lg transition-colors text-sm">
              👥 <span className="ml-3">CRM & Pipeline</span>
            </Link>
            <Link href="/estimator" className="flex items-center px-4 py-2.5 text-gray-300 hover:bg-white/10 rounded-lg transition-colors text-sm">
              🔧 <span className="ml-3">AI Estimator</span>
            </Link>
            <Link href="/estimates" className="flex items-center px-4 py-2.5 text-gray-300 hover:bg-white/10 rounded-lg transition-colors text-sm">
              📋 <span className="ml-3">My Estimates</span>
            </Link>
            <div className="pt-3 pb-1 px-4 text-xs text-gray-500 uppercase tracking-wider">Operations</div>
            <Link href="/projects" className="flex items-center px-4 py-2.5 text-gray-300 hover:bg-white/10 rounded-lg transition-colors text-sm">
              🏗️ <span className="ml-3">Projects</span>
            </Link>
            <Link href="/invoices" className="flex items-center px-4 py-2.5 text-gray-300 hover:bg-white/10 rounded-lg transition-colors text-sm">
              📄 <span className="ml-3">Invoices</span>
            </Link>
            <Link href="/invoices/create" className="flex items-center px-4 py-2.5 text-gray-300 hover:bg-white/10 rounded-lg transition-colors text-sm">
              ✏️ <span className="ml-3">Create Invoice</span>
            </Link>
            <Link href="/rfis" className="flex items-center px-4 py-2.5 text-gray-300 hover:bg-white/10 rounded-lg transition-colors text-sm">
              ❓ <span className="ml-3">RFIs</span>
            </Link>
            <Link href="/change-orders" className="flex items-center px-4 py-2.5 text-gray-300 hover:bg-white/10 rounded-lg transition-colors text-sm">
              📝 <span className="ml-3">Change Orders</span>
            </Link>
          </nav>

          <div className="p-4 border-t border-white/10">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 bg-amber-600 rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold text-white">{user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}</span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-white">{user?.firstName} {user?.lastName}</p>
                <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 bg-white/10 text-gray-300 rounded-lg hover:bg-white/20 transition-colors text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 circuit-bg min-h-screen relative overflow-hidden">
        <div className="circuit-dots"></div>
        <main className="px-8 py-6 relative z-10">

          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white drop-shadow-lg">Dashboard</h2>
            <p className="text-amber-200/80 mt-1">Welcome back, {user?.firstName}. Here's your operation at a glance.</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Active Projects</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stats.active}</p>
                  <p className="text-xs text-gray-500 mt-1">{stats.total} total</p>
                </div>
                <div className="p-3 bg-amber-50 rounded-lg">
                  <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Open RFIs</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{openRFIs}</p>
                  <p className="text-xs text-gray-500 mt-1">{rfis.length} total</p>
                </div>
                <div className="p-3 bg-yellow-50 rounded-lg">
                  <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Pending Invoices</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{pendingInvoices}</p>
                  <p className="text-xs text-gray-500 mt-1">{invoices.length} total</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Pending COs</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{pendingCOs}</p>
                  <p className="text-xs text-gray-500 mt-1">{changeOrders.length} total</p>
                </div>
                <div className="p-3 bg-[#1C2B3A]/10 rounded-lg">
                  <svg className="w-8 h-8 text-[#1C2B3A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Budget + Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Budget Overview</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Total Budget</span>
                    <span className="font-semibold text-gray-900">${(stats.totalBudget / 1000000).toFixed(2)}M</span>
                  </div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Total Spent</span>
                    <span className="font-semibold text-gray-900">${(stats.totalSpent / 1000000).toFixed(2)}M</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 mt-3">
                    <div
                      className="bg-amber-500 h-3 rounded-full"
                      style={{ width: `${(stats.totalSpent / stats.totalBudget) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    {((stats.totalSpent / stats.totalBudget) * 100).toFixed(1)}% of total budget used
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {recentActivity.slice(0, 5).map((activity) => (
                  <div key={activity.id} className="flex items-start">
                    <div className={`w-2 h-2 mt-2 rounded-full ${
                      activity.type === 'invoice' ? 'bg-amber-500' :
                      activity.type === 'rfi' ? 'bg-yellow-500' :
                      'bg-[#1C2B3A]'
                    }`}></div>
                    <div className="ml-3 flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                      <p className="text-xs text-gray-600">{activity.description}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(activity.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gradient-to-r from-[#1C2B3A] to-[#2d4a63] p-6 rounded-lg shadow-sm text-white mb-8">
            <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/projects" className="bg-white/10 hover:bg-white/20 backdrop-blur-sm p-4 rounded-lg transition-all text-center">
                <div className="text-2xl mb-2">📁</div>
                <div className="text-sm font-medium">Projects</div>
              </Link>
              <Link href="/invoices" className="bg-white/10 hover:bg-white/20 backdrop-blur-sm p-4 rounded-lg transition-all text-center">
                <div className="text-2xl mb-2">📄</div>
                <div className="text-sm font-medium">Upload Invoice</div>
              </Link>
              <Link href="/rfis" className="bg-white/10 hover:bg-white/20 backdrop-blur-sm p-4 rounded-lg transition-all text-center">
                <div className="text-2xl mb-2">❓</div>
                <div className="text-sm font-medium">Create RFI</div>
              </Link>
              <Link href="/change-orders" className="bg-white/10 hover:bg-white/20 backdrop-blur-sm p-4 rounded-lg transition-all text-center">
                <div className="text-2xl mb-2">📋</div>
                <div className="text-sm font-medium">Change Orders</div>
              </Link>
            </div>
          </div>

        </main>
      </div>

      <DemoTour />
      <AIChatbot />
    </div>
  )
}
