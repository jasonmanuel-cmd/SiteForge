'use client'

import { useState } from 'react'
import { getMockData } from '@/lib/mockData'
import Sidebar from '@/components/Sidebar'
import DemoTour from '@/components/DemoTour'
import AIChatbot from '@/components/AIChatbot'
import { useAuth } from '@/lib/useAuth'

export default function ProjectsPage() {
  const { user, account, isDemo, loading, logout } = useAuth()
  const [filter, setFilter] = useState('all')
  const [showNewProject, setShowNewProject] = useState(false)
  const [localProjects, setLocalProjects] = useState<any[]>([])
  const [projectForm, setProjectForm] = useState({ name: '', address: '', city: '', state: 'CA', estimatedBudget: '' })

  const handleCreateProject = () => {
    if (!projectForm.name) return
    const newProject = { id: 'proj-' + Date.now(), accountId: account?.id, name: projectForm.name, address: projectForm.address, city: projectForm.city, state: projectForm.state, status: 'active', estimatedBudget: parseFloat(projectForm.estimatedBudget) || 0, actualCost: 0, startDate: new Date().toISOString(), endDate: null }
    const updated = [newProject, ...localProjects]
    setLocalProjects(updated); localStorage.setItem('localProjects', JSON.stringify(updated))
    setProjectForm({ name: '', address: '', city: '', state: 'CA', estimatedBudget: '' }); setShowNewProject(false)
  }

  if (loading) return <div className="flex min-h-screen items-center justify-center"><div className="text-gray-600">Loading...</div></div>

  const mockProjects = getMockData.getProjects(account?.id || '')
  const projects = [...localProjects, ...mockProjects]
  const filteredProjects = filter === 'all' ? projects : projects.filter(p => p.status === filter)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700'
      case 'completed': return 'bg-blue-100 text-blue-700'
      case 'on_hold': return 'bg-yellow-100 text-yellow-700'
      case 'cancelled': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }
  const getStatusLabel = (status: string) => status.replace('_', ' ').charAt(0).toUpperCase() + status.replace('_', ' ').slice(1)

  return (
    <div className="min-h-screen bg-sf-cream">
      <Sidebar currentPath="/projects" user={user} account={account} onLogout={logout} isDemo={isDemo} />

      <div className="ml-64 blueprint-bg min-h-screen">
        <main className="px-8 py-6">
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-sf-navy font-heading tracking-wide">Projects</h1>
              <p className="text-gray-500 mt-1">Manage all your construction projects</p>
            </div>
            <button onClick={() => setShowNewProject(true)} className="px-6 py-3 bg-sf-orange text-white rounded-lg hover:bg-sf-orange-dark transition-colors font-bold font-heading tracking-wide">+ New Project</button>
          </div>

          <div className="mb-6 flex space-x-2">
            {['all', 'active', 'on_hold', 'completed'].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm ${filter === f ? 'bg-sf-navy text-white' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}`}>
                {f === 'all' ? 'All' : getStatusLabel(f)} ({f === 'all' ? projects.length : projects.filter(p => p.status === f).length})
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredProjects.map((project) => {
              const budgetUsed = project.estimatedBudget ? (Number(project.actualCost) / Number(project.estimatedBudget)) * 100 : 0
              return (
                <div key={project.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow border-l-4 border-l-sf-orange">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-sf-navy font-heading tracking-wide mb-1">{project.name}</h3>
                      <p className="text-sm text-gray-500">{project.address}, {project.city}, {project.state}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>{getStatusLabel(project.status)}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div><p className="text-xs text-gray-400">Start Date</p><p className="text-sm font-medium text-sf-navy">{project.startDate ? new Date(project.startDate).toLocaleDateString() : 'N/A'}</p></div>
                    <div><p className="text-xs text-gray-400">End Date</p><p className="text-sm font-medium text-sf-navy">{project.endDate ? new Date(project.endDate).toLocaleDateString() : 'N/A'}</p></div>
                  </div>
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2"><span className="text-gray-500">Budget</span><span className="font-semibold text-sf-navy">{budgetUsed.toFixed(1)}% used</span></div>
                    <div className="w-full bg-gray-200 rounded-full h-2"><div className={`h-2 rounded-full ${budgetUsed > 90 ? 'bg-red-500' : budgetUsed > 75 ? 'bg-yellow-500' : 'bg-sf-orange'}`} style={{ width: `${Math.min(budgetUsed, 100)}%` }}></div></div>
                    <div className="flex justify-between text-xs mt-1"><span className="text-gray-400">${(Number(project.actualCost) / 1000).toFixed(0)}k spent</span><span className="text-gray-400">${(Number(project.estimatedBudget) / 1000).toFixed(0)}k budget</span></div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="flex-1 px-4 py-2 bg-sf-orange/10 text-sf-orange rounded-lg hover:bg-sf-orange/20 transition-colors text-sm font-medium">View Details</button>
                    <button className="px-4 py-2 bg-gray-100 text-gray-500 rounded-lg hover:bg-gray-200 transition-colors text-sm">⚙️</button>
                  </div>
                </div>
              )
            })}
          </div>

          {filteredProjects.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
              <svg className="mx-auto h-12 w-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No projects found</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by creating a new project.</p>
            </div>
          )}
        </main>
      </div>

      {showNewProject && (
        <div role="dialog" aria-modal="true" aria-label="Create New Project" className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-sf-navy font-heading tracking-wide">Create New Project</h3>
              <button onClick={() => setShowNewProject(false)} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
            </div>
            <div className="space-y-4">
              <div><label htmlFor="proj-name" className="block text-sm font-medium text-gray-700 mb-1">Project Name *</label><input id="proj-name" type="text" value={projectForm.name} onChange={e => setProjectForm({...projectForm, name: e.target.value})} placeholder="Office Renovation - Phase 1" className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-sf-orange focus:ring-2 focus:ring-sf-orange/20 outline-none text-sm" /></div>
              <div><label htmlFor="proj-address" className="block text-sm font-medium text-gray-700 mb-1">Address</label><input id="proj-address" type="text" value={projectForm.address} onChange={e => setProjectForm({...projectForm, address: e.target.value})} placeholder="123 Main St" className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-sf-orange focus:ring-2 focus:ring-sf-orange/20 outline-none text-sm" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label htmlFor="proj-city" className="block text-sm font-medium text-gray-700 mb-1">City</label><input id="proj-city" type="text" value={projectForm.city} onChange={e => setProjectForm({...projectForm, city: e.target.value})} placeholder="Los Angeles" className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-sf-orange focus:ring-2 focus:ring-sf-orange/20 outline-none text-sm" /></div>
                <div><label htmlFor="proj-state" className="block text-sm font-medium text-gray-700 mb-1">State</label><select id="proj-state" value={projectForm.state} onChange={e => setProjectForm({...projectForm, state: e.target.value})} className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-sf-orange focus:ring-2 focus:ring-sf-orange/20 outline-none text-sm bg-white">{['CA','TX','FL','NY','WA','OR','AZ','CO','NV','GA'].map(s => <option key={s}>{s}</option>)}</select></div>
              </div>
              <div><label htmlFor="proj-budget" className="block text-sm font-medium text-gray-700 mb-1">Estimated Budget ($)</label><input id="proj-budget" type="number" value={projectForm.estimatedBudget} onChange={e => setProjectForm({...projectForm, estimatedBudget: e.target.value})} placeholder="500000" className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-sf-orange focus:ring-2 focus:ring-sf-orange/20 outline-none text-sm" /></div>
              <div className="flex space-x-3 pt-2">
                <button onClick={handleCreateProject} disabled={!projectForm.name} className="flex-1 bg-sf-orange text-white py-2.5 rounded-lg font-bold hover:bg-sf-orange-dark disabled:opacity-50 transition-colors font-heading tracking-wide">Create Project</button>
                <button onClick={() => setShowNewProject(false)} className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors">Cancel</button>
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
