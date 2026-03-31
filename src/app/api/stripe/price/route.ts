import { getDisplayPrice } from '@/lib/stripe-price'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const price = await getDisplayPrice()
    return NextResponse.json({ price }, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    })
  } catch {
    return NextResponse.json({ price: '4,99' })
  }
}
