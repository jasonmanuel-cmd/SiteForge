/**
 * AI Chatbot API - Construction Assistant
 */

import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

export async function POST(request: NextRequest) {
  try {
    const { message, history } = await request.json()

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY.includes('demo-key')) {
      const demoResponses = [
        "I'm here to help with your construction projects! Try asking about RFIs, invoices, or project management.",
        "This is a demo response. Add your Gemini API key to enable real AI responses!",
        "Great question! In a live environment with an API key, I'd provide detailed construction insights.",
      ]
      return NextResponse.json({
        message: demoResponses[Math.floor(Math.random() * demoResponses.length)]
      })
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
    const result = await chat.sendMessage(message)
    const assistantMessage = result.response.text() || 'Sorry, I could not generate a response.'

    return NextResponse.json({ message: assistantMessage })
  } catch (error: any) {
    console.error('Chat error:', error)
    return NextResponse.json(
      { error: 'Failed to process message', details: error.message },
      { status: 500 }
    )
  }
}
