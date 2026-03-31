'use client'

import { useState, useEffect } from 'react'
import { Lock, Check, Zap, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import Link from 'next/link'

export function UpgradeModal({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const [price, setPrice] = useState('4,99')

  useEffect(() => {
    fetch('/api/stripe/price')
      .then(res => res.json())
      .then(data => { if (data.price) setPrice(data.price) })
      .catch(() => {})
  }, [])

  return (
    <>
      <button onClick={() => setOpen(true)} className="contents">
        {children}
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mx-auto mb-2 h-12 w-12 rounded-full bg-gradient-to-br from-[#09B1BA] to-[#06D6A0] flex items-center justify-center">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <DialogTitle className="text-center text-xl">Passe en illimité</DialogTitle>
            <DialogDescription className="text-center">
              Tu as atteint la limite de 3 articles gratuits. Débloque tout Stockeesy pour développer ton activité.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-4">
            {[
              'Articles et dépenses illimités',
              'Dashboard financier complet',
              'Photos compressées automatiquement',
              'Partage avec un proche',
              'Support prioritaire',
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-3">
                <div className="h-5 w-5 rounded-full bg-[#09B1BA]/10 flex items-center justify-center shrink-0">
                  <Check className="h-3 w-3 text-[#09B1BA]" />
                </div>
                <span className="text-sm text-slate-600 dark:text-slate-300">{feature}</span>
              </div>
            ))}
          </div>

          <div className="text-center mb-2">
            <span className="text-3xl font-extrabold">{price} €</span>
            <span className="text-sm text-slate-500">/mois</span>
            <p className="text-xs text-[#09B1BA] font-medium mt-1">Offre de lancement — places limitées</p>
          </div>

          <Link
            href="/dashboard/subscription"
            onClick={() => setOpen(false)}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gradient-to-r from-[#09B1BA] to-[#06D6A0] text-white font-semibold hover:opacity-90 transition-opacity"
          >
            S&apos;abonner maintenant
            <ArrowRight className="h-4 w-4" />
          </Link>

          <button
            onClick={() => setOpen(false)}
            className="w-full text-center text-xs text-slate-400 hover:text-slate-600 transition-colors"
          >
            Non merci, je reste en gratuit
          </button>
        </DialogContent>
      </Dialog>
    </>
  )
}

export function UpgradeTriggerCard() {
  return (
    <UpgradeModal>
      <div className="flex flex-col items-center gap-2 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 transition-all group active:scale-[0.98] cursor-pointer hover:border-[#09B1BA]/30">
        <div className="p-2.5 rounded-xl bg-[#09B1BA]/10">
          <Lock className="h-5 w-5 text-[#09B1BA]" />
        </div>
        <span className="text-xs font-medium text-slate-500 text-center">Limite atteinte</span>
      </div>
    </UpgradeModal>
  )
}

export function UpgradeTriggerButton() {
  return (
    <UpgradeModal>
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#09B1BA]/10 to-[#06D6A0]/10 border border-[#09B1BA]/20 text-[#09B1BA] text-sm font-medium hover:from-[#09B1BA]/20 hover:to-[#06D6A0]/20 transition-colors cursor-pointer">
        <Lock className="h-4 w-4" />
        Limite atteinte — Passer Pro
      </div>
    </UpgradeModal>
  )
}

export function UpgradeTriggerFab() {
  return (
    <UpgradeModal>
      <div className="sm:hidden fixed bottom-20 right-4 z-40 h-14 w-14 rounded-full bg-gradient-to-br from-[#09B1BA] to-[#06D6A0] text-white shadow-lg flex items-center justify-center cursor-pointer">
        <Lock className="h-6 w-6" />
      </div>
    </UpgradeModal>
  )
}
