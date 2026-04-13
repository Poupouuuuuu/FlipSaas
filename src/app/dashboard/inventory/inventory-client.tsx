'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Search, X, ArrowUpDown } from 'lucide-react'
import { ItemCardList } from './item-card-list'
import { Button } from '@/components/ui/button'
import type { Item } from '@/types'

interface InventoryClientProps {
  items: Item[]
  initialSearch: string
  currentStatus: string
  currentSort: string
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

export function InventoryClient({ items, initialSearch, currentStatus, currentSort, totalCount }: InventoryClientProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState(initialSearch)
  const [showSort, setShowSort] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const buildUrl = useCallback((overrides: { q?: string; sort?: string; page?: string }) => {
    const params = new URLSearchParams()
    params.set('status', currentStatus)
    params.set('page', overrides.page || '1')

    const q = overrides.q !== undefined ? overrides.q : initialSearch
    if (q.trim()) params.set('q', q.trim())

    const sort = overrides.sort || currentSort
    if (sort !== 'date_desc') params.set('sort', sort)

    return `/dashboard/inventory?${params.toString()}`
  }, [currentStatus, currentSort, initialSearch])

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      router.push(buildUrl({ q: value }))
    }, 400)
  }

  const clearSearch = () => {
    setSearchQuery('')
    if (debounceRef.current) clearTimeout(debounceRef.current)
    router.push(buildUrl({ q: '' }))
  }

  const handleSort = (sort: SortOption) => {
    router.push(buildUrl({ sort }))
  }

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [])

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
          className={`h-10 w-10 shrink-0 ${showSort || currentSort !== 'date_desc' ? 'bg-[#09B1BA]/10 border-[#09B1BA]/30 text-[#09B1BA]' : ''}`}
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
              onClick={() => handleSort(key)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                currentSort === key
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

      <ItemCardList items={items} emptyMessage={
        initialSearch
          ? `Aucun article trouvé pour "${initialSearch}".`
          : "Aucun article dans cette catégorie."
      } />
    </>
  )
}
