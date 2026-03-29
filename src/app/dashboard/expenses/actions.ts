'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { addExpenseSchema } from '@/lib/validations'

export async function addExpense(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Non autorisé')

  // Validation Zod
  const parsed = addExpenseSchema.safeParse({
    title: formData.get('title'),
    amount: Number(formData.get('amount')),
  })

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0].message)
  }

  const { title, amount } = parsed.data

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
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Non autorisé')

  const expenseId = formData.get('expense_id') as string

  // Ownership check : .eq('user_id', user.id)
  const { error, count } = await supabase
    .from('expenses')
    .delete({ count: 'exact' })
    .eq('id', expenseId)
    .eq('user_id', user.id)

  if (error) throw new Error('Erreur lors de la suppression')

  if (count === 0) {
    throw new Error('Dépense introuvable ou non autorisée')
  }

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/expenses')
}
