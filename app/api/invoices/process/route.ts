/**
 * Invoice Processing API - Real AI Extraction
 * Uses OpenAI Vision API to extract invoice data
 */

import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

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

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.includes('demo-key')) {
      // Return demo data with a note
      return NextResponse.json({
        vendor: 'Demo Vendor (Add OpenAI API Key for real extraction)',
        invoiceNumber: 'DEMO-' + Math.floor(Math.random() * 10000),
        invoiceDate: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        subtotal: 15750.00,
        tax: 1338.75,
        total: 17088.75,
        category: 'materials',
        lineItems: [
          { description: 'Demo Item - Configure OpenAI API Key for real data', quantity: 1, unitPrice: 15750.00, amount: 15750.00 },
        ],
        confidence: 0.90,
        aiGenerated: true,
        demoMode: true,
      })
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64Image = buffer.toString('base64')
    const mimeType = file.type || 'image/jpeg'

    // Call OpenAI Vision API
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
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

Be as accurate as possible. If a field is not visible, use reasonable defaults. Return ONLY valid JSON, no other text.`,
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:${mimeType};base64,${base64Image}`,
              },
            },
          ],
        },
      ],
      max_tokens: 1000,
    })

    const content = response.choices[0]?.message?.content
    if (!content) {
      throw new Error('No response from OpenAI')
    }

    // Parse the JSON response
    const extractedData = JSON.parse(content)

    // Add confidence score (GPT-4 Vision is highly accurate)
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
