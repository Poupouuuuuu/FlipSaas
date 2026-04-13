import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { LogoWithText } from '@/components/logo'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 px-4">
      <div className="mb-8">
        <LogoWithText size={40} />
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
