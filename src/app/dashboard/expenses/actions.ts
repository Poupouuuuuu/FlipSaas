'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addExpense(formData: FormData) {
  const title = formData.get('title') as string
  const amount = Number(formData.get('amount'))

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Non autorisé')

  const { error } = await supabase.from('expenses').insert({
    user_id: user.id,
    title,
    amount
  })

  if (error) throw new Error("Erreur lors de l'ajout de la dépense")

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/expenses')
}

export async function deleteExpense(formData: FormData) {
  const expenseId = formData.get('expense_id') as string

  const supabase = await createClient()

  const { error } = await supabase.from('expenses').delete().eq('id', expenseId)

  if (error) throw new Error('Erreur lors de la suppression')

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/expenses')
}
