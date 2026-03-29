import Link from 'next/link'
import {
  TableProperties,
  PackageSearch,
  CircleDollarSign,
  BarChart3,
  Camera,
  Truck,
  Check,
  ArrowRight,
  Zap,
} from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100">

      {/* ─── Navbar ─── */}
      <nav className="sticky top-0 z-50 border-b border-slate-100 dark:border-slate-800/50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-lg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#09B1BA] to-[#06D6A0] flex items-center justify-center">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight">Stockeesy</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Se connecter
            </Link>
            <Link
              href="/register"
              className="text-sm font-medium px-4 py-2 rounded-lg bg-gradient-to-r from-[#09B1BA] to-[#06D6A0] text-white hover:opacity-90 transition-opacity"
            >
              Essayer gratuitement
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── Hero ─── */}
      <section className="relative overflow-hidden bg-[#F8FAFC] dark:bg-[#0F172A]">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-[#09B1BA]/10 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-[#06D6A0]/10 blur-3xl" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-20 pb-24 sm:pt-28 sm:pb-32 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#09B1BA]/20 bg-[#09B1BA]/5 text-[#09B1BA] text-sm font-medium mb-8">
            <Zap className="h-3.5 w-3.5" />
            Stockeesy
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] max-w-3xl mx-auto">
            Fini Excel. Gère ton stock de revendeur en{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#09B1BA] to-[#06D6A0]">
              30 secondes.
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Le tableau de bord pensé pour les revendeurs Vinted, Leboncoin et compagnie.
            Stock, marges, colis — tout est sous contrôle, depuis ton téléphone.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#09B1BA] to-[#06D6A0] text-white font-semibold text-base hover:opacity-90 transition-opacity shadow-lg shadow-[#09B1BA]/25"
            >
              Essayer gratuitement
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl border-2 border-[#09B1BA]/30 text-[#09B1BA] font-semibold text-base hover:bg-[#09B1BA]/5 transition-colors"
            >
              Se connecter
            </Link>
          </div>

          <p className="mt-4 text-sm text-slate-400">Aucune carte bancaire requise</p>
        </div>
      </section>

      {/* ─── Problème ─── */}
      <section className="py-20 sm:py-28 bg-white dark:bg-slate-950">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              T&apos;en as marre de...
            </h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-8 sm:gap-6 lg:gap-10">
            {[
              {
                icon: TableProperties,
                title: 'Mettre à jour ton fichier Excel après chaque vente ?',
                description: 'Tu perds 10 minutes à chaque fois, et tu finis par ne plus le faire.',
              },
              {
                icon: PackageSearch,
                title: 'Perdre le fil de tes colis en transit ?',
                description: '"C\'est lequel déjà qui est parti lundi ?" — Plus jamais.',
              },
              {
                icon: CircleDollarSign,
                title: 'Ne pas savoir si tu gagnes vraiment de l\'argent ?',
                description: 'Entre les frais de port, les boosts et les achats, difficile de connaître ton vrai bénéfice.',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="flex flex-col items-center text-center p-6 sm:p-8 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50"
              >
                <div className="h-14 w-14 rounded-2xl bg-red-50 dark:bg-red-950/30 flex items-center justify-center mb-5">
                  <item.icon className="h-7 w-7 text-red-500 dark:text-red-400" />
                </div>
                <h3 className="text-lg font-semibold leading-snug mb-3">{item.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Fonctionnalités ─── */}
      <section className="py-20 sm:py-28 bg-[#F8FAFC] dark:bg-[#0F172A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Tout ce qu&apos;il te faut. Rien de plus.
            </h2>
            <p className="mt-4 text-lg text-slate-500 dark:text-slate-400">
              Trois écrans. Zéro usine à gaz.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-8 sm:gap-6 lg:gap-10">
            {[
              {
                icon: BarChart3,
                title: 'Dashboard financier',
                description: 'Profits, marge moyenne, budget investi, potentiel de vente — tes KPI en un coup d\'oeil. Tu sais toujours où tu en es.',
                gradient: 'from-[#09B1BA] to-[#06D6A0]',
                bg: 'bg-[#09B1BA]/10 dark:bg-[#09B1BA]/20',
              },
              {
                icon: Camera,
                title: 'Stock avec photos',
                description: 'Ajoute un article en quelques secondes : titre, prix, photo. Filtre par statut : en stock, en transit, vendu.',
                gradient: 'from-[#06D6A0] to-[#34D399]',
                bg: 'bg-emerald-100/80 dark:bg-emerald-900/30',
              },
              {
                icon: Truck,
                title: 'Suivi des envois',
                description: 'Marque un article comme expédié, puis valide la livraison. Le profit est calculé automatiquement.',
                gradient: 'from-[#09B1BA] to-[#0EA5E9]',
                bg: 'bg-sky-100/80 dark:bg-sky-900/30',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="group relative flex flex-col p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-[#09B1BA]/30 transition-colors"
              >
                <div className={`h-14 w-14 rounded-2xl ${item.bg} flex items-center justify-center mb-6`}>
                  <item.icon className="h-7 w-7 text-[#09B1BA]" />
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed flex-1">{item.description}</p>
                <div className={`mt-6 h-1 w-12 rounded-full bg-gradient-to-r ${item.gradient} opacity-60 group-hover:w-20 group-hover:opacity-100 transition-all duration-300`} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Pricing ─── */}
      <section className="py-20 sm:py-28 bg-white dark:bg-slate-950">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Un prix simple. Pas de surprises.
            </h2>
            <p className="mt-4 text-lg text-slate-500 dark:text-slate-400">
              Pas d&apos;engagement. Annule quand tu veux.
            </p>
          </div>

          <div className="max-w-md mx-auto">
            <div className="relative rounded-2xl border-2 border-[#09B1BA]/30 bg-white dark:bg-slate-900 p-8 sm:p-10 shadow-xl shadow-[#09B1BA]/5">
              {/* Badge */}
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                <span className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-gradient-to-r from-[#09B1BA] to-[#06D6A0] text-white text-xs font-bold uppercase tracking-wider">
                  <Zap className="h-3 w-3" />
                  Pro
                </span>
              </div>

              {/* Price */}
              <div className="text-center mt-4 mb-8">
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-5xl sm:text-6xl font-extrabold tracking-tight">9.99</span>
                  <span className="text-2xl font-bold text-slate-400">€</span>
                </div>
                <span className="text-sm text-slate-500 dark:text-slate-400">/mois</span>
              </div>

              {/* Features */}
              <ul className="space-y-4 mb-10">
                {[
                  'Articles et dépenses illimités',
                  'Dashboard financier en temps réel',
                  'Photos d\'articles compressées auto',
                  'Partage avec un proche',
                  'Support prioritaire',
                ].map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <div className="mt-0.5 h-5 w-5 rounded-full bg-[#09B1BA]/10 flex items-center justify-center shrink-0">
                      <Check className="h-3 w-3 text-[#09B1BA]" />
                    </div>
                    <span className="text-sm text-slate-600 dark:text-slate-300">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link
                href="/register"
                className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-gradient-to-r from-[#09B1BA] to-[#06D6A0] text-white font-semibold text-base hover:opacity-90 transition-opacity shadow-lg shadow-[#09B1BA]/25"
              >
                Commencer maintenant
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t border-slate-100 dark:border-slate-800 bg-[#F8FAFC] dark:bg-[#0F172A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-8">
            {/* Brand */}
            <div className="flex flex-col items-center sm:items-start gap-1">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-[#09B1BA] to-[#06D6A0] flex items-center justify-center">
                  <Zap className="h-3.5 w-3.5 text-white" />
                </div>
                <span className="text-base font-bold">Stockeesy</span>
              </div>
              <p className="text-sm text-slate-400">L&apos;outil des revendeurs malins.</p>
            </div>

            {/* Links */}
            <div className="flex items-center gap-6">
              <Link href="/login" className="text-sm text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
                Se connecter
              </Link>
              <Link href="/register" className="text-sm text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
                Créer un compte
              </Link>
              <Link href="/mentions-legales" className="text-sm text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
                Mentions légales
              </Link>
              <Link href="/politique-confidentialite" className="text-sm text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
                Confidentialité
              </Link>
            </div>

            {/* Copyright */}
            <p className="text-sm text-slate-400">
              &copy; 2025 Stockeesy. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
