/**
 * AI Estimator API - Handles all trades via OpenAI
 */

import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const TRADE_PROMPTS: Record<string, string> = {
  framing: `You are an expert framing contractor. Calculate a detailed estimate for wall framing. Return ONLY JSON.`,
  drywall: `You are an expert drywall contractor. Calculate a detailed estimate for drywall installation. Return ONLY JSON.`,
  concrete: `You are an expert concrete contractor. Calculate a detailed estimate for concrete work. Return ONLY JSON.`,
  painting: `You are an expert painting contractor. Calculate a detailed estimate for painting work. Return ONLY JSON.`,
  electrical: `You are an expert electrician. Calculate a detailed estimate for electrical work. Return ONLY JSON.`,
  plumbing: `You are an expert plumber. Calculate a detailed estimate for plumbing work. Return ONLY JSON.`,
  roofing: `You are an expert roofing contractor. Calculate a detailed estimate for roofing work. Return ONLY JSON.`,
  landscaping: `You are an expert landscaping contractor. Calculate a detailed estimate for landscaping work. Return ONLY JSON.`,
}

const DEMO_ESTIMATES: Record<string, any> = {
  framing: (inputs: any) => {
    const len = parseFloat(inputs.linearFeet || inputs.squareFeet || 50)
    return buildResult([
      { item: `2x4x${inputs.wallHeight || 8}' Studs`, quantity: Math.ceil(len * 0.75), unit: 'ea', unitCost: 8.50 },
      { item: '2x4x12\' Plates', quantity: Math.ceil(len / 4), unit: 'ea', unitCost: 10.50 },
      { item: '16d Nails (Box)', quantity: 2, unit: 'box', unitCost: 45.00 },
      { item: 'Misc Hardware', quantity: 1, unit: 'lot', unitCost: 75.00 },
    ], len * 0.75, 85, inputs.markup || 25)
  },
  drywall: (inputs: any) => {
    const sqft = parseFloat(inputs.squareFeet || 500)
    return buildResult([
      { item: '1/2" Drywall Sheets', quantity: Math.ceil(sqft / 32), unit: 'sheet', unitCost: 18.50 },
      { item: 'Joint Compound (5 gal)', quantity: Math.ceil(sqft / 400), unit: 'bucket', unitCost: 28.00 },
      { item: 'Drywall Tape (500ft)', quantity: Math.ceil(sqft / 200), unit: 'roll', unitCost: 12.00 },
      { item: 'Drywall Screws (5lb)', quantity: Math.ceil(sqft / 200), unit: 'box', unitCost: 15.00 },
      { item: 'Corner Bead', quantity: Math.ceil(sqft / 100), unit: 'ea', unitCost: 4.50 },
    ], sqft * 0.055, 65, inputs.markup || 25)
  },
  concrete: (inputs: any) => {
    const sqft = parseFloat(inputs.squareFeet || 400)
    const depth = parseFloat(inputs.depth || 4) / 12
    const cyards = (sqft * depth) / 27
    return buildResult([
      { item: 'Ready-Mix Concrete', quantity: Math.ceil(cyards), unit: 'cy', unitCost: 175.00 },
      { item: '#4 Rebar (20ft sticks)', quantity: Math.ceil(sqft / 16), unit: 'ea', unitCost: 12.50 },
      { item: 'Wire Mesh (150sqft roll)', quantity: Math.ceil(sqft / 150), unit: 'roll', unitCost: 65.00 },
      { item: 'Form Boards (2x8x16)', quantity: Math.ceil(Math.sqrt(sqft) * 4 / 16), unit: 'ea', unitCost: 18.00 },
      { item: 'Curing Compound (5gal)', quantity: Math.ceil(sqft / 1000), unit: 'gal', unitCost: 55.00 },
    ], sqft * 0.12, 95, inputs.markup || 30)
  },
  painting: (inputs: any) => {
    const sqft = parseFloat(inputs.squareFeet || 600)
    const coats = parseInt(inputs.coats || 2)
    return buildResult([
      { item: 'Primer (1 gal = 400sqft)', quantity: Math.ceil(sqft / 400), unit: 'gal', unitCost: 35.00 },
      { item: `Paint - ${inputs.quality || 'Premium'} (1 gal = 350sqft)`, quantity: Math.ceil((sqft * coats) / 350), unit: 'gal', unitCost: 55.00 },
      { item: 'Roller Covers', quantity: Math.ceil(sqft / 500), unit: 'ea', unitCost: 8.00 },
      { item: 'Brushes (set)', quantity: 1, unit: 'set', unitCost: 35.00 },
      { item: 'Drop Cloths & Tape', quantity: 1, unit: 'lot', unitCost: 45.00 },
    ], sqft * 0.035 * coats, 55, inputs.markup || 30)
  },
  electrical: (inputs: any) => {
    const outlets = parseInt(inputs.outlets || 20)
    const circuits = parseInt(inputs.circuits || 5)
    return buildResult([
      { item: '14/2 Romex Wire (250ft)', quantity: Math.ceil((outlets * 25) / 250), unit: 'roll', unitCost: 85.00 },
      { item: 'Duplex Outlets', quantity: outlets, unit: 'ea', unitCost: 4.50 },
      { item: 'Single-Pole Breakers', quantity: circuits, unit: 'ea', unitCost: 12.00 },
      { item: 'Electrical Boxes', quantity: outlets + Math.ceil(outlets / 3), unit: 'ea', unitCost: 3.50 },
      { item: 'Wire Connectors (box)', quantity: 2, unit: 'box', unitCost: 8.50 },
      { item: 'Panel Hookup (labor only)', quantity: 1, unit: 'lot', unitCost: 250.00 },
    ], (outlets * 1.5) + (circuits * 3), 110, inputs.markup || 35)
  },
  plumbing: (inputs: any) => {
    const fixtures = parseInt(inputs.fixtures || 5)
    return buildResult([
      { item: '1/2" PEX Pipe (100ft)', quantity: Math.ceil(fixtures * 25 / 100), unit: 'roll', unitCost: 65.00 },
      { item: 'Fixture Connections', quantity: fixtures, unit: 'ea', unitCost: 35.00 },
      { item: 'Shutoff Valves', quantity: fixtures * 2, unit: 'ea', unitCost: 18.00 },
      { item: 'PEX Fittings (bag)', quantity: Math.ceil(fixtures * 3 / 25), unit: 'bag', unitCost: 45.00 },
      { item: 'Misc Supplies', quantity: 1, unit: 'lot', unitCost: 150.00 },
    ], fixtures * 4.5, 115, inputs.markup || 35)
  },
  roofing: (inputs: any) => {
    const sqft = parseFloat(inputs.squareFeet || 1800)
    const squares = sqft / 100
    return buildResult([
      { item: 'Architectural Shingles (sq)', quantity: Math.ceil(squares * 1.1), unit: 'sq', unitCost: 115.00 },
      { item: '30lb Felt Underlayment', quantity: Math.ceil(squares / 4), unit: 'roll', unitCost: 42.00 },
      { item: 'Drip Edge (10ft sticks)', quantity: Math.ceil(Math.sqrt(sqft) * 4 / 10), unit: 'ea', unitCost: 8.50 },
      { item: 'Ridge Cap (25ft)', quantity: Math.ceil(Math.sqrt(sqft) / 25), unit: 'bundle', unitCost: 65.00 },
      { item: 'Roofing Nails (5lb box)', quantity: Math.ceil(squares / 4), unit: 'box', unitCost: 22.00 },
      { item: 'Flashing Kit', quantity: 1, unit: 'kit', unitCost: 185.00 },
    ], squares * 2.5, 95, inputs.markup || 30)
  },
  landscaping: (inputs: any) => {
    const sqft = parseFloat(inputs.squareFeet || 1000)
    return buildResult([
      { item: 'Topsoil (cy)', quantity: Math.ceil(sqft * 0.1 / 27), unit: 'cy', unitCost: 55.00 },
      { item: 'Sod (pallet = 450sqft)', quantity: Math.ceil(sqft / 450), unit: 'pallet', unitCost: 285.00 },
      { item: 'Mulch (2" depth, cy)', quantity: Math.ceil(sqft * (2 / 12) / 27), unit: 'cy', unitCost: 65.00 },
      { item: 'Plants (mixed)', quantity: Math.ceil(sqft / 50), unit: 'ea', unitCost: 35.00 },
      { item: 'Irrigation Supplies', quantity: 1, unit: 'lot', unitCost: sqft * 0.85 },
      { item: 'Edging (20ft rolls)', quantity: Math.ceil(Math.sqrt(sqft) * 4 / 20), unit: 'roll', unitCost: 28.00 },
    ], sqft * 0.08, 65, inputs.markup || 25)
  }
}

