import { ThemeToggle } from '@/components/theme-toggle'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { LayoutDashboard, Package, Receipt, LogOut, Users, CreditCard, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from '@/components/ui/sheet'

function NavLinks({ isSubscribed, isAdmin }: { isSubscribed: boolean, isAdmin: boolean }) {
  return (
    <nav className="grid items-start px-2 text-sm font-medium lg:px-4 space-y-2">
      <Link
        href="/dashboard"
        className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-900 transition-all hover:text-[#09B1BA] hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-50 dark:hover:text-[#09B1BA]"
      >
        <LayoutDashboard className="h-4 w-4" />
        Tableau de bord
      </Link>
      
      {isSubscribed ? (
        <>
          <Link
            href="/dashboard/inventory"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-500 transition-all hover:text-[#09B1BA] hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-400 dark:hover:text-[#09B1BA]"
          >
            <Package className="h-4 w-4" />
            Stock d'articles
          </Link>
          <Link
            href="/dashboard/expenses"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-500 transition-all hover:text-[#09B1BA] hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-400 dark:hover:text-[#09B1BA]"
          >
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
          className="flex items-center gap-3 rounded-lg px-3 py-2 bg-[#09B1BA]/10 text-[#09B1BA] transition-all hover:bg-[#09B1BA]/20 mt-4 font-semibold"
        >
          <CreditCard className="h-4 w-4" />
          S'abonner
        </Link>
      )}

      {isAdmin && (
        <>
          <div className="my-2 border-t border-slate-200 dark:border-slate-800" />
          <Link
            href="/dashboard/admin"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-500 transition-all hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-400 dark:hover:text-indigo-400"
          >
            <Users className="h-4 w-4" />
            Administration
          </Link>
        </>
      )}
    </nav>
  )
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: userData } = await supabase.from('users').select('role, subscription_status').eq('id', user.id).single()
  const isAdmin = userData?.role === 'admin'
  const isSubscribed = userData?.subscription_status === 'active' || isAdmin
  
  return (
    <div className="flex min-h-screen w-full bg-slate-50 dark:bg-background">
      {/* Sidebar Desktop */}
      <aside className="hidden w-64 flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-card md:flex shadow-sm z-10 relative">
        <div className="flex h-14 items-center border-b border-slate-200 dark:border-slate-800 px-4 lg:h-[60px] lg:px-6">
          <Link href="/dashboard" className="flex items-center gap-2 font-bold text-[#09B1BA] text-lg tracking-tight">
            <Package className="h-6 w-6" />
            <span>FlipSaaS</span>
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

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-14 items-center gap-4 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-card/80 backdrop-blur-md px-4 lg:h-[60px] lg:px-6 justify-between shadow-sm z-30 relative sticky top-0">
          
          {/* Mobile Header */}
          <div className="md:hidden flex items-center gap-3">
            <Sheet>
              <SheetTrigger render={<Button variant="ghost" size="icon" className="hover:bg-slate-100 dark:hover:bg-slate-800" />}>
                <Menu className="h-6 w-6 text-slate-600 dark:text-slate-300 pointer-events-none" />
              </SheetTrigger>
              <SheetContent side="left" className="w-72 p-0 flex flex-col bg-white dark:bg-card border-slate-200 dark:border-slate-800">
                <SheetTitle className="sr-only">Menu principal</SheetTitle>
                <SheetDescription className="sr-only">Naviguez dans le dashboard</SheetDescription>
                
                <div className="flex h-14 items-center border-b border-slate-200 dark:border-slate-800 px-4">
                  <Link href="/dashboard" className="flex items-center gap-2 font-bold text-[#09B1BA] text-lg tracking-tight">
                    <Package className="h-6 w-6" />
                    <span>FlipSaaS</span>
                  </Link>
                </div>
                
                <div className="flex-1 overflow-auto py-4">
                  <NavLinks isSubscribed={isSubscribed} isAdmin={isAdmin} />
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
              {user.email}
            </span>
            <ThemeToggle />
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto w-full max-w-7xl mx-auto p-4 lg:p-8 animation-fade-in">
          {children}
        </main>
      </div>
    </div>
  )
}
