'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import AIChatbot from '@/components/AIChatbot'
import DemoTour from '@/components/DemoTour'

const STAGES = ['Lead', 'Contacted', 'Bid Sent', 'Negotiating', 'Won', 'Lost']

const STAGE_COLORS: Record<string, string> = {
  Lead: 'bg-gray-100 border-gray-300',
  Contacted: 'bg-blue-50 border-blue-300',
  'Bid Sent': 'bg-yellow-50 border-yellow-300',
  Negotiating: 'bg-orange-50 border-orange-300',
  Won: 'bg-green-50 border-green-300',
  Lost: 'bg-red-50 border-red-300',
}

const STAGE_HEADER_COLORS: Record<string, string> = {
  Lead: 'bg-gray-500',
  Contacted: 'bg-blue-500',
  'Bid Sent': 'bg-yellow-500',
  Negotiating: 'bg-orange-500',
  Won: 'bg-green-500',
  Lost: 'bg-red-500',
}

const DEMO_CONTACTS = [
  { id: 'c1', name: 'Mike Thompson', company: 'Thompson Properties', email: 'mike@thompsonprop.com', phone: '(661) 555-0101', type: 'customer', stage: 'Won', value: 285000, notes: 'Office renovation project. Great to work with.', lastContact: '2024-01-15' },
  { id: 'c2', name: 'Sarah Chen', company: 'Chen Development', email: 'sarah@chendev.com', phone: '(661) 555-0202', type: 'prospect', stage: 'Bid Sent', value: 650000, notes: 'New warehouse construction. Waiting on bid decision.', lastContact: '2024-01-20' },
  { id: 'c3', name: 'Robert Garcia', company: 'Garcia Retail LLC', email: 'rgarcia@garciaretail.com', phone: '(661) 555-0303', type: 'prospect', stage: 'Contacted', value: 120000, notes: 'Tenant improvement job. Needs phased approach.', lastContact: '2024-01-18' },
  { id: 'c4', name: 'Jennifer Williams', company: 'Williams HOA', email: 'jwilliams@williamshoa.org', phone: '(661) 555-0404', type: 'prospect', stage: 'Lead', value: 95000, notes: 'Clubhouse renovation. Budget conscious.', lastContact: '2024-01-22' },
  { id: 'c5', name: 'David Park', company: 'Park Restaurant Group', email: 'dpark@parkrestaurants.com', phone: '(661) 555-0505', type: 'prospect', stage: 'Negotiating', value: 430000, notes: 'Restaurant buildout x3 locations. High value client.', lastContact: '2024-01-19' },
  { id: 'c6', name: 'Valley Lumber & Supply', company: 'Valley Lumber', email: 'orders@valleylumber.com', phone: '(661) 555-0606', type: 'vendor', stage: 'Won', value: 0, notes: 'Primary lumber vendor. Net 30 terms.', lastContact: '2024-01-21' },
]

