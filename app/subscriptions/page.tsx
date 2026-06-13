'use client'

import { Suspense, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useAuth } from '@/lib/useAuth'

const PLANS = [
  { id: 'basic', name: 'Basic', price: '$49/mo', features: ['Up to 5 projects', 'AI estimator', 'Invoice management', 'RFI tracking', 'Email support'] },
  { id: 'pro', name: 'Pro', price: '$99/mo', features: ['Unlimited projects', 'AI estimator + chatbot', 'Invoice processing (AI)', 'QuickBooks sync', 'RFI & change orders', 'Priority support', 'Team members (up to 5)'] },
]

function SubscriptionContent() {
  const { account } = useAuth()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState('')

  const subscribe = async (plan: string) => {
    setLoading(plan)
    setError('')
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/subscriptions/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ plan }),
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
      else setError(data.error?.message || 'Failed to create subscription')
    } catch { setError('Network error') }
    finally { setLoading(null) }
  }

  const manageBilling = async () => {
    setLoading('manage')
    setError('')
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/subscriptions/portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
      else setError(data.error?.message || 'Failed to open billing portal')
    } catch { setError('Network error') }
    finally { setLoading(null) }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-sf-navy font-heading mb-4">Pricing</h1>
          <p className="text-gray-600 text-lg">Choose the plan that fits your construction business</p>
        </div>

        {searchParams.get('success') && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-8 text-center">
            Subscription activated! Welcome aboard.
          </div>
        )}
        {searchParams.get('canceled') && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-xl mb-8 text-center">
            Checkout canceled. Try again when you&apos;re ready.
          </div>
        )}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-8 text-center">{error}</div>
        )}

        {account?.subscriptionStatus === 'active' ? (
          <div className="text-center">
            <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto border border-green-200">
              <div className="text-4xl mb-4">&#x2705;</div>
              <h2 className="text-2xl font-bold text-sf-navy mb-2">{account.planType === 'pro' ? 'Pro' : 'Basic'} Plan Active</h2>
              <p className="text-gray-500 mb-6">You&apos;re all set. Manage your billing below.</p>
              <button onClick={manageBilling} disabled={loading === 'manage'}
                className="bg-sf-navy text-white px-8 py-3 rounded-xl hover:bg-sf-navy-dark transition-colors font-medium disabled:opacity-50">
                {loading === 'manage' ? 'Loading...' : 'Manage Billing'}
              </button>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {PLANS.map((plan) => (
              <div key={plan.id} className={`bg-white rounded-2xl shadow-lg p-8 border-2 transition-all duration-300 ${plan.id === 'pro' ? 'border-sf-orange scale-105' : 'border-gray-200'}`}>
                {plan.id === 'pro' && <div className="text-xs font-bold text-sf-orange uppercase tracking-widest mb-2">Popular</div>}
                <h3 className="text-2xl font-bold text-sf-navy mb-2">{plan.name}</h3>
                <p className="text-4xl font-bold text-sf-navy mb-6">{plan.price}</p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start space-x-2 text-sm text-gray-600">
                      <span className="text-sf-orange mt-0.5">&#x2713;</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <button onClick={() => subscribe(plan.id)} disabled={loading === plan.id}
                  className={`w-full py-3 rounded-xl font-semibold transition-all disabled:opacity-50 ${plan.id === 'pro' ? 'bg-sf-orange text-white hover:bg-sf-orange-dark' : 'bg-gray-100 text-sf-navy hover:bg-gray-200'}`}>
                  {loading === plan.id ? 'Processing...' : `Start ${plan.name}`}
                </button>
              </div>
            ))}
          </div>
        )}

        <p className="text-center text-xs text-gray-400 mt-8">Cancel anytime. Secure payments via Stripe.</p>
      </div>
    </div>
  )
}

export default function SubscriptionsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="text-sf-navy">Loading...</div></div>}>
      <SubscriptionContent />
    </Suspense>
  )
}
