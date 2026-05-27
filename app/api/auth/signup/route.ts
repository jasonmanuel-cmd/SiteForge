import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword, generateToken } from '@/lib/auth'
import { randomUUID } from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const { email, password, firstName, lastName, companyName } = await request.json()

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json({ error: 'Email, password, first name, and last name are required' }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 })
    }

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 })
    }

    const passwordHash = await hashPassword(password)
    const now = new Date().toISOString()
    const accountId = randomUUID()
    const userId = randomUUID()

    // Check if database is available
    try {
      await prisma.account.create({
        data: {
          id: accountId,
          companyName: companyName || `${lastName} Construction`,
          planType: 'trial',
          status: 'active',
          createdAt: now,
          updatedAt: now,
        },
      })

      await prisma.user.create({
        data: {
          id: userId,
          accountId,
          email,
          passwordHash,
          firstName,
          lastName,
          role: 'owner',
          phoneNumber: '',
          isActive: true,
          createdAt: now,
          updatedAt: now,
        },
      })
    } catch {
      // Fallback to localStorage-based signup if DB is unavailable
      return NextResponse.json({
        demoMode: true,
        message: 'Sign-up is not available in demo mode. Please use the Demo button to explore the app.',
      }, { status: 200 })
    }

    const token = generateToken({ userId, accountId, email, role: 'owner' })

    return NextResponse.json({
      token,
      user: { id: userId, email, firstName, lastName, role: 'owner', phoneNumber: '', accountId },
      account: { id: accountId, companyName: companyName || `${lastName} Construction`, planType: 'trial' },
    })
  } catch (error: any) {
    console.error('Signup error:', error)
    return NextResponse.json({ error: 'Signup failed', details: error.message }, { status: 500 })
  }
}
