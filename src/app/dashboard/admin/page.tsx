import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Badge } from '@/components/ui/badge'
import { InviteUserForm, DeleteUserButton } from './admin-forms'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Vérifier si Admin
  const { data: currentUserData } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  if (currentUserData?.role !== 'admin') {
    redirect('/dashboard') // Rediriger les non-admins vers le dashboard classique
  }

  // Récupérer tous les utilisateurs
  // Note: Si RLS l'empêchait, on l'aurait fait via createAdminClient, mais puisque admin peut tout lire (voir SQL étape 2), createClient suffit pour la lecture !
  const { data: allUsers } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="p-4 lg:p-8 flex flex-col gap-8 max-w-6xl mx-auto w-full">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Administration globale</h1>
        <p className="text-slate-500">
          Gérez les accès de vos clients, envoyez des invitations et vérifiez les abonnements.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 items-start">
        <Card className="lg:col-span-1 shadow-sm border-slate-200/60">
          <CardHeader>
            <CardTitle>Nouveau Client</CardTitle>
            <CardDescription>
              Invitez un nouvel utilisateur afin qu'il puisse gérer son propre inventaire.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <InviteUserForm />
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-2 shadow-sm border-slate-200/60">
          <CardHeader>
            <CardTitle>Liste des utilisateurs ({allUsers?.length || 0})</CardTitle>
            <CardDescription>
              Clients inscrits sur votre SaaS et statuts de paiement Stripe.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 border-t">
            <Table>
              <TableHeader className="bg-slate-50/50 dark:bg-slate-900/50">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="pl-6">Email</TableHead>
                  <TableHead>Inscription</TableHead>
                  <TableHead>Stripe</TableHead>
                  <TableHead className="text-right pr-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allUsers?.map((u) => (
                  <TableRow key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50">
                    <TableCell className="font-medium pl-6">
                      {u.email}
                      {u.role === 'admin' && (
                        <Badge variant="outline" className="ml-2 bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800">Admin</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-slate-500">
                      {u.created_at ? format(new Date(u.created_at), 'dd/MM/yyyy', { locale: fr }) : 'N/A'}
                    </TableCell>
                    <TableCell>
                      {u.subscription_status === 'active' ? (
                        <Badge variant="default" className="bg-emerald-500 hover:bg-emerald-600">Actif</Badge>
                      ) : u.subscription_status === 'canceled' ? (
                        <Badge variant="destructive">Annulé</Badge>
                      ) : u.subscription_status === 'past_due' ? (
                        <Badge variant="destructive" className="bg-red-600">Impayé</Badge>
                      ) : (
                        <Badge variant="secondary" className="text-slate-500">Incomplet</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      {u.role !== 'admin' && (
                         <DeleteUserButton userId={u.id} />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {(!allUsers || allUsers.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-slate-500">
                      Aucun utilisateur trouvé.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
