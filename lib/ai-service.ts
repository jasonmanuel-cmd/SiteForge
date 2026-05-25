/**
 * AI Service
 * Handles all AI/LLM operations for invoice extraction, email processing, etc.
 */

import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
})

export interface InvoiceExtraction {
  vendor: string
  invoiceNumber: string | null
  invoiceDate: string | null
  dueDate: string | null
  subtotal: number
  tax: number
  total: number
  lineItems: {
    description: string
    quantity: number
    unitPrice: number
    amount: number
    category?: string
  }[]
  suggestedProject?: string
  suggestedCategory?: string
  confidence: number
}

export interface EmailClassification {
  type: 'rfi' | 'change_order' | 'general' | 'invoice'
  confidence: number
  subject: string
  summary: string
  extractedData?: {
    question?: string
    scopeChange?: string
    priceImpact?: number
    scheduleImpact?: number
  }
}

export interface DailyReportExtraction {
  date: string
  weatherAM?: string
  weatherPM?: string
  workPerformed: string
  laborSummary: {
    trade: string
    workers: number
    hours: number
  }[]
  delays?: string
  safetyIssues?: string
  equipmentUsed?: string
  deliveries?: string
}

/**
 * Extract invoice data from OCR text or image
 */
export async function extractInvoiceData(
  ocrText: string
): Promise<InvoiceExtraction> {
  const prompt = `You are an expert at extracting structured data from construction invoices.

Extract the following information from this invoice text:
- Vendor/company name
- Invoice number
- Invoice date
- Due date
- Subtotal
- Tax amount
- Total amount
- Line items (description, quantity, unit price, amount)
- Suggested project (if mentioned)
- Suggested category (materials, labor, equipment, or other)

Return ONLY valid JSON in this exact format:
{
  "vendor": "Company Name",
  "invoiceNumber": "INV-12345",
  "invoiceDate": "2024-01-15",
  "dueDate": "2024-02-15",
  "subtotal": 5000.00,
  "tax": 450.00,
  "total": 5450.00,
  "lineItems": [
    {
      "description": "Item description",
      "quantity": 10,
      "unitPrice": 50.00,
      "amount": 500.00,
      "category": "materials"
    }
  ],
  "suggestedProject": "Project name if found",
  "suggestedCategory": "materials",
  "confidence": 0.95
}

Invoice text:
${ocrText}`

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.1,
    response_format: { type: 'json_object' },
  })

  const content = response.choices[0].message.content
  if (!content) {
    throw new Error('No response from AI')
  }

  return JSON.parse(content) as InvoiceExtraction
}

/**
 * Classify email and extract relevant data
 */
export async function classifyEmail(
  subject: string,
  body: string,
  sender: string
): Promise<EmailClassification> {
  const prompt = `You are an expert at analyzing construction project emails.

Classify this email and extract relevant information.

Types:
- rfi: Request for Information (questions about plans, clarifications needed)
- change_order: Scope changes, additional work requests, change in requirements
- invoice: Bills, invoices, payment requests
- general: Everything else

For RFIs, extract the question being asked.
For change orders, extract the scope change description and any cost/time impacts mentioned.

Return ONLY valid JSON in this exact format:
{
  "type": "rfi",
  "confidence": 0.95,
  "subject": "Simplified subject line",
  "summary": "Brief summary of the email",
  "extractedData": {
    "question": "What is being asked?",
    "scopeChange": "What changed?",
    "priceImpact": 5000,
    "scheduleImpact": 7
  }
}

Email:
From: ${sender}
Subject: ${subject}
Body: ${body}`

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.1,
    response_format: { type: 'json_object' },
  })

  const content = response.choices[0].message.content
  if (!content) {
    throw new Error('No response from AI')
  }

  return JSON.parse(content) as EmailClassification
}

/**
 * Convert voice transcript to structured daily report
 */
export async function extractDailyReport(
  transcript: string
): Promise<DailyReportExtraction> {
  const prompt = `You are an expert at converting construction superintendent voice logs into structured daily reports.

Extract the following from this transcript:
- Date
- Weather (AM and PM if mentioned)
- Work performed
- Labor summary (trades, number of workers, hours)
- Delays or issues
- Safety issues
- Equipment used
- Deliveries

Return ONLY valid JSON in this exact format:
{
  "date": "2024-01-15",
  "weatherAM": "Clear, 65°F",
  "weatherPM": "Partly cloudy, 72°F",
  "workPerformed": "Description of work done",
  "laborSummary": [
    {
      "trade": "Framing",
      "workers": 5,
      "hours": 8
    }
  ],
  "delays": "Any delays mentioned",
  "safetyIssues": "Any safety concerns",
  "equipmentUsed": "Equipment on site",
  "deliveries": "Materials delivered"
}

Transcript:
${transcript}`

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.1,
    response_format: { type: 'json_object' },
  })

  const content = response.choices[0].message.content
  if (!content) {
    throw new Error('No response from AI')
  }

  return JSON.parse(content) as DailyReportExtraction
}

/**
 * Transcribe audio to text
 */
export async function transcribeAudio(audioFile: File): Promise<string> {
  const response = await openai.audio.transcriptions.create({
    file: audioFile,
    model: 'whisper-1',
  })

  return response.text
}

/**
 * Simple OCR using GPT-4 Vision
 * For production, consider using specialized OCR like Tesseract or AWS Textract
 */
export async function performOCR(imageBase64: string): Promise<string> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: 'Extract all text from this invoice/receipt image. Return the raw text exactly as it appears.',
          },
          {
            type: 'image_url',
            image_url: {
              url: `data:image/jpeg;base64,${imageBase64}`,
            },
          },
        ],
      },
    ],
    max_tokens: 2000,
  })

  return response.choices[0].message.content || ''
}
