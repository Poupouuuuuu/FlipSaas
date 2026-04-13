import { KpiCards } from './kpi-cards'
import { RecentSales } from './recent-sales'
import { QuickActions } from './quick-actions'
import { WeeklyStats } from './weekly-stats'
import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { createClient } from '@/utils/supabase/server'

export default async function Dashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let isLimited = false
  if (user) {
    const [profileRes, countRes] = await Promise.all([
      supabase.from('users').select('subscription_status, role').eq('id', user.id).single(),
      supabase.from('items').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
    ])
    const profile = profileRes.data
    const count = countRes.count
    isLimited = profile?.subscription_status !== 'active'
      && profile?.role !== 'admin'
      && (count || 0) >= 3
  }

  return (
    <div className="flex flex-col gap-5 md:gap-8">
      {/* Header - compact on mobile */}
      <div className="bg-gradient-to-r from-[#09B1BA]/10 via-transparent to-transparent -mx-4 -mt-4 p-4 lg:-mx-8 lg:-mt-8 lg:p-8 rounded-b-3xl border-b border-white/20 dark:border-slate-800/20">
        <h1 className="text-lg md:text-3xl font-bold tracking-tight mb-0.5 md:mb-1 text-slate-800 dark:text-slate-100">Tableau de bord</h1>
        <p className="text-xs md:text-base text-slate-500 dark:text-slate-400 font-medium max-w-2xl hidden md:block">
          Suivez vos performances et développez votre activité.
        </p>
      </div>

      {/* Weekly Stats - the first thing you see */}
      <Suspense fallback={<Skeleton className="h-32 rounded-xl" />}>
        <WeeklyStats />
      </Suspense>

      {/* KPI Cards */}
      <Suspense fallback={<DashboardSkeleton />}>
        <KpiCards />
      </Suspense>

      {/* Quick Actions */}
      <QuickActions isLimited={isLimited} />

      {/* Recent Sales */}
      <Suspense fallback={<RecentSalesSkeleton />}>
        <RecentSales />
      </Suspense>
    </div>
  )
}

function DashboardSkeleton() {
  return (
    <>
      {/* Mobile */}
      <div className="md:hidden space-y-3">
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      </div>
      {/* Desktop */}
      <div className="hidden md:grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton key={i} className="h-32 rounded-xl" />
        ))}
      </div>
    </>
  )
}

function RecentSalesSkeleton() {
  return (
    <div className="rounded-xl border bg-card p-6 space-y-4">
      <Skeleton className="h-5 w-[180px]" />
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-lg" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-4 w-[140px]" />
            <Skeleton className="h-3 w-[80px]" />
          </div>
          <Skeleton className="h-5 w-[60px]" />
        </div>
      ))}
    </div>
  )
}
