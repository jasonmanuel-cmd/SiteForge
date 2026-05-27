import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { estimatorSchema } from '@/lib/validation'
import { successResponse } from '@/lib/api-response'
import { formatErrorResponse, RateLimitError, AuthError } from '@/lib/error-handler'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

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

const R = (n: number) => Math.round(n * 100) / 100
const R1 = (n: number) => Math.round(n * 10) / 10
const TAX_RATE = 0.0875

function buildResult(materials: any[], laborHours: number, laborRate: number, markupPct: number) {
  const mats = materials.map(m => ({ ...m, total: R(m.quantity * m.unitCost) }))
  const matTotal = mats.reduce((s, m) => s + m.total, 0)
  const laborTotal = R(laborHours * laborRate)
  const textbookBaseCost = matTotal + laborTotal
  const taxableSubtotal = matTotal
  const markup = R(textbookBaseCost * (markupPct / 100))
  const projectSubtotal = textbookBaseCost + markup
  const tax = R(taxableSubtotal * TAX_RATE)
  const total = R(projectSubtotal + tax)
  return {
    materials: mats,
    labor: { hours: R1(laborHours), rate: laborRate, total: laborTotal },
    subtotal: R(textbookBaseCost),
    taxableSubtotal: R(taxableSubtotal),
    markup,
    tax,
    total,
  }
}

