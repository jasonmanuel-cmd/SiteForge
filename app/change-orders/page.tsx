'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getMockData } from '@/lib/mockData'
import Link from 'next/link'
import DemoTour from '@/components/DemoTour'
import AIChatbot from '@/components/AIChatbot'

export default function ChangeOrdersPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [account, setAccount] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showNewCO, setShowNewCO] = useState(false)
  const [localCOs, setLocalCOs] = useState<any[]>([])
  const [coForm, setCoForm] = useState({ title: '', description: '', reason: '', priceImpact: '', scheduleImpact: '', projectId: '' })

  useEffect(() => {
    const userData = localStorage.getItem('user')
    const accountData = localStorage.getItem('account')

    if (!userData || !accountData) {
      router.push('/login')
      return
    }
    setUser(JSON.parse(userData))
    setAccount(JSON.parse(accountData))
    const savedCOs = localStorage.getItem('localCOs')
    if (savedCOs) setLocalCOs(JSON.parse(savedCOs))
    setLoading(false)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('account')
    router.push('/')
  }

  const handleCreateCO = () => {
    if (!coForm.title) return
    const projects = getMockData.getProjects(account?.id || '')
    const newCO = {
      id: 'co-' + Date.now(),
      coNumber: 'CO-' + String(200 + localCOs.length + 1),
      title: coForm.title,
      description: coForm.description,
      reason: coForm.reason,
      priceImpact: parseFloat(coForm.priceImpact) || 0,
      scheduleImpact: parseInt(coForm.scheduleImpact) || 0,
      projectId: coForm.projectId || projects[0]?.id,
      status: 'pending',
      submittedDate: new Date().toISOString(),
      aiGenerated: false,
    }
    const updated = [newCO, ...localCOs]
    setLocalCOs(updated)
    localStorage.setItem('localCOs', JSON.stringify(updated))
    setCoForm({ title: '', description: '', reason: '', priceImpact: '', scheduleImpact: '', projectId: '' })
    setShowNewCO(false)
  }

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center"><div className="text-gray-600">Loading...</div></div>
  }

  const mockCOs = getMockData.getChangeOrders(account?.id || '')
  const changeOrders = [...localCOs, ...mockCOs]
  const projects = getMockData.getProjects(account?.id || '')

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'approved': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      case 'completed': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const totalPriceImpact = changeOrders
    .filter(co => co.status === 'approved')
    .reduce((sum, co) => sum + Number(co.priceImpact), 0)

  const totalScheduleImpact = changeOrders
    .filter(co => co.status === 'approved')
    .reduce((sum, co) => sum + co.scheduleImpact, 0)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-gray-900 text-white">
        <div className="flex flex-col h-full">
          <div className="p-6">
            <h1 className="text-xl font-bold">Construction SaaS</h1>
            <p className="text-sm text-gray-400 mt-1">{account?.companyName}</p>
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
            <Link href="/change-orders" className="flex items-center px-4 py-2.5 bg-gray-800 rounded-lg text-sm">
              📝 <span className="ml-3">Change Orders</span>
            </Link>
          </nav>
          <div className="p-4 border-t border-gray-800">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold">{user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}</span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">{user?.firstName} {user?.lastName}</p>
                <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
              </div>
            </div>
            <button onClick={handleLogout} className="w-full px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors text-sm">Logout</button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64">
        <main className="px-8 py-6">
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Change Orders</h2>
              <p className="text-gray-600 mt-1">Track scope changes and budget impacts</p>
            </div>
            <button onClick={() => setShowNewCO(true)} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">+ New Change Order</button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <p className="text-sm text-gray-600">Total COs</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{changeOrders.length}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <p className="text-sm text-gray-600">Pending Approval</p>
              <p className="text-2xl font-bold text-yellow-600 mt-1">{changeOrders.filter(co => co.status === 'pending').length}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <p className="text-sm text-gray-600">Approved Budget Impact</p>
              <p className="text-2xl font-bold text-green-600 mt-1">
                ${(totalPriceImpact / 1000).toFixed(0)}k
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <p className="text-sm text-gray-600">Schedule Impact</p>
              <p className="text-2xl font-bold text-orange-600 mt-1">
                +{totalScheduleImpact} days
              </p>
            </div>
          </div>

          {/* Change Orders List */}
          <div className="space-y-4">
            {changeOrders.map((co) => {
              const project = projects.find(p => p.id === co.projectId)
              return (
                <div key={co.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="text-lg font-bold text-purple-600">{co.coNumber}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(co.status)}`}>
                          {co.status.charAt(0).toUpperCase() + co.status.slice(1)}
                        </span>
                        {co.aiGenerated && (
                          <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                            🤖 AI Generated
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{co.title}</h3>
                      <p className="text-sm text-gray-600 mb-3">{co.description}</p>
                      {co.reason && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                          <p className="text-xs font-semibold text-blue-900 mb-1">Reason:</p>
                          <p className="text-sm text-blue-800">{co.reason}</p>
                        </div>
                      )}
                      <div className="flex items-center space-x-4 text-sm mb-3">
                        <span className="font-semibold text-gray-900">
                          💰 Price Impact:
                          <span className={Number(co.priceImpact) >= 0 ? 'text-green-600 ml-2' : 'text-red-600 ml-2'}>
                            {Number(co.priceImpact) >= 0 ? '+' : ''}${Number(co.priceImpact).toLocaleString()}
                          </span>
                        </span>
                        <span className="font-semibold text-gray-900">
                          📅 Schedule Impact:
                          <span className={co.scheduleImpact > 0 ? 'text-orange-600 ml-2' : 'text-green-600 ml-2'}>
                            {co.scheduleImpact > 0 ? '+' : ''}{co.scheduleImpact} days
                          </span>
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>📁 {project?.name || 'Unknown Project'}</span>
                        {co.submittedDate && <span>📤 Submitted: {new Date(co.submittedDate).toLocaleDateString()}</span>}
                        {co.approvedDate && <span>✅ Approved: {new Date(co.approvedDate).toLocaleDateString()}</span>}
                        {co.rejectedDate && <span>❌ Rejected: {new Date(co.rejectedDate).toLocaleDateString()}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium">View Details</button>
                    {co.status === 'pending' && (
                      <>
                        <button className="px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium">Approve</button>
                        <button className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium">Reject</button>
                      </>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </main>
      </div>

      {/* New Change Order Modal */}
      {showNewCO && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Create Change Order</h3>
              <button onClick={() => setShowNewCO(false)} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input type="text" value={coForm.title} onChange={e => setCoForm({...coForm, title: e.target.value})}
                  placeholder="Additional electrical work..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea rows={2} value={coForm.description} onChange={e => setCoForm({...coForm, description: e.target.value})}
                  placeholder="Describe the scope change..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                <input type="text" value={coForm.reason} onChange={e => setCoForm({...coForm, reason: e.target.value})}
                  placeholder="Owner requested change..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price Impact ($)</label>
                  <input type="number" value={coForm.priceImpact} onChange={e => setCoForm({...coForm, priceImpact: e.target.value})}
                    placeholder="5000"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Days Impact</label>
                  <input type="number" value={coForm.scheduleImpact} onChange={e => setCoForm({...coForm, scheduleImpact: e.target.value})}
                    placeholder="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Project</label>
                  <select value={coForm.projectId} onChange={e => setCoForm({...coForm, projectId: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm">
                    <option value="">Select</option>
                    {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex space-x-3 pt-2">
                <button onClick={handleCreateCO} disabled={!coForm.title}
                  className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors">
                  Create Change Order
                </button>
                <button onClick={() => setShowNewCO(false)}
                  className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <DemoTour />
      <AIChatbot />
    </div>
  )
}
