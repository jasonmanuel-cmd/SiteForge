'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import AIChatbot from '@/components/AIChatbot'

const TRADE_CONFIG: Record<string, {
  name: string; icon: string; color: string;
  fields: Array<{ key: string; label: string; type: 'number' | 'select' | 'text'; options?: string[]; placeholder?: string; unit?: string; default?: string }>
}> = {
  framing: {
    name: 'Framing', icon: '🔨', color: 'blue',
    fields: [
      { key: 'linearFeet', label: 'Wall Length', type: 'number', placeholder: '50', unit: 'linear ft' },
      { key: 'wallHeight', label: 'Wall Height', type: 'select', options: ["8'", "9'", "10'", "12'"], default: "8'" },
      { key: 'studSpacing', label: 'Stud Spacing', type: 'select', options: ['16" OC', '12" OC', '24" OC'], default: '16" OC' },
      { key: 'plateType', label: 'Top Plate', type: 'select', options: ['Single', 'Double'], default: 'Single' },
    ]
  },
  drywall: {
    name: 'Drywall', icon: '🧱', color: 'orange',
    fields: [
      { key: 'squareFeet', label: 'Total Square Footage', type: 'number', placeholder: '1200', unit: 'sq ft' },
      { key: 'finishLevel', label: 'Finish Level', type: 'select', options: ['Level 1 (Fire tape)', 'Level 3 (Primer ready)', 'Level 4 (Standard)', 'Level 5 (Smooth)'], default: 'Level 4 (Standard)' },
      { key: 'ceilings', label: 'Includes Ceilings?', type: 'select', options: ['Yes', 'No'], default: 'Yes' },
    ]
  },
  concrete: {
    name: 'Concrete', icon: '🏗️', color: 'gray',
    fields: [
      { key: 'squareFeet', label: 'Slab Area', type: 'number', placeholder: '500', unit: 'sq ft' },
      { key: 'depth', label: 'Thickness', type: 'select', options: ['4"', '6"', '8"', '12"'], default: '4"' },
      { key: 'psi', label: 'Concrete Mix', type: 'select', options: ['2500 PSI', '3000 PSI', '4000 PSI', '5000 PSI'], default: '3000 PSI' },
      { key: 'rebar', label: 'Reinforcement', type: 'select', options: ['None', 'Wire Mesh', '#4 Rebar Grid', '#5 Rebar Grid'], default: 'Wire Mesh' },
    ]
  },
  painting: {
    name: 'Painting', icon: '🎨', color: 'pink',
    fields: [
      { key: 'squareFeet', label: 'Surface Area', type: 'number', placeholder: '1800', unit: 'sq ft' },
      { key: 'coats', label: 'Number of Coats', type: 'select', options: ['1', '2', '3'], default: '2' },
      { key: 'quality', label: 'Paint Quality', type: 'select', options: ['Economy', 'Standard', 'Premium', 'Luxury'], default: 'Premium' },
      { key: 'surface', label: 'Surface Type', type: 'select', options: ['Drywall', 'Wood', 'Stucco', 'Masonry'], default: 'Drywall' },
    ]
  },
  electrical: {
    name: 'Electrical', icon: '⚡', color: 'yellow',
    fields: [
      { key: 'squareFeet', label: 'Square Footage', type: 'number', placeholder: '2000', unit: 'sq ft' },
      { key: 'outlets', label: 'Number of Outlets/Switches', type: 'number', placeholder: '30', unit: 'ea' },
      { key: 'circuits', label: 'Number of New Circuits', type: 'number', placeholder: '8', unit: 'ea' },
      { key: 'panelUpgrade', label: 'Panel Upgrade?', type: 'select', options: ['No', 'Yes - 100A', 'Yes - 200A', 'Yes - 400A'], default: 'No' },
    ]
  },
  plumbing: {
    name: 'Plumbing', icon: '🚰', color: 'cyan',
    fields: [
      { key: 'fixtures', label: 'Number of Fixtures', type: 'number', placeholder: '5', unit: 'ea' },
      { key: 'pipeType', label: 'Pipe Material', type: 'select', options: ['PEX', 'Copper', 'PVC', 'CPVC'], default: 'PEX' },
      { key: 'jobType', label: 'Job Type', type: 'select', options: ['Rough-in new', 'Retrofit/replace', 'Repair', 'Add fixtures'], default: 'Rough-in new' },
      { key: 'waterHeater', label: 'Water Heater?', type: 'select', options: ['No', 'Yes - 40gal', 'Yes - 50gal', 'Yes - Tankless'], default: 'No' },
    ]
  },
  roofing: {
    name: 'Roofing', icon: '🏠', color: 'red',
    fields: [
      { key: 'squareFeet', label: 'Roof Area', type: 'number', placeholder: '2200', unit: 'sq ft' },
      { key: 'pitch', label: 'Roof Pitch', type: 'select', options: ['4/12 (Low)', '6/12 (Medium)', '8/12 (Steep)', '12/12 (Very Steep)'], default: '6/12 (Medium)' },
      { key: 'material', label: 'Roofing Material', type: 'select', options: ['3-Tab Shingles', 'Architectural Shingles', 'Metal Roofing', 'Tile'], default: 'Architectural Shingles' },
      { key: 'tearOff', label: 'Tear-off Required?', type: 'select', options: ['No (new construction)', 'Yes - 1 layer', 'Yes - 2+ layers'], default: 'Yes - 1 layer' },
    ]
  },
  landscaping: {
    name: 'Landscaping', icon: '🌳', color: 'green',
    fields: [
      { key: 'squareFeet', label: 'Total Area', type: 'number', placeholder: '2000', unit: 'sq ft' },
      { key: 'scope', label: 'Scope of Work', type: 'select', options: ['Lawn only', 'Full landscape', 'Hardscape only', 'Irrigation only'], default: 'Full landscape' },
      { key: 'grading', label: 'Grading Required?', type: 'select', options: ['No', 'Minor', 'Moderate', 'Extensive'], default: 'Minor' },
      { key: 'irrigation', label: 'Irrigation System?', type: 'select', options: ['None', 'Drip only', 'Full system'], default: 'Full system' },
    ]
  },
}

