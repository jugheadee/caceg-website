'use client';

import Navbar from '@/components/NavBar';
import Image from 'next/image';
import Link from 'next/link';
import Footer from '@/components/Footer';

export default function AProposPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <div className="h-16 lg:h-20"></div>

      {/* Hero A Propos */}
      <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center text-center text-white overflow-hidden">
        <Image
          src="/equipe2.jpg" // Télécharge une belle photo équipe ou bureau pro (je te donne suggestions ci-dessous)
          alt="À propos de CACEG"
          fill
          className="object-cover brightness-70"
          priority
        />
        <div className="relative z-10 px-6 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 drop-shadow-2xl">
            Qui sommes-nous ?
          </h1>
          <p className="text-xl md:text-2xl drop-shadow-lg">
            CACEG Consulting – Votre partenaire en formation et développement professionnel depuis de nombreuses années
          </p>
        </div>
      </section>

      {/* Qui sommes-nous */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-bold text-blue-900 mb-8">
              CACEG, un centre de formation professionnelle continu
            </h2>
            <p className="text-lg text-gray-700 mb-6">
              CACEG est un centre de formation professionnelle continu avec comme activité principale la vente de formations auprès des entreprises, administrations et particuliers.
            </p>
            <p className="text-lg text-gray-700 mb-6">
              CACEG propose un catalogue des centaines de formations dans divers domaines comme le Management, l'Informatique et les réseaux, les Ressources Humaines, la Gestion de Projets, etc... animées par un réseau de plus d'une centaine de formateurs internes et externes.
            </p>
            <p className="text-lg text-gray-700 mb-8">
              Une large gamme de formations répondant aux besoins actuels des entreprises et des administrations. CACEG propose ainsi une large gamme de formations dans le domaine des TIC mais aussi des Ressources Humaines, du Management, de la Gestion de Projet, des Filières métiers (banques, assurance, comptabilité/finances, télécoms...), du Marketing et de la Vente...
            </p>
            <p className="text-lg text-gray-700">
              Ainsi CACEG propose aux entreprises et aux administrations :
            </p>
            <ul className="mt-4 space-y-3 text-lg text-gray-700">
              <li className="flex items-start gap-3">
                <span className="text-amber-600">•</span>
                des formations personnalisées, adaptées aux besoins exprimés,
              </li>
              <li className="flex items-start gap-3">
                <span className="text-amber-600">•</span>
                des formations incluant toujours une partie pratique, les acquis sont immédiatement applicables,
              </li>
              <li className="flex items-start gap-3">
                <span className="text-amber-600">•</span>
                des formateurs professionnels expérimentés, experts reconnus dans leur domaine.
              </li>
            </ul>
          </div>
          <div className="flex justify-center">
            <Image
              src="/equipe1.jpg" // Photo équipe ou bureau pro
              alt="Équipe CACEG"
              width={600}
              height={500}
              className="rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      </section>

     

   {/* Nos valeurs – version ultra classe */}
<section className="py-24 bg-gray-50">
  <div className="max-w-7xl mx-auto px-6">
    <h2 className="text-4xl md:text-5xl font-bold text-center text-blue-900 mb-16">
      Nos valeurs
    </h2>
    <div className="grid md:grid-cols-3 gap-12">
      {/* Valeur 1 - Excellence */}
      <div className="group bg-white p-10 rounded-3xl shadow-xl hover:shadow-2xl hover:-translate-y-4 transition-all duration-500 border border-transparent hover:border-yellow-500">
        <div className="w-20 h-20 mx-auto mb-8 bg-yellow-100 rounded-full flex items-center justify-center group-hover:bg-yellow-500 transition-colors duration-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-blue-900 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-blue-900 mb-4 text-center">
          Excellence
        </h3>
        <p className="text-gray-700 text-center leading-relaxed">
          Nous visons l'excellence dans chaque formation et accompagnement, en proposant des contenus de haut niveau animés par des experts reconnus.
        </p>
      </div>

      {/* Valeur 2 - Innovation */}
      <div className="group bg-white p-10 rounded-3xl shadow-xl hover:shadow-2xl hover:-translate-y-4 transition-all duration-500 border border-transparent hover:border-yellow-500">
        <div className="w-20 h-20 mx-auto mb-8 bg-yellow-100 rounded-full flex items-center justify-center group-hover:bg-yellow-500 transition-colors duration-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-blue-900 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-blue-900 mb-4 text-center">
          Innovation
        </h3>
        <p className="text-gray-700 text-center leading-relaxed">
          Des méthodes pédagogiques modernes, interactives et adaptées aux évolutions du marché du travail.
        </p>
      </div>

      {/* Valeur 3 - Proximité */}
      <div className="group bg-white p-10 rounded-3xl shadow-xl hover:shadow-2xl hover:-translate-y-4 transition-all duration-500 border border-transparent hover:border-yellow-500">
        <div className="w-20 h-20 mx-auto mb-8 bg-yellow-100 rounded-full flex items-center justify-center group-hover:bg-yellow-500 transition-colors duration-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-blue-900 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-blue-900 mb-4 text-center">
          Proximité
        </h3>
        <p className="text-gray-700 text-center leading-relaxed">
          Un accompagnement personnalisé, à l'écoute de vos besoins spécifiques pour un service sur mesure.
        </p>
      </div>
    </div>
  </div>
</section>

      {/* Call to action */}
      <section className="py-20 bg-blue-900 text-white text-center">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold mb-8">
            Prêt à développer vos compétences ?
          </h2>
          <Link
            href="/contact"
            className="inline-block bg-yellow-500 text-blue-900 font-bold px-12 py-6 rounded-full text-2xl hover:bg-yellow-400 transition shadow-2xl"
          >
            Contactez-nous
          </Link>
        </div>
      </section>

    <Footer/>
    </main>
  );
}