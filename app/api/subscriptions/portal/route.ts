import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getToken } from '@/lib/auth'
import { successResponse } from '@/lib/api-response'
import { formatErrorResponse, AuthError } from '@/lib/error-handler'
import { getStripe } from '@/lib/stripe'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const token = getToken(request)
    if (!token?.accountId) {
      const { response, statusCode } = formatErrorResponse(new AuthError())
      return NextResponse.json(response, { status: statusCode })
    }

    const account = await prisma.account.findUnique({
      where: { id: token.accountId },
      select: { stripeCustomerId: true },
    })

    if (!account?.stripeCustomerId) {
      const { response, statusCode } = formatErrorResponse(new AuthError('No subscription found'))
      return NextResponse.json(response, { status: statusCode })
    }

    const session = await getStripe().billingPortal.sessions.create({
      customer: account.stripeCustomerId,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/subscriptions`,
    })

    return NextResponse.json(successResponse({ url: session.url }))
  } catch (error) {
    const { response, statusCode } = formatErrorResponse(error)
    return NextResponse.json(response, { status: statusCode })
  }
}
