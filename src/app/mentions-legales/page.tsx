export default function MentionsLegales() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-10">Mentions légales</h1>

        <div className="space-y-10 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          <section>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3">1. Éditeur du site</h2>
            <p>
              Le site Stockeesy est un projet indépendant édité par une personne physique.
            </p>
            <ul className="mt-3 space-y-1 list-disc list-inside">
              <li>Nom du service : Stockeesy</li>
              <li>Contact : <span className="font-medium text-slate-500">lecharlesadam0137@gmail.com</span></li>
              <li>Statut : Projet indépendant</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3">2. Hébergement</h2>
            <ul className="space-y-1 list-disc list-inside">
              <li>Hébergeur : Vercel Inc.</li>
              <li>Adresse : 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis</li>
              <li>Site web : vercel.com</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3">3. Propriété intellectuelle</h2>
            <p>
              L&apos;ensemble des contenus présents sur le site Stockeesy (textes, graphismes, logos, icônes, images, code source)
              est la propriété exclusive de l&apos;éditeur ou de ses partenaires et est protégé par les lois françaises et
              internationales relatives à la propriété intellectuelle.
            </p>
            <p className="mt-2">
              Toute reproduction, représentation, modification, publication, transmission ou dénaturation, totale ou partielle,
              du site ou de son contenu, par quelque procédé que ce soit, et sur quelque support que ce soit, est interdite
              sans l&apos;autorisation écrite préalable de l&apos;éditeur.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3">4. Limitation de responsabilité</h2>
            <p>
              L&apos;éditeur s&apos;efforce de fournir des informations aussi précises que possible. Toutefois, il ne pourra être tenu
              responsable des omissions, des inexactitudes ou des carences dans la mise à jour, qu&apos;elles soient de son fait
              ou du fait des tiers partenaires qui lui fournissent ces informations.
            </p>
            <p className="mt-2">
              L&apos;éditeur ne saurait être tenu responsable des dommages directs ou indirects résultant de l&apos;accès
              ou de l&apos;utilisation du site, y compris l&apos;inaccessibilité, les pertes de données, les détériorations,
              destructions ou virus qui pourraient affecter l&apos;équipement informatique de l&apos;utilisateur.
            </p>
            <p className="mt-2">
              Stockeesy est un outil de gestion de stock personnel. Les données financières affichées (marges, profits)
              sont indicatives et ne constituent en aucun cas un conseil fiscal ou comptable.
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
