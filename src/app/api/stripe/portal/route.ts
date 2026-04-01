import { stripe } from '@/utils/stripe/config'
import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
import { rateLimit } from '@/lib/rate-limit'

export async function POST() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    // Rate limit: 5 portal sessions par minute par user
    const { success: allowed } = rateLimit(`portal:${user.id}`, 5, 60_000)
    if (!allowed) {
      return NextResponse.json({ error: 'Trop de requêtes. Réessayez dans quelques instants.' }, { status: 429 })
    }

    const { data: userData } = await supabase
      .from('users')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .single()

    if (!userData?.stripe_customer_id) {
      return NextResponse.json({ error: 'Aucun abonnement trouvé' }, { status: 400 })
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

    const session = await stripe.billingPortal.sessions.create({
      customer: userData.stripe_customer_id,
      return_url: `${siteUrl}/dashboard/account`,
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Stripe Portal Error:', error)
    return NextResponse.json({ error: 'Erreur Serveur Stripe' }, { status: 500 })
  }
}
