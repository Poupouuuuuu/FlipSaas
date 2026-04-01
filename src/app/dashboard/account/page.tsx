'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CreditCard, ExternalLink, Loader2, Mail, Shield, User } from 'lucide-react'
import { toast } from 'sonner'
import { createClient } from '@/utils/supabase/client'

export default function AccountPage() {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [subscriptionStatus, setSubscriptionStatus] = useState<string | null>(null)

  useEffect(() => {
    async function loadUser() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setEmail(user.email || '')
        const { data } = await supabase
          .from('users')
          .select('subscription_status')
          .eq('id', user.id)
          .single()
        setSubscriptionStatus(data?.subscription_status || null)
      }
    }
    loadUser()
  }, [])

  async function handleManageSubscription() {
    setLoading(true)
    try {
      const res = await fetch('/api/stripe/portal', { method: 'POST' })
      const data = await res.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        toast.error(data.error || 'Erreur inconnue')
        setLoading(false)
      }
    } catch {
      toast.error('Erreur serveur')
      setLoading(false)
    }
  }

  const isSubscribed = subscriptionStatus === 'active'

  return (
    <div className="p-4 lg:p-8 max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Mon compte</h1>
        <p className="text-slate-500 mt-1">Gérez vos informations et votre abonnement.</p>
      </div>

      {/* Profil */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <User className="h-5 w-5 text-[#09B1BA]" />
            Profil
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-3 text-sm">
            <Mail className="h-4 w-4 text-slate-400" />
            <span className="text-slate-600 dark:text-slate-300">{email || '...'}</span>
          </div>
        </CardContent>
      </Card>

      {/* Abonnement */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <CreditCard className="h-5 w-5 text-[#09B1BA]" />
            Abonnement
          </CardTitle>
          <CardDescription>
            {isSubscribed
              ? 'Vous êtes abonné Pro. Gérez votre abonnement via le portail Stripe.'
              : 'Vous utilisez la version gratuite.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
              isSubscribed
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
            }`}>
              {isSubscribed ? 'Pro actif' : 'Gratuit'}
            </span>
          </div>

          {isSubscribed && (
            <Button
              className="mt-4 bg-[#09B1BA] hover:bg-[#0799a1] text-white gap-2"
              onClick={handleManageSubscription}
              disabled={loading}
            >
              {loading ? <Loader2 className="animate-spin h-4 w-4" /> : <ExternalLink className="h-4 w-4" />}
              Gérer mon abonnement
            </Button>
          )}

          {!isSubscribed && (
            <a href="/dashboard/subscription">
              <Button className="mt-4 bg-[#09B1BA] hover:bg-[#0799a1] text-white gap-2">
                <CreditCard className="h-4 w-4" />
                Passer Pro
              </Button>
            </a>
          )}
        </CardContent>
      </Card>

      {/* Sécurité */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Shield className="h-5 w-5 text-[#09B1BA]" />
            Sécurité
          </CardTitle>
        </CardHeader>
        <CardContent>
          <a href="/forgot-password">
            <Button variant="outline" className="gap-2">
              Changer mon mot de passe
            </Button>
          </a>
        </CardContent>
      </Card>
    </div>
  )
}
