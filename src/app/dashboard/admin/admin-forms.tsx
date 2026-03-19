'use client'

import { useState } from 'react'
import { inviteUserAction, deleteUserAction } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Loader2, Trash2 } from 'lucide-react'

export function InviteUserForm() {
  const [loading, setLoading] = useState(false)

  async function handleInvite(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    try {
      await inviteUserAction(formData)
      toast.success('Invitation envoyée ! Le client a reçu un email contenant son Magic Link.')
      e.currentTarget.reset()
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleInvite} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email du nouvel utilisateur</Label>
        <Input id="email" name="email" type="email" placeholder="client@exemple.com" required />
      </div>
      <Button type="submit" disabled={loading} className="w-full">
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Envoyer le lien magique
      </Button>
    </form>
  )
}

export function DeleteUserButton({ userId }: { userId: string }) {
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!confirm('Êtes-vous SÛR ET CERTAIN de vouloir supprimer ce compte client et toutes ses données ?')) return
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('user_id', userId)
      await deleteUserAction(formData)
      toast.success('Compte client supprimé')
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={handleDelete} 
      disabled={loading}
      className="text-slate-400 hover:text-red-500 hover:bg-red-50"
      title="Supprimer le client, ses stocks et ses données"
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
    </Button>
  )
}
