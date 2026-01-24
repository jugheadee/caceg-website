'use client';

import Navbar from '@/components/NavBar';
import Image from 'next/image';
import Link from 'next/link';
import Footer from '@/components/Footer';

export default function AProposPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />
      <div className="h-16 lg:h-20"></div>

      {/* Hero premium */}
      <section className="relative h-[65vh] min-h-[550px] flex items-center justify-center text-center text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-950/60 via-blue-900/40 to-transparent z-10"></div>
        <Image
          src="/equipe2.jpg"
          alt="CACEG Consulting - Équipe"
          fill
          className="object-cover brightness-75"
          priority
        />
        <div className="relative z-20 px-6 max-w-5xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight drop-shadow-2xl">
            Qui sommes-nous ?
          </h1>
          <p className="text-xl md:text-2xl font-light drop-shadow-xl max-w-3xl mx-auto">
            CACEG Consulting – Votre partenaire d’excellence en formation, conseil et accompagnement depuis 2011
          </p>
        </div>
      </section>

      {/* Première section : Texte à GAUCHE + Photo à DROITE */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Texte à gauche */}
            <div className="space-y-10 lg:space-y-12">
              <div>
                <h2 className="text-4xl lg:text-5xl font-bold text-blue-900 mb-6">
                  CACEG CONSULTING
                </h2>

                {/* Agrément premium */}
                <div className="inline-block bg-gradient-to-r from-yellow-50 to-yellow-100 border-l-8 border-yellow-500 px-8 py-5 rounded-xl shadow-md mb-10">
                  <p className="text-2xl lg:text-2xl font-bold text-blue-900">
                    Agrément d'État n°1031 du 27 juillet 2011
                  </p>
                </div>

                <div className="prose prose-lg lg:prose-xl text-gray-800 max-w-none space-y-6 lg:space-y-8 leading-relaxed">
                  <p className="text-xl">
                    Créé en 2011, CACEG Consulting assure des prestations de conseil et d’études, ainsi que de la formation professionnelle au profit des professionnels par la formation continue (entreprises, administrations et autres organismes) et des particuliers (jeunes diplômés sans qualification à la recherche d’emploi ou désirant se lancer dans la création d’entreprise).
                  </p>

                  <p className="text-xl">
                    CACEG Consulting dispose d’une équipe pédagogique de qualité composée d’experts formateurs et consultants expérimentés dans les domaines de la gestion d’entreprise, pouvant intervenir sur l’ensemble du territoire national.
                  </p>

                  <h3 className="text-3xl font-bold text-blue-900 mt-10 mb-5">
                    Études, conseil et accompagnement
                  </h3>
                  <p className="text-xl">
                    La mission d’études et conseil porte essentiellement sur :
                  </p>
                  <ul className="space-y-4 text-lg lg:text-xl list-none">
                    <li className="flex items-start gap-4">
                      <span className="text-yellow-500 text-2xl font-bold mt-1">•</span>
                      Les études technico-économiques de faisabilité de projets, en vue de bénéficier du foncier industriel pour les projets d’investissement et aussi pour les dossiers de crédits de financement bancaire (Investissement et exploitation) classique et islamique.
                    </li>
                    <li className="flex items-start gap-4">
                      <span className="text-yellow-500 text-2xl font-bold mt-1">•</span>
                      L’accompagnement à la mise en place des systèmes ISO, les procédures de gestion et fiches de postes RH.
                    </li>
                    <li className="flex items-start gap-4">
                      <span className="text-yellow-500 text-2xl font-bold mt-1">•</span>
                      Diagnostic de la gestion et plan d’amélioration de la performance (hausse des ventes, réduction des charges, optimisation des moyens de production, productivité de la ressource humaine, hausse de bénéfices).
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Photo à droite (petite taille) */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl group">
              <Image
                src="/equipe1.jpg"
                alt="Équipe CACEG Consulting"
                width={480}
                height={600}
                className="object-cover w-full h-auto rounded-3xl transition-transform duration-700 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-950/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute bottom-8 left-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                <p className="text-xl lg:text-2xl font-bold">Une équipe d’experts à votre service</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Deuxième section : Texte à DROITE + Photo à GAUCHE */}
      <section className="py-20 lg:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Photo à gauche */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl group">
              <Image
                src="/etude2.jpg"
                alt="Équipe CACEG Consulting"
                width={480}
                height={600}
                className="object-cover w-full h-auto rounded-3xl transition-transform duration-700 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-950/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute bottom-8 left-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                <p className="text-xl lg:text-2xl font-bold">Une équipe d’experts à votre service</p>
              </div>
            </div>

            {/* Texte à droite */}
            <div className="space-y-10 lg:space-y-12">
              <div>
                <h3 className="text-3xl lg:text-4xl font-bold text-blue-900 mb-6">
                  Formation professionnelle, coaching et perfectionnement
                </h3>

                <div className="prose prose-lg lg:prose-xl text-gray-800 max-w-none space-y-6 lg:space-y-8 leading-relaxed">
                  <p className="text-xl">
                    L’activité de formation s’exerce dans le cadre de la mission de prestation de formation diplômante, qualifiante et à la carte. Le collège est agréé par le Ministère de la formation professionnelle (Agrément par l’État, n°1031 du 27/07/2011).
                  </p>
                  <p className="text-xl">
                    CACEG Consulting propose des solutions aux entreprises et autres organismes en matière de :
                  </p>
                  <ul className="space-y-4 text-lg lg:text-xl list-none">
                    <li className="flex items-start gap-4">
                      <span className="text-yellow-500 text-2xl font-bold mt-1">•</span>
                      Accompagnement de l’entreprise dans l’élaboration et la mise en œuvre du plan de formation.
                    </li>
                    <li className="flex items-start gap-4">
                      <span className="text-yellow-500 text-2xl font-bold mt-1">•</span>
                      Amélioration des performances du personnel dans l’exercice de leurs fonctions (commerciale et marketing, comptabilité finances et fiscalité, techniques et production, achats et logistique, Hygiène environnement et sécurité HSE, gestion de la ressource humaine).
                    </li>
                    <li className="flex items-start gap-4">
                      <span className="text-yellow-500 text-2xl font-bold mt-1">•</span>
                      Mise en place de système de management d’organisation des structures de l’entreprise.
                    </li>
                    <li className="flex items-start gap-4">
                      <span className="text-yellow-500 text-2xl font-bold mt-1">•</span>
                      Assistance par du coaching et de formations personnalisées et ciblées en vue d’aboutir à des résultats performants de la ressource humaine.
                    </li>
                  </ul>

                  <p className="italic text-gray-600 text-xl mt-10 text-center lg:text-left">
                    Une large gamme de formations répondant aux besoins actuels des entreprises et administrations est répertoriée dans le catalogue des formations (téléchargeable).
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Nos valeurs */}
      <section className="py-20 lg:py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl lg:text-5xl font-bold text-center text-blue-900 mb-16 lg:mb-20">
            Nos valeurs fondamentales
          </h2>
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            <div className="group bg-white p-8 lg:p-10 rounded-3xl shadow-xl hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 border border-gray-100 hover:border-yellow-500">
              <div className="w-16 h-16 lg:w-20 lg:h-20 mx-auto mb-6 lg:mb-8 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-full flex items-center justify-center group-hover:from-yellow-400 group-hover:to-yellow-500 transition-all duration-500">
                <svg className="w-8 h-8 lg:w-10 lg:h-10 text-blue-900 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl lg:text-3xl font-bold text-blue-900 mb-4 text-center">Excellence</h3>
              <p className="text-gray-700 text-center leading-relaxed text-base lg:text-lg">
                Nous visons l'excellence dans chaque formation et accompagnement, avec des contenus de haut niveau animés par des experts reconnus.
              </p>
            </div>

            <div className="group bg-white p-8 lg:p-10 rounded-3xl shadow-xl hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 border border-gray-100 hover:border-yellow-500">
              <div className="w-16 h-16 lg:w-20 lg:h-20 mx-auto mb-6 lg:mb-8 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-full flex items-center justify-center group-hover:from-yellow-400 group-hover:to-yellow-500 transition-all duration-500">
                <svg className="w-8 h-8 lg:w-10 lg:h-10 text-blue-900 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl lg:text-3xl font-bold text-blue-900 mb-4 text-center">Innovation</h3>
              <p className="text-gray-700 text-center leading-relaxed text-base lg:text-lg">
                Méthodes pédagogiques modernes, interactives et adaptées aux évolutions du marché du travail.
              </p>
            </div>

            <div className="group bg-white p-8 lg:p-10 rounded-3xl shadow-xl hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 border border-gray-100 hover:border-yellow-500">
              <div className="w-16 h-16 lg:w-20 lg:h-20 mx-auto mb-6 lg:mb-8 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-full flex items-center justify-center group-hover:from-yellow-400 group-hover:to-yellow-500 transition-all duration-500">
                <svg className="w-8 h-8 lg:w-10 lg:h-10 text-blue-900 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-2xl lg:text-3xl font-bold text-blue-900 mb-4 text-center">Proximité</h3>
              <p className="text-gray-700 text-center leading-relaxed text-base lg:text-lg">
                Accompagnement personnalisé, à l'écoute de vos besoins spécifiques pour un service sur mesure.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to action premium */}
      <section className="py-20 lg:py-24 bg-gradient-to-r from-blue-900 to-blue-800 text-white text-center">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 lg:mb-8">
            Prêt à booster vos compétences ?
          </h2>
          <p className="text-lg lg:text-xl mb-10 lg:mb-12 max-w-3xl mx-auto opacity-90">
            Rejoignez les entreprises et professionnels qui font confiance à CACEG Consulting pour leur développement.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-yellow-500 text-blue-900 font-bold px-12 lg:px-16 py-5 lg:py-7 rounded-full text-xl lg:text-2xl hover:bg-yellow-400 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105"
          >
            Contactez-nous dès maintenant
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}