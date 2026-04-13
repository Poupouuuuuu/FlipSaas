import { getUser, createClient } from '@/utils/supabase/server'
import { WeeklyStatsClient } from './weekly-stats-client'

export async function WeeklyStats() {
  const user = await getUser()
  if (!user) return null

  const supabase = await createClient()
  // Fetch all sold items with dates (we'll filter client-side for week navigation)
  const { data: soldItems } = await supabase
    .from('items')
    .select('sold_price, purchase_price, sold_at')
    .eq('user_id', user.id)
    .eq('status', 'vendu')
    .not('sold_at', 'is', null)
    .order('sold_at', { ascending: false })

  return <WeeklyStatsClient soldItems={soldItems || []} />
}
