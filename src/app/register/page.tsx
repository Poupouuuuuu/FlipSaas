import { signup } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export default async function Register({ searchParams }: { searchParams: Promise<{ message: string }> }) {
  const { message } = await searchParams;
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950 px-4">
      <Card className="w-full max-w-md">
        <form action={signup}>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Créer un compte</CardTitle>
            <CardDescription className="text-center">
              Rejoignez le Dashboard Vendeur et optimisez vos ventes de seconde main.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="vendeur@example.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input id="password" name="password" type="password" placeholder="••••••••" required minLength={6} />
            </div>
            {message && (
              <p className="text-sm text-center mt-4 p-4 text-red-700 bg-red-50 rounded-md border border-red-200">
                {message}
              </p>
            )}
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button className="w-full bg-[#09B1BA] hover:bg-[#0799a1] text-white" type="submit">
              S'inscrire
            </Button>
            <div className="text-sm text-center text-slate-500">
              Déjà un compte ?{' '}
              <Link href="/login" className="text-[#09B1BA] hover:underline hover:text-[#0799a1] font-medium">
                Se connecter
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
