'use client';

import Navbar from '@/components/NavBar';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

const formations = [
  // Formations CACEG classiques
  {
    title: "GESTION DES STOCKS : Valorisation, Analyse et Gestion Economique",
    instructor: "Yacine",
    description: "La gestion des stocks constitue un moyen de recenser, valoriser et inventorier les biens acquis par l’entreprise...",
    price: "Gratuit",
    image: "/gestion-projet.jpg",
    slug: "gestion-des-stocks-valorisation-analyse-et-gestion-economique-2",
  },
 
  {
    title: "LES TECHNIQUES D’APPROVISIONNEMENT : L’ACHAT A L’ETRANGER",
    instructor: "Lamia Boukhatem",
    description: "Objectifs Acquérir les techniques générales d’achat à l’étranger Approfondir ses connaissances en matière de négociation...",
    price: "Gratuit",
    image: "/formations/achat-etranger.jpg",
    slug: "les-techniques-dapprovisionnement-lachat-a-letranger",
  },
  {
    title: "Management des Ressources Humaines",
    instructor: "Lamia Boukhatem",
    description: "Le management des ressources humaines constitue un domaine important dans la maitrise des outils de gestion de l’entreprise...",
    price: "Gratuit",
    image: "/formations/rh-management.jpg",
    slug: "management-des-ressources-humaines",
  },
  {
    title: "Elaboration du plan de formation et procédure de gestion des taxes de la formation professionelle et de l'apprentissage",
    instructor: "Ameur",
    description: "La formation constitue le levier principal de la gestion des competences de l’entreprise...",
    price: "Gratuit",
    image: "/formations/plan-formation.jpg",
    slug: "elaboration-du-plan-de-formation-et-procedure-de-gestion-des-taxes-de-la-formation-professionnelle-et-de-lapprentissage",
  },
  {
    title: "Fiscalité des entreprises",
    instructor: "Caceg-dz",
    description: "Gérer la fiscalité d’une entreprise est une tâche ardue car elle implique de connaître au moins les principes de base...",
    price: "Gratuit",
    image: "/formations/fiscalite.jpg",
    slug: "fiscalite-des-entreprises",
  },
  {
    title: "Techniques d’accueil en entreprise",
    instructor: "Yacine",
    description: "Améliorer la qualité de votre accueil et de votre relation client...",
    price: "Gratuit",
    image: "/formations/accueil.jpg",
    slug: "techniques-daccueil-en-entreprise",
  },
  {
    title: "Assistant(e) Commercial(e)",
    instructor: "Caceg-dz",
    description: "Au sein d’une équipe commerciale, l’assistant(e) commercial(e) seconde le responsable dans la gestion de ses activités...",
    price: "250.00 DZD",
    image: "/formations/assistant-commercial.jpg",
    slug: "assistante-commerciale",
  },
  {
    title: "Apprendre Python pour l'analyse de données et la visualisation",
    instructor: "CACEG",
    description: "Apprendre Python pour l'analyse de données et la visualisation...",
    price: "Gratuit",
    image: "/formations/python-data.jpg",
    slug: "learning-python-for-data-analysis-and-visualization",
  },
  // Formations développement informatique
  {
    title: "Créer une application de chat web complète de A à Z",
    instructor: "Mike Hussy",
    description: "Apprenez à construire une application de chat full web avec toutes les fonctionnalités modernes.",
    price: "93.00 DZD",
    image: "/formations/web-chat-app.jpg",
    slug: "build-full-web-chat-app-from-scratch",
  },
  {
    title: "Maîtriser les microservices avec Spring Boot et Cloud",
    instructor: "Rosy Janner",
    description: "Développez des architectures microservices robustes avec Spring Boot et déploiement cloud.",
    price: "51.00 DZD",
    image: "/formations/spring-boot-microservices.jpg",
    slug: "master-microservices-spring-boot-cloud",
  },
  {
    title: "Le cours complet JavaScript pour débutants",
    instructor: "David Lee",
    description: "Maîtrisez JavaScript de zéro : variables, fonctions, DOM, ES6+ et projets pratiques.",
    price: "89.00 DZD",
    image: "/formations/javascript-beginner.jpg",
    slug: "complete-javascript-course-beginner",
  },
  {
    title: "Node avec React : Développement Fullstack Web",
    instructor: "David Lee",
    description: "Construisez des applications fullstack avec Node.js backend et React frontend.",
    price: "43.00 DZD",
    image: "/formations/react-node-fullstack.jpg",
    slug: "node-react-fullstack-development",
  },
  {
    title: "Le cours complet de développement web",
    instructor: "Mike Hussy",
    description: "De HTML/CSS à JavaScript avancé, créez des sites web responsives et performants.",
    price: "65.00 DZD",
    image: "/formations/complete-web-developer.jpg",
    slug: "complete-web-developer-course",
  },
  {
    title: "Créer un clone Spotify de A à Z",
    instructor: "Mike Hussy",
    description: "Développez une application de streaming musical complète comme Spotify.",
    price: "25.00 DZD",
    image: "/formations/spotify-clone.jpg",
    slug: "create-spotify-clone-scratch",
  },
  {
    title: "Pratique avec Docker : De Docker Captain",
    instructor: "Rosy Janner",
    description: "Maîtrisez Docker en profondeur : containers, images, volumes et orchestration.",
    price: "59.00 DZD",
    image: "/formations/docker-hands-on.jpg",
    slug: "hands-on-docker-captain",
  },
];

