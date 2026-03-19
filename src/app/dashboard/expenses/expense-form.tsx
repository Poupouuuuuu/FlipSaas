'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { addExpense } from './actions'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

export function AddExpenseForm() {
  const [loading, setLoading] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    try {
      await addExpense(formData)
      toast.success('Dépense ajoutée avec succès')
      formRef.current?.reset()
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Titre de la dépense</Label>
        <Input id="title" name="title" placeholder="Ex: Rouleau Scotch x2" required />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="amount">Montant (€)</Label>
        <Input id="amount" name="amount" type="number" step="0.01" min="0.01" placeholder="Ex: 5.99" required />
      </div>

      <Button type="submit" disabled={loading} className="w-full bg-[#09B1BA] hover:bg-[#0799a1]">
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Ajouter la dépense
      </Button>
    </form>
  )
}
