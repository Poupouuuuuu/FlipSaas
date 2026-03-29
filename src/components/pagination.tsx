import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  baseUrl: string
  searchParams?: Record<string, string>
}

export function Pagination({ currentPage, totalPages, baseUrl, searchParams = {} }: PaginationProps) {
  if (totalPages <= 1) return null

  function buildUrl(page: number) {
    const params = new URLSearchParams(searchParams)
    params.set('page', String(page))
    return `${baseUrl}?${params.toString()}`
  }

  const hasPrev = currentPage > 1
  const hasNext = currentPage < totalPages

  const base = "inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-md border transition-colors"
  const active = `${base} border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300`
  const disabled = `${base} border-slate-100 dark:border-slate-800 text-slate-300 dark:text-slate-600 cursor-not-allowed`

  return (
    <div className="flex items-center justify-center gap-4 pt-4">
      {hasPrev ? (
        <Link href={buildUrl(currentPage - 1)} className={active}>
          <ChevronLeft className="h-4 w-4" /> Précédent
        </Link>
      ) : (
        <span className={disabled}><ChevronLeft className="h-4 w-4" /> Précédent</span>
      )}
      <span className="text-sm text-slate-500">Page {currentPage} sur {totalPages}</span>
      {hasNext ? (
        <Link href={buildUrl(currentPage + 1)} className={active}>
          Suivant <ChevronRight className="h-4 w-4" />
        </Link>
      ) : (
        <span className={disabled}>Suivant <ChevronRight className="h-4 w-4" /></span>
      )}
    </div>
  )
}
