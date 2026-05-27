import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyPassword, generateToken } from '@/lib/auth'
import { loginSchema } from '@/lib/validation'
import { successResponse } from '@/lib/api-response'
import { formatErrorResponse, AuthError } from '@/lib/error-handler'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = loginSchema.parse(body)

    const user = await prisma.user.findUnique({ where: { email: validated.email } })

    if (!user) {
      throw new AuthError('Invalid email or password')
    }

    const valid = await verifyPassword(validated.password, user.passwordHash)

    if (!valid) {
      throw new AuthError('Invalid email or password')
    }

    const account = await prisma.account.findUnique({ where: { id: user.accountId } })

    if (!account) {
      throw new Error('Account not found')
    }

    const token = generateToken({
      userId: user.id,
      accountId: user.accountId,
      email: user.email,
      role: user.role,
    })

    return NextResponse.json(
      successResponse({
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          phoneNumber: user.phoneNumber,
          accountId: user.accountId,
        },
        account: {
          id: account.id,
          companyName: account.companyName,
          planType: account.planType,
        },
      })
    )
  } catch (error) {
    const { response, statusCode } = formatErrorResponse(error)
    return NextResponse.json(response, { status: statusCode })
  }
}
