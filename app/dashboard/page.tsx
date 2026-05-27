'use client'

import { useState } from 'react'
import { getMockData } from '@/lib/mockData'
import Link from 'next/link'
import Sidebar from '@/components/Sidebar'
import DemoTour from '@/components/DemoTour'
import AIChatbot from '@/components/AIChatbot'
import { useAuth } from '@/lib/useAuth'

export default function DashboardPage() {
  const { user, account, isDemo, loading, logout } = useAuth()

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center bg-sf-navy-dark"><div className="text-sf-orange font-semibold animate-pulse">Loading SiteForge...</div></div>
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
    <div className="min-h-screen bg-sf-cream">
      <Sidebar currentPath="/dashboard" user={user} account={account} onLogout={logout} isDemo={isDemo} />

      <div className="ml-64 blueprint-bg min-h-screen relative">
        <main className="px-8 py-6 relative z-10">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-sf-navy font-heading tracking-wide">Dashboard</h1>
            <p className="text-gray-500 mt-1">Welcome back, {user?.firstName}. Here&apos;s your operation at a glance.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-l-sf-orange border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">Active Projects</p>
                  <p className="text-3xl font-bold text-sf-navy mt-2">{stats.active}</p>
                  <p className="text-xs text-gray-400 mt-1">{stats.total} total</p>
                </div>
                <div className="p-3 bg-sf-orange/10 rounded-lg"><svg className="w-8 h-8 text-sf-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg></div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-l-yellow-500 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">Open RFIs</p>
                  <p className="text-3xl font-bold text-sf-navy mt-2">{openRFIs}</p>
                  <p className="text-xs text-gray-400 mt-1">{rfis.length} total</p>
                </div>
                <div className="p-3 bg-yellow-50 rounded-lg"><svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg></div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-l-green-500 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">Pending Invoices</p>
                  <p className="text-3xl font-bold text-sf-navy mt-2">{pendingInvoices}</p>
                  <p className="text-xs text-gray-400 mt-1">{invoices.length} total</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg"><svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" /></svg></div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-l-sf-navy border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">Pending COs</p>
                  <p className="text-3xl font-bold text-sf-navy mt-2">{pendingCOs}</p>
                  <p className="text-xs text-gray-400 mt-1">{changeOrders.length} total</p>
                </div>
                <div className="p-3 bg-sf-navy/10 rounded-lg"><svg className="w-8 h-8 text-sf-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg></div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-bold text-sf-navy font-heading tracking-wide mb-4">Budget Overview</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-500">Total Budget</span>
                    <span className="font-semibold text-sf-navy">${(stats.totalBudget / 1000000).toFixed(2)}M</span>
                  </div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-500">Total Spent</span>
                    <span className="font-semibold text-sf-navy">${(stats.totalSpent / 1000000).toFixed(2)}M</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 mt-3">
                    <div className="bg-sf-orange h-3 rounded-full" style={{ width: `${(stats.totalSpent / stats.totalBudget) * 100}%` }}></div>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">{((stats.totalSpent / stats.totalBudget) * 100).toFixed(1)}% of total budget used</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-bold text-sf-navy font-heading tracking-wide mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {recentActivity.slice(0, 5).map((activity: any) => (
                  <div key={activity.id} className="flex items-start">
                    <div className={`w-2 h-2 mt-2 rounded-full ${activity.type === 'invoice' ? 'bg-sf-orange' : activity.type === 'rfi' ? 'bg-yellow-500' : 'bg-sf-navy'}`}></div>
                    <div className="ml-3 flex-1">
                      <p className="text-sm font-medium text-sf-navy">{activity.title}</p>
                      <p className="text-xs text-gray-500">{activity.description}</p>
                      <p className="text-xs text-gray-400 mt-1">{new Date(activity.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-sf-navy p-6 rounded-xl shadow-sm text-white mb-8">
            <h3 className="text-xl font-bold font-heading tracking-wide mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/projects" className="bg-white/10 hover:bg-sf-orange/20 border border-white/10 hover:border-sf-orange/30 p-4 rounded-lg transition-all text-center">
                <div className="text-2xl mb-2">📁</div>
                <div className="text-sm font-medium">Projects</div>
              </Link>
              <Link href="/invoices" className="bg-white/10 hover:bg-sf-orange/20 border border-white/10 hover:border-sf-orange/30 p-4 rounded-lg transition-all text-center">
                <div className="text-2xl mb-2">📄</div>
                <div className="text-sm font-medium">Upload Invoice</div>
              </Link>
              <Link href="/rfis" className="bg-white/10 hover:bg-sf-orange/20 border border-white/10 hover:border-sf-orange/30 p-4 rounded-lg transition-all text-center">
                <div className="text-2xl mb-2">❓</div>
                <div className="text-sm font-medium">Create RFI</div>
              </Link>
              <Link href="/change-orders" className="bg-white/10 hover:bg-sf-orange/20 border border-white/10 hover:border-sf-orange/30 p-4 rounded-lg transition-all text-center">
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
