import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-02-25.clover', // Utilise la dernière API version possible par défaut, on met une version récente
  appInfo: {
    name: 'FlipSaaS Seller',
    version: '1.0.0',
  },
})
