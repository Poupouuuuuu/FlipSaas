'use client'

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Package, Truck, Check, Trash2, Pencil, Plus, ImageIcon } from 'lucide-react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { markItemAsSoldOrTransit, deleteItem, editItem } from './actions'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useState, useRef } from 'react'
import { compressImage } from '@/lib/compress-image'
import type { Item } from '@/types'

interface ItemCardListProps {
  items: Item[]
  emptyMessage: string
}

export function ItemCardList({ items, emptyMessage }: ItemCardListProps) {
  if (!items || items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center border rounded-xl bg-slate-50/50 dark:bg-slate-900/50 border-dashed">
        <Package className="h-10 w-10 text-slate-400 mb-4" />
        <p className="text-slate-500 font-medium">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <>
      {/* Mobile: compact list */}
      <div className="flex flex-col gap-2 sm:hidden">
        {items.map((item) => (
          <MobileItemCard key={item.id} item={item} />
        ))}
      </div>

      {/* Desktop: grid cards */}
      <div className="hidden sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((item) => (
          <DesktopItemCard key={item.id} item={item} />
        ))}
      </div>
    </>
  )
}

const formatCurrency = (val: number) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(val)

// ─── Shared logic hook ────────────────────────────────────────────

function useItemActions(item: Item) {
  const [soldDialogOpen, setSoldDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editImagePreview, setEditImagePreview] = useState<string | null>(null)
  const [showCelebration, setShowCelebration] = useState(false)
  const editCompressedFileRef = useRef<File | null>(null)

  const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    formData.append('item_id', item.id)
    if (editCompressedFileRef.current) {
      formData.delete('image')
      formData.append('image', editCompressedFileRef.current)
    }
    try {
      await editItem(formData)
      toast.success('Article modifié avec succès')
      setEditDialogOpen(false)
      setEditImagePreview(null)
      editCompressedFileRef.current = null
    } catch (err: unknown) {
      toast.error((err as Error).message)
    }
  }

  async function handleEditImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      setEditImagePreview(URL.createObjectURL(file))
      try {
        editCompressedFileRef.current = await compressImage(file)
      } catch {
        editCompressedFileRef.current = file
      }
    } else {
      setEditImagePreview(null)
      editCompressedFileRef.current = null
    }
  }

  const handleTransitWithPrice = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    formData.append('item_id', item.id)
    formData.append('status', 'en_transit')
    try {
      await markItemAsSoldOrTransit(formData)
      toast.success('Article expédié ! En attente de livraison. 🚚')
      setSoldDialogOpen(false)
    } catch (err: unknown) {
      toast.error((err as Error).message)
    }
  }

  const handleFinalizeSale = async () => {
    const formData = new FormData()
    formData.append('item_id', item.id)
    formData.append('status', 'vendu')
    try {
      await markItemAsSoldOrTransit(formData)
      setShowCelebration(true)
      toast.success("Vente terminée ! L'argent est ajouté à vos bénéfices. 💰")
      setTimeout(() => setShowCelebration(false), 2500)
    } catch (err: unknown) {
      toast.error((err as Error).message)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) return
    const formData = new FormData()
    formData.append('item_id', item.id)
    try {
      await deleteItem(formData)
      toast.success('Article supprimé')
    } catch (err: unknown) {
      toast.error((err as Error).message)
    }
  }

  const currentEditPreview = editImagePreview || item.image_url

  return {
    soldDialogOpen, setSoldDialogOpen,
    editDialogOpen, setEditDialogOpen,
    editImagePreview, setEditImagePreview,
    showCelebration,
    editCompressedFileRef,
    currentEditPreview,
    handleEdit, handleEditImageChange,
    handleTransitWithPrice, handleFinalizeSale, handleDelete,
  }
}

// ─── Edit Dialog (shared) ─────────────────────────────────────────

