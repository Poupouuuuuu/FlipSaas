import { getUser, createClient } from '@/utils/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, TrendingDown, Wallet, PackageOpen, PiggyBank, Euro } from 'lucide-react'

export async function KpiCards() {
  const user = await getUser()
  if (!user) return null

  const supabase = await createClient()
  const [{ data: items }, { data: expenses }] = await Promise.all([
    supabase.from('items').select('status, purchase_price, listed_price, sold_price, quantity, sold_from_id').eq('user_id', user.id),
    supabase.from('expenses').select('amount').eq('user_id', user.id),
  ])

  const safeItems = items || []
  const safeExpenses = expenses || []

  // For purchase totals: only count "parent" items (not sold copies which have sold_from_id)
  // Parent items: purchase_price * quantity represents the total cost of the lot
  // Sold copies already have their unit purchase_price, but the parent already accounts for the full cost
  const parentItems = safeItems.filter(item => !item.sold_from_id)
  const totalItemPurchases = parentItems.reduce((acc, item) => {
    // For stock items with quantity, the total cost = price * (remaining qty + sold copies)
    // But simpler: parent purchase_price * original quantity
    // Since sold copies decrement qty, total = price * qty + price * sold_copies_count
    // Actually simplest: just sum parent price * qty for stock items + sold copy prices
    if (item.status === 'en_stock') {
      return acc + Number(item.purchase_price) * Number(item.quantity)
    }
    return acc + Number(item.purchase_price)
  }, 0)
  // Add purchase price from sold copies (each represents 1 unit sold from a multi-qty item)
  const soldCopies = safeItems.filter(item => item.sold_from_id)
  const soldCopiesPurchase = soldCopies.reduce((acc, item) => acc + Number(item.purchase_price), 0)

  const totalExpenses = safeExpenses.reduce((acc, exp) => acc + Number(exp.amount), 0)
  const totalSpent = totalItemPurchases + soldCopiesPurchase + totalExpenses

  const soldItems = safeItems.filter(item => item.status === 'vendu')
  const totalReceived = soldItems.reduce((acc, item) => acc + Number(item.sold_price || 0), 0)

  const netProfit = totalReceived - totalSpent

  const stockItems = safeItems.filter(item => item.status === 'en_stock' || item.status === 'en_transit')
  const potentialSales = stockItems.reduce((acc, item) => {
    if (item.status === 'en_transit') return acc + Number(item.sold_price || item.listed_price)
    return acc + Number(item.listed_price) * Number(item.quantity || 1)
  }, 0)

  const inventoryValue = totalReceived + potentialSales
  const reinvestableBudget = Math.max(0, netProfit)

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value)
  }

  // Stock item count
  const stockCount = stockItems.reduce((acc, item) => acc + Number(item.quantity || 1), 0)

  return (
    <>
      {/* Mobile: 3 essential KPIs */}
      <div className="grid grid-cols-3 gap-2.5 md:hidden">
        {/* Profit net */}
        <Card className="shadow-sm border-emerald-100 dark:border-emerald-900/50 bg-gradient-to-br from-emerald-50/80 to-white dark:from-emerald-950/30 dark:to-slate-900 overflow-hidden relative">
          <CardContent className="p-3">
            <PiggyBank className="h-4 w-4 text-emerald-500/60 mb-1" />
            <div className={`text-base font-bold tracking-tight ${netProfit >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'}`}>
              {formatCurrency(netProfit)}
            </div>
            <p className="text-[10px] text-slate-400 font-medium mt-0.5">Profit net</p>
          </CardContent>
        </Card>

        {/* Total reçu */}
        <Card className="shadow-sm border-[#09B1BA]/20 dark:border-[#09B1BA]/10 bg-gradient-to-br from-[#09B1BA]/5 to-white dark:from-[#09B1BA]/10 dark:to-slate-900 overflow-hidden relative">
          <CardContent className="p-3">
            <Euro className="h-4 w-4 text-[#09B1BA]/60 mb-1" />
            <div className="text-base font-bold tracking-tight text-[#09B1BA]">
              {formatCurrency(totalReceived)}
            </div>
            <p className="text-[10px] text-slate-400 font-medium mt-0.5">Total reçu</p>
          </CardContent>
        </Card>

        {/* Potentiel de vente */}
        <Card className="shadow-sm border-indigo-100 dark:border-indigo-900/50 bg-gradient-to-br from-indigo-50/80 to-white dark:from-indigo-950/30 dark:to-slate-900 overflow-hidden relative">
          <CardContent className="p-3">
            <TrendingUp className="h-4 w-4 text-indigo-500/60 mb-1" />
            <div className="text-base font-bold tracking-tight text-indigo-600 dark:text-indigo-400">
              {formatCurrency(potentialSales)}
            </div>
            <p className="text-[10px] text-slate-400 font-medium mt-0.5">{stockCount} en stock</p>
          </CardContent>
        </Card>
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