function buildResult(materials: any[], laborHours: number, laborRate: number, markupPct: number) {
  const mats = materials.map(m => ({ ...m, total: Math.round(m.quantity * m.unitCost * 100) / 100 }))
  const matTotal = mats.reduce((s, m) => s + m.total, 0)
  const laborTotal = Math.round(laborHours * laborRate * 100) / 100
  const subtotal = matTotal + laborTotal
  const markup = Math.round(subtotal * (markupPct / 100) * 100) / 100
  const tax = Math.round((subtotal + markup) * 0.0875 * 100) / 100
  return {
    materials: mats,
    labor: { hours: Math.round(laborHours * 10) / 10, rate: laborRate, total: laborTotal },
    subtotal: Math.round(subtotal * 100) / 100,
    markup,
    tax,
    total: Math.round((subtotal + markup + tax) * 100) / 100,
  }
}

export async function POST(request: NextRequest) {
  try {
    const { trade, inputs } = await request.json()

    if (!trade || !inputs) {
      return NextResponse.json({ error: 'Trade and inputs required' }, { status: 400 })
    }

    const hasKey = process.env.OPENAI_API_KEY && !process.env.OPENAI_API_KEY.includes('demo-key')

    if (!hasKey) {
      // Instant demo calculation
      const calcFn = DEMO_ESTIMATES[trade]
      if (!calcFn) return NextResponse.json({ error: 'Unknown trade' }, { status: 400 })
      return NextResponse.json({ ...calcFn(inputs), aiGenerated: false })
    }

    // Real AI calculation
    const prompt = `${TRADE_PROMPTS[trade]}

Project inputs:
${Object.entries(inputs).map(([k, v]) => `- ${k}: ${v}`).join('\n')}

Calculate a DETAILED estimate. Use CURRENT market prices for ${inputs.location || 'California, USA'}.
Respond with ONLY this JSON (no markdown):
{
  "materials": [{"item": "string", "quantity": number, "unit": "string", "unitCost": number, "total": number}],
  "labor": {"hours": number, "rate": number, "total": number},
  "subtotal": number,
  "markup": number,
  "tax": number,
  "total": number,
  "notes": "any important notes"
}`

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1200,
      temperature: 0.2,
    })

    const content = response.choices[0]?.message?.content || ''
    const cleaned = content.replace(/```json\n?|\n?```/g, '').trim()
    const result = JSON.parse(cleaned)

    return NextResponse.json({ ...result, aiGenerated: true })
  } catch (error: any) {
    console.error('Estimator error:', error)
    return NextResponse.json({ error: 'Calculation failed', details: error.message }, { status: 500 })
  }
}
