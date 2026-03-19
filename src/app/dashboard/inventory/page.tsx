import { createClient } from '@/utils/supabase/server'
import { AddItemDialog } from './add-item-dialog'
import { InventoryClient } from './inventory-client'

export default async function InventoryPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const { data: items } = await supabase
    .from('items')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="p-4 lg:p-8 flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Stock d'articles</h1>
          <p className="text-slate-500">Gérez votre inventaire et suivez vos ventes en cours.</p>
        </div>
        <AddItemDialog />
      </div>

      <InventoryClient items={items || []} />
    </div>
  )
}
