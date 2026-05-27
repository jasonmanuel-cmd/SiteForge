'use client'

import { useState } from 'react'
import { getMockData } from '@/lib/mockData'
import Sidebar from '@/components/Sidebar'
import DemoTour from '@/components/DemoTour'
import AIChatbot from '@/components/AIChatbot'
import { useAuth } from '@/lib/useAuth'

export default function ChangeOrdersPage() {
  const { user, account, isDemo, loading, logout } = useAuth()
  const [showNewCO, setShowNewCO] = useState(false)
  const [localCOs, setLocalCOs] = useState<any[]>([])
  const [coForm, setCoForm] = useState({ title: '', description: '', reason: '', priceImpact: '', scheduleImpact: '', projectId: '' })

  const handleCreateCO = () => {
    if (!coForm.title) return
    const projects = getMockData.getProjects(account?.id || '')
    const newCO = { id: 'co-' + Date.now(), coNumber: 'CO-' + String(200 + localCOs.length + 1), title: coForm.title, description: coForm.description, reason: coForm.reason, priceImpact: parseFloat(coForm.priceImpact) || 0, scheduleImpact: parseInt(coForm.scheduleImpact) || 0, projectId: coForm.projectId || projects[0]?.id, status: 'pending', submittedDate: new Date().toISOString(), aiGenerated: false }
    const updated = [newCO, ...localCOs]
    setLocalCOs(updated); localStorage.setItem('localCOs', JSON.stringify(updated))
    setCoForm({ title: '', description: '', reason: '', priceImpact: '', scheduleImpact: '', projectId: '' }); setShowNewCO(false)
  }

  if (loading) return <div className="flex min-h-screen items-center justify-center"><div className="text-gray-600">Loading...</div></div>

  const mockCOs = getMockData.getChangeOrders(account?.id || '')
  const changeOrders = [...localCOs, ...mockCOs]
  const projects = getMockData.getProjects(account?.id || '')

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-700'
      case 'pending': return 'bg-yellow-100 text-yellow-700'
      case 'approved': return 'bg-green-100 text-green-700'
      case 'rejected': return 'bg-red-100 text-red-700'
      case 'completed': return 'bg-blue-100 text-blue-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const totalPriceImpact = changeOrders.filter(co => co.status === 'approved').reduce((sum, co) => sum + Number(co.priceImpact), 0)
  const totalScheduleImpact = changeOrders.filter(co => co.status === 'approved').reduce((sum, co) => sum + co.scheduleImpact, 0)

  return (
    <div className="min-h-screen bg-sf-cream">
      <Sidebar currentPath="/change-orders" user={user} account={account} onLogout={logout} isDemo={isDemo} />

      <div className="ml-64 blueprint-bg min-h-screen">
        <main className="px-8 py-6">
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-sf-navy font-heading tracking-wide">Change Orders</h1>
              <p className="text-gray-500 mt-1">Track scope changes and budget impacts</p>
            </div>
            <button onClick={() => setShowNewCO(true)} className="px-6 py-3 bg-sf-orange text-white rounded-lg hover:bg-sf-orange-dark transition-colors font-bold font-heading tracking-wide">+ New Change Order</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-l-sf-navy border border-gray-200">
              <p className="text-xs text-gray-500 uppercase tracking-wider">Total COs</p>
              <p className="text-2xl font-bold text-sf-navy mt-1">{changeOrders.length}</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-l-yellow-500 border border-gray-200">
              <p className="text-xs text-gray-500 uppercase tracking-wider">Pending Approval</p>
              <p className="text-2xl font-bold text-yellow-600 mt-1">{changeOrders.filter(co => co.status === 'pending').length}</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-l-green-500 border border-gray-200">
              <p className="text-xs text-gray-500 uppercase tracking-wider">Approved Budget Impact</p>
              <p className="text-2xl font-bold text-green-600 mt-1">${(totalPriceImpact / 1000).toFixed(0)}k</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-l-orange-500 border border-gray-200">
              <p className="text-xs text-gray-500 uppercase tracking-wider">Schedule Impact</p>
              <p className="text-2xl font-bold text-orange-600 mt-1">+{totalScheduleImpact} days</p>
            </div>
          </div>

          <div className="space-y-4">
            {changeOrders.map((co) => {
              const project = projects.find(p => p.id === co.projectId)
              return (
                <div key={co.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow border-l-4 border-l-purple-500">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="text-lg font-bold text-purple-600">{co.coNumber}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(co.status)}`}>{co.status.charAt(0).toUpperCase() + co.status.slice(1)}</span>
                        {co.aiGenerated && <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">AI Generated</span>}
                      </div>
                      <h3 className="text-xl font-bold text-sf-navy font-heading tracking-wide mb-2">{co.title}</h3>
                      <p className="text-sm text-gray-500 mb-3">{co.description}</p>
                      {co.reason && <div className="bg-sf-orange/5 border border-sf-orange/20 rounded-lg p-3 mb-3"><p className="text-xs font-semibold text-sf-orange mb-1">Reason:</p><p className="text-sm text-gray-700">{co.reason}</p></div>}
                      <div className="flex items-center space-x-4 text-sm mb-3">
                        <span className="font-semibold text-gray-900">Price: <span className={Number(co.priceImpact) >= 0 ? 'text-green-600' : 'text-red-600'}>{Number(co.priceImpact) >= 0 ? '+' : ''}${Number(co.priceImpact).toLocaleString()}</span></span>
                        <span className="font-semibold text-gray-900">Schedule: <span className={co.scheduleImpact > 0 ? 'text-orange-600' : 'text-green-600'}>{co.scheduleImpact > 0 ? '+' : ''}{co.scheduleImpact} days</span></span>
                      </div>
                      <div className="flex items-center space-x-4 text-xs text-gray-400">
                        <span>📁 {project?.name || 'Unknown Project'}</span>
                        {co.submittedDate && <span>📤 Submitted: {new Date(co.submittedDate).toLocaleDateString()}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="px-4 py-2 bg-sf-orange/10 text-sf-orange rounded-lg hover:bg-sf-orange/20 transition-colors text-sm font-medium">View Details</button>
                    {co.status === 'pending' && <><button className="px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium">Approve</button><button className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium">Reject</button></>}
                  </div>
                </div>
              )
            })}
          </div>
        </main>
      </div>

      {showNewCO && (
        <div role="dialog" aria-modal="true" aria-label="Create Change Order" className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-sf-navy font-heading tracking-wide">Create Change Order</h3>
              <button onClick={() => setShowNewCO(false)} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
            </div>
            <div className="space-y-4">
              <div>
                <label htmlFor="co-title" className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input id="co-title" type="text" value={coForm.title} onChange={e => setCoForm({...coForm, title: e.target.value})} placeholder="Additional electrical work..." className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-sf-orange focus:ring-2 focus:ring-sf-orange/20 outline-none text-sm" />
              </div>
              <div>
                <label htmlFor="co-desc" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea id="co-desc" rows={2} value={coForm.description} onChange={e => setCoForm({...coForm, description: e.target.value})} placeholder="Describe the scope change..." className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-sf-orange focus:ring-2 focus:ring-sf-orange/20 outline-none text-sm" />
              </div>
              <div>
                <label htmlFor="co-reason" className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                <input id="co-reason" type="text" value={coForm.reason} onChange={e => setCoForm({...coForm, reason: e.target.value})} placeholder="Owner requested change..." className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-sf-orange focus:ring-2 focus:ring-sf-orange/20 outline-none text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="co-price" className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                  <input id="co-price" type="number" value={coForm.priceImpact} onChange={e => setCoForm({...coForm, priceImpact: e.target.value})} placeholder="5000" className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-sf-orange focus:ring-2 focus:ring-sf-orange/20 outline-none text-sm" />
                </div>
                <div>
                  <label htmlFor="co-days" className="block text-sm font-medium text-gray-700 mb-1">Days</label>
                  <input id="co-days" type="number" value={coForm.scheduleImpact} onChange={e => setCoForm({...coForm, scheduleImpact: e.target.value})} placeholder="3" className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-sf-orange focus:ring-2 focus:ring-sf-orange/20 outline-none text-sm" />
                </div>
              </div>
              <div>
                <label htmlFor="co-project" className="block text-sm font-medium text-gray-700 mb-1">Project</label>
                <select id="co-project" value={coForm.projectId} onChange={e => setCoForm({...coForm, projectId: e.target.value})} className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-sf-orange focus:ring-2 focus:ring-sf-orange/20 outline-none text-sm bg-white">
                  <option value="">Select</option>
                  {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div className="flex space-x-3 pt-2">
                <button onClick={handleCreateCO} disabled={!coForm.title} className="flex-1 bg-sf-orange text-white py-2.5 rounded-lg font-bold hover:bg-sf-orange-dark disabled:opacity-50 transition-colors font-heading tracking-wide">Create Change Order</button>
                <button onClick={() => setShowNewCO(false)} className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors">Cancel</button>
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
