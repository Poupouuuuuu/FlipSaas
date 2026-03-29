export default function PolitiqueConfidentialite() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-10">Politique de confidentialité</h1>

        <div className="space-y-10 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          <section>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3">1. Responsable du traitement</h2>
            <p>
              Le responsable du traitement des données personnelles est l&apos;éditeur du site Stockeesy (projet indépendant).
            </p>
            <p className="mt-2">
              Contact : <span className="font-medium text-slate-500">lecharlesadam0137@gmail.com</span>
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3">2. Données collectées</h2>
            <p>Dans le cadre de l&apos;utilisation du service Stockeesy, les données suivantes sont collectées :</p>
            <ul className="mt-3 space-y-1 list-disc list-inside">
              <li><span className="font-medium text-slate-700 dark:text-slate-300">Adresse e-mail</span> — lors de la création de compte</li>
              <li><span className="font-medium text-slate-700 dark:text-slate-300">Données de stock personnelles</span> — articles, prix d&apos;achat, prix de vente, photos d&apos;articles, dépenses</li>
              <li><span className="font-medium text-slate-700 dark:text-slate-300">Données de paiement</span> — traitées exclusivement par Stripe (aucune donnée bancaire n&apos;est stockée sur nos serveurs)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3">3. Finalité du traitement</h2>
            <p>Les données personnelles sont collectées pour les finalités suivantes :</p>
            <ul className="mt-3 space-y-1 list-disc list-inside">
              <li>Gestion du compte utilisateur et authentification</li>
              <li>Fourniture du service de gestion de stock</li>
              <li>Gestion de l&apos;abonnement et de la facturation</li>
              <li>Communication relative au service (notifications, mises à jour)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3">4. Base légale</h2>
            <p>
              Le traitement des données personnelles est fondé sur <span className="font-medium text-slate-700 dark:text-slate-300">l&apos;exécution du contrat</span> (article 6.1.b du RGPD)
              auquel l&apos;utilisateur est partie lorsqu&apos;il crée un compte et utilise le service Stockeesy.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3">5. Durée de conservation</h2>
            <ul className="space-y-1 list-disc list-inside">
              <li><span className="font-medium text-slate-700 dark:text-slate-300">Données de compte</span> — conservées pendant toute la durée d&apos;utilisation du service, puis supprimées dans un délai de 30 jours après la suppression du compte</li>
              <li><span className="font-medium text-slate-700 dark:text-slate-300">Données de stock et dépenses</span> — conservées pendant toute la durée d&apos;utilisation du service, supprimées avec le compte</li>
              <li><span className="font-medium text-slate-700 dark:text-slate-300">Données de facturation</span> — conservées conformément aux obligations légales (10 ans)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3">6. Droits de l&apos;utilisateur</h2>
            <p>Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez des droits suivants :</p>
            <ul className="mt-3 space-y-1 list-disc list-inside">
              <li><span className="font-medium text-slate-700 dark:text-slate-300">Droit d&apos;accès</span> — obtenir une copie de vos données personnelles</li>
              <li><span className="font-medium text-slate-700 dark:text-slate-300">Droit de rectification</span> — corriger des données inexactes ou incomplètes</li>
              <li><span className="font-medium text-slate-700 dark:text-slate-300">Droit de suppression</span> — demander l&apos;effacement de vos données personnelles</li>
              <li><span className="font-medium text-slate-700 dark:text-slate-300">Droit à la portabilité</span> — recevoir vos données dans un format structuré</li>
              <li><span className="font-medium text-slate-700 dark:text-slate-300">Droit d&apos;opposition</span> — vous opposer au traitement de vos données</li>
              <li><span className="font-medium text-slate-700 dark:text-slate-300">Droit à la limitation</span> — demander la limitation du traitement</li>
            </ul>
            <p className="mt-3">
              Pour exercer ces droits, contactez-nous à : <span className="font-medium text-slate-500">lecharlesadam0137@gmail.com</span>
            </p>
            <p className="mt-2">
              Vous disposez également du droit de déposer une réclamation auprès de la CNIL (Commission Nationale de l&apos;Informatique et des Libertés).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3">7. Sous-traitants</h2>
            <p>Les données personnelles peuvent être partagées avec les sous-traitants suivants :</p>
            <div className="mt-4 space-y-4">
              <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-800">
                <p className="font-medium text-slate-900 dark:text-slate-100">Supabase Inc.</p>
                <p className="mt-1">Stockage des données et authentification</p>
                <p>Localisation des serveurs : Union Européenne</p>
              </div>
              <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-800">
                <p className="font-medium text-slate-900 dark:text-slate-100">Stripe Inc.</p>
                <p className="mt-1">Traitement des paiements et gestion des abonnements</p>
                <p>Certifié PCI DSS niveau 1</p>
              </div>
              <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-800">
                <p className="font-medium text-slate-900 dark:text-slate-100">Vercel Inc.</p>
                <p className="mt-1">Hébergement de l&apos;application web</p>
                <p>Localisation : réseau mondial (CDN)</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3">8. Cookies</h2>
            <p>
              Stockeesy utilise uniquement des cookies strictement nécessaires au fonctionnement du service
              (cookies d&apos;authentification et de session). Aucun cookie publicitaire ou de suivi n&apos;est utilisé.
            </p>
          </section>

          <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
            <p className="text-xs text-slate-400">Dernière mise à jour : mars 2026</p>
          </div>
        </div>
      </div>
    </div>
  )
}