const LOCATIONS = ['California', 'Texas', 'Florida', 'New York', 'Arizona', 'Nevada', 'Washington', 'Oregon', 'Colorado', 'Illinois']

export default function TradeEstimatorPage() {
  const params = useParams()
  const router = useRouter()
  const trade = params.trade as string

  const config = TRADE_CONFIG[trade]

  const [inputs, setInputs] = useState<Record<string, string>>(() => {
    const defaults: Record<string, string> = { location: 'California', markup: '25', projectType: 'residential' }
    config?.fields.forEach(f => { if (f.default) defaults[f.key] = f.default })
    return defaults
  })
  const [isCalculating, setIsCalculating] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  if (!config) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Trade not found</h2>
          <Link href="/estimator" className="text-blue-600 hover:underline">← Back to Estimator</Link>
        </div>
      </div>
    )
  }

  const calculate = async () => {
    const numericFields = config.fields.filter(f => f.type === 'number')
    if (numericFields.some(f => !inputs[f.key])) {
      setError('Please fill in all required fields.')
      return
    }
    setError('')
    setIsCalculating(true)
    setSaved(false)
    setResult(null)

    try {
      const res = await fetch('/api/estimator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trade, inputs }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Calculation failed')
      setResult(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsCalculating(false)
    }
  }

  const saveEstimate = () => {
    if (!result) return
    const estimate = {
      id: 'est-' + Date.now(),
      trade,
      tradeName: config.name,
      tradeIcon: config.icon,
      inputs,
      result,
      createdAt: new Date().toISOString(),
    }
    const all = JSON.parse(localStorage.getItem('estimates') || '[]')
    all.unshift(estimate)
    localStorage.setItem('estimates', JSON.stringify(all))
    setSaved(true)
  }

  const colorMap: Record<string, string> = {
    blue: 'bg-blue-600', orange: 'bg-orange-500', gray: 'bg-gray-600',
    pink: 'bg-pink-500', yellow: 'bg-yellow-500', cyan: 'bg-cyan-500',
    red: 'bg-red-500', green: 'bg-green-600'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-6">
          <h1 className="text-xl font-bold">Construction SaaS</h1>
          <p className="text-sm text-gray-400 mt-1">{config.name} Estimator</p>
        </div>
        <nav className="flex-1 px-4 space-y-1">
          <Link href="/dashboard" className="flex items-center px-4 py-2.5 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors text-sm">🏠 Dashboard</Link>
          <Link href="/estimator" className="flex items-center px-4 py-2.5 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors text-sm">🔧 All Trades</Link>
          <Link href="/estimates" className="flex items-center px-4 py-2.5 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors text-sm">📋 Saved Estimates</Link>
          <div className="pt-4 pb-2 px-4 text-xs text-gray-500 uppercase tracking-wider">Other Trades</div>
          {Object.entries(TRADE_CONFIG).filter(([id]) => id !== trade).map(([id, t]) => (
            <Link key={id} href={`/estimator/${id}`} className="flex items-center px-4 py-2 text-gray-400 hover:bg-gray-800 rounded-lg transition-colors text-sm">
              <span className="mr-2">{t.icon}</span>{t.name}
            </Link>
          ))}
        </nav>
      </div>

      {/* Main */}
      <div className="ml-64">
        <main className="px-8 py-6 max-w-6xl">
          {/* Header */}
          <div className="flex items-center space-x-4 mb-8">
            <div className={`w-16 h-16 ${colorMap[config.color]} rounded-2xl flex items-center justify-center text-4xl shadow-lg`}>
              {config.icon}
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">{config.name} Estimator</h2>
              <p className="text-gray-500">AI-powered estimates with real market pricing</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Form */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6 border border-gray-100 h-fit">
              <h3 className="text-lg font-bold text-gray-900 mb-5">Project Details</h3>

              <div className="space-y-4">
                {/* Trade-specific fields */}
                {config.fields.map(field => (
                  <div key={field.key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      {field.label} {field.unit && <span className="text-gray-400">({field.unit})</span>}
                    </label>
                    {field.type === 'select' ? (
                      <select
                        value={inputs[field.key] || field.default || ''}
                        onChange={e => setInputs({ ...inputs, [field.key]: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                      >
                        {field.options?.map(o => <option key={o}>{o}</option>)}
                      </select>
                    ) : (
                      <input
                        type="number"
                        value={inputs[field.key] || ''}
                        onChange={e => setInputs({ ...inputs, [field.key]: e.target.value })}
                        placeholder={field.placeholder}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    )}
                  </div>
                ))}

                {/* Common fields */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Location</label>
                  <select
                    value={inputs.location || 'California'}
                    onChange={e => setInputs({ ...inputs, location: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  >
                    {LOCATIONS.map(l => <option key={l}>{l}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Your Markup: <span className="text-blue-600 font-bold">{inputs.markup || 25}%</span>
                  </label>
                  <input
                    type="range"
                    min="10" max="60" step="5"
                    value={inputs.markup || 25}
                    onChange={e => setInputs({ ...inputs, markup: e.target.value })}
                    className="w-full accent-blue-600"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>10%</span><span>35%</span><span>60%</span>
                  </div>
                </div>

                {error && <p className="text-red-600 text-sm bg-red-50 rounded-lg px-3 py-2">{error}</p>}

                <button
                  onClick={calculate}
                  disabled={isCalculating}
                  className={`w-full ${colorMap[config.color]} text-white py-3.5 rounded-xl font-bold text-lg hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-lg`}
                >
                  {isCalculating ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Calculating...
                    </span>
                  ) : '🤖 Generate Estimate'}
                </button>
              </div>
            </div>

            {/* Results */}
            <div className="lg:col-span-3">
              {result ? (
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                  {/* Total banner */}
                  <div className={`${colorMap[config.color]} text-white rounded-xl p-5 mb-6 flex justify-between items-center`}>
                    <div>
                      <p className="text-white/80 text-sm font-medium">TOTAL ESTIMATE</p>
                      <p className="text-4xl font-bold">${result.total?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white/80 text-xs">{result.aiGenerated ? '🤖 AI Calculated' : '⚡ Instant Calc'}</p>
                      <p className="text-white/80 text-xs mt-1">{config.name} • {inputs.location}</p>
                    </div>
                  </div>

                  {/* Materials */}
                  <div className="mb-5">
                    <h4 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wider text-gray-500">Materials</h4>
                    <div className="space-y-2">
                      {result.materials?.map((item: any, i: number) => (
                        <div key={i} className="flex justify-between items-center py-2 border-b border-gray-50 text-sm">
                          <div className="flex-1">
                            <span className="text-gray-800 font-medium">{item.item}</span>
                            <span className="text-gray-400 text-xs ml-2">{item.quantity} {item.unit} × ${item.unitCost?.toFixed(2)}</span>
                          </div>
                          <span className="font-semibold text-gray-900">${item.total?.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Labor */}
                  <div className="mb-5 pb-5 border-b border-gray-200">
                    <h4 className="font-bold text-sm uppercase tracking-wider text-gray-500 mb-3">Labor</h4>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">{result.labor?.hours} hrs × ${result.labor?.rate}/hr</span>
                      <span className="font-semibold">${result.labor?.total?.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="space-y-2 mb-6">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Subtotal</span><span>${result.subtotal?.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Markup ({inputs.markup}%)</span><span>+${result.markup?.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Tax (8.75%)</span><span>+${result.tax?.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold border-t-2 pt-2">
                      <span>Total</span>
                      <span className={`text-${config.color}-600`}>${result.total?.toFixed(2)}</span>
                    </div>
                  </div>

                  {result.notes && (
                    <div className="bg-blue-50 rounded-lg p-3 mb-5 text-sm text-blue-800">
                      <span className="font-semibold">Note: </span>{result.notes}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={saveEstimate}
                      className={`py-2.5 rounded-xl font-medium text-sm transition-all ${saved ? 'bg-green-100 text-green-700' : 'bg-gray-900 text-white hover:bg-gray-800'}`}
                    >
                      {saved ? '✓ Saved!' : '💾 Save'}
                    </button>
                    <button
                      onClick={() => router.push('/estimates')}
                      className="py-2.5 bg-gray-100 text-gray-700 rounded-xl font-medium text-sm hover:bg-gray-200 transition-colors"
                    >
                      📋 My Estimates
                    </button>
                    <button
                      onClick={() => window.print()}
                      className="py-2.5 bg-blue-50 text-blue-700 rounded-xl font-medium text-sm hover:bg-blue-100 transition-colors"
                    >
                      🖨️ Print PDF
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-lg p-12 border border-gray-100 text-center">
                  <div className="text-8xl mb-4">{config.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Ready to estimate!</h3>
                  <p className="text-gray-500">Fill in the project details on the left and click "Generate Estimate" to get instant AI-powered pricing.</p>
                  <div className="mt-6 grid grid-cols-3 gap-4 text-sm text-gray-500">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="font-bold text-gray-900 mb-1">Accurate</div>
                      <div>Real market pricing updated regularly</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="font-bold text-gray-900 mb-1">Fast</div>
                      <div>Get estimates in under 10 seconds</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="font-bold text-gray-900 mb-1">Saveable</div>
                      <div>Save, print, and share instantly</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
      <AIChatbot />
    </div>
  )
}
