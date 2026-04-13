import { Skeleton } from '@/components/ui/skeleton'

export default function DashboardLoading() {
  return (
    <div className="flex flex-col gap-6 md:gap-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#09B1BA]/10 via-transparent to-transparent -mx-4 -mt-4 p-4 lg:-mx-8 lg:-mt-8 lg:p-8 rounded-b-3xl border-b border-white/20 dark:border-slate-800/20 mb-2">
        <Skeleton className="h-6 md:h-8 w-48 mb-2" />
        <Skeleton className="h-4 w-72" />
      </div>

      {/* KPI cards mobile */}
      <div className="md:hidden">
        <div className="flex gap-3 overflow-hidden -mx-4 px-4">
          <Skeleton className="min-w-[75vw] h-32 rounded-xl flex-shrink-0" />
          <Skeleton className="min-w-[75vw] h-32 rounded-xl flex-shrink-0" />
        </div>
        <div className="grid grid-cols-2 gap-3 mt-4">
          <Skeleton className="h-20 rounded-xl" />
          <Skeleton className="h-20 rounded-xl" />
        </div>
      </div>

      {/* KPI cards desktop */}
      <div className="hidden md:grid gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-xl" />
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-3 gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-20 rounded-xl" />
        ))}
      </div>

      {/* Recent sales */}
      <Skeleton className="h-64 rounded-xl" />
    </div>
  )
}
