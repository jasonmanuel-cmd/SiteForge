'use client'

import { useEffect, useState } from 'react'
import Sidebar from '@/components/Sidebar'
import AIChatbot from '@/components/AIChatbot'
import DemoTour from '@/components/DemoTour'
import { useAuth } from '@/lib/useAuth'

const STAGES = ['Lead', 'Contacted', 'Bid Sent', 'Negotiating', 'Won', 'Lost']
const STAGE_COLORS: Record<string, string> = { Lead: 'bg-gray-100 border-gray-300', Contacted: 'bg-blue-50 border-blue-300', 'Bid Sent': 'bg-yellow-50 border-yellow-300', Negotiating: 'bg-orange-50 border-orange-300', Won: 'bg-green-50 border-green-300', Lost: 'bg-red-50 border-red-300' }
const STAGE_HEADER_COLORS: Record<string, string> = { Lead: 'bg-gray-500', Contacted: 'bg-blue-500', 'Bid Sent': 'bg-yellow-500', Negotiating: 'bg-sf-orange', Won: 'bg-green-500', Lost: 'bg-red-500' }

const DEMO_CONTACTS = [
  { id: 'c1', name: 'Mike Thompson', company: 'Thompson Properties', email: 'mike@thompsonprop.com', phone: '(661) 555-0101', type: 'customer', stage: 'Won', value: 285000, notes: 'Office renovation project. Great to work with.', lastContact: '2024-01-15' },
  { id: 'c2', name: 'Sarah Chen', company: 'Chen Development', email: 'sarah@chendev.com', phone: '(661) 555-0202', type: 'prospect', stage: 'Bid Sent', value: 650000, notes: 'New warehouse construction.', lastContact: '2024-01-20' },
  { id: 'c3', name: 'Robert Garcia', company: 'Garcia Retail LLC', email: 'rgarcia@garciaretail.com', phone: '(661) 555-0303', type: 'prospect', stage: 'Contacted', value: 120000, notes: 'Tenant improvement job.', lastContact: '2024-01-18' },
  { id: 'c4', name: 'Jennifer Williams', company: 'Williams HOA', email: 'jwilliams@williamshoa.org', phone: '(661) 555-0404', type: 'prospect', stage: 'Lead', value: 95000, notes: 'Clubhouse renovation.', lastContact: '2024-01-22' },
  { id: 'c5', name: 'David Park', company: 'Park Restaurant Group', email: 'dpark@parkrestaurants.com', phone: '(661) 555-0505', type: 'prospect', stage: 'Negotiating', value: 430000, notes: 'Restaurant buildout x3 locations.', lastContact: '2024-01-19' },
  { id: 'c6', name: 'Valley Lumber & Supply', company: 'Valley Lumber', email: 'orders@valleylumber.com', phone: '(661) 555-0606', type: 'vendor', stage: 'Won', value: 0, notes: 'Primary lumber vendor.', lastContact: '2024-01-21' },
]

