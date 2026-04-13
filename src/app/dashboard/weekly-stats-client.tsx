'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { TrendingUp, TrendingDown, Minus, ShoppingBag, Euro, ChevronLeft, ChevronRight } from 'lucide-react'
import { format, startOfWeek, endOfWeek, subWeeks, isWithinInterval } from 'date-fns'
import { fr } from 'date-fns/locale'

interface SoldItem {
  sold_price: number | null
  purchase_price: number
  sold_at: string | null
}

interface WeeklyStatsClientProps {
  soldItems: SoldItem[]
}

export function WeeklyStatsClient({ soldItems }: WeeklyStatsClientProps) {
  const [weekOffset, setWeekOffset] = useState(0) // 0 = this week, 1 = last week, etc.

  const { currentWeek, previousWeek, weekLabel, isCurrentWeek } = useMemo(() => {
    const now = new Date()
    const targetDate = subWeeks(now, weekOffset)
    const comparisonDate = subWeeks(now, weekOffset + 1)

    const targetStart = startOfWeek(targetDate, { weekStartsOn: 1 })
    const targetEnd = endOfWeek(targetDate, { weekStartsOn: 1 })
    const compStart = startOfWeek(comparisonDate, { weekStartsOn: 1 })
    const compEnd = endOfWeek(comparisonDate, { weekStartsOn: 1 })

    const filterByRange = (start: Date, end: Date) =>
      soldItems.filter(item => {
        if (!item.sold_at) return false
        const d = new Date(item.sold_at)
        return isWithinInterval(d, { start, end })
      })

    const current = filterByRange(targetStart, targetEnd)
    const previous = filterByRange(compStart, compEnd)

    const label = weekOffset === 0
      ? 'Cette semaine'
      : weekOffset === 1
      ? 'Semaine dernière'
      : `Sem. du ${format(targetStart, 'dd MMM', { locale: fr })}`

    return {
      currentWeek: current,
      previousWeek: previous,
      weekLabel: label,
      isCurrentWeek: weekOffset === 0,
    }
  }, [soldItems, weekOffset])

  const calcStats = (items: SoldItem[]) => ({
    count: items.length,
    revenue: items.reduce((acc, item) => acc + Number(item.sold_price || 0), 0),
    profit: items.reduce((acc, item) => acc + (Number(item.sold_price || 0) - Number(item.purchase_price || 0)), 0),
  })

  const tw = calcStats(currentWeek)
  const lw = calcStats(previousWeek)

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value)

  const stats = [
    { label: 'Ventes', value: tw.count, prev: lw.count, format: (v: number) => String(v) },
    { label: 'CA', value: tw.revenue, prev: lw.revenue, format: formatCurrency },
    { label: 'Profit', value: tw.profit, prev: lw.profit, format: formatCurrency },
  ]

  // Motivational message
  let message = ''
  if (tw.count === 0 && soldItems.length === 0) {
    message = 'Ajoute tes premiers articles pour commencer !'
  } else if (tw.count === 0) {
    message = 'Pas encore de vente. Ça va venir !'
  } else if (tw.profit > lw.profit && lw.profit > 0) {
    const pct = Math.round(((tw.profit - lw.profit) / lw.profit) * 100)
    message = `En feu ! +${pct}% de profit vs la semaine précédente`
  } else if (tw.count > lw.count) {
    message = `${tw.count - lw.count} vente${tw.count - lw.count > 1 ? 's' : ''} de plus que la semaine précédente`
  } else if (tw.count >= 1) {
    message = `${tw.count} vente${tw.count > 1 ? 's' : ''}, continuez comme ça !`
  }

  // Check if there's data older than current offset
  const hasOlderData = soldItems.some(item => {
    if (!item.sold_at) return false
    const targetDate = subWeeks(new Date(), weekOffset + 1)
    const weekStart = startOfWeek(targetDate, { weekStartsOn: 1 })
    return new Date(item.sold_at) < weekStart
  })

  return (
    <Card className="border-slate-200 dark:border-slate-800 overflow-hidden">
      <CardContent className="p-0">
        {/* Header with navigation */}
        <div className="px-4 pt-3 pb-2 sm:px-6 sm:pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setWeekOffset(weekOffset + 1)}
                disabled={!hasOlderData && weekOffset > 3}
                className="h-7 w-7 rounded-full flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95 transition-all disabled:opacity-30"
              >
                <ChevronLeft className="h-4 w-4 text-slate-500" />
              </button>
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">{weekLabel}</h3>
              <button
                onClick={() => setWeekOffset(Math.max(0, weekOffset - 1))}
                disabled={isCurrentWeek}
                className="h-7 w-7 rounded-full flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95 transition-all disabled:opacity-30"
              >
                <ChevronRight className="h-4 w-4 text-slate-500" />
              </button>
            </div>
            <span className="text-[10px] font-medium text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
              vs sem. précédente
            </span>
          </div>
          {message && (
            <p className="text-xs text-[#09B1BA] font-medium mt-1">{message}</p>
          )}
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 divide-x divide-slate-100 dark:divide-slate-800 px-2 pb-3 sm:px-4">
          {stats.map((stat) => {
            const diff = stat.value - stat.prev
            const isUp = diff > 0
            const isDown = diff < 0

            return (
              <div key={stat.label} className="flex flex-col items-center text-center px-2 py-1.5">
                <span className="text-[10px] font-medium text-slate-400 mb-0.5 uppercase tracking-wide">{stat.label}</span>
                <span className="text-lg sm:text-xl font-bold text-slate-800 dark:text-slate-100">
                  {stat.format(stat.value)}
                </span>
                <div className={`flex items-center gap-0.5 mt-0.5 text-[11px] font-semibold ${
                  isUp ? 'text-emerald-500' : isDown ? 'text-red-500' : 'text-slate-400'
                }`}>
                  {isUp && <TrendingUp className="h-3 w-3" />}
                  {isDown && <TrendingDown className="h-3 w-3" />}
                  {!isUp && !isDown && <Minus className="h-3 w-3" />}
                  <span>{isUp ? '+' : ''}{stat.format(diff)}</span>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
