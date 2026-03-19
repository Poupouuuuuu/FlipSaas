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
          const compressedFile = new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), {
            type: 'image/jpeg',
            lastModified: Date.now(),
          })
          resolve(compressedFile)
        },
        'image/jpeg',
        quality
      )
    }
    img.onerror = () => reject(new Error('Impossible de lire l\'image'))
    img.src = URL.createObjectURL(file)
  })
}

interface ItemCardListProps {
  items: any[]
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
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {items.map((item) => (
        <ItemCard key={item.id} item={item} />
      ))}
    </div>
  )
}

function ItemCard({ item }: { item: any }) {
  const [soldDialogOpen, setSoldDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editImagePreview, setEditImagePreview] = useState<string | null>(null)
  const editCompressedFileRef = useRef<File | null>(null)

  const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    formData.append('item_id', item.id)
    
    // Replace raw image with compressed version if one was selected
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
    } catch (err: any) {
      toast.error(err.message)
    }
  }

  async function handleEditImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      setEditImagePreview(URL.createObjectURL(file))
      try {
        const compressed = await compressImage(file)
        editCompressedFileRef.current = compressed
      } catch {
        editCompressedFileRef.current = file
      }
    } else {
      setEditImagePreview(null)
      editCompressedFileRef.current = null
    }
  }

  const formatCurrency = (val: number) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(val)

  const handleTransitWithPrice = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    formData.append('item_id', item.id)
    formData.append('status', 'en_transit')
    try {
      await markItemAsSoldOrTransit(formData)
      toast.success('Article expédié ! En attente de livraison. 🚚')
      setSoldDialogOpen(false)
    } catch (err: any) {
      toast.error(err.message)
    }
  }

  const handleFinalizeSale = async () => {
    const formData = new FormData()
    formData.append('item_id', item.id)
    formData.append('status', 'vendu')
    try {
      await markItemAsSoldOrTransit(formData)
      toast.success("Vente terminée ! L'argent est ajouté à vos bénéfices. 💰")
    } catch (err: any) {
      toast.error(err.message)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) return
    const formData = new FormData()
    formData.append('item_id', item.id)
    try {
      await deleteItem(formData)
      toast.success('Article supprimé')
    } catch (err: any) {
      toast.error(err.message)
    }
  }

  // Determine the preview to show in the edit dialog
  const currentEditPreview = editImagePreview || item.image_url

  return (
    <Card className="flex flex-col overflow-hidden group">
      <div className="relative aspect-square bg-slate-100 dark:bg-slate-800">
        {item.image_url ? (
          <Image
            src={item.image_url}
            alt={item.title}
            fill
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

        <div className="absolute top-2 right-2 flex gap-1.5 z-10 transition-opacity duration-200">
          {item.status === 'en_stock' && (
            <Dialog open={editDialogOpen} onOpenChange={(open) => {
              setEditDialogOpen(open)
              if (!open) {
                setEditImagePreview(null)
                editCompressedFileRef.current = null
              }
            }}>
              <DialogTrigger render={<Button variant="secondary" size="icon" className="h-7 w-7 rounded-full bg-white/95 dark:bg-slate-900/95 hover:bg-white text-slate-700 dark:text-slate-300 shadow-sm"><Pencil className="h-3.5 w-3.5" /></Button>} />
              <DialogContent className="sm:max-w-[400px]">
                <DialogHeader>
                  <DialogTitle>Modifier l'article</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleEdit} className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <Label htmlFor={`edit-title-${item.id}`}>Titre</Label>
                    <Input id={`edit-title-${item.id}`} name="title" defaultValue={item.title} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`edit-listed-price-${item.id}`}>Prix affiché (€)</Label>
                    <Input id={`edit-listed-price-${item.id}`} name="listed_price" type="number" step="0.01" min="0" defaultValue={item.listed_price} required />
                  </div>

                  {/* Image edit section */}
                  <div className="space-y-2">
                    <Label htmlFor={`edit-image-${item.id}`}>Photo de l'article</Label>
                    <div className="flex flex-col items-center justify-center w-full">
                      <label htmlFor={`edit-image-${item.id}`} className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors overflow-hidden relative">
                        {currentEditPreview ? (
                          <img src={currentEditPreview} alt="Aperçu" className="w-full h-full object-cover" />
                        ) : (
                          <div className="flex flex-col items-center justify-center pt-5 pb-6 text-gray-500">
                            <ImageIcon className="w-8 h-8 mb-2" />
                            <p className="text-sm">Cliquez pour ajouter une photo</p>
                          </div>
                        )}
                        <Input
                          id={`edit-image-${item.id}`}
                          name="image"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleEditImageChange}
                        />
                      </label>
                      {currentEditPreview && (
                        <p className="text-xs text-slate-400 mt-1">Cliquez sur l'image pour la changer</p>
                      )}
                    </div>
                  </div>

                  <Button type="submit" className="w-full bg-[#09B1BA] hover:bg-[#0799a1] text-white">Enregistrer les modifications</Button>
                </form>
              </DialogContent>
            </Dialog>
          )}

          <Button 
            variant="secondary" 
            size="icon" 
            className="h-7 w-7 rounded-full bg-white/95 dark:bg-slate-900/95 hover:bg-red-50 dark:hover:bg-red-950 hover:text-red-600 dark:hover:text-red-400 text-slate-700 dark:text-slate-300 shadow-sm"
            onClick={handleDelete}
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
            <span className="font-bold text-emerald-600">{formatCurrency(item.sold_price - item.purchase_price)}</span>
          </div>
        )}
      </CardContent>

      <CardFooter className="p-0 border-t flex">
        {item.status === 'en_stock' && (
          <Dialog open={soldDialogOpen} onOpenChange={setSoldDialogOpen}>
            <DialogTrigger render={<Button variant="ghost" className="w-full rounded-none text-[#09B1BA] hover:text-[#0799a1] hover:bg-[#09B1BA]/10 font-medium" />}>
              <Truck className="w-4 h-4 mr-2" />
              Vendu (Expédier)
            </DialogTrigger>
            <DialogContent className="sm:max-w-[400px]">
              <DialogHeader>
                <DialogTitle>Super, article vendu ! 🎉</DialogTitle>
                <DialogDescription>
                  Entrez le prix net convenu (après négociation). L'article passera directement "En Transit" en attendant la livraison.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleTransitWithPrice} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor={`sold-price-${item.id}`}>Prix de vente convenu (€)</Label>
                  <Input id={`sold-price-${item.id}`} name="sold_price" type="number" step="0.01" min="0" required defaultValue={item.listed_price} />
                </div>
                <Button type="submit" className="w-full bg-[#09B1BA] hover:bg-[#0799a1] text-white">Confirmer l'expédition</Button>
              </form>
            </DialogContent>
          </Dialog>
        )}

        {item.status === 'en_transit' && (
          <Button onClick={handleFinalizeSale} variant="default" className="w-full rounded-none bg-emerald-500 hover:bg-emerald-600 text-white font-medium">
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
  )
}
