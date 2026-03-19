'use client'

import { useState, useRef } from 'react'
import { Package, Receipt, Plus, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { toast } from 'sonner'
import { addItem } from './inventory/actions'
import { addExpense } from './expenses/actions'

async function compressImage(file: File, maxWidth = 1200, quality = 0.7): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new window.Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      let { width, height } = img
      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width)
        width = maxWidth
      }
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      if (!ctx) { resolve(file); return }
      ctx.drawImage(img, 0, 0, width, height)
      canvas.toBlob(
        (blob) => {
          if (!blob) { resolve(file); return }
          resolve(new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), { type: 'image/jpeg', lastModified: Date.now() }))
        },
        'image/jpeg',
        quality
      )
    }
    img.onerror = () => reject(new Error('Impossible de lire l\'image'))
    img.src = URL.createObjectURL(file)
  })
}

export function QuickActions() {
  const [itemDialogOpen, setItemDialogOpen] = useState(false)
  const [expenseDialogOpen, setExpenseDialogOpen] = useState(false)
  const [itemLoading, setItemLoading] = useState(false)
  const [expenseLoading, setExpenseLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const itemFormRef = useRef<HTMLFormElement>(null)
  const expenseFormRef = useRef<HTMLFormElement>(null)
  const compressedFileRef = useRef<File | null>(null)

  async function handleAddItem(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setItemLoading(true)
    const formData = new FormData(e.currentTarget)
    if (compressedFileRef.current) {
      formData.delete('image')
      formData.append('image', compressedFileRef.current)
    }
    try {
      await addItem(formData)
      toast.success('Article ajouté au stock ! 🎉')
      setItemDialogOpen(false)
      itemFormRef.current?.reset()
      setImagePreview(null)
      compressedFileRef.current = null
    } catch (err: any) {
      toast.error(err.message || 'Une erreur est survenue.')
    } finally {
      setItemLoading(false)
    }
  }

  async function handleAddExpense(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setExpenseLoading(true)
    const formData = new FormData(e.currentTarget)
    try {
      await addExpense(formData)
      toast.success('Dépense ajoutée avec succès')
      setExpenseDialogOpen(false)
      expenseFormRef.current?.reset()
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setExpenseLoading(false)
    }
  }

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      setImagePreview(URL.createObjectURL(file))
      try {
        compressedFileRef.current = await compressImage(file)
      } catch {
        compressedFileRef.current = file
      }
    } else {
      setImagePreview(null)
      compressedFileRef.current = null
    }
  }

  return (
    <>
      <div className="grid grid-cols-3 gap-3">
        <Link
          href="/dashboard/inventory"
          className="flex flex-col items-center gap-2 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-card hover:border-[#09B1BA]/30 hover:bg-[#09B1BA]/5 transition-all group active:scale-[0.98]"
        >
          <div className="p-2.5 rounded-xl bg-[#09B1BA]/10 group-hover:bg-[#09B1BA]/20 transition-colors">
            <Package className="h-5 w-5 text-[#09B1BA]" />
          </div>
          <span className="text-xs font-medium text-slate-600 dark:text-slate-400 text-center">Voir le stock</span>
        </Link>

        <button
          onClick={() => setItemDialogOpen(true)}
          className="flex flex-col items-center gap-2 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-card hover:border-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 transition-all group active:scale-[0.98]"
        >
          <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 group-hover:bg-emerald-200 dark:group-hover:bg-emerald-900/50 transition-colors">
            <Plus className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <span className="text-xs font-medium text-slate-600 dark:text-slate-400 text-center">Ajouter article</span>
        </button>

        <button
          onClick={() => setExpenseDialogOpen(true)}
          className="flex flex-col items-center gap-2 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-card hover:border-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/20 transition-all group active:scale-[0.98]"
        >
          <div className="p-2.5 rounded-xl bg-amber-100 dark:bg-amber-900/30 group-hover:bg-amber-200 dark:group-hover:bg-amber-900/50 transition-colors">
            <Receipt className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          </div>
          <span className="text-xs font-medium text-slate-600 dark:text-slate-400 text-center">Ajouter dépense</span>
        </button>
      </div>

      {/* Add Item Dialog */}
      <Dialog open={itemDialogOpen} onOpenChange={(open) => {
        setItemDialogOpen(open)
        if (!open) { setImagePreview(null); compressedFileRef.current = null }
      }}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Ajouter au stock</DialogTitle>
            <DialogDescription>Renseignez les détails de votre nouvel article.</DialogDescription>
          </DialogHeader>
          <form ref={itemFormRef} onSubmit={handleAddItem} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="qa-title">Titre de l'article</Label>
              <Input id="qa-title" name="title" placeholder="Ex: Pull Ralph Lauren" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="qa-purchase_price">Prix d'achat (€)</Label>
                <Input id="qa-purchase_price" name="purchase_price" type="number" step="0.01" min="0" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="qa-listed_price">Prix affiché (€)</Label>
                <Input id="qa-listed_price" name="listed_price" type="number" step="0.01" min="0" required />
              </div>
            </div>
            <div className="space-y-3">
              <Label htmlFor="qa-image">Photo (Optionnel)</Label>
              <label htmlFor="qa-image" className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors overflow-hidden relative">
                {imagePreview ? (
                  <img src={imagePreview} alt="Aperçu" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex items-center gap-2 text-gray-500">
                    <Plus className="w-5 h-5" />
                    <p className="text-sm">Ajouter une photo</p>
                  </div>
                )}
                <Input id="qa-image" name="image" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              </label>
            </div>
            <Button type="submit" disabled={itemLoading} className="w-full bg-[#09B1BA] hover:bg-[#0799a1] text-white">
              {itemLoading ? 'Ajout en cours...' : 'Ajouter au stock'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Expense Dialog */}
      <Dialog open={expenseDialogOpen} onOpenChange={setExpenseDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Nouvelle dépense</DialogTitle>
            <DialogDescription>Ajoutez un frais annexe (boost, carton, scotch...).</DialogDescription>
          </DialogHeader>
          <form ref={expenseFormRef} onSubmit={handleAddExpense} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="qa-expense-title">Titre de la dépense</Label>
              <Input id="qa-expense-title" name="title" placeholder="Ex: Rouleau Scotch x2" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="qa-expense-amount">Montant (€)</Label>
              <Input id="qa-expense-amount" name="amount" type="number" step="0.01" min="0.01" placeholder="Ex: 5.99" required />
            </div>
            <Button type="submit" disabled={expenseLoading} className="w-full bg-[#09B1BA] hover:bg-[#0799a1] text-white">
              {expenseLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Ajouter la dépense
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
