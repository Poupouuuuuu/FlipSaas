'use client'

import { useState, useRef } from 'react'
import { Plus } from 'lucide-react'
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
import { addItem } from './actions'
import { toast } from 'sonner'
import { compressImage } from '@/lib/compress-image'
import { UpgradeTriggerFab } from '../upgrade-modal'

export function InventoryFab({ isLimited = false }: { isLimited?: boolean }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const compressedFileRef = useRef<File | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    if (compressedFileRef.current) {
      formData.delete('image')
      formData.append('image', compressedFileRef.current)
    }
    try {
      await addItem(formData)
      toast.success('Article ajouté au stock ! 🎉')
      setOpen(false)
      formRef.current?.reset()
      setImagePreview(null)
      compressedFileRef.current = null
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

  if (isLimited) {
    return <UpgradeTriggerFab />
  }

  return (
    <>
      {/* FAB - only visible on mobile */}
      <button
        onClick={() => setOpen(true)}
        className="sm:hidden fixed bottom-20 right-4 z-40 h-14 w-14 rounded-full bg-[#09B1BA] hover:bg-[#0799a1] text-white shadow-lg shadow-[#09B1BA]/30 flex items-center justify-center active:scale-95 transition-all duration-200"
        aria-label="Ajouter un article"
      >
        <Plus className="h-7 w-7" />
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Ajouter au stock</DialogTitle>
            <DialogDescription>
              Renseignez les détails de votre nouvel article.
            </DialogDescription>
          </DialogHeader>
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fab-title">Titre de l'article</Label>
              <Input id="fab-title" name="title" placeholder="Ex: Pull Ralph Lauren" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fab-purchase_price">Prix d'achat (€)</Label>
                <Input id="fab-purchase_price" name="purchase_price" type="number" step="0.01" min="0" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fab-listed_price">Prix affiché (€)</Label>
                <Input id="fab-listed_price" name="listed_price" type="number" step="0.01" min="0" required />
              </div>
            </div>
            <div className="space-y-3">
              <Label htmlFor="fab-image">Photo (Optionnel)</Label>
              <div className="flex flex-col items-center justify-center w-full">
                <label htmlFor="fab-image" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors overflow-hidden relative">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Aperçu" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6 text-gray-500">
                      <Plus className="w-8 h-8 mb-2" />
                      <p className="text-sm">Cliquez pour ajouter une photo</p>
                    </div>
                  )}
                  <Input id="fab-image" name="image" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                </label>
              </div>
            </div>
            <div className="pt-4 flex justify-end">
              <Button type="submit" disabled={loading} className="bg-[#09B1BA] hover:bg-[#0799a1] text-white">
                {loading ? 'Ajout en cours...' : 'Ajouter au stock'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
