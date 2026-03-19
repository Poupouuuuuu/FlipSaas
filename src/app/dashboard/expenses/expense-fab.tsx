'use client'

import { useState, useRef } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { addExpense } from './actions'
import { toast } from 'sonner'

export function ExpenseFab() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    try {
      await addExpense(formData)
      toast.success('Dépense ajoutée avec succès')
      setOpen(false)
      formRef.current?.reset()
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="sm:hidden fixed bottom-20 right-4 z-40 h-14 w-14 rounded-full bg-[#09B1BA] hover:bg-[#0799a1] text-white shadow-lg shadow-[#09B1BA]/30 flex items-center justify-center active:scale-95 transition-all duration-200"
        aria-label="Ajouter une dépense"
      >
        <Plus className="h-7 w-7" />
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Nouvelle dépense</DialogTitle>
            <DialogDescription>
              Ajoutez un frais annexe (boost, carton, scotch...).
            </DialogDescription>
          </DialogHeader>
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fab-expense-title">Titre de la dépense</Label>
              <Input id="fab-expense-title" name="title" placeholder="Ex: Rouleau Scotch x2" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fab-expense-amount">Montant (€)</Label>
              <Input id="fab-expense-amount" name="amount" type="number" step="0.01" min="0.01" placeholder="Ex: 5.99" required />
            </div>
            <Button type="submit" disabled={loading} className="w-full bg-[#09B1BA] hover:bg-[#0799a1] text-white">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Ajouter la dépense
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
