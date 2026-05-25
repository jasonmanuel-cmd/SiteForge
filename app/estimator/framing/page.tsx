'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

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
  const [isCalculating, setIsCalculating] = useState(false)
  const [result, setResult] = useState<EstimateResult | null>(null)

  // Form inputs
  const [projectType, setProjectType] = useState('residential')
  const [wallLength, setWallLength] = useState('')
  const [wallHeight, setWallHeight] = useState('8')
  const [studSpacing, setStudSpacing] = useState('16')
  const [plateType, setPlateType] = useState('single')
  const [location, setLocation] = useState('california')
  const [markup, setMarkup] = useState('25')

  const calculateEstimate = async () => {
    setIsCalculating(true)

    // Simulate AI calculation delay
    await new Promise(resolve => setTimeout(resolve, 2000))

    const length = parseFloat(wallLength) || 0
    const height = parseFloat(wallHeight) || 8
    const spacing = parseFloat(studSpacing) || 16
    const markupPercent = parseFloat(markup) || 25

    // Calculate studs needed
    const studsNeeded = Math.ceil((length * 12) / spacing) + 1

    // Calculate plates (top, bottom, and optional double top)
    const platesNeeded = plateType === 'double' ? 3 : 2
    const plateLength = length * platesNeeded

    // Material costs (regional pricing for California)
    const studCost = 8.50 // per stud (2x4x8)
    const plateCost = 10.50 // per 2x4x12
    const nailsCost = 45.00 // box
    const miscCost = 75.00 // shims, etc

    const materials = [
      {
        item: `2x4x${height}' Studs`,
        quantity: studsNeeded,
        unit: 'ea',
        unitCost: studCost,
        total: studsNeeded * studCost
      },
      {
        item: `2x4x12' Plates (${plateType})`,
        quantity: Math.ceil(plateLength / 12),
        unit: 'ea',
        unitCost: plateCost,
        total: Math.ceil(plateLength / 12) * plateCost
      },
      {
        item: '16d Nails (Box)',
        quantity: 2,
        unit: 'box',
        unitCost: nailsCost,
        total: nailsCost * 2
      },
      {
        item: 'Misc Hardware',
        quantity: 1,
        unit: 'lot',
        unitCost: miscCost,
        total: miscCost
      }
    ]

    // Labor calculation (0.75 hrs per linear foot for framing)
    const laborHours = length * 0.75
    const laborRate = 85.00 // per hour (California rate)
    const laborTotal = laborHours * laborRate

    const materialsSubtotal = materials.reduce((sum, item) => sum + item.total, 0)
    const subtotal = materialsSubtotal + laborTotal
    const markupAmount = subtotal * (markupPercent / 100)
    const taxAmount = (subtotal + markupAmount) * 0.0875 // CA tax
    const total = subtotal + markupAmount + taxAmount

    setResult({
      materials,
      labor: {
        hours: Math.round(laborHours * 10) / 10,
        rate: laborRate,
        total: laborTotal
      },
      subtotal,
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
      inputs: {
        wallLength: parseFloat(wallLength),
        wallHeight: parseFloat(wallHeight),
        studSpacing: parseFloat(studSpacing),
        plateType,
        location
      },
      result,
      createdAt: new Date().toISOString()
    }

    // Save to localStorage
    const saved = JSON.parse(localStorage.getItem('estimates') || '[]')
    saved.push(estimate)
    localStorage.setItem('estimates', JSON.stringify(saved))

    alert('Estimate saved! View it in "My Estimates"')
    router.push('/estimates')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar Navigation */}
      <div className="fixed inset-y-0 left-0 w-64 bg-gray-900 text-white">
        <div className="flex flex-col h-full">
          <div className="p-6">
            <h1 className="text-xl font-bold">Construction SaaS</h1>
            <p className="text-sm text-gray-400 mt-1">Framing Estimator</p>
          </div>

          <nav className="flex-1 px-4 space-y-2">
            <Link href="/dashboard" className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors">
              <span>← Dashboard</span>
            </Link>
            <Link href="/estimator" className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors">
              <span>← All Trades</span>
            </Link>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64">
        <main className="px-8 py-6 max-w-6xl">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-2">
              <span className="text-5xl">🔨</span>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Framing Estimator</h2>
                <p className="text-gray-600">AI-powered residential & commercial framing estimates</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Form */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Project Details</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Type
                  </label>
                  <select
                    value={projectType}
                    onChange={(e) => setProjectType(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="residential">Residential</option>
                    <option value="commercial">Commercial</option>
                    <option value="multi-family">Multi-Family</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Wall Length (linear feet) *
                  </label>
                  <input
                    type="number"
                    value={wallLength}
                    onChange={(e) => setWallLength(e.target.value)}
                    placeholder="50"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Wall Height (feet)
                  </label>
                  <select
                    value={wallHeight}
                    onChange={(e) => setWallHeight(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="8">8 ft (Standard)</option>
                    <option value="9">9 ft</option>
                    <option value="10">10 ft</option>
                    <option value="12">12 ft</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stud Spacing (on center)
                  </label>
                  <select
                    value={studSpacing}
                    onChange={(e) => setStudSpacing(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="16">16" OC (Standard)</option>
                    <option value="12">12" OC (Load-bearing)</option>
                    <option value="24">24" OC (Non-load)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Plate Configuration
                  </label>
                  <select
                    value={plateType}
                    onChange={(e) => setPlateType(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="single">Single Top Plate</option>
                    <option value="double">Double Top Plate</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location (for material pricing)
                  </label>
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="california">California</option>
                    <option value="texas">Texas</option>
                    <option value="florida">Florida</option>
                    <option value="newyork">New York</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Markup (%)
                  </label>
                  <input
                    type="number"
                    value={markup}
                    onChange={(e) => setMarkup(e.target.value)}
                    placeholder="25"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <button
                  onClick={calculateEstimate}
                  disabled={!wallLength || isCalculating}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold text-lg"
                >
                  {isCalculating ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Calculating...
                    </span>
                  ) : (
                    '🤖 Calculate with AI'
                  )}
                </button>
              </div>
            </div>

            {/* Results */}
            <div>
              {result ? (
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center justify-between">
                    <span>Estimate Results</span>
                    <span className="text-sm font-normal text-green-600 bg-green-100 px-3 py-1 rounded-full">
                      ✓ AI Calculated
                    </span>
                  </h3>

                  {/* Materials */}
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

                  {/* Labor */}
                  <div className="mb-6 pb-6 border-b border-gray-200">
                    <h4 className="font-semibold text-gray-700 mb-3">Labor</h4>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {result.labor.hours} hrs @ ${result.labor.rate}/hr
                      </span>
                      <span className="font-semibold">${result.labor.total.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Totals */}
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
                      <span className="text-blue-600">${result.total.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-6 space-y-3">
                    <button
                      onClick={handleSaveEstimate}
                      className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
                    >
                      💾 Save Estimate
                    </button>
                    <button
                      onClick={() => window.print()}
                      className="w-full bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 transition-colors font-medium"
                    >
                      🖨️ Print PDF
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-lg p-12 border border-gray-200 text-center">
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
