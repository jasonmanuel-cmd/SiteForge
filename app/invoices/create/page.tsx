'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface LineItem {
  description: string
  quantity: number
  unitPrice: number
  amount: number
}

export default function CreateInvoicePage() {
  const router = useRouter()
  const [saved, setSaved] = useState(false)

  const [form, setForm] = useState({
    clientName: '',
    clientEmail: '',
    clientAddress: '',
    projectName: '',
    invoiceNumber: 'INV-' + Date.now().toString().slice(-6),
    invoiceDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
    notes: '',
    terms: 'Net 30 - Payment due within 30 days of invoice date.',
    taxRate: '8.75',
  })

  const [lineItems, setLineItems] = useState<LineItem[]>([
    { description: '', quantity: 1, unitPrice: 0, amount: 0 }
  ])

  const updateLine = (i: number, field: keyof LineItem, value: string | number) => {
    const updated = [...lineItems]
    updated[i] = { ...updated[i], [field]: value }
    if (field === 'quantity' || field === 'unitPrice') {
      updated[i].amount = Number(updated[i].quantity) * Number(updated[i].unitPrice)
    }
    setLineItems(updated)
  }

  const addLine = () => setLineItems([...lineItems, { description: '', quantity: 1, unitPrice: 0, amount: 0 }])
  const removeLine = (i: number) => setLineItems(lineItems.filter((_, idx) => idx !== i))

  const subtotal = lineItems.reduce((s, l) => s + l.amount, 0)
  const tax = subtotal * (parseFloat(form.taxRate) / 100)
  const total = subtotal + tax

  const handleSave = (status: 'draft' | 'sent') => {
    const invoice = {
      id: 'inv-' + Date.now(),
      ...form,
      lineItems,
      subtotal,
      tax,
      total,
      status,
      createdAt: new Date().toISOString(),
    }
    const all = JSON.parse(localStorage.getItem('createdInvoices') || '[]')
    all.unshift(invoice)
    localStorage.setItem('createdInvoices', JSON.stringify(all))
    setSaved(true)
    setTimeout(() => router.push('/invoices'), 1200)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="fixed inset-y-0 left-0 w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-6">
          <h1 className="text-xl font-bold">Construction SaaS</h1>
          <p className="text-sm text-gray-400 mt-1">Create Invoice</p>
        </div>
        <nav className="flex-1 px-4 space-y-1">
          <Link href="/dashboard" className="flex items-center px-4 py-2.5 text-gray-300 hover:bg-gray-800 rounded-lg text-sm">🏠 Dashboard</Link>
          <Link href="/invoices" className="flex items-center px-4 py-2.5 text-gray-300 hover:bg-gray-800 rounded-lg text-sm">← Back to Invoices</Link>
        </nav>
      </div>

      <div className="ml-64">
        <main className="px-8 py-6 max-w-5xl">
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Create Invoice</h2>
              <p className="text-gray-500">Invoice #{form.invoiceNumber}</p>
            </div>
            {saved && (
              <div className="bg-green-100 text-green-700 px-4 py-2 rounded-lg font-medium">
                ✓ Invoice Saved! Redirecting...
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Client Info */}
              <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-4">Client Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Client Name *</label>
                    <input
                      type="text"
                      value={form.clientName}
                      onChange={e => setForm({ ...form, clientName: e.target.value })}
                      placeholder="ABC Corporation"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Client Email</label>
                    <input
                      type="email"
                      value={form.clientEmail}
                      onChange={e => setForm({ ...form, clientEmail: e.target.value })}
                      placeholder="client@company.com"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Client Address</label>
                    <input
                      type="text"
                      value={form.clientAddress}
                      onChange={e => setForm({ ...form, clientAddress: e.target.value })}
                      placeholder="123 Main St, City, CA 90210"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Project / Description</label>
                    <input
                      type="text"
                      value={form.projectName}
                      onChange={e => setForm({ ...form, projectName: e.target.value })}
                      placeholder="Office Renovation - Phase 1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Line Items */}
              <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-4">Line Items</h3>
                <div className="space-y-3">
                  <div className="grid grid-cols-12 gap-2 text-xs font-semibold text-gray-500 uppercase px-2">
                    <span className="col-span-5">Description</span>
                    <span className="col-span-2 text-right">Qty</span>
                    <span className="col-span-2 text-right">Unit Price</span>
                    <span className="col-span-2 text-right">Amount</span>
                    <span className="col-span-1"></span>
                  </div>
                  {lineItems.map((item, i) => (
                    <div key={i} className="grid grid-cols-12 gap-2 items-center">
                      <input
                        className="col-span-5 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Description of work or materials"
                        value={item.description}
                        onChange={e => updateLine(i, 'description', e.target.value)}
                      />
                      <input
                        className="col-span-2 px-3 py-2 border border-gray-300 rounded-lg text-sm text-right focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        type="number"
                        value={item.quantity}
                        onChange={e => updateLine(i, 'quantity', parseFloat(e.target.value) || 0)}
                      />
                      <input
                        className="col-span-2 px-3 py-2 border border-gray-300 rounded-lg text-sm text-right focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        type="number"
                        value={item.unitPrice}
                        onChange={e => updateLine(i, 'unitPrice', parseFloat(e.target.value) || 0)}
                      />
                      <div className="col-span-2 text-right font-semibold text-gray-900 text-sm">
                        ${item.amount.toFixed(2)}
                      </div>
                      <button
                        onClick={() => removeLine(i)}
                        className="col-span-1 text-red-400 hover:text-red-600 text-center"
                      >✕</button>
                    </div>
                  ))}
                  <button
                    onClick={addLine}
                    className="w-full py-2 border-2 border-dashed border-gray-300 text-gray-500 hover:border-blue-400 hover:text-blue-500 rounded-lg text-sm font-medium transition-colors"
                  >
                    + Add Line Item
                  </button>
                </div>
              </div>

              {/* Notes */}
              <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-4">Notes & Terms</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes to Client</label>
                    <textarea
                      value={form.notes}
                      onChange={e => setForm({ ...form, notes: e.target.value })}
                      placeholder="Thank you for your business!"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Payment Terms</label>
                    <input
                      type="text"
                      value={form.terms}
                      onChange={e => setForm({ ...form, terms: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Side Panel */}
            <div className="space-y-6">
              {/* Invoice Details */}
              <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-4">Invoice Details</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Invoice #</label>
                    <input
                      type="text"
                      value={form.invoiceNumber}
                      onChange={e => setForm({ ...form, invoiceNumber: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Invoice Date</label>
                    <input type="date" value={form.invoiceDate} onChange={e => setForm({ ...form, invoiceDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                    <input type="date" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tax Rate (%)</label>
                    <input type="number" value={form.taxRate} onChange={e => setForm({ ...form, taxRate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm" />
                  </div>
                </div>
              </div>

              {/* Totals */}
              <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-4">Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span><span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax ({form.taxRate}%)</span><span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold border-t pt-2 mt-2">
                    <span>Total</span>
                    <span className="text-blue-600">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <button
                  onClick={() => handleSave('sent')}
                  disabled={!form.clientName || saved}
                  className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg"
                >
                  📤 Send Invoice
                </button>
                <button
                  onClick={() => handleSave('draft')}
                  disabled={saved}
                  className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                >
                  💾 Save as Draft
                </button>
                <button
                  onClick={() => window.print()}
                  className="w-full bg-white border border-gray-300 text-gray-600 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                >
                  🖨️ Print / PDF
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
