'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { LayoutDashboard, Package, Receipt, LogOut, Users, CreditCard, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { ThemeToggle } from '@/components/theme-toggle'

interface SidebarNavProps {
  isSubscribed: boolean
  isAdmin: boolean
  userEmail: string
}

function NavLinks({ isSubscribed, isAdmin, onLinkClick }: { isSubscribed: boolean, isAdmin: boolean, onLinkClick?: () => void }) {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard'
    }
    return pathname.startsWith(href)
  }

  const linkClass = (href: string) => {
    const active = isActive(href)
    return `flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
      active
        ? 'bg-[#09B1BA]/10 text-[#09B1BA] font-semibold'
        : 'text-slate-500 hover:text-[#09B1BA] hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-400 dark:hover:text-[#09B1BA]'
    }`
  }

  return (
    <nav className="grid items-start px-2 text-sm font-medium lg:px-4 space-y-2">
      <Link href="/dashboard" className={linkClass('/dashboard')} onClick={onLinkClick}>
        <LayoutDashboard className="h-4 w-4" />
        Tableau de bord
      </Link>
      
      {isSubscribed ? (
        <>
          <Link href="/dashboard/inventory" className={linkClass('/dashboard/inventory')} onClick={onLinkClick}>
            <Package className="h-4 w-4" />
            Stock d'articles
          </Link>
          <Link href="/dashboard/expenses" className={linkClass('/dashboard/expenses')} onClick={onLinkClick}>
            <Receipt className="h-4 w-4" />
            Frais annexes
          </Link>
        </>
      ) : (
        <div className="pt-2 px-3 text-sm text-amber-600 font-medium tracking-tight">
          Abonnez-vous pour débloquer ces fonctionnalités.
        </div>
      )}

      {!isSubscribed && (
        <Link
          href="/dashboard/subscription"
          className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all mt-4 font-semibold ${
            isActive('/dashboard/subscription')
              ? 'bg-[#09B1BA]/20 text-[#09B1BA]'
              : 'bg-[#09B1BA]/10 text-[#09B1BA] hover:bg-[#09B1BA]/20'
          }`}
          onClick={onLinkClick}
        >
          <CreditCard className="h-4 w-4" />
          S'abonner
        </Link>
      )}

      {isAdmin && (
        <>
          <div className="my-2 border-t border-slate-200 dark:border-slate-800" />
          <Link href="/dashboard/admin" className={linkClass('/dashboard/admin')} onClick={onLinkClick}>
            <Users className="h-4 w-4" />
            Administration
          </Link>
        </>
      )}
    </nav>
  )
}

export function DesktopSidebar({ isSubscribed, isAdmin }: { isSubscribed: boolean, isAdmin: boolean }) {
  return (
    <aside className="hidden w-64 flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-card md:flex shadow-sm z-10 relative">
      <div className="flex h-14 items-center border-b border-slate-200 dark:border-slate-800 px-4 lg:h-[60px] lg:px-6">
        <Link href="/dashboard" className="flex items-center gap-2 font-bold text-[#09B1BA] text-lg tracking-tight">
          <Package className="h-6 w-6" />
          <span>Stockeesy</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-4">
        <NavLinks isSubscribed={isSubscribed} isAdmin={isAdmin} />
      </div>
      <div className="mt-auto p-4 border-t border-slate-200 dark:border-slate-800">
         <form action="/auth/signout" method="post">
           <Button variant="ghost" className="w-full justify-start gap-2 h-9 text-slate-500 hover:text-slate-900 dark:hover:text-slate-50" type="submit">
             <LogOut className="h-4 w-4" />
             Déconnexion
           </Button>
         </form>
      </div>
    </aside>
  )
}

export function MobileHeader({ isSubscribed, isAdmin, userEmail }: SidebarNavProps) {
  const [sheetOpen, setSheetOpen] = useState(false)

  const closeSheet = () => setSheetOpen(false)

  return (
    <header className="flex h-14 items-center gap-4 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-card/80 backdrop-blur-md px-4 lg:h-[60px] lg:px-6 justify-between shadow-sm z-30 relative sticky top-0">
      
      {/* Mobile Header */}
      <div className="md:hidden flex items-center gap-3">
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger render={<Button variant="ghost" size="icon" className="hover:bg-slate-100 dark:hover:bg-slate-800" />}>
            <Menu className="h-6 w-6 text-slate-600 dark:text-slate-300 pointer-events-none" />
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0 flex flex-col bg-white dark:bg-card border-slate-200 dark:border-slate-800">
            <SheetTitle className="sr-only">Menu principal</SheetTitle>
            <SheetDescription className="sr-only">Naviguez dans le dashboard</SheetDescription>
            
            <div className="flex h-14 items-center border-b border-slate-200 dark:border-slate-800 px-4">
              <Link href="/dashboard" className="flex items-center gap-2 font-bold text-[#09B1BA] text-lg tracking-tight" onClick={closeSheet}>
                <Package className="h-6 w-6" />
                <span>Stockeesy</span>
              </Link>
            </div>
            
            <div className="flex-1 overflow-auto py-4">
              <NavLinks isSubscribed={isSubscribed} isAdmin={isAdmin} onLinkClick={closeSheet} />
            </div>
            
            <div className="mt-auto p-4 border-t border-slate-200 dark:border-slate-800">
              <form action="/auth/signout" method="post">
                <Button variant="ghost" className="w-full justify-start gap-2 h-9 text-slate-500" type="submit">
                  <LogOut className="h-4 w-4 leading-none pointer-events-none" />
                  Déconnexion
                </Button>
              </form>
            </div>
          </SheetContent>
        </Sheet>

        <Link href="/dashboard" className="flex items-center gap-2 font-bold text-[#09B1BA] text-lg">
          <Package className="h-6 w-6" />
        </Link>
      </div>
      
      <div className="flex-1"></div>
      
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-slate-500 hidden sm:inline-block">
          {userEmail}
        </span>
        <ThemeToggle />
      </div>
    </header>
  )
}
