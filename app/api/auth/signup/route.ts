import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword, generateToken } from '@/lib/auth'
import { signupSchema } from '@/lib/validation'
import { successResponse } from '@/lib/api-response'
import { formatErrorResponse, AuthError } from '@/lib/error-handler'
import { randomUUID } from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = signupSchema.parse(body)

    const existing = await prisma.user.findUnique({ where: { email: validated.email } })
    if (existing) {
      throw new AuthError('An account with this email already exists', 'ACCOUNT_EXISTS')
    }

    const passwordHash = await hashPassword(validated.password)
    const now = new Date().toISOString()
    const accountId = randomUUID()
    const userId = randomUUID()

    // Check if database is available
    try {
      await prisma.account.create({
        data: {
          id: accountId,
          companyName: validated.businessName,
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
          email: validated.email,
          passwordHash,
          firstName: '',
          lastName: '',
          role: 'owner',
          phoneNumber: '',
          isActive: true,
          createdAt: now,
          updatedAt: now,
        },
      })
    } catch {
      // Fallback to demo mode if DB is unavailable
      return NextResponse.json(
        successResponse({
          demoMode: true,
          message: 'Sign-up is not available in demo mode. Please use the Demo button to explore the app.',
        })
      )
    }

    const token = generateToken({ userId, accountId, email: validated.email, role: 'owner' })

    return NextResponse.json(
      successResponse({
        token,
        user: { 
          id: userId, 
          email: validated.email, 
          firstName: '', 
          lastName: '', 
          role: 'owner', 
          phoneNumber: '', 
          accountId 
        },
        account: { 
          id: accountId, 
          companyName: validated.businessName, 
          planType: 'trial' 
        },
      })
    )
  } catch (error) {
    const { response, statusCode } = formatErrorResponse(error)
    return NextResponse.json(response, { status: statusCode })
  }
}
