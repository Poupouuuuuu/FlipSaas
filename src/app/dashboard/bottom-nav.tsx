'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Package, Receipt } from 'lucide-react'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, exactMatch: true },
  { href: '/dashboard/inventory', label: 'Stock', icon: Package },
  { href: '/dashboard/expenses', label: 'Frais', icon: Receipt },
]

export function BottomNav() {
  const pathname = usePathname()

  const isActive = (href: string, exactMatch?: boolean) => {
    if (exactMatch) return pathname === href
    return pathname.startsWith(href)
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 shadow-[0_-2px_10px_rgba(0,0,0,0.06)]">
      <div className="flex items-center justify-around h-16 px-2 max-w-lg mx-auto">
        {navItems.map((item) => {
          const active = isActive(item.href, item.exactMatch)
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 flex-1 py-2 rounded-xl transition-all duration-200 ${
                active
                  ? 'text-[#09B1BA]'
                  : 'text-slate-400 active:text-slate-600 dark:text-slate-500'
              }`}
            >
              <div className={`relative p-1.5 rounded-xl transition-all duration-200 ${
                active ? 'bg-[#09B1BA]/10 scale-110' : ''
              }`}>
                <Icon className={`h-5 w-5 transition-all ${active ? 'stroke-[2.5]' : 'stroke-[1.5]'}`} />
              </div>
              <span className={`text-[10px] font-medium leading-none transition-all ${
                active ? 'font-semibold' : ''
              }`}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
      {/* Safe area for devices with home indicator */}
      <div className="h-[env(safe-area-inset-bottom,0px)] bg-white/95 dark:bg-slate-900/95" />
    </nav>
  )
}
