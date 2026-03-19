import Stripe from 'stripe'
import { stripe } from '@/utils/stripe/config'
import { createAdminClient } from '@/utils/supabase/admin'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const body = await req.text()
  const signature = req.headers.get('stripe-signature') as string

  let event: Stripe.Event

  try {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`)
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
      
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string
        
        // Find which user has this customerId
        const { data: userData } = await supabaseAdmin
          .from('users')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single()

        if (userData) {
          await supabaseAdmin
            .from('users')
            .update({
              subscription_status: subscription.status
            })
            .eq('id', userData.id)
        }
        break
      }
      // ... autres events (invoice.payment_failed par exemple pour relance)
      default:
        console.log(`Unhandled event type ${event.type}`)
    }
  } catch (err: any) {
    console.error(`Erreur Database Update: ${err.message}`)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
