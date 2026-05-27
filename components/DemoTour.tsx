'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface DemoStep { title: string; description: string; page: string; duration: number }

export default function DemoTour() {
  const router = useRouter()
  const [isRunning, setIsRunning] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [isMinimized, setIsMinimized] = useState(false)

  const demoSteps: DemoStep[] = [
    { title: '👋 Welcome to SiteForge!', description: 'Your construction command center with real-time project insights.', page: '/dashboard', duration: 3000 },
    { title: '🏗️ Projects Overview', description: 'Track all construction projects with budget monitoring and progress.', page: '/projects', duration: 4000 },
    { title: '📄 AI Invoice Processing', description: 'Upload any invoice — AI extracts vendor info, line items, and amounts automatically!', page: '/invoices', duration: 4000 },
    { title: '❓ RFI Management', description: 'Manage RFIs with AI-generated categorization and priority tracking.', page: '/rfis', duration: 3500 },
    { title: '📝 Change Orders', description: 'Track change orders with budget and schedule impact visualization.', page: '/change-orders', duration: 3500 },
    { title: '✅ Tour Complete!', description: 'You\'ve seen the key features. Ready to streamline your construction business?', page: '/dashboard', duration: 3000 },
  ]

  useEffect(() => {
    if (!isRunning) return
    const step = demoSteps[currentStep]
    router.push(step.page)
    const timer = setTimeout(() => {
      if (currentStep < demoSteps.length - 1) setCurrentStep(currentStep + 1)
      else { setIsRunning(false); setCurrentStep(0) }
    }, step.duration)
    return () => clearTimeout(timer)
  }, [isRunning, currentStep, router])

  const startTour = () => { setIsRunning(true); setCurrentStep(0); setIsMinimized(false) }
  const stopTour = () => { setIsRunning(false); setCurrentStep(0) }
  const skipToNext = () => { if (currentStep < demoSteps.length - 1) setCurrentStep(currentStep + 1) }

  if (!isRunning) {
    return (
      <button onClick={startTour}
        className="fixed bottom-6 right-6 bg-sf-navy text-white px-5 py-3.5 rounded-full shadow-2xl hover:shadow-sf-navy/30 transition-all duration-300 flex items-center space-x-2 font-semibold text-sm hover:scale-105 z-50 border border-sf-orange/30">
        <span className="text-lg">🎬</span>
        <span>Demo Tour</span>
      </button>
    )
  }

  if (isMinimized) {
    return (
      <button onClick={() => setIsMinimized(false)} aria-label="Resume demo tour"
        className="fixed bottom-6 right-6 bg-sf-navy-dark text-white px-4 py-3 rounded-full shadow-lg flex items-center space-x-2 z-50 border border-sf-orange/20">
        <span aria-hidden="true">🎬</span>
        <span className="text-sm">Tour in progress...</span>
      </button>
    )
  }

  const step = demoSteps[currentStep]
  const progress = ((currentStep + 1) / demoSteps.length) * 100

  return (
    <div role="dialog" aria-label="Demo tour" className="fixed bottom-6 right-6 bg-white rounded-2xl shadow-2xl border-2 border-sf-navy/20 p-6 max-w-md w-full z-50 animate-slide-up">
      <div aria-hidden="true" className="absolute top-0 left-0 right-0 h-1 bg-gray-200 rounded-t-2xl overflow-hidden">
        <div className="h-full bg-sf-orange transition-all duration-500" style={{ width: `${progress}%` }} />
      </div>
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-sf-navy font-heading tracking-wide mb-1">{step.title}</h3>
          <p className="text-xs text-gray-500">Step {currentStep + 1} of {demoSteps.length}</p>
        </div>
        <div className="flex space-x-2">
          <button onClick={() => setIsMinimized(true)} className="text-gray-400 hover:text-gray-600 p-1" title="Minimize">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <button onClick={stopTour} className="text-gray-400 hover:text-gray-600 p-1" title="Stop Tour">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
      <p className="text-gray-700 text-sm mb-6 leading-relaxed">{step.description}</p>
      <div className="flex items-center justify-between">
        <div className="flex space-x-2">
          {currentStep < demoSteps.length - 1 ? (
            <button onClick={skipToNext} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">Skip →</button>
          ) : (
            <button onClick={stopTour} className="px-4 py-2 bg-sf-navy text-white rounded-lg hover:bg-sf-navy-dark transition-all text-sm font-medium">Finish Tour 🎉</button>
          )}
        </div>
          <div className="flex items-center space-x-2 text-xs text-gray-500">
          <div className="animate-pulse" aria-hidden="true"><div className="w-2 h-2 bg-sf-orange rounded-full"></div></div>
          <span>Auto-advancing...</span>
        </div>
      </div>
    </div>
  )
}