function EditDialog({ item, open, onOpenChange, onSubmit, onImageChange, currentPreview, compressedFileRef }: {
  item: Item
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  currentPreview: string | null
  compressedFileRef: React.MutableRefObject<File | null>
}) {
  return (
    <Dialog open={open} onOpenChange={(v) => {
      onOpenChange(v)
      if (!v) compressedFileRef.current = null
    }}>
      <DialogContent className="sm:max-w-[400px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Modifier l'article</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor={`edit-title-${item.id}`}>Titre</Label>
            <Input id={`edit-title-${item.id}`} name="title" defaultValue={item.title} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`edit-listed-price-${item.id}`}>Prix affiché (€)</Label>
            <Input id={`edit-listed-price-${item.id}`} name="listed_price" type="number" step="0.01" min="0" defaultValue={item.listed_price} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`edit-image-${item.id}`}>Photo de l'article</Label>
            <div className="flex flex-col items-center justify-center w-full">
              <label htmlFor={`edit-image-${item.id}`} className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors overflow-hidden relative">
                {currentPreview ? (
                  <img src={currentPreview} alt="Aperçu" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center justify-center pt-5 pb-6 text-gray-500">
                    <ImageIcon className="w-8 h-8 mb-2" />
                    <p className="text-sm">Cliquez pour ajouter une photo</p>
                  </div>
                )}
                <Input id={`edit-image-${item.id}`} name="image" type="file" accept="image/*" className="hidden" onChange={onImageChange} />
              </label>
              {currentPreview && <p className="text-xs text-slate-400 mt-1">Cliquez sur l'image pour la changer</p>}
            </div>
          </div>
          <Button type="submit" className="w-full bg-[#09B1BA] hover:bg-[#0799a1] text-white">Enregistrer</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// ─── Sold Dialog (shared) ─────────────────────────────────────────

function SoldDialog({ item, open, onOpenChange, onSubmit }: {
  item: Item
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Super, article vendu ! 🎉</DialogTitle>
          <DialogDescription>
            Entrez le prix net convenu (après négociation).
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor={`sold-price-${item.id}`}>Prix de vente convenu (€)</Label>
            <Input id={`sold-price-${item.id}`} name="sold_price" type="number" step="0.01" min="0" required defaultValue={item.listed_price} />
          </div>
          <Button type="submit" className="w-full bg-[#09B1BA] hover:bg-[#0799a1] text-white">Confirmer l'expédition</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// ─── Celebration Overlay (shared) ─────────────────────────────────

function CelebrationOverlay() {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-xl">
      <div className="flex flex-col items-center gap-2">
        <div className="text-4xl animate-sale-check">✅</div>
        <p className="text-sm font-bold text-emerald-600 animate-sale-check" style={{ animationDelay: '0.2s' }}>Vendu !</p>
        <div className="flex gap-1 mt-1">
          {['🎉', '💰', '🎊', '✨', '🎉'].map((emoji, i) => (
            <span key={i} className="text-lg animate-confetti-pop" style={{ animationDelay: `${0.1 * i}s` }}>{emoji}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── MOBILE Card (compact horizontal) ─────────────────────────────

function MobileItemCard({ item }: { item: Item }) {
  const actions = useItemActions(item)
  const profit = item.status === 'vendu' ? (item.sold_price ?? 0) - item.purchase_price : null

  return (
    <>
      <div className="relative flex items-stretch gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-card overflow-hidden active:bg-slate-50 dark:active:bg-slate-800/50 transition-colors">
        {actions.showCelebration && <CelebrationOverlay />}

        {/* Thumbnail */}
        <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 flex-shrink-0">
          {item.image_url ? (
            <Image
              src={item.image_url}
              alt={item.title}
              fill
              sizes="64px"
              loading="lazy"
              className="object-cover"
            />
          ) : (
            <div className="flex w-full h-full justify-center items-center text-slate-400">
              <Package className="h-6 w-6 opacity-50" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <h3 className="font-semibold text-sm leading-tight truncate">{item.title}</h3>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs text-slate-400">Achat {formatCurrency(item.purchase_price)}</span>
          </div>
          {item.status === 'vendu' && profit !== null && (
            <span className={`text-xs font-bold mt-0.5 ${profit >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
              {profit >= 0 ? '+' : ''}{formatCurrency(profit)}
            </span>
          )}
          {item.status === 'en_transit' && item.sold_price && (
            <span className="text-xs font-medium text-amber-500 mt-0.5">
              Convenu : {formatCurrency(item.sold_price)}
            </span>
          )}
        </div>

        {/* Right: price + actions */}
        <div className="flex flex-col items-end justify-between flex-shrink-0">
          <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{formatCurrency(item.listed_price)}</span>

          <div className="flex gap-1">
            {item.status === 'en_stock' && (
              <>
                <button
                  onClick={() => actions.setSoldDialogOpen(true)}
                  className="h-7 w-7 rounded-full bg-[#09B1BA]/10 flex items-center justify-center active:scale-95 transition-transform"
                >
                  <Truck className="h-3.5 w-3.5 text-[#09B1BA]" />
                </button>
                <button
                  onClick={() => actions.setEditDialogOpen(true)}
                  className="h-7 w-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center active:scale-95 transition-transform"
                >
                  <Pencil className="h-3.5 w-3.5 text-slate-500" />
                </button>
              </>
            )}
            {item.status === 'en_transit' && (
              <button
                onClick={actions.handleFinalizeSale}
                className="h-7 px-2.5 rounded-full bg-emerald-500 flex items-center justify-center gap-1 active:scale-95 transition-transform"
              >
                <Check className="h-3.5 w-3.5 text-white" />
                <span className="text-[10px] font-bold text-white">Livré</span>
              </button>
            )}
            {item.status === 'vendu' && (
              <span className="text-[10px] font-medium text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-1 rounded-full">
                {item.sold_at ? format(new Date(item.sold_at), 'dd MMM', { locale: fr }) : 'Vendu'}
              </span>
            )}
            <button
              onClick={actions.handleDelete}
              className="h-7 w-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center active:scale-95 transition-transform"
            >
              <Trash2 className="h-3.5 w-3.5 text-slate-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <SoldDialog item={item} open={actions.soldDialogOpen} onOpenChange={actions.setSoldDialogOpen} onSubmit={actions.handleTransitWithPrice} />
      <EditDialog
        item={item}
        open={actions.editDialogOpen}
        onOpenChange={(open) => {
          actions.setEditDialogOpen(open)
          if (!open) actions.setEditImagePreview(null)
        }}
        onSubmit={actions.handleEdit}
        onImageChange={actions.handleEditImageChange}
        currentPreview={actions.currentEditPreview}
        compressedFileRef={actions.editCompressedFileRef}
      />
    </>
  )
}

// ─── DESKTOP Card (original vertical layout) ─────────────────────

function DesktopItemCard({ item }: { item: Item }) {
  const actions = useItemActions(item)
  const currentEditPreview = actions.currentEditPreview

  return (
    <>
      <Card className="flex flex-col overflow-hidden group relative">
        {actions.showCelebration && <CelebrationOverlay />}

        <div className="relative aspect-square bg-slate-100 dark:bg-slate-800">
          {item.image_url ? (
            <Image
              src={item.image_url}
              alt={item.title}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              loading="lazy"
              className="object-cover"
            />
          ) : (
            <div className="flex w-full h-full justify-center items-center text-slate-400">
              <Package className="h-12 w-12 opacity-50" />
            </div>
          )}
          <div className="absolute top-2 left-2 bg-black/60 text-white px-2 py-1 rounded text-xs font-medium backdrop-blur-sm shadow-sm pointer-events-none">
            {formatCurrency(item.listed_price)}
          </div>

          <div className="absolute top-2 right-2 flex gap-1.5 z-10">
            {item.status === 'en_stock' && (
              <Button
                variant="secondary"
                size="icon"
                className="h-7 w-7 rounded-full bg-white/95 dark:bg-slate-900/95 hover:bg-white text-slate-700 dark:text-slate-300 shadow-sm"
                onClick={() => actions.setEditDialogOpen(true)}
              >
                <Pencil className="h-3.5 w-3.5" />
              </Button>
            )}
            <Button
              variant="secondary"
              size="icon"
              className="h-7 w-7 rounded-full bg-white/95 dark:bg-slate-900/95 hover:bg-red-50 dark:hover:bg-red-950 hover:text-red-600 dark:hover:text-red-400 text-slate-700 dark:text-slate-300 shadow-sm"
              onClick={actions.handleDelete}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        <CardHeader className="p-4 pb-2">
          <h3 className="font-semibold text-lg leading-tight truncate" title={item.title}>{item.title}</h3>
          <p className="text-xs text-slate-500">Ajouté le {format(new Date(item.created_at), 'dd MMM yyyy', { locale: fr })}</p>
        </CardHeader>

        <CardContent className="p-4 pt-0 flex-1">
          <div className="flex justify-between items-center text-sm mb-2">
            <span className="text-slate-500">Acheté à:</span>
            <span className="font-medium text-red-500">{formatCurrency(item.purchase_price)}</span>
          </div>
          {(item.status === 'vendu' || item.status === 'en_transit') && item.sold_price && (
            <div className="flex justify-between items-center text-sm border-t border-slate-100 dark:border-slate-800 pt-2 mt-2">
              <span className="text-slate-500 text-xs">{item.status === 'vendu' ? 'Vendu à:' : 'Prix convenu:'}</span>
              <span className={`font-bold ${item.status === 'vendu' ? 'text-emerald-500' : 'text-amber-500'}`}>
                {formatCurrency(item.sold_price)}
              </span>
            </div>
          )}
          {item.status === 'vendu' && (
            <div className="flex justify-between items-center text-sm mt-1">
              <span className="text-slate-500 text-xs">Bénéfice Net:</span>
              <span className="font-bold text-emerald-600">{formatCurrency((item.sold_price ?? 0) - item.purchase_price)}</span>
            </div>
          )}
        </CardContent>

        <CardFooter className="p-0 border-t flex">
          {item.status === 'en_stock' && (
            <Button variant="ghost" className="w-full rounded-none text-[#09B1BA] hover:text-[#0799a1] hover:bg-[#09B1BA]/10 font-medium" onClick={() => actions.setSoldDialogOpen(true)}>
              <Truck className="w-4 h-4 mr-2" />
              Vendu (Expédier)
            </Button>
          )}
          {item.status === 'en_transit' && (
            <Button onClick={actions.handleFinalizeSale} variant="default" className="w-full rounded-none bg-emerald-500 hover:bg-emerald-600 text-white font-medium">
              <Check className="w-4 h-4 mr-2" />
              Colis Livré (Récupérer l'argent)
            </Button>
          )}
          {item.status === 'vendu' && (
            <div className="w-full p-2 text-center text-sm font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30">
              Vente finalisée le {item.sold_at ? format(new Date(item.sold_at), 'dd MMM', { locale: fr }) : 'N/A'}
            </div>
          )}
        </CardFooter>
      </Card>

      {/* Dialogs */}
      <SoldDialog item={item} open={actions.soldDialogOpen} onOpenChange={actions.setSoldDialogOpen} onSubmit={actions.handleTransitWithPrice} />
      <EditDialog
        item={item}
        open={actions.editDialogOpen}
        onOpenChange={(open) => {
          actions.setEditDialogOpen(open)
          if (!open) actions.setEditImagePreview(null)
        }}
        onSubmit={actions.handleEdit}
        onImageChange={actions.handleEditImageChange}
        currentPreview={currentEditPreview}
        compressedFileRef={actions.editCompressedFileRef}
      />
    </>
  )
}
