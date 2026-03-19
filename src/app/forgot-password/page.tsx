import { requestPasswordReset } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export default async function ForgotPassword({ searchParams }: { searchParams: Promise<{ message: string }> }) {
  const { message } = await searchParams;
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950 px-4">
      <Card className="w-full max-w-md">
        <form action={requestPasswordReset}>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Mot de passe oublié</CardTitle>
            <CardDescription className="text-center">
              Entrez votre adresse email de vendeur pour recevoir un lien de réinitialisation.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="vendeur@example.com" required />
            </div>
            {message && (
              <p className="text-sm text-center mt-4 p-4 text-emerald-700 bg-emerald-50 rounded-md border border-emerald-200">
                {message}
              </p>
            )}
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button className="w-full bg-[#09B1BA] hover:bg-[#0799a1] text-white" type="submit">
              Envoyer le lien
            </Button>
            <div className="text-sm text-center text-slate-500">
              <Link href="/login" className="text-[#09B1BA] hover:underline hover:text-[#0799a1] font-medium">
                Retour à la connexion
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
