'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, X, Repeat, Ruler } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { addItem } from './actions'
import { toast } from 'sonner'
import { compressImage } from '@/lib/compress-image'
import { UpgradeTriggerButton } from '../upgrade-modal'
import type { SizeVariant } from '@/types'

const PRESET_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

export function AddItemDialog({ isLimited = false }: { isLimited?: boolean }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isPermanent, setIsPermanent] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [useSizes, setUseSizes] = useState(false)
  const [variants, setVariants] = useState<SizeVariant[]>([])
  const [customSize, setCustomSize] = useState('')
  const formRef = useRef<HTMLFormElement>(null)
  const compressedFileRef = useRef<File | null>(null)

  function resetState() {
    setImagePreview(null)
    compressedFileRef.current = null
    setIsPermanent(false)
    setQuantity(1)
    setUseSizes(false)
    setVariants([])
    setCustomSize('')
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)

    if (compressedFileRef.current) {
      formData.delete('image')
      formData.append('image', compressedFileRef.current)
    }

    // Add quantity/permanent/variants
    const totalQty = useSizes ? variants.reduce((sum, v) => sum + v.qty, 0) : quantity
    formData.set('quantity', String(totalQty))
    formData.set('is_permanent', isPermanent ? 'true' : 'false')

    if (useSizes && variants.length > 0) {
      formData.set('variants', JSON.stringify(variants))
    }

    // Permanent items have purchase_price = 0
    if (isPermanent) {
      formData.set('purchase_price', '0')
    }

    try {
      await addItem(formData)
      toast.success(totalQty > 1 ? `${totalQty} articles ajoutés au stock ! 🎉` : 'Article ajouté au stock ! 🎉')
      setOpen(false)
      formRef.current?.reset()
      resetState()
    } catch (err: unknown) {
      toast.error((err as Error).message || 'Une erreur est survenue.')
    } finally {
      setLoading(false)
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

  if (isLimited) {
    return <UpgradeTriggerButton />
  }

  const totalSizeQty = variants.reduce((sum, v) => sum + v.qty, 0)

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) resetState() }}>
      <DialogTrigger render={<Button className="bg-[#09B1BA] hover:bg-[#0799a1] text-white" />}>
        <Plus className="mr-2 h-4 w-4" />
        Ajouter un article
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ajouter au stock</DialogTitle>
          <DialogDescription>
            Renseignez les détails de votre nouvel article.
          </DialogDescription>
        </DialogHeader>
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Titre de l'article</Label>
            <Input id="title" name="title" placeholder="Ex: Pull Ralph Lauren" required />
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
                isPermanent
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
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
                  useSizes
                    ? 'bg-[#09B1BA] text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
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
                <Label htmlFor="purchase_price">Prix d'achat (€)</Label>
                <Input id="purchase_price" name="purchase_price" type="number" step="0.01" min="0" required />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="listed_price">Prix affiché (€)</Label>
              <Input id="listed_price" name="listed_price" type="number" step="0.01" min="0" required />
            </div>
            {isPermanent && (
              <div className="space-y-2">
                <Label htmlFor="purchase_price_hidden">Prix d'achat</Label>
                <div className="flex items-center h-10 px-3 rounded-md border bg-slate-50 dark:bg-slate-800 text-sm text-slate-400">
                  0 € (dans les frais)
                </div>
                <input type="hidden" name="purchase_price" value="0" />
              </div>
            )}
          </div>

          {/* Quantity (when no sizes) */}
          {!useSizes && (
            <div className="space-y-2">
              <Label>Quantité</Label>
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))} className="h-9 w-9 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center text-lg font-medium active:scale-95 transition-transform">-</button>
                <span className="w-8 text-center font-semibold text-lg">{quantity}</span>
                <button type="button" onClick={() => setQuantity(quantity + 1)} className="h-9 w-9 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center text-lg font-medium active:scale-95 transition-transform">+</button>
              </div>
            </div>
          )}

          {/* Sizes */}
          {useSizes && (
            <div className="space-y-3">
              <Label>Tailles et quantités</Label>

              {/* Preset sizes */}
              <div className="flex flex-wrap gap-1.5">
                {PRESET_SIZES.map(size => {
                  const existing = variants.find(v => v.size === size)
                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => addSize(size)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        existing
                          ? 'bg-[#09B1BA] text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                      }`}
                    >
                      {size}{existing ? ` (${existing.qty})` : ''}
                    </button>
                  )
                })}
              </div>

              {/* Custom size input */}
              <div className="flex gap-2">
                <Input
                  value={customSize}
                  onChange={(e) => setCustomSize(e.target.value)}
                  placeholder="Taille perso (42, Unique...)"
                  className="text-sm"
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSize(customSize) } }}
                />
                <Button type="button" variant="outline" size="icon" className="shrink-0" onClick={() => addSize(customSize)} disabled={!customSize.trim()}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {/* Selected variants */}
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
            <Label htmlFor="image">Photo (Optionnel)</Label>
            <label htmlFor="image" className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors overflow-hidden relative">
              {imagePreview ? (
                <img src={imagePreview} alt="Aperçu" className="w-full h-full object-cover" />
              ) : (
                <div className="flex items-center gap-2 text-gray-500">
                  <Plus className="w-5 h-5" />
                  <p className="text-sm">Ajouter une photo</p>
                </div>
              )}
              <Input id="image" name="image" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            </label>
          </div>

          <Button type="submit" disabled={loading || (useSizes && variants.length === 0)} className="w-full bg-[#09B1BA] hover:bg-[#0799a1] text-white">
            {loading ? 'Ajout en cours...' : useSizes ? `Ajouter ${totalSizeQty} article${totalSizeQty > 1 ? 's' : ''}` : quantity > 1 ? `Ajouter ${quantity} articles` : 'Ajouter au stock'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
