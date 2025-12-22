'use client';

import Navbar from '@/components/NavBar';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';

const slides = [
  {
    image: '/hero1.jpeg',
    title: 'PARTENAIRE PRIVILÉGIÉ DES PME',
    subtitle: 'Des solutions sur mesure de formation, conseil et expertise de votre projet jusqu\'à la concrétisation',
  },
  {
    image: '/hero2.jpg',
    title: 'EXPERTISE & ACCOMPAGNEMENT',
    subtitle: 'Formation professionnelle, consulting et études pour booster votre performance',
  },
  {
    image: '/hero4.jpg',
    title: 'DÉVELOPPEZ VOS COMPÉTENCES',
    subtitle: 'Formations adaptées à vos besoins et à votre secteur d\'activité',
  },
  {
    image: '/consulting.jpg',
    title: 'VERS LA RÉUSSITE DE VOS PROJETS',
    subtitle: 'Un accompagnement complet pour atteindre vos objectifs',
  },
];

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

     

      {/* HERO SLIDER AUTOMATIQUE */}
      <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Image
              src={slide.image}
              alt={`CACEG Slide ${index + 1}`}
              fill
              className="object-cover"
              priority={index === 0}
            />
            <div className="absolute inset-0 bg-black opacity-50"></div>
            <div className="relative z-10 flex items-center justify-center h-full text-center text-white px-6">
              <div className="max-w-4xl">
                <h1 className="text-4xl md:text-6xl font-bold mb-6">
                  {slide.title}
                </h1>
                <p className="text-xl md:text-2xl mb-8 opacity-90">
                  {slide.subtitle}
                </p>
                <Link
                  href="/contact"
                  className="inline-block bg-yellow-500 text-blue-900 font-bold px-8 py-4 rounded-lg text-lg hover:bg-yellow-400 transition shadow-lg"
                >
                  EN SAVOIR PLUS
                </Link>
              </div>
            </div>
          </div>
        ))}

        {/* Indicateurs en bas */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition ${
                index === currentSlide ? 'bg-yellow-500' : 'bg-white opacity-60'
              } hover:bg-yellow-400`}
              aria-label={`Aller au slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Le reste des sections (copie-colle celles du code précédent) */}
      {/* Section "Une formation réussie..." */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-6">
              Une formation réussie, un accès facile à l'emploi
            </h2>
            <p className="text-lg text-gray-700 mb-8">
              CACEG a développé une large gamme de formations pour partager et transmettre le savoir et les bonnes pratiques du management aux salariés de chaque entreprise.
            </p>
            <p className="text-lg text-gray-700 mb-8">
              Toutes nos formations sont adaptables à vos besoins et contexte (durée, programme, niveau de difficulté, nombre de participants...). Nous pouvons également concevoir des formations totalement sur mesure en tenant votre cahier des charges.
            </p>
            <Link
              href="/formations"
              className="inline-block bg-yellow-500 text-blue-900 font-bold px-8 py-4 rounded-lg hover:bg-yellow-400 transition"
            >
              EN SAVOIR PLUS
            </Link>
          </div>
          <div className="flex justify-center">
            <Image
              src="/formation-image.jpg"
              alt="Formation CACEG"
              width={600}
              height={400}
              className="rounded-xl shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* CACEG Formations + Consulting */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16">
          <div className="text-center md:text-left">
            <Image
              src="/formation-image.jpg"
              alt="CACEG Formations"
              width={600}
              height={400}
              className="rounded-xl shadow-xl mb-8 mx-auto md:mx-0"
            />
            <h2 className="text-3xl font-bold text-blue-900 mb-6">CACEG Formations</h2>
            <p className="text-gray-700 mb-8 text-lg">
              Nous proposons des formations inter-entreprises et des formations intra-entreprises. 
              Caceg Formations identifie avec votre entreprise vos besoins en formation. 
              Nous établissons ensemble un plan de formation en fonction de votre budget et de votre calendrier. 
              Notre expérience et notre réseau de formateurs et d'organismes de formation nous permettent de vous proposer des formations, tant en termes de contenu que de coûts et d'organisation.
            </p>
            <Link
              href="/formations"
              className="inline-block bg-yellow-500 text-blue-900 font-bold px-8 py-4 rounded-lg hover:bg-yellow-400 transition"
            >
              Lire Plus
            </Link>
          </div>

          <div className="text-center md:text-left">
            <Image
              src="/consulting-caceg.jpg"
              alt="CACEG Consulting"
              width={600}
              height={400}
              className="rounded-xl shadow-xl mb-8 mx-auto md:mx-0"
            />
            <h2 className="text-3xl font-bold text-blue-900 mb-6">CACEG Consulting</h2>
            <p className="text-gray-700 mb-8 text-lg">
              Nous avons pour mission d'accompagner les entreprises dans leurs projets d'évolution et de développement afin de les propulser vers la réussite de leurs objectifs de performance. 
              La pluridisciplinarité de notre équipe d'experts permet de vous accompagner dans votre projet de certification ISO, élaboration de plan stratégique, audit, certification, etc.
            </p>
            <Link
              href="/etudes"
              className="inline-block bg-yellow-500 text-blue-900 font-bold px-8 py-4 rounded-lg hover:bg-yellow-400 transition"
            >
              Lire Plus
            </Link>
          </div>
        </div>
      </section>
      {/* Témoignages clients */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-blue-900 mb-12">
            Ce que disent nos clients
          </h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <p className="text-gray-700 italic mb-6">
                "J'ai vraiment apprécié les cours de CACEG et j'espère pouvoir suivre d'autres formations avec eux. Les explications sont claires ainsi que les exemples sont bien présentés et faciles à suivre."
              </p>
              <p className="font-semibold text-blue-900">Mohamed</p>
              <p className="text-sm text-gray-600">Développeur Web</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <p className="text-gray-700 italic mb-6">
                "Les cours ici ont dépassé mes attentes à bien des égards. L'approche pédagogique est claire et structurée. Dans un environnement très calme, j'ai appris les principes clés du design que je peux mettre en œuvre immédiatement."
              </p>
              <p className="font-semibold text-blue-900">Rafik Ziani</p>
              <p className="text-sm text-gray-600">Infographie</p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-yellow-500">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-6">
            Abonnez-vous à notre newsletter
          </h2>
          <form className="flex flex-col md:flex-row gap-4 max-w-lg mx-auto">
            <input
              type="email"
              placeholder="Votre email"
              className="px-6 py-4 rounded-lg flex-1"
            />
            <button className="bg-blue-900 text-white font-bold px-8 py-4 rounded-lg hover:bg-blue-800 transition">
              S'abonner
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-950 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white font-bold text-lg mb-4">CACEG</h3>
            <p className="text-sm">
              CACEG Consulting, spécialisé en Formation, consulting et étude ainsi en management et ressources humaines (RH). Notre cabinet de formation agréé en Algérie réalise des formations professionnelles.
            </p>
          </div>
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Liens Utiles</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/formations">Formations</Link></li>
              <li><Link href="/actualites">Actualités</Link></li>
              <li><Link href="/about">À propos</Link></li>
              <li><Link href="/faq">FAQ</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Coordonnées</h3>
            <p className="text-sm">
              01, Place Ayachi Abderrahmane, BPS18 RP, Mostaganem, Algérie <br />
              Tél : +213 (0)23 58 86 76 <br />
              Mobile : +213 (0)550 177 84 <br />
              Email : contact@caceg-dz.com
            </p>
          </div>
          <div className="text-center md:text-right">
            <p className="text-sm mb-4">CACEG est agréé par :</p>
            {/* Mets le logo FDE si tu l'as */}
            <Image src="/fde-logo.png" alt="FDE" width={150} height={80} />
          </div>
        </div>
        <div className="text-center text-sm mt-12 border-t border-blue-800 pt-6">
          © {new Date().getFullYear()} CACEG. Tous droits réservés. Designed with ❤️ in Algeria
        </div>
      </footer>

    

    </main>
  );
}