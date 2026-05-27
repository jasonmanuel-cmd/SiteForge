/**
 * AI Chatbot API - Construction Assistant
 */

import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { chatSchema } from '@/lib/validation'
import { successResponse } from '@/lib/api-response'
import { formatErrorResponse, RateLimitError } from '@/lib/error-handler'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, history } = body
    const validated = chatSchema.parse({ message })

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY.includes('demo-key')) {
      const demoResponses = [
        "I'm here to help with your construction projects! Try asking about RFIs, invoices, or project management.",
        "This is a demo response. Add your Gemini API key to enable real AI responses!",
        "Great question! In a live environment with an API key, I'd provide detailed construction insights.",
      ]
      return NextResponse.json(
        successResponse({
          message: demoResponses[Math.floor(Math.random() * demoResponses.length)]
        })
      )
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

    const geminiHistory = (history || []).map((msg: any) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }))

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      systemInstruction: `You are an expert AI assistant for a construction management SaaS platform. You help users with:
- Project management and tracking
- RFI (Request for Information) management
- Invoice processing and approvals
- Change order management
- Construction industry best practices
- QuickBooks integration questions

Be helpful, professional, and concise. Provide actionable advice specific to construction projects.`,
    })

    const chat = model.startChat({ history: geminiHistory })
    const result = await chat.sendMessage(validated.message)
    const assistantMessage = result.response.text() || 'Sorry, I could not generate a response.'

    return NextResponse.json(
      successResponse({ message: assistantMessage })
    )
  } catch (error) {
    if ((error as any).message?.includes('429')) {
      const { response, statusCode } = formatErrorResponse(
        new RateLimitError('API quota exceeded.')
      )
      return NextResponse.json(response, { status: statusCode })
    }
    
    const { response, statusCode } = formatErrorResponse(error)
    return NextResponse.json(response, { status: statusCode })
  }
}
