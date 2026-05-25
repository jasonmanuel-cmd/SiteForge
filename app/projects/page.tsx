'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getMockData } from '@/lib/mockData'
import Link from 'next/link'
import DemoTour from '@/components/DemoTour'
import AIChatbot from '@/components/AIChatbot'

export default function ProjectsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [account, setAccount] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [showNewProject, setShowNewProject] = useState(false)
  const [localProjects, setLocalProjects] = useState<any[]>([])
  const [projectForm, setProjectForm] = useState({ name: '', address: '', city: '', state: 'CA', estimatedBudget: '' })

  useEffect(() => {
    const userData = localStorage.getItem('user')
    const accountData = localStorage.getItem('account')

    if (!userData || !accountData) {
      router.push('/login')
      return
    }
    setUser(JSON.parse(userData))
    setAccount(JSON.parse(accountData))
    const savedProjects = localStorage.getItem('localProjects')
    if (savedProjects) setLocalProjects(JSON.parse(savedProjects))
    setLoading(false)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('account')
    router.push('/')
  }

  const handleCreateProject = () => {
    if (!projectForm.name) return
    const newProject = {
      id: 'proj-' + Date.now(),
      accountId: account?.id,
      name: projectForm.name,
      address: projectForm.address,
      city: projectForm.city,
      state: projectForm.state,
      status: 'active',
      estimatedBudget: parseFloat(projectForm.estimatedBudget) || 0,
      actualCost: 0,
      startDate: new Date().toISOString(),
      endDate: null,
    }
    const updated = [newProject, ...localProjects]
    setLocalProjects(updated)
    localStorage.setItem('localProjects', JSON.stringify(updated))
    setProjectForm({ name: '', address: '', city: '', state: 'CA', estimatedBudget: '' })
    setShowNewProject(false)
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }

  const mockProjects = getMockData.getProjects(account?.id || '')
  const projects = [...localProjects, ...mockProjects]
  const filteredProjects = filter === 'all'
    ? projects
    : projects.filter(p => p.status === filter)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'completed': return 'bg-blue-100 text-blue-800'
      case 'on_hold': return 'bg-yellow-100 text-yellow-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    return status.replace('_', ' ').charAt(0).toUpperCase() + status.replace('_', ' ').slice(1)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar Navigation */}
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
            <Link href="/projects" className="flex items-center px-4 py-2.5 bg-gray-800 rounded-lg text-sm">
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
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64">
        <main className="px-8 py-6">
          {/* Header */}
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Projects</h2>
              <p className="text-gray-600 mt-1">Manage all your construction projects</p>
            </div>
            <button onClick={() => setShowNewProject(true)} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
              + New Project
            </button>
          </div>

          {/* Filter Tabs */}
          <div className="mb-6 flex space-x-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              All ({projects.length})
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'active'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              Active ({projects.filter(p => p.status === 'active').length})
            </button>
            <button
              onClick={() => setFilter('on_hold')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'on_hold'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              On Hold ({projects.filter(p => p.status === 'on_hold').length})
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'completed'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              Completed ({projects.filter(p => p.status === 'completed').length})
            </button>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredProjects.map((project) => {
              const budgetUsed = project.estimatedBudget
                ? (Number(project.actualCost) / Number(project.estimatedBudget)) * 100
                : 0

              return (
                <div key={project.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-1">{project.name}</h3>
                      <p className="text-sm text-gray-600">
                        {project.address}, {project.city}, {project.state}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                      {getStatusLabel(project.status)}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-500">Start Date</p>
                      <p className="text-sm font-medium text-gray-900">
                        {project.startDate ? new Date(project.startDate).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">End Date</p>
                      <p className="text-sm font-medium text-gray-900">
                        {project.endDate ? new Date(project.endDate).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Budget Progress</span>
                      <span className="font-semibold text-gray-900">{budgetUsed.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${budgetUsed > 90 ? 'bg-red-600' : budgetUsed > 75 ? 'bg-yellow-600' : 'bg-green-600'}`}
                        style={{ width: `${Math.min(budgetUsed, 100)}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs mt-1">
                      <span className="text-gray-500">
                        ${(Number(project.actualCost) / 1000).toFixed(0)}k spent
                      </span>
                      <span className="text-gray-500">
                        ${(Number(project.estimatedBudget) / 1000).toFixed(0)}k budget
                      </span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button className="flex-1 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium">
                      View Details
                    </button>
                    <button className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors text-sm">
                      ⚙️
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

          {filteredProjects.length === 0 && (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No projects found</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by creating a new project.</p>
            </div>
          )}
        </main>
      </div>

      {/* New Project Modal */}
      {showNewProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Create New Project</h3>
              <button onClick={() => setShowNewProject(false)} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Project Name *</label>
                <input type="text" value={projectForm.name} onChange={e => setProjectForm({...projectForm, name: e.target.value})}
                  placeholder="Office Renovation - Phase 1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input type="text" value={projectForm.address} onChange={e => setProjectForm({...projectForm, address: e.target.value})}
                  placeholder="123 Main St"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input type="text" value={projectForm.city} onChange={e => setProjectForm({...projectForm, city: e.target.value})}
                    placeholder="Los Angeles"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <select value={projectForm.state} onChange={e => setProjectForm({...projectForm, state: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm">
                    {['CA','TX','FL','NY','WA','OR','AZ','CO','NV','GA'].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Budget ($)</label>
                <input type="number" value={projectForm.estimatedBudget} onChange={e => setProjectForm({...projectForm, estimatedBudget: e.target.value})}
                  placeholder="500000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm" />
              </div>
              <div className="flex space-x-3 pt-2">
                <button onClick={handleCreateProject} disabled={!projectForm.name}
                  className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors">
                  Create Project
                </button>
                <button onClick={() => setShowNewProject(false)}
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
