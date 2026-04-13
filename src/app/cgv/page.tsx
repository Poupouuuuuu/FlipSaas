import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Conditions Générales de Vente',
}

export default function CGVPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-[#09B1BA] transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour à l&apos;accueil
        </Link>

        <h1 className="text-3xl font-bold tracking-tight mb-2">Conditions Générales de Vente</h1>
        <p className="text-sm text-slate-400 mb-8">Dernière mise à jour : 31 mars 2026</p>

        <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-xl font-semibold mb-3">Article 1 — Objet</h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Les présentes Conditions Générales de Vente (CGV) régissent les relations contractuelles entre
              Stockeesy, éditeur de la plateforme accessible à l&apos;adresse{' '}
              <a href="https://stockeesy.vercel.app" className="text-[#09B1BA] hover:underline">
                stockeesy.vercel.app
              </a>
              , et tout utilisateur souscrivant à un abonnement payant (ci-après &quot;l&apos;Abonné&quot;).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Article 2 — Services proposés</h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Stockeesy est une application de gestion de stock et de suivi financier destinée aux revendeurs
              de seconde main. L&apos;abonnement Pro donne accès à :
            </p>
            <ul className="list-disc list-inside text-slate-600 dark:text-slate-300 space-y-1 mt-2">
              <li>Ajout d&apos;articles et de dépenses illimités</li>
              <li>Tableau de bord financier complet (marges, bénéfices, statistiques)</li>
              <li>Compression automatique des photos</li>
              <li>Partage avec un proche</li>
              <li>Support prioritaire</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Article 3 — Prix et paiement</h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Le prix de l&apos;abonnement est indiqué en euros TTC sur la page de souscription.
              Le paiement est effectué par carte bancaire via la plateforme sécurisée Stripe.
              L&apos;abonnement est facturé mensuellement à date anniversaire.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Article 4 — Droit de rétractation</h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Conformément à l&apos;article L221-28 du Code de la consommation, le droit de rétractation
              ne s&apos;applique pas aux contrats de fourniture de contenu numérique non fourni sur un support
              matériel dont l&apos;exécution a commencé avec l&apos;accord du consommateur. En souscrivant,
              l&apos;Abonné accepte que le service commence immédiatement et renonce à son droit de rétractation.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Article 5 — Résiliation</h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              L&apos;Abonné peut résilier son abonnement à tout moment depuis son espace &quot;Mon compte&quot;
              ou via le portail de gestion Stripe. La résiliation prend effet à la fin de la période de
              facturation en cours. Aucun remboursement au prorata ne sera effectué.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Article 6 — Responsabilité</h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Stockeesy s&apos;engage à fournir un service fonctionnel et accessible. Toutefois,
              l&apos;éditeur ne saurait être tenu responsable des interruptions de service, pertes de
              données, ou tout dommage indirect lié à l&apos;utilisation de la plateforme. Les données
              saisies par l&apos;utilisateur relèvent de sa seule responsabilité.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Article 7 — Propriété intellectuelle</h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              L&apos;ensemble des éléments de la plateforme Stockeesy (design, code, textes, logo) sont
              protégés par le droit de la propriété intellectuelle. Toute reproduction, même partielle,
              est interdite sans autorisation préalable.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Article 8 — Données personnelles</h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Le traitement des données personnelles est décrit dans notre{' '}
              <Link href="/politique-confidentialite" className="text-[#09B1BA] hover:underline">
                Politique de Confidentialité
              </Link>
              .
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Article 9 — Droit applicable</h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Les présentes CGV sont régies par le droit français. En cas de litige, une solution
              amiable sera recherchée avant toute action judiciaire. À défaut, les tribunaux compétents
              seront ceux du ressort du domicile de l&apos;éditeur.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Article 10 — Contact</h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Pour toute question relative aux présentes CGV :{' '}
              <a href="mailto:lecharlesadam0137@gmail.com" className="text-[#09B1BA] hover:underline">
                lecharlesadam0137@gmail.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