export default function CRMPage() {
  const [contacts, setContacts] = useState<any[]>([])
  const [view, setView] = useState<'pipeline' | 'list'>('pipeline')
  const [showAddModal, setShowAddModal] = useState(false)
  const [filterType, setFilterType] = useState('all')
  const [newContact, setNewContact] = useState({
    name: '', company: '', email: '', phone: '', type: 'prospect', stage: 'Lead', value: '', notes: ''
  })

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('crmContacts') || 'null')
    setContacts(saved || DEMO_CONTACTS)
  }, [])

  const saveContacts = (updated: any[]) => {
    setContacts(updated)
    localStorage.setItem('crmContacts', JSON.stringify(updated))
  }

  const addContact = () => {
    if (!newContact.name) return
    const contact = {
      id: 'c' + Date.now(),
      ...newContact,
      value: parseFloat(newContact.value) || 0,
      lastContact: new Date().toISOString().split('T')[0],
    }
    saveContacts([contact, ...contacts])
    setNewContact({ name: '', company: '', email: '', phone: '', type: 'prospect', stage: 'Lead', value: '', notes: '' })
    setShowAddModal(false)
  }

  const moveStage = (id: string, stage: string) => {
    saveContacts(contacts.map(c => c.id === id ? { ...c, stage } : c))
  }

  const deleteContact = (id: string) => {
    if (confirm('Delete this contact?')) saveContacts(contacts.filter(c => c.id !== id))
  }

  const filtered = filterType === 'all' ? contacts : contacts.filter(c => c.type === filterType)

  const pipelineContacts = filtered.filter(c => c.type !== 'vendor' && c.type !== 'subcontractor')
  const totalPipelineValue = pipelineContacts.filter(c => c.stage !== 'Lost').reduce((s, c) => s + (c.value || 0), 0)
  const wonValue = pipelineContacts.filter(c => c.stage === 'Won').reduce((s, c) => s + (c.value || 0), 0)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-6">
          <h1 className="text-xl font-bold">Construction SaaS</h1>
          <p className="text-sm text-gray-400 mt-1">CRM</p>
        </div>
        <nav className="flex-1 px-4 space-y-1">
          <Link href="/dashboard" className="flex items-center px-4 py-2.5 text-gray-300 hover:bg-gray-800 rounded-lg text-sm">🏠 Dashboard</Link>
          <Link href="/crm" className="flex items-center px-4 py-2.5 bg-gray-800 rounded-lg text-sm text-white">👥 CRM & Pipeline</Link>
          <Link href="/estimator" className="flex items-center px-4 py-2.5 text-gray-300 hover:bg-gray-800 rounded-lg text-sm">🔧 Estimator</Link>
          <Link href="/projects" className="flex items-center px-4 py-2.5 text-gray-300 hover:bg-gray-800 rounded-lg text-sm">🏗️ Projects</Link>
          <Link href="/invoices" className="flex items-center px-4 py-2.5 text-gray-300 hover:bg-gray-800 rounded-lg text-sm">📄 Invoices</Link>
          <Link href="/rfis" className="flex items-center px-4 py-2.5 text-gray-300 hover:bg-gray-800 rounded-lg text-sm">❓ RFIs</Link>
          <Link href="/change-orders" className="flex items-center px-4 py-2.5 text-gray-300 hover:bg-gray-800 rounded-lg text-sm">📝 Change Orders</Link>
        </nav>
      </div>

      <div className="ml-64">
        <main className="px-8 py-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">CRM & Pipeline</h2>
              <p className="text-gray-500">Track leads, customers, vendors, and subcontractors</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg"
            >
              + Add Contact
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <p className="text-xs text-gray-500 uppercase font-semibold">Total Contacts</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{contacts.length}</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <p className="text-xs text-gray-500 uppercase font-semibold">Pipeline Value</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">${(totalPipelineValue / 1000).toFixed(0)}k</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <p className="text-xs text-gray-500 uppercase font-semibold">Won Value</p>
              <p className="text-2xl font-bold text-green-600 mt-1">${(wonValue / 1000).toFixed(0)}k</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <p className="text-xs text-gray-500 uppercase font-semibold">Active Leads</p>
              <p className="text-2xl font-bold text-orange-500 mt-1">
                {pipelineContacts.filter(c => !['Won', 'Lost'].includes(c.stage)).length}
              </p>
            </div>
          </div>

          {/* View Toggle + Filters */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex bg-white rounded-xl border border-gray-200 p-1">
              <button onClick={() => setView('pipeline')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${view === 'pipeline' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}>
                🎯 Pipeline
              </button>
              <button onClick={() => setView('list')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${view === 'list' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}>
                📋 List
              </button>
            </div>
            <div className="flex gap-2">
              {['all', 'prospect', 'customer', 'vendor', 'subcontractor'].map(t => (
                <button key={t} onClick={() => setFilterType(t)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors capitalize ${filterType === t ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Pipeline View */}
          {view === 'pipeline' && (
            <div className="flex gap-4 overflow-x-auto pb-4">
              {STAGES.map(stage => {
                const stagePeople = pipelineContacts.filter(c => c.stage === stage)
                const stageValue = stagePeople.reduce((s, c) => s + (c.value || 0), 0)
                return (
                  <div key={stage} className="flex-shrink-0 w-64">
                    <div className={`${STAGE_HEADER_COLORS[stage]} text-white px-4 py-2.5 rounded-t-xl`}>
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-sm">{stage}</span>
                        <span className="bg-white/20 rounded-full px-2 py-0.5 text-xs">{stagePeople.length}</span>
                      </div>
                      {stageValue > 0 && (
                        <p className="text-white/80 text-xs">${(stageValue / 1000).toFixed(0)}k</p>
                      )}
                    </div>
                    <div className={`${STAGE_COLORS[stage]} border-2 rounded-b-xl p-2 min-h-32 space-y-2`}>
                      {stagePeople.map(contact => (
                        <div key={contact.id} className="bg-white rounded-lg p-3 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start mb-1">
                            <p className="font-semibold text-gray-900 text-sm leading-tight">{contact.name}</p>
                            <button onClick={() => deleteContact(contact.id)} className="text-gray-300 hover:text-red-400 text-xs ml-1">✕</button>
                          </div>
                          <p className="text-xs text-gray-500 mb-2">{contact.company}</p>
                          {contact.value > 0 && (
                            <p className="text-xs font-bold text-green-600 mb-2">${contact.value.toLocaleString()}</p>
                          )}
                          <select
                            value={contact.stage}
                            onChange={e => moveStage(contact.id, e.target.value)}
                            className="w-full text-xs border border-gray-200 rounded px-2 py-1 bg-gray-50"
                          >
                            {STAGES.map(s => <option key={s}>{s}</option>)}
                          </select>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* List View */}
          {view === 'list' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-800 text-white">
                  <tr>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider">Contact</th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider">Type</th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider">Stage</th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider">Value</th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider">Last Contact</th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map(contact => (
                    <tr key={contact.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3.5">
                        <p className="font-semibold text-gray-900 text-sm">{contact.name}</p>
                        <p className="text-xs text-gray-500">{contact.company}</p>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="px-2 py-1 rounded-full text-xs font-semibold capitalize bg-blue-50 text-blue-700">
                          {contact.type}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <select
                          value={contact.stage}
                          onChange={e => moveStage(contact.id, e.target.value)}
                          className="text-xs border border-gray-200 rounded-lg px-2 py-1"
                        >
                          {STAGES.map(s => <option key={s}>{s}</option>)}
                        </select>
                      </td>
                      <td className="px-5 py-3.5 font-semibold text-sm text-gray-900">
                        {contact.value > 0 ? `$${contact.value.toLocaleString()}` : '-'}
                      </td>
                      <td className="px-5 py-3.5 text-xs text-gray-500">{contact.lastContact}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex gap-2">
                          <a href={`mailto:${contact.email}`} className="p-1.5 bg-blue-50 text-blue-600 rounded hover:bg-blue-100">
                            ✉
                          </a>
                          <button onClick={() => deleteContact(contact.id)} className="p-1.5 bg-red-50 text-red-500 rounded hover:bg-red-100 text-xs">✕</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>

      {/* Add Contact Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-xl font-bold text-gray-900">Add Contact</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input value={newContact.name} onChange={e => setNewContact({ ...newContact, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" placeholder="John Smith" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                <input value={newContact.company} onChange={e => setNewContact({ ...newContact, company: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" placeholder="ABC Corp" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" value={newContact.email} onChange={e => setNewContact({ ...newContact, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" placeholder="john@abc.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input value={newContact.phone} onChange={e => setNewContact({ ...newContact, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" placeholder="(555) 000-0000" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select value={newContact.type} onChange={e => setNewContact({ ...newContact, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white">
                  <option value="prospect">Prospect</option>
                  <option value="customer">Customer</option>
                  <option value="vendor">Vendor</option>
                  <option value="subcontractor">Subcontractor</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stage</label>
                <select value={newContact.stage} onChange={e => setNewContact({ ...newContact, stage: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white">
                  {STAGES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Deal Value ($)</label>
                <input type="number" value={newContact.value} onChange={e => setNewContact({ ...newContact, value: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" placeholder="50000" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea value={newContact.notes} onChange={e => setNewContact({ ...newContact, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" rows={2} placeholder="Add any notes..." />
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={addContact} className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl font-semibold hover:bg-blue-700">
                Add Contact
              </button>
              <button onClick={() => setShowAddModal(false)} className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-xl font-semibold hover:bg-gray-200">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <AIChatbot />
      <DemoTour />
    </div>
  )
}
