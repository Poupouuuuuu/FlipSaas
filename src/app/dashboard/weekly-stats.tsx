import { createClient } from '@/utils/supabase/server'
import { Card, CardContent } from '@/components/ui/card'
import { TrendingUp, TrendingDown, Minus, ShoppingBag, Euro, Package } from 'lucide-react'

export async function WeeklyStats() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const now = new Date()
  const dayOfWeek = now.getDay() === 0 ? 7 : now.getDay() // Monday = 1
  const thisMonday = new Date(now)
  thisMonday.setDate(now.getDate() - (dayOfWeek - 1))
  thisMonday.setHours(0, 0, 0, 0)

  const lastMonday = new Date(thisMonday)
  lastMonday.setDate(thisMonday.getDate() - 7)

  const thisWeekStart = thisMonday.toISOString()
  const lastWeekStart = lastMonday.toISOString()
  const lastWeekEnd = thisMonday.toISOString()

  // Fetch this week and last week sales in parallel
  const [{ data: thisWeekSales }, { data: lastWeekSales }, { data: thisWeekItems }, { data: lastWeekItems }] = await Promise.all([
    supabase
      .from('items')
      .select('sold_price, purchase_price')
      .eq('user_id', user.id)
      .eq('status', 'vendu')
      .gte('sold_at', thisWeekStart),
    supabase
      .from('items')
      .select('sold_price, purchase_price')
      .eq('user_id', user.id)
      .eq('status', 'vendu')
      .gte('sold_at', lastWeekStart)
      .lt('sold_at', lastWeekEnd),
    supabase
      .from('items')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .gte('created_at', thisWeekStart),
    supabase
      .from('items')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .gte('created_at', lastWeekStart)
      .lt('created_at', lastWeekEnd),
  ])

  const tw = thisWeekSales || []
  const lw = lastWeekSales || []

  const thisWeekCount = tw.length
  const lastWeekCount = lw.length

  const thisWeekRevenue = tw.reduce((acc, item) => acc + Number(item.sold_price || 0), 0)
  const lastWeekRevenue = lw.reduce((acc, item) => acc + Number(item.sold_price || 0), 0)

  const thisWeekProfit = tw.reduce((acc, item) => acc + (Number(item.sold_price || 0) - Number(item.purchase_price || 0)), 0)
  const lastWeekProfit = lw.reduce((acc, item) => acc + (Number(item.sold_price || 0) - Number(item.purchase_price || 0)), 0)

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value)

  const stats = [
    {
      label: 'Ventes',
      value: thisWeekCount,
      prev: lastWeekCount,
      format: (v: number) => String(v),
      icon: ShoppingBag,
    },
    {
      label: 'Chiffre d\'affaires',
      value: thisWeekRevenue,
      prev: lastWeekRevenue,
      format: formatCurrency,
      icon: Euro,
    },
    {
      label: 'Profit net',
      value: thisWeekProfit,
      prev: lastWeekProfit,
      format: formatCurrency,
      icon: TrendingUp,
    },
  ]

  // Motivational message
  const totalSalesEver = thisWeekCount + lastWeekCount
  let message = ''
  if (thisWeekCount === 0 && totalSalesEver === 0) {
    message = 'Ajoute tes premiers articles pour commencer !'
  } else if (thisWeekCount === 0) {
    message = 'Pas encore de vente cette semaine. Ça va venir !'
  } else if (thisWeekProfit > lastWeekProfit && lastWeekProfit > 0) {
    const pct = Math.round(((thisWeekProfit - lastWeekProfit) / lastWeekProfit) * 100)
    message = `En feu ! +${pct}% de profit vs la semaine dernière`
  } else if (thisWeekCount > lastWeekCount) {
    message = `Belle progression ! ${thisWeekCount - lastWeekCount} vente${thisWeekCount - lastWeekCount > 1 ? 's' : ''} de plus`
  } else if (thisWeekCount >= 1) {
    message = `${thisWeekCount} vente${thisWeekCount > 1 ? 's' : ''} cette semaine, continuez comme ça !`
  }

  return (
    <Card className="border-slate-200 dark:border-slate-800 overflow-hidden">
      <CardContent className="p-0">
        {/* Header */}
        <div className="px-4 pt-4 pb-2 sm:px-6 sm:pt-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-300">Cette semaine</h3>
            <span className="text-[10px] font-medium text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
              vs semaine dernière
            </span>
          </div>
          {message && (
            <p className="text-xs text-[#09B1BA] font-medium mt-1">{message}</p>
          )}
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 divide-x divide-slate-100 dark:divide-slate-800 px-2 pb-4 sm:px-4">
          {stats.map((stat) => {
            const diff = stat.value - stat.prev
            const isUp = diff > 0
            const isDown = diff < 0
            const isNeutral = diff === 0

            return (
              <div key={stat.label} className="flex flex-col items-center text-center px-2 py-2">
                <span className="text-[10px] font-medium text-slate-400 mb-1 uppercase tracking-wide">{stat.label}</span>
                <span className="text-lg sm:text-xl font-bold text-slate-800 dark:text-slate-100">
                  {stat.format(stat.value)}
                </span>
                <div className={`flex items-center gap-0.5 mt-1 text-[11px] font-semibold ${
                  isUp ? 'text-emerald-500' : isDown ? 'text-red-500' : 'text-slate-400'
                }`}>
                  {isUp && <TrendingUp className="h-3 w-3" />}
                  {isDown && <TrendingDown className="h-3 w-3" />}
                  {isNeutral && <Minus className="h-3 w-3" />}
                  <span>
                    {isUp ? '+' : ''}{stat.format(diff)}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
