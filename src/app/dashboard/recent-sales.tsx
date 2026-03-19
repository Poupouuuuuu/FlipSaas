import { createClient } from '@/utils/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { TrendingUp, ShoppingBag } from 'lucide-react'
import Image from 'next/image'

export async function RecentSales() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: recentSoldItems } = await supabase
    .from('items')
    .select('*')
    .eq('user_id', user.id)
    .eq('status', 'vendu')
    .order('sold_at', { ascending: false })
    .limit(5)

  const soldItems = recentSoldItems || []

  if (soldItems.length === 0) {
    return (
      <Card className="border-slate-200 dark:border-slate-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-[#09B1BA]" />
            Dernières ventes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <ShoppingBag className="h-8 w-8 text-slate-300 dark:text-slate-600 mb-2" />
            <p className="text-sm text-slate-400">Aucune vente pour le moment</p>
            <p className="text-xs text-slate-400 mt-1">Vos dernières ventes apparaîtront ici</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value)

  return (
    <Card className="border-slate-200 dark:border-slate-800">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-[#09B1BA]" />
          Dernières ventes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 pt-0">
        {soldItems.map((item) => {
          const profit = (item.sold_price || 0) - item.purchase_price
          return (
            <div
              key={item.id}
              className="flex items-center gap-3 p-2 -mx-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
            >
              {/* Thumbnail */}
              <div className="relative h-10 w-10 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 flex-shrink-0">
                {item.image_url ? (
                  <Image src={item.image_url} alt={item.title} fill className="object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <ShoppingBag className="h-4 w-4 text-slate-400" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{item.title}</p>
                <p className="text-xs text-slate-400">
                  {item.sold_at
                    ? format(new Date(item.sold_at), 'dd MMM yyyy', { locale: fr })
                    : 'Date inconnue'}
                </p>
              </div>

              {/* Price + Profit */}
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
                  {formatCurrency(item.sold_price || 0)}
                </p>
                <p className={`text-xs font-medium ${profit >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                  {profit >= 0 ? '+' : ''}{formatCurrency(profit)}
                </p>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
