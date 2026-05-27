/**
 * Invoice Processing API - Real AI Extraction
 * Uses Gemini Vision API to extract invoice data
 */

import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY.includes('demo-key')) {
      return NextResponse.json({
        vendor: 'Demo Vendor (Add Gemini API Key for real extraction)',
        invoiceNumber: 'DEMO-' + Math.floor(Math.random() * 10000),
        invoiceDate: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        subtotal: 15750.00,
        tax: 1338.75,
        total: 17088.75,
        category: 'materials',
        lineItems: [
          { description: 'Demo Item - Configure Gemini API Key for real data', quantity: 1, unitPrice: 15750.00, amount: 15750.00 },
        ],
        confidence: 0.90,
        aiGenerated: true,
        demoMode: true,
      })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64Image = buffer.toString('base64')
    const mimeType = file.type || 'image/jpeg'

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

    const result = await model.generateContent([
      {
        inlineData: { mimeType, data: base64Image },
      },
      {
        text: `You are an expert at extracting data from construction invoices. Analyze this invoice image and extract the following information in JSON format:

{
  "vendor": "company name",
  "invoiceNumber": "invoice number",
  "invoiceDate": "YYYY-MM-DD",
  "dueDate": "YYYY-MM-DD",
  "subtotal": 0.00,
  "tax": 0.00,
  "total": 0.00,
  "category": "materials|labor|equipment|other",
  "lineItems": [
    {
      "description": "item description",
      "quantity": 0,
      "unitPrice": 0.00,
      "amount": 0.00
    }
  ]
}

Be as accurate as possible. If a field is not visible, use reasonable defaults. Return ONLY valid JSON, no other text or markdown.`,
      },
    ])

    const content = result.response.text()
    if (!content) {
      throw new Error('No response from Gemini')
    }

    const cleaned = content.replace(/```json\n?|\n?```/g, '').trim()
    const extractedData = JSON.parse(cleaned)

    return NextResponse.json({
      ...extractedData,
      confidence: 0.95,
      aiGenerated: true,
    })
  } catch (error: any) {
    console.error('Invoice processing error:', error)
    return NextResponse.json(
      { error: 'Failed to process invoice', details: error.message },
      { status: 500 }
    )
  }
}
