'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface DemoStep {
  title: string
  description: string
  page: string
  duration: number
  action?: () => void
}

export default function DemoTour() {
  const router = useRouter()
  const [isRunning, setIsRunning] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [isMinimized, setIsMinimized] = useState(false)

  const demoSteps: DemoStep[] = [
    {
      title: '👋 Welcome to Construction SaaS!',
      description: 'Let me show you around. This is your command center with real-time project insights.',
      page: '/dashboard',
      duration: 3000,
    },
    {
      title: '🏗️ Projects Overview',
      description: 'Track all your construction projects with budget monitoring and progress tracking.',
      page: '/projects',
      duration: 4000,
    },
    {
      title: '📄 AI Invoice Processing',
      description: 'Upload any invoice and watch AI extract vendor info, line items, and amounts automatically!',
      page: '/invoices',
      duration: 4000,
    },
    {
      title: '❓ RFI Management',
      description: 'Manage Requests for Information with AI-generated categorization and priority tracking.',
      page: '/rfis',
      duration: 3500,
    },
    {
      title: '📝 Change Orders',
      description: 'Track change orders with budget and schedule impact visualization.',
      page: '/change-orders',
      duration: 3500,
    },
    {
      title: '✅ Tour Complete!',
      description: 'You\'ve seen all the key features. Ready to streamline your construction business?',
      page: '/dashboard',
      duration: 3000,
    },
  ]

  useEffect(() => {
    if (!isRunning) return

    const step = demoSteps[currentStep]

    // Navigate to the page
    router.push(step.page)

    // Execute custom action if any
    if (step.action) {
      setTimeout(() => step.action!(), 500)
    }

    // Move to next step after duration
    const timer = setTimeout(() => {
      if (currentStep < demoSteps.length - 1) {
        setCurrentStep(currentStep + 1)
      } else {
        setIsRunning(false)
        setCurrentStep(0)
      }
    }, step.duration)

    return () => clearTimeout(timer)
  }, [isRunning, currentStep, router])

  const startTour = () => {
    setIsRunning(true)
    setCurrentStep(0)
    setIsMinimized(false)
  }

  const stopTour = () => {
    setIsRunning(false)
    setCurrentStep(0)
  }

  const skipToNext = () => {
    if (currentStep < demoSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  if (!isRunning) {
    return (
      <button
        onClick={startTour}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-4 rounded-full shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 flex items-center space-x-3 font-semibold text-lg hover:scale-105 z-50 animate-bounce"
      >
        <span className="text-2xl">🎬</span>
        <span>Start Demo Tour</span>
      </button>
    )
  }

  if (isMinimized) {
    return (
      <button
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-6 right-6 bg-gray-900 text-white px-4 py-3 rounded-full shadow-lg flex items-center space-x-2 z-50"
      >
        <span>🎬</span>
        <span className="text-sm">Tour in progress...</span>
      </button>
    )
  }

  const step = demoSteps[currentStep]
  const progress = ((currentStep + 1) / demoSteps.length) * 100

  return (
    <div className="fixed bottom-6 right-6 bg-white rounded-2xl shadow-2xl border-2 border-purple-500 p-6 max-w-md w-full z-50 animate-slide-up">
      {/* Progress Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200 rounded-t-2xl overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-purple-600 to-blue-600 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-1">{step.title}</h3>
          <p className="text-sm text-gray-600">
            Step {currentStep + 1} of {demoSteps.length}
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setIsMinimized(true)}
            className="text-gray-400 hover:text-gray-600 p-1"
            title="Minimize"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <button
            onClick={stopTour}
            className="text-gray-400 hover:text-gray-600 p-1"
            title="Stop Tour"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-700 mb-6 leading-relaxed">{step.description}</p>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex space-x-2">
          {currentStep < demoSteps.length - 1 ? (
            <button
              onClick={skipToNext}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
            >
              Skip →
            </button>
          ) : (
            <button
              onClick={stopTour}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all text-sm font-medium"
            >
              Finish Tour 🎉
            </button>
          )}
        </div>

        {/* Auto-advance indicator */}
        <div className="flex items-center space-x-2 text-xs text-gray-500">
          <div className="animate-pulse">
            <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
          </div>
          <span>Auto-advancing...</span>
        </div>
      </div>
    </div>
  )
}
