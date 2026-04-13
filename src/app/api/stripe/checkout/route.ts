import { stripe } from '@/utils/stripe/config'
import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
import { rateLimit } from '@/lib/rate-limit'

export async function POST(req: Request) {
  try {
    const priceId = process.env.STRIPE_PRICE_ID
    if (!priceId) {
      console.error('STRIPE_PRICE_ID is not configured')
      return NextResponse.json({ error: 'Configuration manquante' }, { status: 500 })
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
    if (!siteUrl) {
      console.error('NEXT_PUBLIC_SITE_URL is not configured')
      return NextResponse.json({ error: 'Configuration manquante' }, { status: 500 })
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    // Rate limit: 5 checkout sessions par minute par user
    const { success: allowed } = rateLimit(`checkout:${user.id}`, 5, 60_000)
    if (!allowed) {
      return NextResponse.json({ error: 'Trop de requêtes. Réessayez dans quelques instants.' }, { status: 429 })
    }

    // Récupérer le user depuis la DB pour voir s'il a déjà un stripe_customer_id
    const { data: userData } = await supabase
      .from('users')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .single()

    let customerId = userData?.stripe_customer_id

    // Si pas de client Stripe, en créer un et sauvegarder immédiatement
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          supabaseUUID: user.id
        }
      })
      customerId = customer.id

      // Sauvegarder le customer ID immédiatement (pas attendre le webhook)
      await supabase
        .from('users')
        .update({ stripe_customer_id: customerId })
        .eq('id', user.id)
    }

    // Créer la session Checkout
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      billing_address_collection: 'auto',
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${siteUrl}/dashboard?session_id={CHECKOUT_SESSION_ID}&success=true`,
      cancel_url: `${siteUrl}/dashboard/subscription?canceled=true`,
      metadata: {
        supabaseUUID: user.id
      }
    })

    return NextResponse.json({ url: session.url })
  } catch (error: unknown) {
    console.error('Stripe Checkout Error:', error)
    return NextResponse.json({ error: 'Erreur Serveur Stripe' }, { status: 500 })
  }
}
