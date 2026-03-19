'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus } from 'lucide-react'
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

export function AddItemDialog() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const compressedFileRef = useRef<File | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    
    // Replace the raw image with the compressed version
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
    } catch (err: any) {
      toast.error(err.message || 'Une erreur est survenue.')
    } finally {
      setLoading(false)
    }
  }

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      setImagePreview(URL.createObjectURL(file))
      try {
        const compressed = await compressImage(file)
        compressedFileRef.current = compressed
      } catch {
        compressedFileRef.current = file
      }
    } else {
      setImagePreview(null)
      compressedFileRef.current = null
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button className="bg-[#09B1BA] hover:bg-[#0799a1] text-white" />}>
        <Plus className="mr-2 h-4 w-4" />
        Ajouter un article
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ajouter au stock</DialogTitle>
          <DialogDescription>
            Renseignez les détails de votre nouvel article (prix d'achat moyen, prix visé...).
          </DialogDescription>
        </DialogHeader>
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Titre de l'article</Label>
            <Input id="title" name="title" placeholder="Ex: Pull Ralph Lauren" required />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="purchase_price">Prix d'achat (€)</Label>
              <Input id="purchase_price" name="purchase_price" type="number" step="0.01" min="0" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="listed_price">Prix affiché public (€)</Label>
              <Input id="listed_price" name="listed_price" type="number" step="0.01" min="0" required />
            </div>
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="image">Photo de l'article (Optionnel)</Label>
            <div className="flex flex-col items-center justify-center w-full">
              <label htmlFor="image" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors overflow-hidden relative">
                {imagePreview ? (
                  <img src={imagePreview} alt="Aperçu" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center justify-center pt-5 pb-6 text-gray-500">
                    <Plus className="w-8 h-8 mb-2" />
                    <p className="text-sm">Cliquez pour ajouter une photo</p>
                  </div>
                )}
                <Input 
                  id="image" 
                  name="image" 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleImageChange}
                />
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
  )
}
