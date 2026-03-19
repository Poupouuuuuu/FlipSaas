import { stripe } from '@/utils/stripe/config'
import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    // Récupérer le user depuis la DB pour voir s'il a déjà un stripe_customer_id
    const { data: userData } = await supabase
      .from('users')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .single()

    let customerId = userData?.stripe_customer_id

    // Si pas de client Stripe, en créer un
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          supabaseUUID: user.id
        }
      })
      customerId = customer.id

      // Sauvegarder dans la DB via un appel admin (Optionnel si RLS l'autorise pas)
      // Ici on le fait plus tard via le webhook de toute façon, mais c'est mieux de l'avoir en amont
    }

    const priceId = process.env.STRIPE_PRICE_ID || 'price_xxxxx' // <-- IMPORTANT: L'Admin doit le remplir
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

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
  } catch (error: any) {
    console.error('Stripe Checkout Error:', error)
    return NextResponse.json({ error: 'Erreur Serveur Stripe' }, { status: 500 })
  }
}
