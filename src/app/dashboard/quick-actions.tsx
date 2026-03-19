'use client'

import Link from 'next/link'
import { Package, Receipt, Plus } from 'lucide-react'

export function QuickActions() {
  return (
    <div className="grid grid-cols-3 gap-3">
      <Link
        href="/dashboard/inventory"
        className="flex flex-col items-center gap-2 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-card hover:border-[#09B1BA]/30 hover:bg-[#09B1BA]/5 transition-all group active:scale-[0.98]"
      >
        <div className="p-2.5 rounded-xl bg-[#09B1BA]/10 group-hover:bg-[#09B1BA]/20 transition-colors">
          <Package className="h-5 w-5 text-[#09B1BA]" />
        </div>
        <span className="text-xs font-medium text-slate-600 dark:text-slate-400 text-center">Voir le stock</span>
      </Link>

      <Link
        href="/dashboard/inventory"
        className="flex flex-col items-center gap-2 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-card hover:border-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 transition-all group active:scale-[0.98]"
      >
        <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 group-hover:bg-emerald-200 dark:group-hover:bg-emerald-900/50 transition-colors">
          <Plus className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
        </div>
        <span className="text-xs font-medium text-slate-600 dark:text-slate-400 text-center">Ajouter article</span>
      </Link>

      <Link
        href="/dashboard/expenses"
        className="flex flex-col items-center gap-2 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-card hover:border-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/20 transition-all group active:scale-[0.98]"
      >
        <div className="p-2.5 rounded-xl bg-amber-100 dark:bg-amber-900/30 group-hover:bg-amber-200 dark:group-hover:bg-amber-900/50 transition-colors">
          <Receipt className="h-5 w-5 text-amber-600 dark:text-amber-400" />
        </div>
        <span className="text-xs font-medium text-slate-600 dark:text-slate-400 text-center">Ajouter dépense</span>
      </Link>
    </div>
  )
}
