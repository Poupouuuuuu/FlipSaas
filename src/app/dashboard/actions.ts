'use server'

import { createClient } from '@/utils/supabase/server'

export async function setOnboarded() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Utilisateur non connecté')
  }

  const { error } = await supabase
    .from('users')
    .update({ has_onboarded: true })
    .eq('id', user.id)

  if (error) {
    throw new Error("Erreur lors de la mise à jour du profil")
  }
}
