import { createClient } from '@/utils/supabase/server'
import { AddExpenseForm } from './expense-form'
import { ExpenseList } from './expense-list'

export default async function ExpensesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const { data: expenses } = await supabase
    .from('expenses')
    .select('*')
    .eq('user_id', user.id)
    .order('date', { ascending: false })

  return (
    <div className="p-4 lg:p-8 flex flex-col gap-8 max-w-4xl mx-auto w-full">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Frais annexes</h1>
        <p className="text-slate-500">
          Ajoutez vos dépenses globales (Boosts, cartons, scotch, imprimante) pour calculer votre bénéfice net réel.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 items-start">
        <div className="md:col-span-1 rounded-xl border bg-card text-card-foreground shadow p-6">
          <h2 className="font-semibold text-lg mb-4">Nouvelle dépense</h2>
          <AddExpenseForm />
        </div>
        
        <div className="md:col-span-2">
          <h2 className="font-semibold text-lg mb-4">Historique des dépenses</h2>
          <ExpenseList expenses={expenses || []} />
        </div>
      </div>
    </div>
  )
}
