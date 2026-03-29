import { createClient } from '@/utils/supabase/server'
import { AddItemDialog } from './add-item-dialog'
import { InventoryClient } from './inventory-client'
import { InventoryFab } from './inventory-fab'
import { Pagination } from '@/components/pagination'
import Link from 'next/link'

const PAGE_SIZE = 20

export default async function InventoryPage({ searchParams }: { searchParams: Promise<{ status?: string; page?: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const params = await searchParams
  const status = params.status || 'en_stock'
  const page = Math.max(1, Number(params.page) || 1)
  const offset = (page - 1) * PAGE_SIZE

  // Counts for tab badges
  const [
    { count: stockCount },
    { count: transitCount },
    { count: soldCount },
  ] = await Promise.all([
    supabase.from('items').select('*', { count: 'exact', head: true }).eq('user_id', user.id).eq('status', 'en_stock'),
    supabase.from('items').select('*', { count: 'exact', head: true }).eq('user_id', user.id).eq('status', 'en_transit'),
    supabase.from('items').select('*', { count: 'exact', head: true }).eq('user_id', user.id).eq('status', 'vendu'),
  ])

  // Main query with pagination
  const { data: items, count: totalCount } = await supabase
    .from('items')
    .select('*', { count: 'exact', head: false })
    .eq('user_id', user.id)
    .eq('status', status)
    .order('created_at', { ascending: false })
    .range(offset, offset + PAGE_SIZE - 1)

  const totalPages = Math.ceil((totalCount || 0) / PAGE_SIZE)

  // Subscription check for free tier limit
  const { data: profile } = await supabase
    .from('users')
    .select('subscription_status, role')
    .eq('id', user.id)
    .single()

  const totalItemCount = (stockCount || 0) + (transitCount || 0) + (soldCount || 0)
  const isLimited = profile?.subscription_status !== 'active'
    && profile?.role !== 'admin'
    && totalItemCount >= 3

  const tabs = [
    { value: 'en_stock', label: 'En Stock', count: stockCount || 0 },
    { value: 'en_transit', label: 'En Transit', count: transitCount || 0 },
    { value: 'vendu', label: 'Vendus', count: soldCount || 0 },
  ]

  return (
    <div className="p-4 lg:p-8 flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Stock d'articles</h1>
          <p className="text-slate-500">Gérez votre inventaire et suivez vos ventes en cours.</p>
        </div>
        {/* Desktop: normal button | Mobile: hidden, replaced by FAB */}
        <div className="hidden sm:block">
          <AddItemDialog isLimited={isLimited} />
        </div>
      </div>

      {/* Status tabs */}
      <div className="flex gap-1 border-b">
        {tabs.map((tab) => (
          <Link
            key={tab.value}
            href={`/dashboard/inventory?status=${tab.value}&page=1`}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
              status === tab.value
                ? 'border-[#09B1BA] text-[#09B1BA]'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab.label} ({tab.count})
          </Link>
        ))}
      </div>

      <InventoryClient items={items || []} />

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        baseUrl="/dashboard/inventory"
        searchParams={{ status }}
      />

      {/* Mobile FAB */}
      <InventoryFab isLimited={isLimited} />
    </div>
  )
}
