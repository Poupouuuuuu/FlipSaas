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
import { toast } from 'sonner' // Requires 'sonner' to be a standard component or similar, we installed it

export function AddItemDialog() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const formRef = useRef<HTMLFormElement>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    
    try {
      await addItem(formData)
      toast.success('Article ajouté au stock ! 🎉')
      setOpen(false)
      formRef.current?.reset()
      setImagePreview(null)
    } catch (err: any) {
      toast.error(err.message || 'Une erreur est survenue.')
    } finally {
      setLoading(false)
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
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      setImagePreview(URL.createObjectURL(file))
                    } else {
                      setImagePreview(null)
                    }
                  }}
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
