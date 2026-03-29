import Link from 'next/link'
import { Zap, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 px-4">
      <div className="flex items-center gap-2 mb-8">
        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-[#09B1BA] to-[#06D6A0] flex items-center justify-center">
          <Zap className="h-5 w-5 text-white" />
        </div>
        <span className="text-xl font-bold tracking-tight">Stockeesy</span>
      </div>

      <h1 className="text-7xl sm:text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#09B1BA] to-[#06D6A0]">
        404
      </h1>

      <p className="mt-4 text-lg text-slate-500 dark:text-slate-400 text-center max-w-md">
        Cette page n&apos;existe pas ou a été déplacée.
      </p>

      <Link
        href="/dashboard"
        className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#09B1BA] to-[#06D6A0] text-white font-semibold hover:opacity-90 transition-opacity"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour au dashboard
      </Link>
    </div>
  )
}
