import { createClient } from '@/utils/supabase/server'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AddItemDialog } from './add-item-dialog'
import { ItemCardList } from './item-card-list'

export default async function InventoryPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const { data: items } = await supabase
    .from('items')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const allItems = items || []
  const stockItems = allItems.filter(item => item.status === 'en_stock')
  const transitItems = allItems.filter(item => item.status === 'en_transit')
  const soldItems = allItems.filter(item => item.status === 'vendu')

  return (
    <div className="p-4 lg:p-8 flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Stock d'articles</h1>
          <p className="text-slate-500">Gérez votre inventaire et suivez vos ventes en cours.</p>
        </div>
        <AddItemDialog />
      </div>

      <Tabs defaultValue="stock" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="stock">En Stock ({stockItems.length})</TabsTrigger>
          <TabsTrigger value="transit">En Transit ({transitItems.length})</TabsTrigger>
          <TabsTrigger value="vendu">Vendus ({soldItems.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="stock">
          <ItemCardList items={stockItems} emptyMessage="Aucun article en stock. Ajoutez-en un !" />
        </TabsContent>
        <TabsContent value="transit">
          <ItemCardList items={transitItems} emptyMessage="Aucun article en cours de livraison." />
        </TabsContent>
        <TabsContent value="vendu">
          <ItemCardList items={soldItems} emptyMessage="Aucun article vendu pour le moment." />
        </TabsContent>
      </Tabs>
    </div>
  )
}
