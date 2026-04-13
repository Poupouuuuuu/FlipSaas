'use client'

import { useState, useRef } from 'react'
import { Package, Receipt, Plus, Loader2, X, Repeat, Ruler } from 'lucide-react'
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
import { compressImage } from '@/lib/compress-image'
import { UpgradeTriggerCard } from './upgrade-modal'
import type { SizeVariant } from '@/types'

const PRESET_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

export function QuickActions({ isLimited = false }: { isLimited?: boolean }) {
  const [itemDialogOpen, setItemDialogOpen] = useState(false)
  const [expenseDialogOpen, setExpenseDialogOpen] = useState(false)
  const [itemLoading, setItemLoading] = useState(false)
  const [expenseLoading, setExpenseLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isPermanent, setIsPermanent] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [useSizes, setUseSizes] = useState(false)
  const [variants, setVariants] = useState<SizeVariant[]>([])
  const [customSize, setCustomSize] = useState('')
  const itemFormRef = useRef<HTMLFormElement>(null)
  const expenseFormRef = useRef<HTMLFormElement>(null)
  const compressedFileRef = useRef<File | null>(null)

  function resetItemState() {
    setImagePreview(null)
    compressedFileRef.current = null
    setIsPermanent(false)
    setQuantity(1)
    setUseSizes(false)
    setVariants([])
    setCustomSize('')
  }

  async function handleAddItem(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setItemLoading(true)
    const formData = new FormData(e.currentTarget)
    if (compressedFileRef.current) {
      formData.delete('image')
      formData.append('image', compressedFileRef.current)
    }

    const totalQty = useSizes ? variants.reduce((sum, v) => sum + v.qty, 0) : quantity
    formData.set('quantity', String(totalQty))
    formData.set('is_permanent', isPermanent ? 'true' : 'false')
    if (useSizes && variants.length > 0) {
      formData.set('variants', JSON.stringify(variants))
    }
    if (isPermanent) {
      formData.set('purchase_price', '0')
    }

    try {
      await addItem(formData)
      toast.success(totalQty > 1 ? `${totalQty} articles ajoutés ! 🎉` : 'Article ajouté au stock ! 🎉')
      setItemDialogOpen(false)
      itemFormRef.current?.reset()
      resetItemState()
    } catch (err: unknown) {
      toast.error((err as Error).message || 'Une erreur est survenue.')
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
    } catch (err: unknown) {
      toast.error((err as Error).message)
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

  function addSize(size: string) {
    if (!size.trim()) return
    const existing = variants.find(v => v.size === size.trim())
    if (existing) {
      setVariants(variants.map(v => v.size === size.trim() ? { ...v, qty: v.qty + 1 } : v))
    } else {
      setVariants([...variants, { size: size.trim(), qty: 1 }])
    }
    setCustomSize('')
  }

  function updateVariantQty(size: string, qty: number) {
    if (qty <= 0) {
      setVariants(variants.filter(v => v.size !== size))
    } else {
      setVariants(variants.map(v => v.size === size ? { ...v, qty } : v))
    }
  }

  function removeVariant(size: string) {
    setVariants(variants.filter(v => v.size !== size))
  }

  const totalSizeQty = variants.reduce((sum, v) => sum + v.qty, 0)

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

        {isLimited ? (
          <UpgradeTriggerCard />
        ) : (
          <button
            onClick={() => setItemDialogOpen(true)}
            className="flex flex-col items-center gap-2 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-card hover:border-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 transition-all group active:scale-[0.98]"
          >
            <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 group-hover:bg-emerald-200 dark:group-hover:bg-emerald-900/50 transition-colors">
              <Plus className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <span className="text-xs font-medium text-slate-600 dark:text-slate-400 text-center">Ajouter article</span>
          </button>
        )}

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
      <Dialog open={itemDialogOpen} onOpenChange={setItemDialogOpen}>
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

            {/* Toggle options */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsPermanent(!isPermanent)
                  if (!isPermanent) setUseSizes(false)
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  isPermanent ? 'bg-amber-500 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                <Repeat className="h-3 w-3" />
                Permanent
              </button>
              {!isPermanent && (
                <button
                  type="button"
                  onClick={() => setUseSizes(!useSizes)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    useSizes ? 'bg-[#09B1BA] text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Ruler className="h-3 w-3" />
                  Tailles
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              {!isPermanent && (
                <div className="space-y-2">
                  <Label htmlFor="qa-purchase_price">Prix d'achat (€)</Label>
                  <Input id="qa-purchase_price" name="purchase_price" type="number" step="0.01" min="0" required />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="qa-listed_price">Prix affiché (€)</Label>
                <Input id="qa-listed_price" name="listed_price" type="number" step="0.01" min="0" required />
              </div>
              {isPermanent && (
                <div className="space-y-2">
                  <Label>Prix d'achat</Label>
                  <div className="flex items-center h-10 px-3 rounded-md border bg-slate-50 dark:bg-slate-800 text-sm text-slate-400">
                    0 € (frais)
                  </div>
                  <input type="hidden" name="purchase_price" value="0" />
                </div>
              )}
            </div>

            {/* Quantity */}
            {!useSizes && (
              <div className="space-y-2">
                <Label>Quantité</Label>
                <div className="flex items-center gap-3">
                  <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))} className="h-9 w-9 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center text-lg font-medium active:scale-95">-</button>
                  <span className="w-8 text-center font-semibold text-lg">{quantity}</span>
                  <button type="button" onClick={() => setQuantity(quantity + 1)} className="h-9 w-9 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center text-lg font-medium active:scale-95">+</button>
                </div>
              </div>
            )}

            {/* Sizes */}
            {useSizes && (
              <div className="space-y-3">
                <Label>Tailles et quantités</Label>
                <div className="flex flex-wrap gap-1.5">
                  {PRESET_SIZES.map(size => {
                    const existing = variants.find(v => v.size === size)
                    return (
                      <button key={size} type="button" onClick={() => addSize(size)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${existing ? 'bg-[#09B1BA] text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'}`}>
                        {size}{existing ? ` (${existing.qty})` : ''}
                      </button>
                    )
                  })}
                </div>
                <div className="flex gap-2">
                  <Input value={customSize} onChange={(e) => setCustomSize(e.target.value)} placeholder="Taille perso (42, Unique...)" className="text-sm" onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSize(customSize) } }} />
                  <Button type="button" variant="outline" size="icon" className="shrink-0" onClick={() => addSize(customSize)} disabled={!customSize.trim()}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {variants.length > 0 && (
                  <div className="space-y-2">
                    {variants.map(v => (
                      <div key={v.size} className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                        <span className="text-sm font-medium flex-1">{v.size}</span>
                        <div className="flex items-center gap-1.5">
                          <button type="button" onClick={() => updateVariantQty(v.size, v.qty - 1)} className="h-7 w-7 rounded border text-sm flex items-center justify-center active:scale-95">-</button>
                          <span className="w-6 text-center text-sm font-semibold">{v.qty}</span>
                          <button type="button" onClick={() => updateVariantQty(v.size, v.qty + 1)} className="h-7 w-7 rounded border text-sm flex items-center justify-center active:scale-95">+</button>
                        </div>
                        <button type="button" onClick={() => removeVariant(v.size)} className="h-7 w-7 rounded-full text-slate-400 hover:text-red-500 flex items-center justify-center">
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                    <p className="text-xs text-slate-400 text-right">Total : {totalSizeQty} article{totalSizeQty > 1 ? 's' : ''}</p>
                  </div>
                )}
              </div>
            )}

            {/* Photo */}
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

            <Button type="submit" disabled={itemLoading || (useSizes && variants.length === 0)} className="w-full bg-[#09B1BA] hover:bg-[#0799a1] text-white">
              {itemLoading ? 'Ajout en cours...' : useSizes ? `Ajouter ${totalSizeQty} article${totalSizeQty > 1 ? 's' : ''}` : quantity > 1 ? `Ajouter ${quantity} articles` : 'Ajouter au stock'}
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