const DEMO_ESTIMATES: Record<string, any> = {
  framing: (inputs: any) => {
    const len = parseFloat(inputs.linearFeet) || 50
    const spacing = parseInt(inputs.studSpacing) || 16
    const isDouble = inputs.plateType === 'Double'
    const studCount = Math.ceil((len * 12) / spacing) + 1
    const plateCount = Math.ceil((len * (isDouble ? 3 : 2)) / 12)
    const waste = 1.10
    return buildResult([
      { item: `2×4 Studs`, quantity: Math.ceil(studCount * waste), unit: 'ea', unitCost: 4.50 },
      { item: `2×4 PT Plates`, quantity: Math.ceil(plateCount * waste), unit: 'ea', unitCost: 5.80 },
      { item: '16d Nails (5lb box)', quantity: Math.max(1, Math.ceil(len / 200 * waste)), unit: 'box', unitCost: 12.00 },
      { item: 'Simpson Hangers & Ties', quantity: Math.ceil(studCount * 0.3), unit: 'ea', unitCost: 1.25 },
      { item: 'Misc Hardware', quantity: 1, unit: 'lot', unitCost: 55.00 },
    ], len * 0.1, 85, inputs.markup || 25)
  },
  drywall: (inputs: any) => {
    const sqft = parseFloat(inputs.squareFeet) || 1200
    const hasCeilings = inputs.ceilings === 'Yes'
    const effectiveSqft = hasCeilings ? sqft * 1.5 : sqft
    const sheets = Math.ceil(effectiveSqft / 32)
    const finishLvl = inputs.finishLevel || 'Level 4 (Standard)'
    const finishMult = finishLvl.includes('Level 1') ? 0.6 : finishLvl.includes('Level 3') ? 0.85 : finishLvl.includes('Level 5') ? 1.35 : 1.0
    const waste = 1.10
    return buildResult([
      { item: '1/2" Drywall 4×8 Sheets', quantity: Math.ceil(sheets * waste), unit: 'sheet', unitCost: 18.50 },
      { item: 'Joint Compound (5gal)', quantity: Math.max(1, Math.ceil(sheets / 20 * waste)), unit: 'bucket', unitCost: 32.00 },
      { item: 'Drywall Tape (500ft roll)', quantity: Math.max(1, Math.ceil(sheets / 30 * waste)), unit: 'roll', unitCost: 8.50 },
      { item: 'Drywall Screws (5lb box)', quantity: Math.max(1, Math.ceil(sheets / 25 * waste)), unit: 'box', unitCost: 14.00 },
      { item: 'Corner Bead (10ft)', quantity: Math.ceil(Math.sqrt(effectiveSqft) * 0.5), unit: 'ea', unitCost: 3.25 },
    ], sheets * 1.5 * finishMult, 65, inputs.markup || 25)
  },
  concrete: (inputs: any) => {
    const sqft = parseFloat(inputs.squareFeet) || 500
    const depthIn = parseFloat(inputs.depth) || 4
    const cyards = (sqft * (depthIn / 12)) / 27
    const rebarType = inputs.rebar || 'Wire Mesh'
    const waste = 1.10
    const materials: any[] = [
      { item: 'Ready-Mix Concrete', quantity: Math.ceil(cyards * waste), unit: 'cy', unitCost: 175.00 },
      { item: 'Form Boards 2×8×16\'', quantity: Math.max(4, Math.ceil(Math.sqrt(sqft) * 4 / 16 * waste)), unit: 'ea', unitCost: 18.00 },
      { item: 'Curing Compound (5gal)', quantity: Math.max(1, Math.ceil(sqft / 1000)), unit: 'gal', unitCost: 55.00 },
    ]
    if (rebarType !== 'None') {
      if (rebarType === 'Wire Mesh') {
        materials.push({ item: 'Wire Mesh (150sqft roll)', quantity: Math.ceil(sqft / 150 * waste), unit: 'roll', unitCost: 65.00 })
      } else {
        const sticks = Math.ceil(Math.sqrt(sqft) / 4) * 2
        const cost = rebarType.includes('#5') ? 18.50 : 12.50
        materials.push({ item: rebarType, quantity: Math.ceil(sticks * waste), unit: 'ea', unitCost: cost })
      }
    }
    return buildResult(materials, cyards * 3, 95, inputs.markup || 30)
  },
  painting: (inputs: any) => {
    const sqft = parseFloat(inputs.squareFeet) || 1800
    const coats = parseInt(inputs.coats) || 2
    const quality = inputs.quality || 'Premium'
    const surface = inputs.surface || 'Drywall'
    const galPerCoat = Math.ceil(sqft / 350)
    const totalPaintGal = galPerCoat * coats
    const paintCost = quality === 'Economy' ? 25 : quality === 'Standard' ? 35 : quality === 'Premium' ? 55 : 75
    const surfaceMult = surface === 'Wood' ? 1.15 : surface === 'Stucco' ? 1.3 : surface === 'Masonry' ? 1.4 : 1.0
    return buildResult([
      { item: 'Primer (1 gal = 400sqft)', quantity: Math.ceil(sqft / 400), unit: 'gal', unitCost: 35.00 },
      { item: `${quality} Paint`, quantity: totalPaintGal, unit: 'gal', unitCost: paintCost },
      { item: 'Roller Covers (set)', quantity: Math.max(1, Math.ceil(sqft / 500)), unit: 'set', unitCost: 8.00 },
      { item: 'Brushes (set)', quantity: 1, unit: 'set', unitCost: 25.00 },
      { item: 'Drop Cloths & Tape', quantity: 1, unit: 'lot', unitCost: 35.00 },
    ], (sqft / 200) * coats * surfaceMult, 55, inputs.markup || 30)
  },
  electrical: (inputs: any) => {
    const outlets = parseInt(inputs.outlets) || 20
    const circuits = parseInt(inputs.circuits) || 5
    const sqft = parseFloat(inputs.squareFeet) || 2000
    const panelUpgrade = inputs.panelUpgrade || 'No'
    const wireRolls = Math.max(1, Math.ceil((outlets * 25 + circuits * 50) / 250))
    const panelLabor = panelUpgrade !== 'No' ? (panelUpgrade.includes('400') ? 8 : panelUpgrade.includes('200') ? 5 : 3) : 0
    return buildResult([
      { item: '14/2 Romex Wire (250ft)', quantity: wireRolls, unit: 'roll', unitCost: 85.00 },
      { item: 'Duplex Outlets/Switches', quantity: outlets, unit: 'ea', unitCost: 4.50 },
      { item: 'Single-Pole Breakers', quantity: circuits, unit: 'ea', unitCost: 12.00 },
      { item: 'Electrical Boxes', quantity: outlets + Math.ceil(outlets / 3), unit: 'ea', unitCost: 3.50 },
      { item: 'Wire Connectors (box)', quantity: 2, unit: 'box', unitCost: 8.50 },
      { item: `Subpanel/Labor Hookup`, quantity: 1, unit: 'lot', unitCost: panelUpgrade !== 'No' ? 250 : 85 },
    ], outlets * 0.75 + circuits * 2.5 + panelLabor, 110, inputs.markup || 35)
  },
  plumbing: (inputs: any) => {
    const fixtures = parseInt(inputs.fixtures) || 5
    const pipeMat = inputs.pipeType || 'PEX'
    const pipeCost = pipeMat === 'Copper' ? 125 : pipeMat === 'PVC' ? 45 : pipeMat === 'CPVC' ? 55 : 65
    const wh = inputs.waterHeater || 'No'
    const whExtra = wh !== 'No' ? (wh.includes('Tankless') ? 4 : 3) : 0
    return buildResult([
      { item: `${pipeMat} Pipe (100ft)`, quantity: Math.max(1, Math.ceil(fixtures * 25 / 100)), unit: 'roll', unitCost: pipeCost },
      { item: 'Fixture Connections', quantity: fixtures, unit: 'ea', unitCost: 35.00 },
      { item: 'Shutoff Valves', quantity: fixtures * 2, unit: 'ea', unitCost: 18.00 },
      { item: `${pipeMat} Fittings (bag)`, quantity: Math.max(1, Math.ceil(fixtures * 3 / 25)), unit: 'bag', unitCost: 45.00 },
      { item: 'Misc Supplies', quantity: 1, unit: 'lot', unitCost: 150.00 },
      { item: 'Water Heater Assembly', quantity: wh !== 'No' ? 1 : 0, unit: 'lot', unitCost: wh !== 'No' ? (wh.includes('Tankless') ? 850 : 450) : 0 },
    ].filter(m => m.quantity > 0), fixtures * 3 + whExtra, 115, inputs.markup || 35)
  },
  roofing: (inputs: any) => {
    const sqft = parseFloat(inputs.squareFeet) || 2200
    const pitch = inputs.pitch || '6/12 (Medium)'
    const material = inputs.material || 'Architectural Shingles'
    const tearOff = inputs.tearOff || 'Yes - 1 layer'
    const squares = sqft / 100
    const pitchMult = pitch.includes('12/12') ? 1.6 : pitch.includes('8/12') ? 1.3 : pitch.includes('4/12') ? 0.85 : 1.0
    const tearOffHrs = tearOff.includes('2+') ? squares * 1.0 : tearOff.includes('Yes') ? squares * 0.7 : 0
    const matCost = material === '3-Tab Shingles' ? 95 : material === 'Architectural Shingles' ? 115 : material === 'Metal Roofing' ? 285 : 220
    return buildResult([
      { item: `${material} (per sq)`, quantity: Math.ceil(squares * 1.10), unit: 'sq', unitCost: matCost },
      { item: '30lb Felt Underlayment', quantity: Math.max(1, Math.ceil(squares / 4)), unit: 'roll', unitCost: 42.00 },
      { item: 'Drip Edge (10ft sticks)', quantity: Math.ceil(Math.sqrt(sqft) * 4 / 10), unit: 'ea', unitCost: 8.50 },
      { item: 'Ridge Cap (25ft bundle)', quantity: Math.max(1, Math.ceil(Math.sqrt(sqft) / 25)), unit: 'bundle', unitCost: 65.00 },
      { item: 'Roofing Nails (5lb box)', quantity: Math.max(1, Math.ceil(squares / 4)), unit: 'box', unitCost: 22.00 },
      { item: 'Flashing Kit', quantity: 1, unit: 'kit', unitCost: 185.00 },
    ], squares * 2.5 * pitchMult + tearOffHrs, 95, inputs.markup || 30)
  },
  landscaping: (inputs: any) => {
    const sqft = parseFloat(inputs.squareFeet) || 2000
    const scope = inputs.scope || 'Full landscape'
    const grading = inputs.grading || 'Minor'
    const irrigation = inputs.irrigation || 'Full system'
    const gradingHrs = grading === 'Extensive' ? 24 : grading === 'Moderate' ? 12 : grading === 'Minor' ? 4 : 0
    const irrHrs = irrigation === 'Full system' ? 16 : irrigation === 'Drip only' ? 6 : 0
    const scopeMult = scope === 'Lawn only' ? 0.4 : scope === 'Hardscape only' ? 0.7 : scope === 'Irrigation only' ? 0.3 : 1.0
    return buildResult([
      { item: 'Sod (pallet = 450sqft)', quantity: Math.max(1, Math.ceil(sqft / 450 * scopeMult)), unit: 'pallet', unitCost: 285.00 },
      { item: 'Mulch (2" depth, cy)', quantity: Math.max(1, Math.ceil(sqft * (2 / 12) / 27 * scopeMult)), unit: 'cy', unitCost: 65.00 },
      { item: 'Plants (mixed)', quantity: Math.max(1, Math.ceil(sqft / 50 * scopeMult)), unit: 'ea', unitCost: 35.00 },
      { item: 'Irrigation Supplies', quantity: 1, unit: 'lot', unitCost: irrigation === 'None' ? 0 : sqft * 0.85 },
      { item: 'Edging (20ft rolls)', quantity: Math.max(1, Math.ceil(Math.sqrt(sqft) * 4 / 20 * scopeMult)), unit: 'roll', unitCost: 28.00 },
    ].filter(m => m.unitCost > 0), (sqft * 0.05 * scopeMult) + gradingHrs + irrHrs, 65, inputs.markup || 25)
  },
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = estimatorSchema.parse(body)
    const { trade, inputs } = validated

    // Extract accountId from JWT token (optional for saving to DB)
    let accountId: string | null = null
    const authHeader = request.headers.get('authorization')
    if (authHeader?.startsWith('Bearer ')) {
      try {
        const token = authHeader.slice(7)
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
        accountId = decoded.accountId
      } catch {
        // Token invalid or expired, proceed without saving to DB
      }
    }

    const hasKey = process.env.GEMINI_API_KEY && !process.env.GEMINI_API_KEY.includes('demo-key')

    let result: any
    if (!hasKey) {
      const calcFn = DEMO_ESTIMATES[trade]
      if (!calcFn) throw new Error(`Unknown trade: ${trade}`)
      const demoResult = calcFn(inputs)
      result = Object.assign({}, demoResult, { aiGenerated: false })
      
      // Save to DB if authenticated
      if (accountId) {
        try {
          await prisma.estimate.create({
            data: {
              accountId,
              trade,
              inputs,
              materials: result.materials,
              labor: result.labor,
              subtotal: result.subtotal,
              taxableSubtotal: result.taxableSubtotal,
              markup: result.markup,
              tax: result.tax,
              total: result.total,
              aiGenerated: false,
            },
          })
        } catch (dbError) {
          console.error('Failed to save estimate to DB:', dbError)
          // Continue despite DB error
        }
      }
      
      return NextResponse.json(successResponse(result))
    }

    const prompt = `${TRADE_PROMPTS[trade]}

Project inputs:
${Object.entries(inputs).map(([k, v]) => `- ${k}: ${v}`).join('\n')}

IMPORTANT: Sales tax (8.75%) ONLY applies to tangible materials, NEVER to labor or markup.
The formula is:
- Material Total = sum of qty × unitCost
- Textbook Base Cost = Material Total + Labor Total
- Markup = Textbook Base Cost × (markupPct / 100)
- Project Subtotal = Textbook Base Cost + Markup
- Tax = Material Total × 0.0875
- Final Total = Project Subtotal + Tax

Use CURRENT wholesale/contractor market prices for ${inputs.location || 'California, USA'}.
Calculate a DETAILED estimate. Respond with ONLY this JSON (no markdown, no code fences):
{
  "materials": [{"item": "string", "quantity": number, "unit": "string", "unitCost": number, "total": number}],
  "labor": {"hours": number, "rate": number, "total": number},
  "subtotal": number,
  "taxableSubtotal": number,
  "markup": number,
  "tax": number,
  "total": number,
  "notes": "any important notes"
}`

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })
    const response = await model.generateContent(prompt)
    const content = response.response.text()
    const cleaned = content.replace(/```json\n?|\n?```/g, '').trim()
    const parsedResult = JSON.parse(cleaned)
    result = Object.assign({}, parsedResult, { aiGenerated: true })

    // Save to DB if authenticated
    if (accountId) {
      try {
        await prisma.estimate.create({
          data: {
            accountId,
            trade,
            inputs,
            materials: result.materials,
            labor: result.labor,
            subtotal: result.subtotal,
            taxableSubtotal: result.taxableSubtotal,
            markup: result.markup,
            tax: result.tax,
            total: result.total,
            aiGenerated: true,
          },
        })
      } catch (dbError) {
        console.error('Failed to save estimate to DB:', dbError)
        // Continue despite DB error
      }
    }

    return NextResponse.json(
      successResponse({ ...result, aiGenerated: true })
    )
  } catch (error) {
    if ((error as any).message?.includes('429')) {
      const { response, statusCode } = formatErrorResponse(
        new RateLimitError('API quota exceeded. Using demo calculator.')
      )
      return NextResponse.json(response, { status: statusCode })
    }
    
    const { response, statusCode } = formatErrorResponse(error)
    return NextResponse.json(response, { status: statusCode })
  }
}
