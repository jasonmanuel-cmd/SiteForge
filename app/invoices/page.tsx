'use client'

import { useState } from 'react'
import { getMockData } from '@/lib/mockData'
import Sidebar from '@/components/Sidebar'
import DemoTour from '@/components/DemoTour'
import AIChatbot from '@/components/AIChatbot'
import { useAuth } from '@/lib/useAuth'

export default function InvoicesPage() {
  const { user, account, isDemo, loading, logout } = useAuth()
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [extractedData, setExtractedData] = useState<any>(null)
  const [selectedProject, setSelectedProject] = useState('')
  const [savedInvoices, setSavedInvoices] = useState<any[]>([])
  const [showSuccessToast, setShowSuccessToast] = useState(false)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const formData = new FormData(); formData.append('file', file)
      await new Promise(resolve => setTimeout(resolve, 800))
      setUploading(false); setProcessing(true)
      const response = await fetch('/api/invoices/process', { method: 'POST', body: formData })
      if (!response.ok) throw new Error('Failed to process invoice')
      const extractedData = await response.json()
      setExtractedData(extractedData); setProcessing(false)
    } catch { setProcessing(false); setUploading(false); alert('Failed to process invoice. Please try again.') }
  }

  const handleSaveInvoice = () => {
    if (!selectedProject) { alert('Please select a project!'); return }
    const newInvoice = { id: 'inv-' + Date.now(), accountId: account?.id, projectId: selectedProject, invoiceNumber: extractedData.invoiceNumber, invoiceDate: extractedData.invoiceDate, dueDate: extractedData.dueDate, subtotal: extractedData.subtotal, tax: extractedData.tax, total: extractedData.total, status: 'pending', category: extractedData.category, aiExtracted: true, aiConfidence: extractedData.confidence, createdAt: new Date().toISOString() }
    const updatedInvoices = [...savedInvoices, newInvoice]
    setSavedInvoices(updatedInvoices); localStorage.setItem('savedInvoices', JSON.stringify(updatedInvoices))
    setShowSuccessToast(true); setTimeout(() => setShowSuccessToast(false), 3000)
    setShowUploadModal(false); setExtractedData(null); setSelectedProject('')
  }

  if (loading) return <div className="flex min-h-screen items-center justify-center"><div className="text-gray-600">Loading...</div></div>

  const mockInvoices = getMockData.getInvoices(account?.id || '')
  const invoices = [...mockInvoices, ...savedInvoices]
  const projects = getMockData.getProjects(account?.id || '')

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-700'
      case 'pending': return 'bg-yellow-100 text-yellow-700'
      case 'paid': return 'bg-blue-100 text-blue-700'
      case 'disputed': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="min-h-screen bg-sf-cream">
      <Sidebar currentPath="/invoices" user={user} account={account} onLogout={logout} isDemo={isDemo} />

      <div className="ml-64 blueprint-bg min-h-screen">
        <main className="px-8 py-6">
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-sf-navy font-heading tracking-wide">Invoices</h1>
              <p className="text-gray-500 mt-1">AI-powered invoice processing and QuickBooks sync</p>
            </div>
            <button onClick={() => setShowUploadModal(true)} className="px-6 py-3 bg-sf-orange text-white rounded-lg hover:bg-sf-orange-dark transition-colors font-bold font-heading tracking-wide flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
              Upload Invoice
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-l-sf-navy border border-gray-200">
              <p className="text-xs text-gray-500 uppercase tracking-wider">Total Invoices</p>
              <p className="text-2xl font-bold text-sf-navy mt-1">{invoices.length}</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-l-yellow-500 border border-gray-200">
              <p className="text-xs text-gray-500 uppercase tracking-wider">Pending</p>
              <p className="text-2xl font-bold text-yellow-600 mt-1">{invoices.filter(i => i.status === 'pending').length}</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-l-green-500 border border-gray-200">
              <p className="text-xs text-gray-500 uppercase tracking-wider">Approved</p>
              <p className="text-2xl font-bold text-green-600 mt-1">{invoices.filter(i => i.status === 'approved').length}</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-l-sf-orange border border-gray-200">
              <p className="text-xs text-gray-500 uppercase tracking-wider">Total Amount</p>
              <p className="text-2xl font-bold text-sf-navy mt-1">${(invoices.reduce((sum, inv) => sum + Number(inv.total), 0) / 1000).toFixed(1)}k</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-sf-navy text-white">
                  <tr>
                    <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider">Invoice #</th>
                    <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider">Vendor</th>
                    <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider">Project</th>
                    <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider">Date</th>
                    <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider">Amount</th>
                    <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider">AI</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {invoices.map((invoice) => {
                    const project = projects.find(p => p.id === invoice.projectId)
                    return (
                      <tr key={invoice.id} className="hover:bg-sf-orange/5">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-sf-navy">{invoice.invoiceNumber}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Vendor</td>
                        <td className="px-6 py-4 text-sm text-gray-500"><div className="max-w-xs truncate">{project?.name || 'Unknown'}</div></td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{invoice.invoiceDate ? new Date(invoice.invoiceDate).toLocaleDateString() : 'N/A'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-sf-navy">${Number(invoice.total).toLocaleString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap"><span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>{invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}</span></td>
                        <td className="px-6 py-4 whitespace-nowrap">{invoice.aiExtracted && <div className="flex items-center text-xs text-green-600"><svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>{invoice.aiConfidence ? `${(Number(invoice.aiConfidence) * 100).toFixed(0)}%` : 'AI'}</div>}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {showUploadModal && (
        <div role="dialog" aria-modal="true" aria-label="Upload Invoice" className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-sf-navy font-heading tracking-wide">Upload Invoice — AI Processing</h3>
                <button onClick={() => { setShowUploadModal(false); setExtractedData(null); setUploading(false); setProcessing(false) }} className="text-gray-400 hover:text-gray-600"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
              </div>
            </div>
            <div className="p-6">
              {!extractedData && !uploading && !processing && (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                  <p className="mt-4 text-lg font-medium text-gray-900">Drop invoice image here or</p>
                  <label className="mt-2 inline-block px-6 py-3 bg-sf-orange text-white rounded-lg hover:bg-sf-orange-dark cursor-pointer font-medium">Browse Files
                    <input type="file" className="hidden" accept="image/*,.pdf" onChange={handleFileUpload} />
                  </label>
                  <p className="mt-4 text-sm text-gray-500">AI will automatically extract vendor, amounts, line items, and more</p>
                </div>
              )}
              {uploading && <div className="text-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sf-orange mx-auto"></div><p className="mt-4 text-lg font-medium text-gray-900">Uploading invoice...</p></div>}
              {processing && (
                <div className="text-center py-12">
                  <div className="animate-pulse"><svg className="mx-auto h-16 w-16 text-sf-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg></div>
                  <p className="mt-4 text-lg font-medium text-gray-900">AI is extracting data...</p>
                  <p className="mt-2 text-sm text-gray-500">Reading invoice, identifying vendor, extracting line items...</p>
                </div>
              )}
              {extractedData && (
                <div className="space-y-6">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center"><svg className="h-6 w-6 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg><div><p className="font-semibold text-green-900">AI Extraction Complete!</p><p className="text-sm text-green-700">Confidence: {(extractedData.confidence * 100).toFixed(0)}%</p></div></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label htmlFor="inv-vendor" className="block text-sm font-medium text-gray-700 mb-1">Vendor</label><input id="inv-vendor" type="text" value={extractedData.vendor} className="w-full px-3 py-2 border border-gray-300 rounded-lg" readOnly /></div>
                    <div><label htmlFor="inv-number" className="block text-sm font-medium text-gray-700 mb-1">Invoice #</label><input id="inv-number" type="text" value={extractedData.invoiceNumber} className="w-full px-3 py-2 border border-gray-300 rounded-lg" readOnly /></div>
                    <div><label htmlFor="inv-date" className="block text-sm font-medium text-gray-700 mb-1">Invoice Date</label><input id="inv-date" type="date" value={extractedData.invoiceDate} className="w-full px-3 py-2 border border-gray-300 rounded-lg" /></div>
                    <div><label htmlFor="inv-due" className="block text-sm font-medium text-gray-700 mb-1">Due Date</label><input id="inv-due" type="date" value={extractedData.dueDate} className="w-full px-3 py-2 border border-gray-300 rounded-lg" /></div>
                    <div><label htmlFor="inv-category" className="block text-sm font-medium text-gray-700 mb-1">Category</label><select id="inv-category" className="w-full px-3 py-2 border border-gray-300 rounded-lg"><option value="materials">Materials</option><option value="labor">Labor</option><option value="equipment">Equipment</option><option value="other">Other</option></select></div>
                    <div><label htmlFor="inv-project" className="block text-sm font-medium text-gray-700 mb-1">Project</label><select id="inv-project" value={selectedProject} onChange={(e) => setSelectedProject(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg"><option value="">Select Project</option>{projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select></div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Line Items</h4>
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50"><tr><th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Description</th><th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Qty</th><th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Unit Price</th><th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Amount</th></tr></thead>
                        <tbody className="divide-y divide-gray-200">{extractedData.lineItems.map((item: any, idx: number) => (<tr key={idx}><td className="px-3 py-2 text-gray-900">{item.description}</td><td className="px-3 py-2 text-gray-500">{item.quantity}</td><td className="px-3 py-2 text-gray-500">${item.unitPrice.toFixed(2)}</td><td className="px-3 py-2 font-semibold text-gray-900">${item.amount.toFixed(2)}</td></tr>))}</tbody>
                      </table>
                    </div>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                    <div className="text-right"><div className="flex justify-between mb-1"><span className="text-gray-500">Subtotal:</span><span className="font-semibold ml-8">${extractedData.subtotal.toFixed(2)}</span></div><div className="flex justify-between mb-1"><span className="text-gray-500">Tax:</span><span className="font-semibold ml-8">${extractedData.tax.toFixed(2)}</span></div><div className="flex justify-between text-lg"><span className="font-bold text-gray-900">Total:</span><span className="font-bold text-gray-900 ml-8">${extractedData.total.toFixed(2)}</span></div></div>
                  </div>
                  <div className="flex space-x-3">
                    <button onClick={handleSaveInvoice} className="flex-1 px-6 py-3 bg-sf-orange text-white rounded-lg hover:bg-sf-orange-dark font-bold font-heading tracking-wide">Save & Sync to QuickBooks</button>
                    <button onClick={() => setExtractedData(null)} className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">Cancel</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showSuccessToast && (
        <div className="fixed bottom-4 right-4 bg-green-600 text-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3 animate-slide-up z-50">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
          <div><p className="font-semibold">Invoice Saved!</p><p className="text-sm">Synced with QuickBooks</p></div>
        </div>
      )}

      <DemoTour />
      <AIChatbot />
    </div>
  )
}
