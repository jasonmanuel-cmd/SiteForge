'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getMockData, mockAccount, mockUsers } from '@/lib/mockData'
import Link from 'next/link'
import DemoTour from '@/components/DemoTour'
import AIChatbot from '@/components/AIChatbot'

export default function RFIsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [account, setAccount] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showNewRFI, setShowNewRFI] = useState(false)
  const [rfiForm, setRfiForm] = useState({ subject: '', question: '', priority: 'normal', projectId: '' })
  const [localRFIs, setLocalRFIs] = useState<any[]>([])

  useEffect(() => {
    const userData = localStorage.getItem('user')
    const accountData = localStorage.getItem('account')

    if (!userData || !accountData) {
      setUser(mockUsers[0])
      setAccount(mockAccount)
      localStorage.setItem('user', JSON.stringify(mockUsers[0]))
      localStorage.setItem('account', JSON.stringify(mockAccount))
    } else {
      setUser(JSON.parse(userData))
      setAccount(JSON.parse(accountData))
    }
    const savedRFIs = localStorage.getItem('localRFIs')
    if (savedRFIs) setLocalRFIs(JSON.parse(savedRFIs))
    setLoading(false)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('account')
    router.push('/')
  }

  const handleCreateRFI = () => {
    if (!rfiForm.subject) return
    const projects = getMockData.getProjects(account?.id || '')
    const newRFI = {
      id: 'rfi-' + Date.now(),
      rfiNumber: 'RFI-' + String(100 + localRFIs.length + 1),
      subject: rfiForm.subject,
      question: rfiForm.question,
      priority: rfiForm.priority,
      projectId: rfiForm.projectId || projects[0]?.id,
      status: 'draft',
      dueDate: new Date(Date.now() + 7 * 86400000).toISOString(),
      aiGenerated: false,
    }
    const updated = [newRFI, ...localRFIs]
    setLocalRFIs(updated)
    localStorage.setItem('localRFIs', JSON.stringify(updated))
    setRfiForm({ subject: '', question: '', priority: 'normal', projectId: '' })
    setShowNewRFI(false)
  }

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center"><div className="text-gray-600">Loading...</div></div>
  }

  const mockRFIs = getMockData.getRFIs(account?.id || '')
  const rfis = [...localRFIs, ...mockRFIs]
  const projects = getMockData.getProjects(account?.id || '')

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800'
      case 'sent': return 'bg-yellow-100 text-yellow-800'
      case 'responded': return 'bg-blue-100 text-blue-800'
      case 'closed': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600'
      case 'high': return 'text-orange-600'
      case 'normal': return 'text-blue-600'
      case 'low': return 'text-gray-600'
      default: return 'text-gray-600'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar - Same as other pages */}
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
            <Link href="/rfis" className="flex items-center px-4 py-2.5 bg-gray-800 rounded-lg text-sm">
              ❓ <span className="ml-3">RFIs</span>
            </Link>
            <Link href="/change-orders" className="flex items-center px-4 py-2.5 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors text-sm">
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
              <h2 className="text-3xl font-bold text-gray-900">RFIs</h2>
              <p className="text-gray-600 mt-1">Request for Information management</p>
            </div>
            <button onClick={() => setShowNewRFI(true)} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">+ New RFI</button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <p className="text-sm text-gray-600">Total RFIs</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{rfis.length}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <p className="text-sm text-gray-600">Draft</p>
              <p className="text-2xl font-bold text-gray-600 mt-1">{rfis.filter(r => r.status === 'draft').length}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <p className="text-sm text-gray-600">Awaiting Response</p>
              <p className="text-2xl font-bold text-yellow-600 mt-1">{rfis.filter(r => r.status === 'sent').length}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <p className="text-sm text-gray-600">Responded</p>
              <p className="text-2xl font-bold text-green-600 mt-1">{rfis.filter(r => r.status === 'responded').length}</p>
            </div>
          </div>

          {/* RFIs Professional Data Table */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            {/* Table Header with Filters */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search RFIs..."
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                    <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm">
                    <option>All Status</option>
                    <option>Draft</option>
                    <option>Sent</option>
                    <option>Responded</option>
                    <option>Closed</option>
                  </select>
                  <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm">
                    <option>All Priority</option>
                    <option>Urgent</option>
                    <option>High</option>
                    <option>Normal</option>
                    <option>Low</option>
                  </select>
                </div>
                <div className="text-sm font-medium text-gray-600">
                  {rfis.length} Total RFIs
                </div>
              </div>
            </div>

            {/* Professional Data Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-800 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">RFI #</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Subject</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Project</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Priority</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Due Date</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {rfis.map((rfi, index) => {
                    const project = projects.find(p => p.id === rfi.projectId)
                    return (
                      <tr key={rfi.id} className="hover:bg-blue-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-bold text-blue-600">{rfi.rfiNumber}</span>
                            {rfi.aiGenerated && (
                              <span className="px-2 py-0.5 bg-purple-100 text-purple-600 rounded text-xs font-medium">AI</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="max-w-xs">
                            <p className="text-sm font-medium text-gray-900 truncate">{rfi.subject}</p>
                            <p className="text-xs text-gray-500 truncate">{rfi.question}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-gray-700 truncate max-w-xs">{project?.name || 'N/A'}</p>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(rfi.status)}`}>
                            {rfi.status.charAt(0).toUpperCase() + rfi.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`text-sm font-bold ${getPriorityColor(rfi.priority)}`}>
                            {rfi.priority.charAt(0).toUpperCase() + rfi.priority.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {rfi.dueDate ? new Date(rfi.dueDate).toLocaleDateString() : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex space-x-2">
                            <button className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors" title="View">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </button>
                            <button className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors" title="Edit">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            {rfi.status === 'draft' && (
                              <button className="p-2 text-purple-600 hover:bg-purple-100 rounded-lg transition-colors" title="Send">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Table Footer with Pagination */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Showing 1 to {rfis.length} of {rfis.length} entries
                </div>
                <div className="flex space-x-2">
                  <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">Previous</button>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium">1</button>
                  <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">Next</button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* New RFI Modal */}
      {showNewRFI && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Create New RFI</h3>
              <button onClick={() => setShowNewRFI(false)} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
                <input type="text" value={rfiForm.subject} onChange={e => setRfiForm({...rfiForm, subject: e.target.value})}
                  placeholder="Clarification needed on..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Question / Description</label>
                <textarea rows={3} value={rfiForm.question} onChange={e => setRfiForm({...rfiForm, question: e.target.value})}
                  placeholder="Describe the information requested..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select value={rfiForm.priority} onChange={e => setRfiForm({...rfiForm, priority: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm">
                    <option value="low">Low</option>
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Project</label>
                  <select value={rfiForm.projectId} onChange={e => setRfiForm({...rfiForm, projectId: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm">
                    <option value="">Select Project</option>
                    {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex space-x-3 pt-2">
                <button onClick={handleCreateRFI} disabled={!rfiForm.subject}
                  className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors">
                  Create RFI
                </button>
                <button onClick={() => setShowNewRFI(false)}
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
