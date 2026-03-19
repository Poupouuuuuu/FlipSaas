import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { DesktopSidebar, MobileHeader } from './sidebar-nav'

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
      <DesktopSidebar isSubscribed={isSubscribed} isAdmin={isAdmin} />

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <MobileHeader isSubscribed={isSubscribed} isAdmin={isAdmin} userEmail={user.email || ''} />
        
        <main className="flex-1 overflow-y-auto w-full max-w-7xl mx-auto p-4 lg:p-8 animation-fade-in">
          {children}
        </main>
      </div>
    </div>
  )
}
