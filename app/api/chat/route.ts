/**
 * AI Chatbot API - Construction Assistant
 */

import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { message, history } = await request.json()

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.includes('demo-key')) {
      // Return demo responses
      const demoResponses = [
        "I'm here to help with your construction projects! Try asking about RFIs, invoices, or project management.",
        "This is a demo response. Add your OpenAI API key to enable real AI responses!",
        "Great question! In a live environment with an API key, I'd provide detailed construction insights.",
      ]
      return NextResponse.json({
        message: demoResponses[Math.floor(Math.random() * demoResponses.length)]
      })
    }

    // Build conversation history for context
    const messages = [
      {
        role: 'system' as const,
        content: `You are an expert AI assistant for a construction management SaaS platform. You help users with:
- Project management and tracking
- RFI (Request for Information) management
- Invoice processing and approvals
- Change order management
- Construction industry best practices
- QuickBooks integration questions

Be helpful, professional, and concise. Provide actionable advice specific to construction projects.`
      },
      ...history.map((msg: any) => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content
      })),
      {
        role: 'user' as const,
        content: message
      }
    ]

    // Call OpenAI
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      max_tokens: 500,
      temperature: 0.7,
    })

    const assistantMessage = response.choices[0]?.message?.content || 'Sorry, I could not generate a response.'

    return NextResponse.json({
      message: assistantMessage
    })
  } catch (error: any) {
    console.error('Chat error:', error)
    return NextResponse.json(
      { error: 'Failed to process message', details: error.message },
      { status: 500 }
    )
  }
}
