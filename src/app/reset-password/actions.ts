'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function resetPassword(formData: FormData) {
  const password = formData.get('password') as string
  const supabase = await createClient()

  // Cette API met à jour le mot de passe de l'utilisateur actuellement connecté par la session du lien email
  const { error } = await supabase.auth.updateUser({
    password: password
  })

  if (error) {
    redirect(`/reset-password?error=${error.message}`)
  }

  // Dès que le mot de passe est enregistré, on l'envoie direct sur son dashboard.
  redirect('/dashboard')
}
