import { NextRequest, NextResponse } from 'next/server'
import { getToken } from '@/lib/auth'
import { successResponse } from '@/lib/api-response'
import { formatErrorResponse, AuthError } from '@/lib/error-handler'
import { getStripe } from '@/lib/stripe'

const PRICE_IDS: Record<string, string> = {
  basic: process.env.STRIPE_BASIC_PRICE_ID || '',
  pro: process.env.STRIPE_PRO_PRICE_ID || '',
}

export async function POST(request: NextRequest) {
  try {
    const token = getToken(request)
    if (!token?.accountId) {
      const { response, statusCode } = formatErrorResponse(new AuthError())
      return NextResponse.json(response, { status: statusCode })
    }

    const body = await request.json()
    const plan = body.plan || 'basic'
    const priceId = PRICE_IDS[plan]
    if (!priceId) {
      const { response, statusCode } = formatErrorResponse(new AuthError('Invalid plan'))
      return NextResponse.json(response, { status: statusCode })
    }

    const session = await getStripe().checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: token.email,
      client_reference_id: token.accountId,
      metadata: { accountId: token.accountId, plan },
      subscription_data: {
        metadata: { accountId: token.accountId, plan },
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/subscriptions?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/subscriptions?canceled=true`,
    })

    return NextResponse.json(successResponse({ url: session.url }))
  } catch (error) {
    const { response, statusCode } = formatErrorResponse(error)
    return NextResponse.json(response, { status: statusCode })
  }
}
