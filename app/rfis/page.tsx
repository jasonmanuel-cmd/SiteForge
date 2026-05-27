'use client'

import { useState } from 'react'
import { getMockData } from '@/lib/mockData'
import Sidebar from '@/components/Sidebar'
import DemoTour from '@/components/DemoTour'
import AIChatbot from '@/components/AIChatbot'
import { useAuth } from '@/lib/useAuth'

export default function RFIsPage() {
  const { user, account, isDemo, loading, logout } = useAuth()
  const [showNewRFI, setShowNewRFI] = useState(false)
  const [rfiForm, setRfiForm] = useState({ subject: '', question: '', priority: 'normal', projectId: '' })
  const [localRFIs, setLocalRFIs] = useState<any[]>([])

  const handleCreateRFI = () => {
    if (!rfiForm.subject) return
    const projects = getMockData.getProjects(account?.id || '')
    const newRFI = { id: 'rfi-' + Date.now(), rfiNumber: 'RFI-' + String(100 + localRFIs.length + 1), subject: rfiForm.subject, question: rfiForm.question, priority: rfiForm.priority, projectId: rfiForm.projectId || projects[0]?.id, status: 'draft', dueDate: new Date(Date.now() + 7 * 86400000).toISOString(), aiGenerated: false }
    const updated = [newRFI, ...localRFIs]
    setLocalRFIs(updated); localStorage.setItem('localRFIs', JSON.stringify(updated))
    setRfiForm({ subject: '', question: '', priority: 'normal', projectId: '' }); setShowNewRFI(false)
  }

  if (loading) return <div className="flex min-h-screen items-center justify-center"><div className="text-gray-600">Loading...</div></div>

  const mockRFIs = getMockData.getRFIs(account?.id || '')
  const rfis = [...localRFIs, ...mockRFIs]
  const projects = getMockData.getProjects(account?.id || '')

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-700'
      case 'sent': return 'bg-yellow-100 text-yellow-700'
      case 'responded': return 'bg-blue-100 text-blue-700'
      case 'closed': return 'bg-green-100 text-green-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600'
      case 'high': return 'text-orange-600'
      case 'normal': return 'text-sf-orange'
      case 'low': return 'text-gray-500'
      default: return 'text-gray-500'
    }
  }

  return (
    <div className="min-h-screen bg-sf-cream">
      <Sidebar currentPath="/rfis" user={user} account={account} onLogout={logout} isDemo={isDemo} />

      <div className="ml-64 blueprint-bg min-h-screen">
        <main className="px-8 py-6">
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-sf-navy font-heading tracking-wide">RFIs</h1>
              <p className="text-gray-500 mt-1">Request for Information management</p>
            </div>
            <button onClick={() => setShowNewRFI(true)} className="px-6 py-3 bg-sf-orange text-white rounded-lg hover:bg-sf-orange-dark transition-colors font-bold font-heading tracking-wide">+ New RFI</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-l-sf-navy border border-gray-200">
              <p className="text-xs text-gray-500 uppercase tracking-wider">Total RFIs</p>
              <p className="text-2xl font-bold text-sf-navy mt-1">{rfis.length}</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-l-gray-400 border border-gray-200">
              <p className="text-xs text-gray-500 uppercase tracking-wider">Draft</p>
              <p className="text-2xl font-bold text-gray-600 mt-1">{rfis.filter(r => r.status === 'draft').length}</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-l-yellow-500 border border-gray-200">
              <p className="text-xs text-gray-500 uppercase tracking-wider">Awaiting Response</p>
              <p className="text-2xl font-bold text-yellow-600 mt-1">{rfis.filter(r => r.status === 'sent').length}</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-l-green-500 border border-gray-200">
              <p className="text-xs text-gray-500 uppercase tracking-wider">Responded</p>
              <p className="text-2xl font-bold text-green-600 mt-1">{rfis.filter(r => r.status === 'responded').length}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-sf-cream px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <input type="text" placeholder="Search RFIs..." className="pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:border-sf-orange focus:ring-2 focus:ring-sf-orange/20 outline-none text-sm" />
                    <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                  </div>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-sf-navy text-white">
                  <tr>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">RFI #</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Subject</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Project</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Priority</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Due Date</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {rfis.map((rfi) => {
                    const project = projects.find(p => p.id === rfi.projectId)
                    return (
                      <tr key={rfi.id} className="hover:bg-sf-orange/5">
                        <td className="px-6 py-4 whitespace-nowrap"><div className="flex items-center space-x-2"><span className="text-sm font-bold text-sf-orange">{rfi.rfiNumber}</span>{rfi.aiGenerated && <span className="px-2 py-0.5 bg-purple-100 text-purple-600 rounded text-xs font-medium">AI</span>}</div></td>
                        <td className="px-6 py-4"><div className="max-w-xs"><p className="text-sm font-medium text-sf-navy truncate">{rfi.subject}</p><p className="text-xs text-gray-500 truncate">{rfi.question}</p></div></td>
                        <td className="px-6 py-4"><p className="text-sm text-gray-500 truncate max-w-xs">{project?.name || 'N/A'}</p></td>
                        <td className="px-6 py-4 whitespace-nowrap"><span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(rfi.status)}`}>{rfi.status.charAt(0).toUpperCase() + rfi.status.slice(1)}</span></td>
                        <td className="px-6 py-4 whitespace-nowrap"><span className={`text-sm font-bold ${getPriorityColor(rfi.priority)}`}>{rfi.priority.charAt(0).toUpperCase() + rfi.priority.slice(1)}</span></td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{rfi.dueDate ? new Date(rfi.dueDate).toLocaleDateString() : '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap"><div className="flex space-x-2">
                          <button className="p-2 text-sf-orange hover:bg-sf-orange/10 rounded-lg transition-colors" title="View"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg></button>
                          <button className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors" title="Edit"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg></button>
                        </div></td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
              <div className="text-sm text-gray-500">Showing 1 to {rfis.length} of {rfis.length} entries</div>
            </div>
          </div>
        </main>
      </div>

      {showNewRFI && (
        <div role="dialog" aria-modal="true" aria-label="Create New RFI" className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-sf-navy font-heading tracking-wide">Create New RFI</h3>
              <button onClick={() => setShowNewRFI(false)} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
            </div>
            <div className="space-y-4">
              <div><label htmlFor="rfi-subject" className="block text-sm font-medium text-gray-700 mb-1">Subject *</label><input id="rfi-subject" type="text" value={rfiForm.subject} onChange={e => setRfiForm({...rfiForm, subject: e.target.value})} placeholder="Clarification needed on..." className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-sf-orange focus:ring-2 focus:ring-sf-orange/20 outline-none text-sm" /></div>

              <div><label htmlFor="rfi-question" className="block text-sm font-medium text-gray-700 mb-1">Question / Description</label><textarea id="rfi-question" rows={3} value={rfiForm.question} onChange={e => setRfiForm({...rfiForm, question: e.target.value})} placeholder="Describe the information requested..." className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-sf-orange focus:ring-2 focus:ring-sf-orange/20 outline-none text-sm" /></div>

              <div className="grid grid-cols-2 gap-4">
                <div><label htmlFor="rfi-priority" className="block text-sm font-medium text-gray-700 mb-1">Priority</label><select id="rfi-priority" value={rfiForm.priority} onChange={e => setRfiForm({...rfiForm, priority: e.target.value})} className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-sf-orange focus:ring-2 focus:ring-sf-orange/20 outline-none text-sm bg-white"><option value="low">Low</option><option value="normal">Normal</option><option value="high">High</option><option value="urgent">Urgent</option></select></div>
                <div><label htmlFor="rfi-project" className="block text-sm font-medium text-gray-700 mb-1">Project</label><select id="rfi-project" value={rfiForm.projectId} onChange={e => setRfiForm({...rfiForm, projectId: e.target.value})} className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-sf-orange focus:ring-2 focus:ring-sf-orange/20 outline-none text-sm bg-white"><option value="">Select Project</option>{projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select></div>
              </div>
              <div className="flex space-x-3 pt-2">
                <button onClick={handleCreateRFI} disabled={!rfiForm.subject} className="flex-1 bg-sf-orange text-white py-2.5 rounded-lg font-bold hover:bg-sf-orange-dark disabled:opacity-50 transition-colors font-heading tracking-wide">Create RFI</button>
                <button onClick={() => setShowNewRFI(false)} className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors">Cancel</button>
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