export default function CRMPage() {
  const { user, account, isDemo, loading, logout } = useAuth()
  const [contacts, setContacts] = useState<any[]>([])
  const [view, setView] = useState<'pipeline' | 'list'>('pipeline')
  const [showAddModal, setShowAddModal] = useState(false)
  const [filterType, setFilterType] = useState('all')
  const [newContact, setNewContact] = useState({ name: '', company: '', email: '', phone: '', type: 'prospect', stage: 'Lead', value: '', notes: '' })

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('crmContacts') || 'null')
    setContacts(saved || DEMO_CONTACTS)
  }, [])

  const saveContacts = (updated: any[]) => { setContacts(updated); localStorage.setItem('crmContacts', JSON.stringify(updated)) }
  const addContact = () => {
    if (!newContact.name) return
    const contact = { id: 'c' + Date.now(), ...newContact, value: parseFloat(newContact.value) || 0, lastContact: new Date().toISOString().split('T')[0] }
    saveContacts([contact, ...contacts])
    setNewContact({ name: '', company: '', email: '', phone: '', type: 'prospect', stage: 'Lead', value: '', notes: '' }); setShowAddModal(false)
  }
  const moveStage = (id: string, stage: string) => saveContacts(contacts.map(c => c.id === id ? { ...c, stage } : c))
  const deleteContact = (id: string) => { if (confirm('Delete this contact?')) saveContacts(contacts.filter(c => c.id !== id)) }
  const filtered = filterType === 'all' ? contacts : contacts.filter(c => c.type === filterType)
  const pipelineContacts = filtered.filter(c => c.type !== 'vendor' && c.type !== 'subcontractor')
  const totalPipelineValue = pipelineContacts.filter(c => c.stage !== 'Lost').reduce((s, c) => s + (c.value || 0), 0)
  const wonValue = pipelineContacts.filter(c => c.stage === 'Won').reduce((s, c) => s + (c.value || 0), 0)

  return (
    <div className="min-h-screen bg-sf-cream">
      <Sidebar currentPath="/crm" user={user} account={account} onLogout={logout} isDemo={isDemo} />

      <div className="ml-64 blueprint-bg min-h-screen">
        <main className="px-8 py-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-sf-navy font-heading tracking-wide">CRM & Pipeline</h1>
              <p className="text-gray-500 mt-1">Track leads, customers, vendors, and subcontractors</p>
            </div>
            <button onClick={() => setShowAddModal(true)} className="px-5 py-2.5 bg-sf-orange text-white rounded-xl font-bold hover:bg-sf-orange-dark transition-colors shadow-lg font-heading tracking-wide">+ Add Contact</button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm border-l-4 border-l-sf-navy">
              <p className="text-xs text-gray-500 uppercase font-semibold">Total Contacts</p>
              <p className="text-2xl font-bold text-sf-navy mt-1">{contacts.length}</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm border-l-4 border-l-blue-500">
              <p className="text-xs text-gray-500 uppercase font-semibold">Pipeline Value</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">${(totalPipelineValue / 1000).toFixed(0)}k</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm border-l-4 border-l-green-500">
              <p className="text-xs text-gray-500 uppercase font-semibold">Won Value</p>
              <p className="text-2xl font-bold text-green-600 mt-1">${(wonValue / 1000).toFixed(0)}k</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm border-l-4 border-l-sf-orange">
              <p className="text-xs text-gray-500 uppercase font-semibold">Active Leads</p>
              <p className="text-2xl font-bold text-sf-orange mt-1">{pipelineContacts.filter(c => !['Won', 'Lost'].includes(c.stage)).length}</p>
            </div>
          </div>

          <div className="flex items-center justify-between mb-6">
            <div className="flex bg-white rounded-xl border border-gray-200 p-1">
              <button onClick={() => setView('pipeline')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${view === 'pipeline' ? 'bg-sf-navy text-white' : 'text-gray-600 hover:bg-gray-50'}`}>🎯 Pipeline</button>
              <button onClick={() => setView('list')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${view === 'list' ? 'bg-sf-navy text-white' : 'text-gray-600 hover:bg-gray-50'}`}>📋 List</button>
            </div>
            <div className="flex gap-2">
              {['all', 'prospect', 'customer', 'vendor', 'subcontractor'].map(t => (
                <button key={t} onClick={() => setFilterType(t)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors capitalize ${filterType === t ? 'bg-sf-navy text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}>{t}</button>
              ))}
            </div>
          </div>

          {view === 'pipeline' && (
            <div className="flex gap-4 overflow-x-auto pb-4">
              {STAGES.map(stage => {
                const stagePeople = pipelineContacts.filter(c => c.stage === stage)
                const stageValue = stagePeople.reduce((s, c) => s + (c.value || 0), 0)
                return (
                  <div key={stage} className="flex-shrink-0 w-64">
                    <div className={`${STAGE_HEADER_COLORS[stage]} text-white px-4 py-2.5 rounded-t-xl`}>
                      <div className="flex justify-between items-center"><span className="font-bold text-sm">{stage}</span><span className="bg-white/20 rounded-full px-2 py-0.5 text-xs">{stagePeople.length}</span></div>
                      {stageValue > 0 && <p className="text-white/80 text-xs">${(stageValue / 1000).toFixed(0)}k</p>}
                    </div>
                    <div className={`${STAGE_COLORS[stage]} border-2 rounded-b-xl p-2 min-h-32 space-y-2`}>
                      {stagePeople.map(contact => (
                        <div key={contact.id} className="bg-white rounded-lg p-3 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start mb-1">
                            <p className="font-semibold text-gray-900 text-sm leading-tight">{contact.name}</p>
                            <button onClick={() => deleteContact(contact.id)} className="text-gray-300 hover:text-red-400 text-xs ml-1">✕</button>
                          </div>
                          <p className="text-xs text-gray-500 mb-2">{contact.company}</p>
                          {contact.value > 0 && <p className="text-xs font-bold text-green-600 mb-2">${contact.value.toLocaleString()}</p>}
                          <select value={contact.stage} onChange={e => moveStage(contact.id, e.target.value)} className="w-full text-xs border border-gray-200 rounded px-2 py-1 bg-gray-50">{STAGES.map(s => <option key={s}>{s}</option>)}</select>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {view === 'list' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-sf-navy text-white">
                  <tr>
                    <th scope="col" className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider">Contact</th>
                    <th scope="col" className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider">Type</th>
                    <th scope="col" className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider">Stage</th>
                    <th scope="col" className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider">Value</th>
                    <th scope="col" className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider">Last Contact</th>
                    <th scope="col" className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map(contact => (
                    <tr key={contact.id} className="hover:bg-sf-orange/5">
                      <td className="px-5 py-3.5"><p className="font-semibold text-sf-navy text-sm">{contact.name}</p><p className="text-xs text-gray-500">{contact.company}</p></td>
                      <td className="px-5 py-3.5"><span className="px-2 py-1 rounded-full text-xs font-semibold capitalize bg-sf-orange/10 text-sf-orange">{contact.type}</span></td>
                      <td className="px-5 py-3.5"><select value={contact.stage} onChange={e => moveStage(contact.id, e.target.value)} className="text-xs border border-gray-200 rounded-lg px-2 py-1">{STAGES.map(s => <option key={s}>{s}</option>)}</select></td>
                      <td className="px-5 py-3.5 font-semibold text-sm text-sf-navy">{contact.value > 0 ? `$${contact.value.toLocaleString()}` : '-'}</td>
                      <td className="px-5 py-3.5 text-xs text-gray-500">{contact.lastContact}</td>
                      <td className="px-5 py-3.5"><div className="flex gap-2"><a href={`mailto:${contact.email}`} className="p-1.5 bg-sf-orange/10 text-sf-orange rounded hover:bg-sf-orange/20">✉</a><button onClick={() => deleteContact(contact.id)} className="p-1.5 bg-red-50 text-red-500 rounded hover:bg-red-100 text-xs">✕</button></div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>

      {showAddModal && (
        <div role="dialog" aria-modal="true" aria-label="Add Contact" className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-xl font-bold text-sf-navy font-heading tracking-wide">Add Contact</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><label htmlFor="crm-name" className="block text-sm font-medium text-gray-700 mb-1">Name *</label><input id="crm-name" value={newContact.name} onChange={e => setNewContact({ ...newContact, name: e.target.value })} className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-sm focus:border-sf-orange focus:ring-2 focus:ring-sf-orange/20 outline-none" placeholder="John Smith" /></div>

              <div><label htmlFor="crm-company" className="block text-sm font-medium text-gray-700 mb-1">Company</label><input id="crm-company" value={newContact.company} onChange={e => setNewContact({ ...newContact, company: e.target.value })} className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-sm focus:border-sf-orange focus:ring-2 focus:ring-sf-orange/20 outline-none" placeholder="ABC Corp" /></div>

              <div><label htmlFor="crm-email" className="block text-sm font-medium text-gray-700 mb-1">Email</label><input id="crm-email" type="email" value={newContact.email} onChange={e => setNewContact({ ...newContact, email: e.target.value })} className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-sm focus:border-sf-orange focus:ring-2 focus:ring-sf-orange/20 outline-none" placeholder="john@abc.com" /></div>

              <div><label htmlFor="crm-phone" className="block text-sm font-medium text-gray-700 mb-1">Phone</label><input id="crm-phone" value={newContact.phone} onChange={e => setNewContact({ ...newContact, phone: e.target.value })} className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-sm focus:border-sf-orange focus:ring-2 focus:ring-sf-orange/20 outline-none" placeholder="(555) 000-0000" /></div>

              <div><label htmlFor="crm-type" className="block text-sm font-medium text-gray-700 mb-1">Type</label><select id="crm-type" value={newContact.type} onChange={e => setNewContact({ ...newContact, type: e.target.value })} className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-sm bg-white focus:border-sf-orange focus:ring-2 focus:ring-sf-orange/20 outline-none"><option value="prospect">Prospect</option><option value="customer">Customer</option><option value="vendor">Vendor</option><option value="subcontractor">Subcontractor</option></select></div>

              <div><label htmlFor="crm-stage" className="block text-sm font-medium text-gray-700 mb-1">Stage</label><select id="crm-stage" value={newContact.stage} onChange={e => setNewContact({ ...newContact, stage: e.target.value })} className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-sm bg-white focus:border-sf-orange focus:ring-2 focus:ring-sf-orange/20 outline-none">{STAGES.map(s => <option key={s}>{s}</option>)}</select></div>

              <div className="col-span-2"><label htmlFor="crm-value" className="block text-sm font-medium text-gray-700 mb-1">Deal Value ($)</label><input id="crm-value" type="number" value={newContact.value} onChange={e => setNewContact({ ...newContact, value: e.target.value })} className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-sm focus:border-sf-orange focus:ring-2 focus:ring-sf-orange/20 outline-none" placeholder="50000" /></div>

              <div className="col-span-2"><label htmlFor="crm-notes" className="block text-sm font-medium text-gray-700 mb-1">Notes</label><textarea id="crm-notes" value={newContact.notes} onChange={e => setNewContact({ ...newContact, notes: e.target.value })} className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-sm focus:border-sf-orange focus:ring-2 focus:ring-sf-orange/20 outline-none" rows={2} placeholder="Add any notes..." /></div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={addContact} className="flex-1 bg-sf-orange text-white py-2.5 rounded-xl font-bold hover:bg-sf-orange-dark font-heading tracking-wide">Add Contact</button>
              <button onClick={() => setShowAddModal(false)} className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-xl font-semibold hover:bg-gray-200">Cancel</button>
            </div>
          </div>
        </div>
      )}

      <AIChatbot />
      <DemoTour />
    </div>
  )
}
