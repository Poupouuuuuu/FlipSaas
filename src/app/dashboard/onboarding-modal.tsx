'use client'

import { useState } from 'react'
import { Package, Truck, BarChart3 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { setOnboarded } from './actions'

const steps = [
  {
    icon: Package,
    title: 'Ajoute ton premier article',
    description:
      "Clique sur le bouton + pour ajouter un article avec son prix d'achat, prix de vente et une photo.",
  },
  {
    icon: Truck,
    title: 'Suis tes envois',
    description:
      "Marque un article comme 'En transit' quand tu l'expédies, puis 'Vendu' quand il est livré.",
  },
  {
    icon: BarChart3,
    title: 'Consulte ton dashboard',
    description:
      'Tes profits, ta marge moyenne et ton stock sont calculés automatiquement.',
  },
]

export function OnboardingModal({ show }: { show: boolean }) {
  const [open, setOpen] = useState(show)
  const [loading, setLoading] = useState(false)

  async function handleClose() {
    setLoading(true)
    try {
      await setOnboarded()
    } catch {
      // silently fail — modal won't reappear thanks to local state
    }
    setOpen(false)
    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose() }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Bienvenue sur Stockeesy 👋</DialogTitle>
          <DialogDescription>
            Voici comment démarrer en 3 étapes
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-4">
          {steps.map((step, i) => (
            <div key={step.title} className="flex gap-4">
              <div className="flex-shrink-0 h-10 w-10 rounded-xl bg-[#09B1BA]/10 flex items-center justify-center">
                <step.icon className="h-5 w-5 text-[#09B1BA]" />
              </div>
              <div>
                <p className="text-sm font-semibold">
                  {i + 1}. {step.title}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <Button
          onClick={handleClose}
          disabled={loading}
          className="w-full bg-gradient-to-r from-[#09B1BA] to-[#06D6A0] text-white hover:opacity-90"
        >
          {loading ? 'Chargement...' : "C'est parti !"}
        </Button>
      </DialogContent>
    </Dialog>
  )
}
