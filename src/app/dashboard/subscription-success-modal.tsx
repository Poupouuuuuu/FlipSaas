'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { PartyPopper, Heart, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'

export function SubscriptionSuccessModal() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      setOpen(true)
    }
  }, [searchParams])

  function handleClose() {
    setOpen(false)
    // Nettoyer l'URL
    router.replace('/dashboard', { scroll: false })
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose() }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-2 h-14 w-14 rounded-full bg-gradient-to-br from-[#09B1BA] to-[#06D6A0] flex items-center justify-center">
            <PartyPopper className="h-7 w-7 text-white" />
          </div>
          <DialogTitle className="text-center text-xl">
            Merci pour ta confiance !
          </DialogTitle>
          <DialogDescription className="text-center">
            Ton abonnement est actif. Bienvenue dans la famille Stockeesy Pro.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex gap-3 p-3 rounded-lg bg-[#09B1BA]/5 border border-[#09B1BA]/10">
            <Heart className="h-5 w-5 text-[#09B1BA] shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium">Tu fais partie des premiers utilisateurs</p>
              <p className="text-xs text-slate-500 mt-0.5">
                Ton avis compte pour nous. Chaque suggestion sera prise en compte pour faire évoluer Stockeesy.
              </p>
            </div>
          </div>

          <div className="flex gap-3 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30">
            <MessageCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium">Accès VIP au support</p>
              <p className="text-xs text-slate-500 mt-0.5">
                Une idée, un bug, une question ? Écris-nous directement à{' '}
                <a href="mailto:lecharlesadam0137@gmail.com" className="text-[#09B1BA] underline">
                  lecharlesadam0137@gmail.com
                </a>
                {' '} — on répond vite.
              </p>
            </div>
          </div>
        </div>

        <Button
          onClick={handleClose}
          className="w-full bg-gradient-to-r from-[#09B1BA] to-[#06D6A0] text-white hover:opacity-90"
        >
          C&apos;est parti, je gère mon stock !
        </Button>
      </DialogContent>
    </Dialog>
  )
}
