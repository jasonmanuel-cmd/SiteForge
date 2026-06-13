import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import type Stripe from 'stripe'
import { getStripe } from '@/lib/stripe'

const prisma = new PrismaClient()
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature') || ''
    let event: Stripe.Event

    try {
      event = getStripe().webhooks.constructEvent(body, signature, webhookSecret)
    } catch {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const accountId = session.metadata?.accountId
        if (accountId && session.subscription) {
          await prisma.account.update({
            where: { id: accountId },
            data: {
              stripeCustomerId: session.customer as string,
              subscriptionId: session.subscription as string,
              subscriptionStatus: 'active',
              planType: session.metadata?.plan || 'basic',
              status: 'active',
            },
          })
        }
        break
      }

      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const accountId = subscription.metadata?.accountId
        if (accountId) {
          const status = subscription.status === 'active' || subscription.status === 'trialing' ? 'active'
            : subscription.status === 'past_due' ? 'suspended'
            : 'cancelled'
          await prisma.account.update({
            where: { id: accountId },
            data: { subscriptionStatus: subscription.status, status },
          })
        }
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice & { subscription_details?: { metadata?: { accountId?: string } } }
        const accountId = invoice.subscription_details?.metadata?.accountId || invoice.metadata?.accountId
        if (accountId) {
          await prisma.account.update({
            where: { id: accountId },
            data: { subscriptionStatus: 'past_due', status: 'suspended' },
          })
        }
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch {
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }
}
