import { resetPassword } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function ResetPassword({ searchParams }: { searchParams: Promise<{ message: string, error: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  // L'utilisateur doit être techniquement connecté (session active via le lien magique de son email) pour changer son mot de passe
  if (!user) {
    redirect('/login')
  }

  const { message, error } = await searchParams;

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950 px-4">
      <Card className="w-full max-w-md">
        <form action={resetPassword}>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Nouveau mot de passe</CardTitle>
            <CardDescription className="text-center">
              Veuillez saisir votre nouveau mot de passe ci-dessous.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Nouveau mot de passe</Label>
              <Input id="password" name="password" type="password" placeholder="••••••••" required minLength={6} />
            </div>
            {message && (
              <p className="text-sm text-center mt-4 p-4 text-emerald-700 bg-emerald-50 rounded-md border border-emerald-200">
                {message}
              </p>
            )}
            {error && (
              <p className="text-sm text-center mt-4 p-4 text-red-700 bg-red-50 rounded-md border border-red-200">
                {error}
              </p>
            )}
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button className="w-full bg-[#09B1BA] hover:bg-[#0799a1] text-white" type="submit">
              Mettre à jour
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
