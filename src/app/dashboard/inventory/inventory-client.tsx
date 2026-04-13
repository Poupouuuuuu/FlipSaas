'use client'

import { useState, useMemo, useCallback, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Search, X, ArrowUpDown } from 'lucide-react'
import { ItemCardList } from './item-card-list'
import { Button } from '@/components/ui/button'
import type { Item } from '@/types'

interface InventoryClientProps {
  items: Item[]
  initialSearch: string
  currentStatus: string
  totalCount: number
}

type SortOption = 'date_desc' | 'date_asc' | 'price_asc' | 'price_desc' | 'listed_asc' | 'listed_desc'

const sortLabels: Record<SortOption, string> = {
  date_desc: 'Plus récent',
  date_asc: 'Plus ancien',
  price_asc: 'Achat ↑',
  price_desc: 'Achat ↓',
  listed_asc: 'Prix affiché ↑',
  listed_desc: 'Prix affiché ↓',
}

export function InventoryClient({ items, initialSearch, currentStatus, totalCount }: InventoryClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(initialSearch)
  const [sortBy, setSortBy] = useState<SortOption>('date_desc')
  const [showSort, setShowSort] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const pushSearch = useCallback((query: string) => {
    const params = new URLSearchParams()
    params.set('status', currentStatus)
    params.set('page', '1')
    if (query.trim()) {
      params.set('q', query.trim())
    }
    router.push(`/dashboard/inventory?${params.toString()}`)
  }, [router, currentStatus])

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => pushSearch(value), 400)
  }

  const clearSearch = () => {
    setSearchQuery('')
    if (debounceRef.current) clearTimeout(debounceRef.current)
    pushSearch('')
  }

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [])

  // Client-side sort only (search is server-side now)
  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      switch (sortBy) {
        case 'date_desc': return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        case 'date_asc': return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        case 'price_asc': return a.purchase_price - b.purchase_price
        case 'price_desc': return b.purchase_price - a.purchase_price
        case 'listed_asc': return a.listed_price - b.listed_price
        case 'listed_desc': return b.listed_price - a.listed_price
        default: return 0
      }
    })
  }, [items, sortBy])

  return (
    <>
      {/* Search + Sort bar */}
      <div className="flex gap-2 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          <Input
            type="text"
            placeholder="Rechercher un article..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-9 pr-9"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-slate-400 hover:text-slate-600"
              onClick={clearSearch}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <Button
          variant="outline"
          size="icon"
          className={`h-10 w-10 shrink-0 ${showSort ? 'bg-[#09B1BA]/10 border-[#09B1BA]/30 text-[#09B1BA]' : ''}`}
          onClick={() => setShowSort(!showSort)}
        >
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      </div>

      {/* Sort options */}
      {showSort && (
        <div className="flex flex-wrap gap-2 animate-in slide-in-from-top-2 duration-200">
          {(Object.entries(sortLabels) as [SortOption, string][]).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setSortBy(key)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                sortBy === key
                  ? 'bg-[#09B1BA] text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      {initialSearch && (
        <p className="text-sm text-slate-500">
          {totalCount} résultat{totalCount !== 1 ? 's' : ''} pour "{initialSearch}"
        </p>
      )}

      <ItemCardList items={sortedItems} emptyMessage={
        initialSearch
          ? `Aucun article trouvé pour "${initialSearch}".`
          : "Aucun article dans cette catégorie."
      } />
    </>
  )
}
