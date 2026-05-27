'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'

const DEMO_USER = {
  id: 'demo-user-id',
  email: 'demo@siteforge.app',
  firstName: 'Demo',
  lastName: 'User',
  role: 'owner',
  phoneNumber: '+1-555-0000',
  accountId: 'demo-account-id',
}

const DEMO_ACCOUNT = {
  id: 'demo-account-id',
  companyName: 'Demo Construction Co.',
  planType: 'trial',
}

export function useAuth() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [account, setAccount] = useState<any>(null)
  const [isDemo, setIsDemo] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const demo = localStorage.getItem('demo')
    const userData = localStorage.getItem('user')
    const accountData = localStorage.getItem('account')

    if (demo === 'true' && userData && accountData) {
      setUser(JSON.parse(userData))
      setAccount(JSON.parse(accountData))
      setIsDemo(true)
      setLoading(false)
      return
    }

    if (!token || !userData || !accountData) {
      router.push('/login')
      return
    }

    setUser(JSON.parse(userData))
    setAccount(JSON.parse(accountData))
    setLoading(false)
  }, [router])

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('account')
    localStorage.removeItem('demo')
    router.push('/login')
  }, [router])

  const loginAsDemo = useCallback(() => {
    localStorage.setItem('demo', 'true')
    localStorage.setItem('user', JSON.stringify(DEMO_USER))
    localStorage.setItem('account', JSON.stringify(DEMO_ACCOUNT))
    setUser(DEMO_USER)
    setAccount(DEMO_ACCOUNT)
    setIsDemo(true)
    setLoading(false)
    router.push('/dashboard')
  }, [router])

  return { user, account, isDemo, loading, logout, loginAsDemo }
}
