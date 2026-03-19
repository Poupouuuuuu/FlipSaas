import { login } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export default async function Login({ searchParams }: { searchParams: Promise<{ message: string }> }) {
  const { message } = await searchParams;
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950 px-4">
      <Card className="w-full max-w-md">
        <form action={login}>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Connexion</CardTitle>
            <CardDescription className="text-center">
              Espace sécurisé pour les vendeurs de seconde main. Connectez-vous à votre tableau de bord.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="vendeur@example.com" required />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Mot de passe</Label>
                <Link href="/forgot-password" className="text-xs text-[#09B1BA] hover:underline font-medium">
                  Mot de passe oublié ?
                </Link>
              </div>
              <Input id="password" name="password" type="password" placeholder="••••••••" required />
            </div>
            {message && (
              <p className="text-sm text-center mt-4 p-4 text-emerald-700 bg-emerald-50 rounded-md border border-emerald-200">
                {message}
              </p>
            )}
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button className="w-full bg-[#09B1BA] hover:bg-[#0799a1] text-white" type="submit">
              Se connecter
            </Button>
            <div className="text-sm text-center text-slate-500">
              Pas encore de compte ?{' '}
              <Link href="/register" className="text-[#09B1BA] hover:underline hover:text-[#0799a1] font-medium">
                Créer un compte
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
