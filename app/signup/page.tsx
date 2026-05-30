'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SignupPage() {
  const router = useRouter()
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', companyName: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Signup failed'); setLoading(false); return }
      if (data.demoMode) { setError(data.message); setLoading(false); return }
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      localStorage.setItem('account', JSON.stringify(data.account))
      router.push('/dashboard')
    } catch { setError('Connection failed. Please try again.'); setLoading(false) }
  }

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm(prev => ({ ...prev, [field]: e.target.value }))

  return (
    <div className="min-h-screen bg-sf-navy-dark flex items-center justify-center p-4 relative overflow-hidden">
      <div aria-hidden="true" className="absolute inset-0 opacity-[0.07]"
        style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
      <div aria-hidden="true" className="fixed top-0 left-0 right-0 h-1 bg-sf-orange" />
      <div aria-hidden="true" className="fixed bottom-0 left-0 right-0 h-1 bg-sf-orange" />

      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-sf-navy rounded-2xl mb-4 shadow-lg">
            <span className="text-3xl font-bold text-sf-orange font-heading tracking-wide">SF</span>
          </div>
          <h1 className="text-3xl font-bold text-sf-navy font-heading tracking-wide">Create Account</h1>
          <div className="h-0.5 w-16 bg-sf-orange mx-auto mt-3 mb-3" />
          <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">Join SiteForge</p>
        </div>

        {error && (
          <div role="alert" className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1.5">First Name</label>
              <input id="firstName" type="text" value={form.firstName} onChange={set('firstName')} required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-sf-orange focus:ring-2 focus:ring-sf-orange/20 outline-none transition-all" />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1.5">Last Name</label>
              <input id="lastName" type="text" value={form.lastName} onChange={set('lastName')} required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-sf-orange focus:ring-2 focus:ring-sf-orange/20 outline-none transition-all" />
            </div>
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
            <input id="email" type="email" value={form.email} onChange={set('email')} required
              placeholder="you@yourcompany.com"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-sf-orange focus:ring-2 focus:ring-sf-orange/20 outline-none transition-all" />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
            <input id="password" type="password" value={form.password} onChange={set('password')} required minLength={6}
              placeholder="At least 6 characters"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-sf-orange focus:ring-2 focus:ring-sf-orange/20 outline-none transition-all" />
          </div>
          <div>
            <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1.5">Company Name <span className="text-gray-400">(optional)</span></label>
            <input id="companyName" type="text" value={form.companyName} onChange={set('companyName')}
              placeholder="Your Construction Co."
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-sf-orange focus:ring-2 focus:ring-sf-orange/20 outline-none transition-all" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-sf-orange hover:bg-sf-orange-dark text-white font-bold py-3.5 px-6 rounded-lg transition-colors shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed font-heading tracking-wide text-lg btn-loading">
            {loading ? '' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Already have an account?{' '}
            <a href="/login" className="text-sf-orange font-semibold hover:underline">Sign in</a>
          </p>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-400">
            Powered by <span className="font-semibold text-sf-orange">COAI</span> &middot; Bakersfield, CA
          </p>
        </div>
      </div>
    </div>
  )
}