const ITEMS_PER_PAGE = 6;

export default function FormationsPage() {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(formations.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentFormations = formations.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePrev = () => setCurrentPage((p) => Math.max(1, p - 1));
  const handleNext = () => setCurrentPage((p) => Math.min(totalPages, p + 1));

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <div className="h-16 lg:h-20"></div>

      {/* Hero avec photo */}
      <section className="relative h-[70vh] min-h-[600px] flex items-center justify-center text-center text-white overflow-hidden">
        <Image
          src="/formation-hero.jpg"
          alt="Formations professionnelles CACEG"
          fill
          className="object-cover brightness-75"
          priority
        />
        <div className="relative z-10 px-6 max-w-5xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 drop-shadow-2xl">
            Toutes Nos Formations
          </h1>
          <p className="text-xl md:text-3xl drop-shadow-lg max-w-3xl mx-auto">
            Découvrez notre catalogue complet de formations professionnelles adaptées à vos besoins en management, RH, finance et plus.
          </p>
        </div>
      </section>

      {/* Liste des formations avec pagination */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {currentFormations.map((f) => (
              <Link href={`/formations/${f.slug}`} key={f.slug} className="block">
                <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-3 transition-all duration-300 overflow-hidden">
                  <div className="relative h-56">
                    <Image src={f.image} alt={f.title} fill className="object-cover" />
                    <span
                      className={`absolute top-4 right-4 px-4 py-2 rounded-full font-bold text-sm ${
                        f.price === "Gratuit" ? 'bg-yellow-500 text-blue-900' : 'bg-green-600 text-white'
                      }`}
                    >
                      {f.price}
                    </span>
                  </div>
                  <div className="p-8">
                    <h3 className="text-xl font-bold text-blue-900 mb-3 line-clamp-2">{f.title}</h3>
                    <p className="text-sm text-gray-600 mb-4">Par {f.instructor}</p>
                    <p className="text-gray-700 line-clamp-3 mb-6">{f.description}</p>
                    <span className="text-blue-900 font-semibold hover:underline flex items-center gap-2">
                      En savoir plus <span className="text-yellow-500">→</span>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination fonctionnelle */}
          {totalPages > 1 && (
            <div className="mt-16 flex items-center justify-center gap-4 flex-wrap">
              <button
                onClick={handlePrev}
                disabled={currentPage === 1}
                className="bg-blue-900 text-white px-8 py-4 rounded-lg hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                ← Précédent
              </button>

              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-6 py-4 rounded-lg font-bold transition ${
                    currentPage === i + 1
                      ? 'bg-yellow-500 text-blue-900'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className="bg-blue-900 text-white px-8 py-4 rounded-lg hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Suivant →
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Footer (le même que tu avais) */}
      <footer className="bg-blue-950 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white font-bold text-lg mb-4">CACEG</h3>
            <p className="text-sm leading-relaxed">
              CACEG Consulting, spécialisé en Formation, consulting et étude ainsi en management et ressources humaines (RH). 
              Notre cabinet de formation agréé en Algérie réalise des formations professionnelles.
            </p>
          </div>

          <div>
            <h3 className="text-white font-bold text-lg mb-4">Liens Utiles</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/formations" className="hover:text-white transition flex items-center gap-2"><span className="text-yellow-500">›</span> Formations</Link></li>
              <li><Link href="/actualites" className="hover:text-white transition flex items-center gap-2"><span className="text-yellow-500">›</span> Actualités</Link></li>
              <li><Link href="/presentation" className="hover:text-white transition flex items-center gap-2"><span className="text-yellow-500">›</span> À propos</Link></li>
              <li><Link href="/faq" className="hover:text-white transition flex items-center gap-2"><span className="text-yellow-500">›</span> FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold text-lg mb-4">Coordonnées</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3"><span className="text-yellow-500">📍</span><span>01, Place Ayachi Abderrahmane, BPS18 RP,Mostaganem, Algérie</span></li>
              <li className="flex items-center gap-3"><span className="text-yellow-500">☎</span><span>+213 (0)23 58 86 76</span></li>
              <li className="flex items-center gap-3"><span className="text-yellow-500">📱</span><span>+213 (0)550 177 84</span></li>
              <li className="flex items-center gap-3"><span className="text-yellow-500">✉</span><a href="mailto:contact@caceg-dz.com" className="hover:text-white transition">contact@caceg-dz.com</a></li>
            </ul>
          </div>

          <div className="flex flex-col items-end justify-start pr-8">
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

        <div className="mt-12 pt-8 border-t border-blue-800 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} CACEG. Tous droits réservés. Designed by sefrone
        </div>
      </footer>
    </main>
  );
}