import { getUser, createClient } from '@/utils/supabase/server'
import { AddExpenseForm } from './expense-form'
import { ExpenseList } from './expense-list'
import { ExpenseFab } from './expense-fab'
import { Pagination } from '@/components/pagination'

const PAGE_SIZE = 20

export default async function ExpensesPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const user = await getUser()
  if (!user) return null

  const supabase = await createClient()

  const params = await searchParams
  const page = Math.max(1, Number(params.page) || 1)
  const offset = (page - 1) * PAGE_SIZE

  const { data: expenses, count: totalCount } = await supabase
    .from('expenses')
    .select('*', { count: 'exact', head: false })
    .eq('user_id', user.id)
    .order('date', { ascending: false })
    .range(offset, offset + PAGE_SIZE - 1)

  const totalPages = Math.ceil((totalCount || 0) / PAGE_SIZE)

  return (
    <div className="p-4 lg:p-8 flex flex-col gap-8 max-w-4xl mx-auto w-full">
      <div>
        <h1 className="text-xl sm:text-3xl font-bold tracking-tight sm:mb-2">Frais annexes</h1>
        <p className="text-slate-500 text-sm hidden sm:block">
          Ajoutez vos dépenses globales (Boosts, cartons, scotch, imprimante) pour calculer votre bénéfice net réel.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 items-start">
        {/* Desktop: form visible | Mobile: hidden, use FAB */}
        <div className="hidden md:block md:col-span-1 rounded-xl border bg-card text-card-foreground shadow p-6">
          <h2 className="font-semibold text-lg mb-4">Nouvelle dépense</h2>
          <AddExpenseForm />
        </div>

        <div className="md:col-span-2">
          <h2 className="font-semibold text-lg mb-4">Historique des dépenses</h2>
          <ExpenseList expenses={expenses || []} />
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            baseUrl="/dashboard/expenses"
          />
        </div>
      </div>

      {/* Mobile FAB */}
      <ExpenseFab />
    </div>
  )
}
