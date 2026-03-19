import { KpiCards } from './kpi-cards'
import { RecentSales } from './recent-sales'
import { QuickActions } from './quick-actions'
import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-6 md:gap-8">
      <div className="bg-gradient-to-r from-[#09B1BA]/10 via-transparent to-transparent -mx-4 -mt-4 p-4 lg:-mx-8 lg:-mt-8 lg:p-8 rounded-b-3xl border-b border-white/20 dark:border-slate-800/20 mb-2">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-1 text-slate-800 dark:text-slate-100">Tableau de bord</h1>
        <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 font-medium max-w-2xl">
          Suivez vos performances et développez votre activité.
        </p>
      </div>

      <Suspense fallback={<DashboardSkeleton />}>
        <KpiCards />
      </Suspense>

      {/* Quick Actions */}
      <QuickActions />

      {/* Recent Sales */}
      <Suspense fallback={<RecentSalesSkeleton />}>
        <RecentSales />
      </Suspense>
    </div>
  )
}

function DashboardSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="rounded-xl border bg-card text-card-foreground shadow space-y-2 p-6">
          <Skeleton className="h-4 w-[150px]" />
          <Skeleton className="h-8 w-[100px]" />
          <Skeleton className="h-3 w-[200px]" />
        </div>
      ))}
    </div>
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
