'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Search, X } from 'lucide-react'
import { ItemCardList } from './item-card-list'
import { Button } from '@/components/ui/button'

interface InventoryClientProps {
  items: any[]
}

export function InventoryClient({ items }: InventoryClientProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const allItems = items || []

  // Filter items by search query (case-insensitive, matches title)
  const filteredItems = searchQuery.trim()
    ? allItems.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allItems

  const stockItems = filteredItems.filter(item => item.status === 'en_stock')
  const transitItems = filteredItems.filter(item => item.status === 'en_transit')
  const soldItems = filteredItems.filter(item => item.status === 'vendu')

  return (
    <>
      {/* Search bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
        <Input
          type="text"
          placeholder="Rechercher un article..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 pr-9"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-slate-400 hover:text-slate-600"
            onClick={() => setSearchQuery('')}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {searchQuery.trim() && (
        <p className="text-sm text-slate-500">
          {filteredItems.length} résultat{filteredItems.length !== 1 ? 's' : ''} pour "{searchQuery}"
        </p>
      )}

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
    </>
  )
}
