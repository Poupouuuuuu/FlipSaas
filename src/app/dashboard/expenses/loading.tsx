import { Skeleton } from '@/components/ui/skeleton'

export default function ExpensesLoading() {
  return (
    <div className="p-4 lg:p-8 flex flex-col gap-8 max-w-4xl mx-auto w-full">
      {/* Header */}
      <Skeleton className="h-6 sm:h-8 w-36" />

      {/* Mobile: compact expense cards */}
      <div className="flex flex-col gap-2 sm:hidden">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
            <Skeleton className="h-9 w-9 rounded-lg flex-shrink-0" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-3 w-20" />
            </div>
            <Skeleton className="h-4 w-14" />
          </div>
        ))}
      </div>

      {/* Desktop: table */}
      <div className="hidden sm:grid md:grid-cols-3 gap-8 items-start">
        <Skeleton className="h-56 rounded-xl" />
        <div className="md:col-span-2 space-y-4">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-64 rounded-xl" />
        </div>
      </div>
    </div>
  )
}
