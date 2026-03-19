import { KpiCards } from './kpi-cards'
import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-8">
      <div className="bg-gradient-to-r from-[#09B1BA]/10 via-transparent to-transparent -mx-4 -mt-4 p-4 lg:-mx-8 lg:-mt-8 lg:p-8 rounded-b-3xl border-b border-white/20 dark:border-slate-800/20 mb-2">
        <h1 className="text-3xl font-bold tracking-tight mb-2 text-slate-800 dark:text-slate-100">Tableau de bord</h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium max-w-2xl">
          Suivez vos performances financières, surveillez votre stock et développez votre activité de revente.
        </p>
      </div>

      <Suspense fallback={<DashboardSkeleton />}>
        <KpiCards />
      </Suspense>

      {/* Raccourcis ou graphiques à ajouter plus tard ici */}
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
