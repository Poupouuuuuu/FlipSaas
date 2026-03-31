import { stripe } from '@/utils/stripe/config'

let cachedPrice: string | null = null
let cacheTimestamp = 0
const CACHE_DURATION = 60 * 60 * 1000 // 1 heure

export async function getDisplayPrice(): Promise<string> {
  const now = Date.now()

  if (cachedPrice && now - cacheTimestamp < CACHE_DURATION) {
    return cachedPrice
  }

  try {
    const priceId = process.env.STRIPE_PRICE_ID
    if (!priceId) return '4.99'

    const price = await stripe.prices.retrieve(priceId)
    const amount = (price.unit_amount ?? 499) / 100

    // Format: "4.99" ou "9.99"
    cachedPrice = amount.toFixed(2).replace('.', ',')
    cacheTimestamp = now
    return cachedPrice
  } catch (error) {
    console.error('Failed to fetch Stripe price:', error)
    return '4,99'
  }
}
