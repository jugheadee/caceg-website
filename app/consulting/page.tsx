'use client';

import Navbar from '@/components/NavBar';
import Image from 'next/image';
import Link from 'next/link';

export default function ConsultingPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <div className="h-16 lg:h-20"></div> {/* Spacer pour navbar */}

      {/* Hero */}
      <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center bg-gradient-to-r from-blue-900 to-blue-800 text-white">
        <Image
          src="/IA.png" // Télécharge une belle image pro (voir liste ci-dessous)
          alt="Consulting CACEG"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 text-center px-6">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Consulting & Accompagnement
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            Votre partenaire stratégique pour l'excellence opérationnelle et la performance durable
          </p>
        </div>
      </section>

      {/* Introduction CACEG Consulting */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-blue-900 text-center mb-12">
            CACEG Consulting
          </h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-lg text-gray-700 mb-6">
                Notre mission est d'accompagner les entreprises et les organisations dans leurs démarches d'amélioration continue et de recherche de la performance.
              </p>
              <p className="text-lg text-gray-700 mb-6">
                À travers l'accès à une certification ISO, le déploiement de l'Excellence Opérationnelle, une gestion efficace des projets et un management des domaines variés, CACEG Consulting dispose de compétences permettant d'intervenir dans tous les domaines.
              </p>
              <Link
                href="/contact"
                className="inline-block bg-yellow-500 text-blue-900 font-bold px-8 py-4 rounded-lg hover:bg-yellow-400 transition"
              >
                En savoir plus
              </Link>
            </div>
            <div className="flex justify-center">
              <Image
                src="/IA-consulting.png" // Image d'équipe pro
                alt="Équipe CACEG Consulting"
                width={600}
                height={400}
                className="rounded-xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Domaines de compétence (infographie circulaire) */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-blue-900 text-center mb-12">
            Domaines de compétence
          </h2>
          <div className="grid md:grid-cols-2 gap-12">
            {/* Liste des domaines */}
            <div>
              <ul className="space-y-4 text-lg text-gray-700">
                <li className="flex items-start">
                  <span className="text-yellow-500 mr-3">✔</span> Organisation et conduite du changement
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-500 mr-3">✔</span> Cartographie des risques
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-500 mr-3">✔</span> Développement organisationnel
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-500 mr-3">✔</span> Ressources humaines
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-500 mr-3">✔</span> Recrutement
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-500 mr-3">✔</span> Ingénierie de la Formation
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-500 mr-3">✔</span> Formation et développement des ressources humaines
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-500 mr-3">✔</span> Législation du travail et conformité sociale
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-500 mr-3">✔</span> Gestion des conflits sociaux en entreprise
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-500 mr-3">✔</span> Communication
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-500 mr-3">✔</span> Développement local et gouvernance locale
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-500 mr-3">✔</span> Conseil aux PME/PMI et aux Associations professionnelles
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-500 mr-3">✔</span> Conseil juridique et administratif
                </li>
              </ul>
            </div>

            {/* Infographie circulaire */}
            <div className="flex justify-center">
              <Image
                src="/banner2.jpg" 
                alt="Domaines de compétence CACEG"
                width={500}
                height={500}
                className=" rounded-xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Certification ISO */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-blue-900 mb-8">
            Certification ISO
          </h2>
          <p className="text-xl text-gray-700 max-w-4xl mx-auto mb-12">
            Engagez votre organisation dans une démarche de certification ISO. CACEG Consulting vous accompagne jusqu'à la certification de votre système, vous proposant l'externalisation de la gestion de votre système une fois la certification acquise.
          </p>
          <div className="flex justify-center mb-12">
            <Image
              src="/iso.jpeg" // Logo ISO stylisé
              alt="ISO Certification CACEG"
              width={400}
              height={400}
              className="rounded-full"
            />
          </div>
          <Link
            href="/contact"
            className="inline-block bg-yellow-500 text-blue-900 font-bold px-10 py-5 rounded-lg text-xl hover:bg-yellow-400 transition"
          >
            En savoir plus
          </Link>
        </div>
      </section>

      {/* Gestion de projet */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold text-blue-900 mb-6">Gestion de projet</h2>
            <p className="text-lg text-gray-700 mb-6">
              Sécurisez votre projet depuis son démarrage jusqu'à sa livraison. CACEG Consulting se positionne comme un réel partenaire en vous accompagnant tout au long des phases de votre projet.
            </p>
            <Link
              href="/contact"
              className="inline-block bg-yellow-500 text-blue-900 font-bold px-8 py-4 rounded-lg hover:bg-yellow-400 transition"
            >
              En savoir plus
            </Link>
          </div>
          <Image
            src="/gestion-projet.jpg" 
            alt="Gestion de projet CACEG"
            width={600}
            height={400}
            className="rounded-xl shadow-2xl"
          />
        </div>
      </section>

       {/* Footer */}
    <footer className="bg-blue-950 text-gray-300 py-12">
  <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-8">
    {/* Colonne 1 : CACEG */}
    <div>
      <h3 className="text-white font-bold text-lg mb-4">CACEG</h3>
      <p className="text-sm leading-relaxed">
        CACEG Consulting, spécialisé en Formation, consulting et étude ainsi en management et ressources humaines (RH). 
        Notre cabinet de formation agréé en Algérie réalise des formations professionnelles.
      </p>
    </div>

    {/* Colonne 2 : Liens Utiles */}
    <div>
      <h3 className="text-white font-bold text-lg mb-4">Liens Utiles</h3>
      <ul className="space-y-3 text-sm">
        <li>
          <Link href="/formations" className="hover:text-white transition flex items-center gap-2">
            <span className="text-yellow-500">›</span> Formations
          </Link>
        </li>
        <li>
          <Link href="/actualites" className="hover:text-white transition flex items-center gap-2">
            <span className="text-yellow-500">›</span> Actualités
          </Link>
        </li>
        <li>
          <Link href="/presentation" className="hover:text-white transition flex items-center gap-2">
            <span className="text-yellow-500">›</span> À propos
          </Link>
        </li>
        <li>
          <Link href="/faq" className="hover:text-white transition flex items-center gap-2">
            <span className="text-yellow-500">›</span> FAQ
          </Link>
        </li>
      </ul>
    </div>

    {/* Colonne 3 : Coordonnées */}
    <div>
      <h3 className="text-white font-bold text-lg mb-4">Coordonnées</h3>
      <ul className="space-y-4 text-sm">
        <li className="flex items-start gap-3">
          <span className="text-yellow-500">📍</span>
          <span>01, Place Ayachi Abderrahmane, BPS18 RP,Mostaganem, Algérie</span>
        </li>
        <li className="flex items-center gap-3">
          <span className="text-yellow-500">☎</span>
          <span>+213 (0)23 58 86 76</span>
        </li>
        <li className="flex items-center gap-3">
          <span className="text-yellow-500">📱</span>
          <span>+213 (0)550 177 84</span>
        </li>
        <li className="flex items-center gap-3">
          <span className="text-yellow-500">✉</span>
          <a href="mailto:contact@caceg-dz.com" className="hover:text-white transition">
            contact@caceg-dz.com
          </a>
        </li>
      </ul>
    </div>

    {/* Colonne 4 : Logo FEDE à droite */}
 <div className="flex flex-col items-end justify-start pr-8"> {/* padding droite pour centrer visuellement */}
  <p className="text-sm text-gray-400 mb-4 w-full text-right">CACEG est agréé par :</p>
  <Image
    src="/logos/fede.png"
    alt="FEDE - Fédération Européenne Des Écoles"
    width={180}
    height={80}
    className="object-contain"
  />
</div>
  </div>

  {/* Ligne du bas */}
  <div className="mt-12 pt-8 border-t border-blue-800 text-center text-sm text-gray-400">
    © {new Date().getFullYear()} CACEG. Tous droits réservés. Designed by sefrone
  </div>
</footer>
    </main>
  );
}