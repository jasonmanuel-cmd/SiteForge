'use client'

import { useState } from 'react'

interface Message { role: 'user' | 'assistant'; content: string }

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([{ role: 'assistant', content: 'Hi! I\'m your AI construction assistant. Ask me about project management, invoicing, RFIs, or anything construction-related!' }])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const sendMessage = async () => {
    if (!input.trim()) return
    const userMessage = input.trim()
    setInput('')
    setMessages([...messages, { role: 'user', content: userMessage }])
    setIsLoading(true)
    try {
      const response = await fetch('/api/chat', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, history: messages }),
      })
      if (!response.ok) throw new Error('Failed')
      const data = await response.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.message }])
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again!' }])
    } finally { setIsLoading(false) }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }
  }

  if (!isOpen) {
    return (
      <button onClick={() => setIsOpen(true)} aria-label="Open AI Assistant"
        className="fixed bottom-6 left-6 bg-sf-navy text-white p-4 rounded-full shadow-2xl hover:shadow-sf-navy/30 transition-all duration-300 hover:scale-110 z-50 flex items-center space-x-3 border border-sf-orange/30">
        <svg className="w-6 h-6" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
        <span className="font-semibold text-sm">AI Assistant</span>
      </button>
    )
  }

  return (
      <div role="dialog" aria-modal="true" aria-label="AI Assistant" className="fixed bottom-6 left-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 border-2 border-sf-navy/20">
      <div className="bg-sf-navy text-white p-4 rounded-t-2xl flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-sf-orange/20 rounded-full flex items-center justify-center border border-sf-orange/30">
            <svg className="w-5 h-5 text-sf-orange-light" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-sm">AI Assistant</h3>
            <p className="text-xs text-white/60">Construction expert</p>
          </div>
        </div>
        <button onClick={() => setIsOpen(false)} aria-label="Close chat" className="text-white/60 hover:text-white transition-colors">
          <svg className="w-5 h-5" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50" role="log" aria-live="polite" aria-label="Chat messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${msg.role === 'user' ? 'bg-sf-navy text-white' : 'bg-white border border-gray-200 text-gray-800'}`}>
              <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3">
              <div className="flex space-x-2" aria-hidden="true">
                <div className="w-2 h-2 bg-sf-orange rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-sf-orange rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-sf-orange rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-gray-200 bg-white rounded-b-2xl">
        <div className="flex space-x-2">
          <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={handleKeyPress}
            placeholder="Ask me anything..." id="ai-chat-input"
            className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-full focus:border-sf-orange focus:ring-2 focus:ring-sf-orange/20 outline-none text-sm" />
          <button onClick={sendMessage} disabled={!input.trim() || isLoading} aria-label="Send message"
            className="bg-sf-orange text-white p-2 rounded-full hover:bg-sf-orange-dark disabled:opacity-50 transition-colors">
            <svg className="w-5 h-5" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
        <p className="text-[10px] text-gray-400 mt-2 text-center">Powered by AI &middot; Construction expert</p>
      </div>
    </div>
  )
}
