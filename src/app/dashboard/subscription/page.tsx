'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Check, Loader2, CreditCard } from 'lucide-react'
import { toast } from 'sonner'

export default function SubscriptionPage() {
  const [loading, setLoading] = useState(false)

  async function handleSubscribe() {
    setLoading(true)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
      })
      const data = await res.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        toast.error(data.error || 'Erreur inconnue')
        setLoading(false)
      }
    } catch (err) {
      toast.error('Erreur Serveur')
      setLoading(false)
    }
  }

  return (
    <div className="p-4 lg:p-8 flex flex-col items-center justify-center min-h-[80vh]">
      <div className="text-center max-w-xl mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-4">Passez à la vitesse supérieure</h1>
        <p className="text-slate-500 text-lg">
          Accédez à votre tableau de bord Stockeesy en illimité et gérez votre business comme un pro.
        </p>
      </div>

      <Card className="w-full max-w-md border-slate-200 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-[#09B1BA]"></div>
        <CardHeader className="text-center pb-2 pt-8">
          <CardTitle className="text-2xl">Abonnement Pro</CardTitle>
          <CardDescription>Gérez votre stock sans limite</CardDescription>
        </CardHeader>
        <CardContent className="text-center pb-6">
          <div className="mt-4 flex items-baseline justify-center gap-x-2">
            <span className="text-5xl font-bold tracking-tight text-slate-900 dark:text-white">9.99€</span>
            <span className="text-sm font-semibold leading-6 tracking-wide text-slate-500">/mois</span>
          </div>
          <ul className="mt-8 space-y-3 text-sm leading-6 text-slate-600 dark:text-slate-400 text-left">
            <li className="flex gap-x-3">
              <Check className="h-6 w-5 flex-none text-[#09B1BA]" aria-hidden="true" />
              Ajouts de stocks illimités
            </li>
            <li className="flex gap-x-3">
              <Check className="h-6 w-5 flex-none text-[#09B1BA]" aria-hidden="true" />
              Calcul automatique de vos marges et bénéfices
            </li>
            <li className="flex gap-x-3">
              <Check className="h-6 w-5 flex-none text-[#09B1BA]" aria-hidden="true" />
              Gestion des frais et envois optimisée
            </li>
            <li className="flex gap-x-3">
              <Check className="h-6 w-5 flex-none text-[#09B1BA]" aria-hidden="true" />
              Support VIP par les créateurs
            </li>
          </ul>
        </CardContent>
        <CardFooter className="bg-slate-50 dark:bg-slate-900/50 p-6">
          <Button 
            className="w-full bg-[#09B1BA] hover:bg-[#0799a1] text-white font-semibold flex gap-2 h-12"
            onClick={handleSubscribe} 
            disabled={loading}
          >
            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <CreditCard className="w-5 h-5" />}
            {loading ? "Redirection..." : "S'abonner maintenant"}
          </Button>
        </CardFooter>
      </Card>

      <p className="text-sm text-slate-400 mt-8">
        Paiement 100% sécurisé via Stripe. Vous pouvez annuler à tout moment.
      </p>
    </div>
  )
}
