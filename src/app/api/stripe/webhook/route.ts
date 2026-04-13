import Stripe from 'stripe'
import { stripe } from '@/utils/stripe/config'
import { createAdminClient } from '@/utils/supabase/admin'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const body = await req.text()
  const signature = req.headers.get('stripe-signature') as string

  let event: Stripe.Event

  try {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
    if (!webhookSecret) {
      console.error('STRIPE_WEBHOOK_SECRET is not configured')
      return NextResponse.json({ error: 'Configuration manquante' }, { status: 500 })
    }
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err: unknown) {
    console.error(`Webhook signature verification failed: ${(err as Error).message}`)
    return NextResponse.json({ error: 'Bad Request' }, { status: 400 })
  }

  const supabaseAdmin = createAdminClient()

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const supabaseUUID = session.metadata?.supabaseUUID
        if (supabaseUUID) {
          await supabaseAdmin
            .from('users')
            .update({
              stripe_customer_id: session.customer as string,
              subscription_status: 'active'
            })
            .eq('id', supabaseUUID)
        }
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string

        const { data: userData } = await supabaseAdmin
          .from('users')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single()

        if (userData) {
          await supabaseAdmin
            .from('users')
            .update({ subscription_status: subscription.status })
            .eq('id', userData.id)
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string

        const { data: userData } = await supabaseAdmin
          .from('users')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single()

        if (userData) {
          await supabaseAdmin
            .from('users')
            .update({ subscription_status: 'canceled' })
            .eq('id', userData.id)
        }
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        const customerId = invoice.customer as string

        const { data: userData } = await supabaseAdmin
          .from('users')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single()

        if (userData) {
          // Stripe met automatiquement le status à 'past_due'
          // On le sync pour être sûr
          await supabaseAdmin
            .from('users')
            .update({ subscription_status: 'past_due' })
            .eq('id', userData.id)
        }
        console.warn(`Payment failed for customer ${customerId}`)
        break
      }

      default:
        // Événements non gérés (pas une erreur)
        break
    }
  } catch (err: unknown) {
    console.error(`Erreur Database Update: ${(err as Error).message}`)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
