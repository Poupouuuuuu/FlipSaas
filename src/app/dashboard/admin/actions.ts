'use server'

import { createAdminClient } from '@/utils/supabase/admin'
import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

async function checkAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false

  const { data } = await supabase.from('users').select('role').eq('id', user.id).single()
  return data?.role === 'admin'
}

export async function inviteUserAction(formData: FormData) {
  const isAdmin = await checkAdmin()
  if (!isAdmin) throw new Error('Accès refusé')

  const email = formData.get('email') as string
  const adminClient = createAdminClient()

  // Envoyer un Magic Link via l'API Admin
  const { data, error } = await adminClient.auth.admin.inviteUserByEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`
  })

  // Avec inviteUserByEmail, Supabase va créer l'utilisateur dans auth.users
  // Le trigger de base de données que l'on a oublié ou pas fait doit créer l'entrée dans public.users
  // MAIS comme nous n'avons pas fait de trigger SQL, nous devons le faire manuellement ici si la table 'users' ne l'a pas
  
  if (error) throw new Error(error.message)

  if (data?.user) {
    // S'assurer qu'il existe dans public.users
    const { data: existingUser } = await adminClient.from('users').select('id').eq('id', data.user.id).single()
    if (!existingUser) {
      await adminClient.from('users').insert({
        id: data.user.id,
        email: data.user.email
      })
    }
  }

  revalidatePath('/dashboard/admin')
  return { success: true }
}

export async function deleteUserAction(formData: FormData) {
  const isAdmin = await checkAdmin()
  if (!isAdmin) throw new Error('Accès refusé')

  const userId = formData.get('user_id') as string
  const adminClient = createAdminClient()

  const { error } = await adminClient.auth.admin.deleteUser(userId)
  if (error) throw new Error("Erreur de suppression de l'utilisateur")

  revalidatePath('/dashboard/admin')
  return { success: true }
}
