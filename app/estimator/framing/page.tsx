'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import { useAuth } from '@/lib/useAuth'

interface EstimateResult {
  materials: Array<{ item: string; quantity: number; unit: string; unitCost: number; total: number }>
  labor: { hours: number; rate: number; total: number }
  subtotal: number
  markup: number
  tax: number
  total: number
}

export default function FramingEstimatorPage() {
  const router = useRouter()
  const { user, account, isDemo, loading, logout } = useAuth()
  const [isCalculating, setIsCalculating] = useState(false)
  const [result, setResult] = useState<EstimateResult | null>(null)

  const [projectType, setProjectType] = useState('residential')
  const [wallLength, setWallLength] = useState('')
  const [wallHeight, setWallHeight] = useState('8')
  const [studSpacing, setStudSpacing] = useState('16')
  const [plateType, setPlateType] = useState('single')
  const [location, setLocation] = useState('california')
  const [markup, setMarkup] = useState('25')

  const calculateEstimate = () => {
    setIsCalculating(true)

    const length = parseFloat(wallLength) || 0
    const height = parseFloat(wallHeight) || 8
    const spacing = parseFloat(studSpacing) || 16
    const markupPercent = parseFloat(markup) || 25

    const isDouble = plateType === 'double'
    const waste = 1.10

    const studsNeeded = Math.ceil((length * 12) / spacing) + 1
    const platesNeeded = isDouble ? 3 : 2
    const plateQty = Math.ceil((length * platesNeeded) / 12)

    const materials = [
      { item: `2×4 Studs`, quantity: Math.ceil(studsNeeded * waste), unit: 'ea', unitCost: 4.50, total: 0 },
      { item: `2×4 PT Plates`, quantity: Math.ceil(plateQty * waste), unit: 'ea', unitCost: 5.80, total: 0 },
      { item: '16d Nails (5lb box)', quantity: Math.max(1, Math.ceil(length / 200 * waste)), unit: 'box', unitCost: 12.00, total: 0 },
      { item: 'Simpson Hangers & Ties', quantity: Math.ceil(studsNeeded * 0.3), unit: 'ea', unitCost: 1.25, total: 0 },
      { item: 'Misc Hardware', quantity: 1, unit: 'lot', unitCost: 55.00, total: 0 },
    ]
    materials.forEach(m => { m.total = Math.round(m.quantity * m.unitCost * 100) / 100 })

    const laborHours = length * 0.1
    const laborRate = 85.00
    const laborTotal = Math.round(laborHours * laborRate * 100) / 100

    const matTotal = materials.reduce((sum, m) => sum + m.total, 0)
    const textbookBaseCost = matTotal + laborTotal
    const markupAmount = Math.round(textbookBaseCost * (markupPercent / 100) * 100) / 100
    const projectSubtotal = textbookBaseCost + markupAmount
    const taxAmount = Math.round(matTotal * 0.0875 * 100) / 100
    const total = Math.round((projectSubtotal + taxAmount) * 100) / 100

    setResult({
      materials,
      labor: { hours: Math.round(laborHours * 10) / 10, rate: laborRate, total: laborTotal },
      subtotal: Math.round(textbookBaseCost * 100) / 100,
      markup: markupAmount,
      tax: taxAmount,
      total
    })

    setIsCalculating(false)
  }

  const handleSaveEstimate = () => {
    if (!result) return
    const estimate = {
      id: 'est-' + Date.now(),
      trade: 'framing',
      projectType,
      inputs: { wallLength: parseFloat(wallLength), wallHeight: parseFloat(wallHeight), studSpacing: parseFloat(studSpacing), plateType, location },
      result,
      createdAt: new Date().toISOString()
    }
    const saved = JSON.parse(localStorage.getItem('estimates') || '[]')
    saved.push(estimate)
    localStorage.setItem('estimates', JSON.stringify(saved))
    alert('Estimate saved! View it in "My Estimates"')
    router.push('/estimates')
  }

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center bg-sf-navy-dark"><div className="text-sf-orange font-semibold animate-pulse">Loading SiteForge...</div></div>
  }

  return (
    <div className="min-h-screen bg-sf-cream">
      <Sidebar currentPath="/estimator" user={user} account={account} onLogout={logout} isDemo={isDemo} />

      <div className="ml-64 blueprint-bg min-h-screen relative">
        <main className="px-8 py-6 max-w-6xl relative z-10">
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-2">
              <span className="text-5xl">🔨</span>
              <div>
                <h1 className="text-3xl font-bold text-sf-navy font-heading tracking-wide">Framing Estimator</h1>
                <p className="text-gray-500">AI-powered residential & commercial framing estimates</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
              <h3 className="text-xl font-bold text-sf-navy font-heading tracking-wide mb-6">Project Details</h3>

              <div className="space-y-4">
                <div>
                  <label htmlFor="frame-project-type" className="block text-sm font-medium text-gray-700 mb-2">Project Type</label>
                  <select id="frame-project-type" value={projectType} onChange={(e) => setProjectType(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sf-orange focus:border-sf-orange outline-none">
                    <option value="residential">Residential</option>
                    <option value="commercial">Commercial</option>
                    <option value="multi-family">Multi-Family</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="frame-wall-length" className="block text-sm font-medium text-gray-700 mb-2">Wall Length (linear feet) *</label>
                  <input id="frame-wall-length" type="number" value={wallLength} onChange={(e) => setWallLength(e.target.value)} placeholder="50"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sf-orange focus:border-sf-orange outline-none" required />
                </div>

                <div>
                  <label htmlFor="frame-wall-height" className="block text-sm font-medium text-gray-700 mb-2">Wall Height (feet)</label>
                  <select id="frame-wall-height" value={wallHeight} onChange={(e) => setWallHeight(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sf-orange focus:border-sf-orange outline-none">
                    <option value="8">8 ft (Standard)</option>
                    <option value="9">9 ft</option>
                    <option value="10">10 ft</option>
                    <option value="12">12 ft</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="frame-stud-spacing" className="block text-sm font-medium text-gray-700 mb-2">Stud Spacing (on center)</label>
                  <select id="frame-stud-spacing" value={studSpacing} onChange={(e) => setStudSpacing(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sf-orange focus:border-sf-orange outline-none">
                    <option value="16">16" OC (Standard)</option>
                    <option value="12">12" OC (Load-bearing)</option>
                    <option value="24">24" OC (Non-load)</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="frame-plate-config" className="block text-sm font-medium text-gray-700 mb-2">Plate Configuration</label>
                  <select id="frame-plate-config" value={plateType} onChange={(e) => setPlateType(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sf-orange focus:border-sf-orange outline-none">
                    <option value="single">Single Top Plate</option>
                    <option value="double">Double Top Plate</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="frame-location" className="block text-sm font-medium text-gray-700 mb-2">Location (for material pricing)</label>
                  <select id="frame-location" value={location} onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sf-orange focus:border-sf-orange outline-none">
                    <option value="california">California</option>
                    <option value="texas">Texas</option>
                    <option value="florida">Florida</option>
                    <option value="newyork">New York</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="frame-markup" className="block text-sm font-medium text-gray-700 mb-2">Markup (%)</label>
                  <input id="frame-markup" type="number" value={markup} onChange={(e) => setMarkup(e.target.value)} placeholder="25"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sf-orange focus:border-sf-orange outline-none" />
                </div>

                <button
                  onClick={calculateEstimate}
                  disabled={!wallLength || isCalculating}
                  className="w-full bg-sf-orange text-white py-3 rounded-lg hover:bg-sf-orange-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold text-lg font-heading tracking-wide shadow-sm"
                >
                  {isCalculating ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Calculating...
                    </span>
                  ) : '🤖 Calculate with AI'}
                </button>
              </div>
            </div>

            <div>
              {result ? (
                <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
                  <h3 className="text-xl font-bold text-sf-navy font-heading tracking-wide mb-6 flex items-center justify-between">
                    <span>Estimate Results</span>
                    <span className="text-sm font-normal text-green-600 bg-green-100 px-3 py-1 rounded-full">
                      ✓ AI Calculated
                    </span>
                  </h3>

                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-700 mb-3">Materials</h4>
                    <div className="space-y-2">
                      {result.materials.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-sm">
                          <span className="text-gray-600">
                            {item.item} ({item.quantity} {item.unit} @ ${item.unitCost.toFixed(2)})
                          </span>
                          <span className="font-semibold">${item.total.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6 pb-6 border-b border-gray-200">
                    <h4 className="font-semibold text-gray-700 mb-3">Labor</h4>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">{result.labor.hours} hrs @ ${result.labor.rate}/hr</span>
                      <span className="font-semibold">${result.labor.total.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-semibold">${result.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Markup ({markup}%)</span>
                      <span className="font-semibold">${result.markup.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Tax (8.75%)</span>
                      <span className="font-semibold">${result.tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold pt-3 border-t-2 border-gray-300">
                      <span>Total</span>
                      <span className="text-sf-orange">${result.total.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="mt-6 space-y-3">
                    <button onClick={handleSaveEstimate} className="w-full bg-sf-navy text-white py-2 rounded-lg hover:bg-sf-navy-light transition-colors font-medium">
                      💾 Save Estimate
                    </button>
                    <button onClick={() => window.print()} className="w-full bg-sf-cream text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors font-medium">
                      🖨️ Print PDF
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-sm p-12 border border-gray-200 text-center">
                  <svg className="w-24 h-24 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <p className="text-gray-500 text-lg">Enter project details and click "Calculate with AI" to see your estimate</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
