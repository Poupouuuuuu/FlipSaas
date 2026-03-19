import { createClient } from '@/utils/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, TrendingDown, Wallet, PackageOpen, PiggyBank, Euro } from 'lucide-react'

export async function KpiCards() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: items } = await supabase.from('items').select('*').eq('user_id', user.id)
  const { data: expenses } = await supabase.from('expenses').select('*').eq('user_id', user.id)

  const safeItems = items || []
  const safeExpenses = expenses || []

  const totalItemPurchases = safeItems.reduce((acc, item) => acc + Number(item.purchase_price), 0)
  const totalExpenses = safeExpenses.reduce((acc, exp) => acc + Number(exp.amount), 0)
  const totalSpent = totalItemPurchases + totalExpenses

  const soldItems = safeItems.filter(item => item.status === 'vendu')
  const totalReceived = soldItems.reduce((acc, item) => acc + Number(item.sold_price || 0), 0)

  const netProfit = totalReceived - totalSpent

  const stockItems = safeItems.filter(item => item.status === 'en_stock' || item.status === 'en_transit')
  const potentialSales = stockItems.reduce((acc, item) => {
    if (item.status === 'en_transit') return acc + Number(item.sold_price || item.listed_price)
    return acc + Number(item.listed_price)
  }, 0)

  const inventoryValue = totalReceived + potentialSales
  const reinvestableBudget = Math.max(0, netProfit)

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value)
  }

  return (
    <>
      {/* Mobile: Horizontal scroll carousel */}
      <div className="md:hidden">
        {/* Primary KPIs - big horizontal scroll */}
        <div className="flex gap-3 overflow-x-auto pb-3 snap-x snap-mandatory -mx-4 px-4 scrollbar-hide">
          {/* Bénéfice Net */}
          <Card className="min-w-[75vw] snap-center relative overflow-hidden border-emerald-100 dark:border-emerald-900/50 shadow-sm bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950/40 dark:to-slate-900">
            <div className="absolute -bottom-4 -right-4 text-emerald-500/10 dark:text-emerald-500/5 transform rotate-12 pointer-events-none">
              <PiggyBank className="w-28 h-28" />
            </div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 relative z-10 pb-2">
              <CardTitle className="text-sm font-semibold tracking-wide text-slate-600 dark:text-slate-300">Bénéfice Net Réel</CardTitle>
              <div className="p-2 bg-emerald-100 dark:bg-emerald-900/50 rounded-full">
                <PiggyBank className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className={`text-3xl font-bold tracking-tight ${netProfit >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'}`}>
                {formatCurrency(netProfit)}
              </div>
              <p className="text-xs text-slate-500 mt-2 font-medium">Revenus totaux moins dépenses</p>
            </CardContent>
          </Card>

          {/* Budget Disponible */}
          <Card className="min-w-[75vw] snap-center relative overflow-hidden border-[#09B1BA]/20 dark:border-[#09B1BA]/10 shadow-sm bg-gradient-to-br from-[#09B1BA]/5 to-white dark:from-[#09B1BA]/10 dark:to-slate-900">
            <div className="absolute -bottom-4 -right-4 text-[#09B1BA]/5 dark:text-[#09B1BA]/5 transform -rotate-12 pointer-events-none">
              <Wallet className="w-28 h-28" />
            </div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 relative z-10 pb-2">
              <CardTitle className="text-sm font-semibold tracking-wide text-slate-600 dark:text-slate-300">Budget Disponible</CardTitle>
              <div className="p-2 bg-[#09B1BA]/10 rounded-full">
                <Wallet className="h-4 w-4 text-[#09B1BA]" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold tracking-tight text-[#09B1BA]">
                {formatCurrency(reinvestableBudget)}
              </div>
              <p className="text-xs text-slate-500 mt-2 font-medium">Réinvestissable immédiatement</p>
            </CardContent>
          </Card>

          {/* Potentiel de vente */}
          <Card className="min-w-[75vw] snap-center relative overflow-hidden border-indigo-100 dark:border-indigo-900/50 shadow-sm bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-950/40 dark:to-slate-900">
            <div className="absolute -bottom-4 -right-4 text-indigo-500/5 dark:text-indigo-500/5 transform rotate-6 pointer-events-none">
              <TrendingUp className="w-28 h-28" />
            </div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 relative z-10 pb-2">
              <CardTitle className="text-sm font-semibold tracking-wide text-slate-600 dark:text-slate-300">Potentiel de vente</CardTitle>
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-full">
                <TrendingUp className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold tracking-tight text-indigo-600 dark:text-indigo-400">
                {formatCurrency(potentialSales)}
              </div>
              <p className="text-xs text-slate-500 mt-2 font-medium">Stock non vendu estimé</p>
            </CardContent>
          </Card>

          {/* Patrimoine Brut */}
          <Card className="min-w-[75vw] snap-center relative overflow-hidden border-amber-100 dark:border-amber-900/50 shadow-sm bg-gradient-to-br from-amber-50 to-white dark:from-amber-950/40 dark:to-slate-900">
            <div className="absolute -bottom-4 -right-4 text-amber-500/10 dark:text-amber-500/5 transform -rotate-12 pointer-events-none">
              <PackageOpen className="w-28 h-28" />
            </div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 relative z-10 pb-2">
              <CardTitle className="text-sm font-semibold tracking-wide text-slate-600 dark:text-slate-300">Patrimoine Brut</CardTitle>
              <div className="p-2 bg-amber-100 dark:bg-amber-900/50 rounded-full">
                <PackageOpen className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold tracking-tight text-amber-600 dark:text-amber-400">
                {formatCurrency(inventoryValue)}
              </div>
              <p className="text-xs text-slate-500 mt-2 font-medium">Total Reçu + Stock estimé</p>
            </CardContent>
          </Card>
        </div>

        {/* Scroll hint dots */}
        <div className="flex justify-center gap-1.5 mt-1 mb-2">
          <div className="w-6 h-1 rounded-full bg-[#09B1BA]" />
          <div className="w-1.5 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
          <div className="w-1.5 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
          <div className="w-1.5 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
        </div>

        {/* Secondary KPIs - compact grid */}
        <div className="grid grid-cols-2 gap-3 mt-2">
          <Card className="shadow-sm bg-white dark:bg-card border-slate-200 dark:border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 pt-4 px-4">
              <CardTitle className="text-xs font-semibold text-slate-500">Total Reçu</CardTitle>
              <Euro className="h-3.5 w-3.5 text-slate-400" />
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="text-xl font-bold text-slate-700 dark:text-slate-200">{formatCurrency(totalReceived)}</div>
            </CardContent>
          </Card>
          <Card className="shadow-sm bg-white dark:bg-card border-slate-200 dark:border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 pt-4 px-4">
              <CardTitle className="text-xs font-semibold text-slate-500">Total Dépensé</CardTitle>
              <TrendingDown className="h-3.5 w-3.5 text-slate-400" />
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="text-xl font-bold text-slate-700 dark:text-slate-200">{formatCurrency(totalSpent)}</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Desktop: Standard grid */}
      <div className="hidden md:grid gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Bénéfice Net */}
        <Card className="relative overflow-hidden border-emerald-100 dark:border-emerald-900/50 shadow-sm bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950/40 dark:to-slate-900 transition-all hover:shadow-md">
          <div className="absolute -bottom-4 -right-4 text-emerald-500/10 dark:text-emerald-500/5 transform rotate-12 pointer-events-none">
            <PiggyBank className="w-32 h-32" />
          </div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 relative z-10 pb-2">
            <CardTitle className="text-sm font-semibold tracking-wide text-slate-600 dark:text-slate-300">Bénéfice Net Réel</CardTitle>
            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/50 rounded-full">
              <PiggyBank className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className={`text-3xl font-bold tracking-tight ${netProfit >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'}`}>
              {formatCurrency(netProfit)}
            </div>
            <p className="text-xs text-slate-500 mt-2 font-medium">Revenus totaux moins dépenses</p>
          </CardContent>
        </Card>

        {/* Budget Réinvestissable */}
        <Card className="relative overflow-hidden border-[#09B1BA]/20 dark:border-[#09B1BA]/10 shadow-sm bg-gradient-to-br from-[#09B1BA]/5 to-white dark:from-[#09B1BA]/10 dark:to-slate-900 transition-all hover:shadow-md">
          <div className="absolute -bottom-4 -right-4 text-[#09B1BA]/5 dark:text-[#09B1BA]/5 transform -rotate-12 pointer-events-none">
            <Wallet className="w-32 h-32" />
          </div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 relative z-10 pb-2">
            <CardTitle className="text-sm font-semibold tracking-wide text-slate-600 dark:text-slate-300">Budget Disponible</CardTitle>
            <div className="p-2 bg-[#09B1BA]/10 rounded-full">
              <Wallet className="h-4 w-4 text-[#09B1BA]" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold tracking-tight text-[#09B1BA]">
              {formatCurrency(reinvestableBudget)}
            </div>
            <p className="text-xs text-slate-500 mt-2 font-medium">Réinvestissable immédiatement</p>
          </CardContent>
        </Card>

        {/* Potentiel de vente */}
        <Card className="relative overflow-hidden border-indigo-100 dark:border-indigo-900/50 shadow-sm bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-950/40 dark:to-slate-900 transition-all hover:shadow-md">
          <div className="absolute -bottom-4 -right-4 text-indigo-500/5 dark:text-indigo-500/5 transform rotate-6 pointer-events-none">
            <TrendingUp className="w-32 h-32" />
          </div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 relative z-10 pb-2">
            <CardTitle className="text-sm font-semibold tracking-wide text-slate-600 dark:text-slate-300">Potentiel de vente</CardTitle>
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-full">
              <TrendingUp className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold tracking-tight text-indigo-600 dark:text-indigo-400">
              {formatCurrency(potentialSales)}
            </div>
            <p className="text-xs text-slate-500 mt-2 font-medium">Valeur estimée du stock non finalisé</p>
          </CardContent>
        </Card>

        {/* Patrimoine */}
        <Card className="relative overflow-hidden border-amber-100 dark:border-amber-900/50 shadow-sm bg-gradient-to-br from-amber-50 to-white dark:from-amber-950/40 dark:to-slate-900 transition-all hover:shadow-md">
          <div className="absolute -bottom-4 -right-4 text-amber-500/10 dark:text-amber-500/5 transform -rotate-12 pointer-events-none">
            <PackageOpen className="w-32 h-32" />
          </div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 relative z-10 pb-2">
            <CardTitle className="text-sm font-semibold tracking-wide text-slate-600 dark:text-slate-300">Patrimoine Brut</CardTitle>
            <div className="p-2 bg-amber-100 dark:bg-amber-900/50 rounded-full">
              <PackageOpen className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold tracking-tight text-amber-600 dark:text-amber-400">
              {formatCurrency(inventoryValue)}
            </div>
            <p className="text-xs text-slate-500 mt-2 font-medium">Total Reçu + Stock estimé potentiel</p>
          </CardContent>
        </Card>

        {/* Total Reçu */}
        <Card className="relative overflow-hidden border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-card transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold tracking-wide text-slate-500">Total Reçu</CardTitle>
            <Euro className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-700 dark:text-slate-200">{formatCurrency(totalReceived)}</div>
            <p className="text-xs text-slate-400 mt-1">
              Chiffre d'affaires brut généré
            </p>
          </CardContent>
        </Card>

        {/* Total Dépensé */}
        <Card className="relative overflow-hidden border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-card transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold tracking-wide text-slate-500">Total Dépensé</CardTitle>
            <TrendingDown className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-700 dark:text-slate-200">{formatCurrency(totalSpent)}</div>
            <p className="text-xs text-slate-400 mt-1">
              Achats d'articles ({formatCurrency(totalItemPurchases)}) + Frais ({formatCurrency(totalExpenses)})
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
