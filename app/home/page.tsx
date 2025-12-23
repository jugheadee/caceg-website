"use client";

import Navbar from "@/components/NavBar";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import SponsorsCarousel from "@/components/SponsorsCarousel";

const slides = [
  {
    image: "/hero1.jpeg",
    title: "PARTENAIRE PRIVILÉGIÉ DES PME",
    subtitle:
      "Des solutions sur mesure de formation, conseil et expertise de votre projet jusqu'à la concrétisation",
  },
  {
    image: "/hero2.jpg",
    title: "EXPERTISE & ACCOMPAGNEMENT",
    subtitle:
      "Formation professionnelle, consulting et études pour booster votre performance",
  },
  {
    image: "/hero4.jpg",
    title: "DÉVELOPPEZ VOS COMPÉTENCES",
    subtitle: "Formations adaptées à vos besoins et à votre secteur d'activité",
  },
  {
    image: "/consulting.jpg",
    title: "VERS LA RÉUSSITE DE VOS PROJETS",
    subtitle: "Un accompagnement complet pour atteindre vos objectifs",
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
              index === currentSlide ? "opacity-100" : "opacity-0"
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
                index === currentSlide ? "bg-yellow-500" : "bg-white opacity-60"
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
              CACEG a développé une large gamme de formations pour partager et
              transmettre le savoir et les bonnes pratiques du management aux
              salariés de chaque entreprise.
            </p>
            <p className="text-lg text-gray-700 mb-8">
              Toutes nos formations sont adaptables à vos besoins et contexte
              (durée, programme, niveau de difficulté, nombre de
              participants...). Nous pouvons également concevoir des formations
              totalement sur mesure en tenant votre cahier des charges.
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
              src="/image7.jpg"
              alt="CACEG Formations"
              width={600}
              height={400}
              className="rounded-xl shadow-xl mb-8 mx-auto md:mx-0"
            />
            <h2 className="text-3xl font-bold text-blue-900 mb-6">
              CACEG Formations
            </h2>
            <p className="text-gray-700 mb-8 text-lg">
              Nous proposons des formations inter-entreprises et des formations
              intra-entreprises. Caceg Formations identifie avec votre
              entreprise vos besoins en formation. Nous établissons ensemble un
              plan de formation en fonction de votre budget et de votre
              calendrier. Notre expérience et notre réseau de formateurs et
              d'organismes de formation nous permettent de vous proposer des
              formations, tant en termes de contenu que de coûts et
              d'organisation.
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
              src="/consulting2.jpg"
              alt="CACEG Consulting"
              width={600}
              height={400}
              className="rounded-xl shadow-xl mb-8 mx-auto md:mx-0"
            />
            <h2 className="text-3xl font-bold text-blue-900 mb-6">
              CACEG Consulting
            </h2>
            <p className="text-gray-700 mb-8 text-lg">
              Nous avons pour mission d'accompagner les entreprises dans leurs
              projets d'évolution et de développement afin de les propulser vers
              la réussite de leurs objectifs de performance. La
              pluridisciplinarité de notre équipe d'experts permet de vous
              accompagner dans votre projet de certification ISO, élaboration de
              plan stratégique, audit, certification, etc.
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
                "J'ai vraiment apprécié les cours de CACEG et j'espère pouvoir
                suivre d'autres formations avec eux. Les explications sont
                claires ainsi que les exemples sont bien présentés et faciles à
                suivre."
              </p>
              <p className="font-semibold text-blue-900">Mohamed</p>
              <p className="text-sm text-gray-600">Développeur Web</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <p className="text-gray-700 italic mb-6">
                "Les cours ici ont dépassé mes attentes à bien des égards.
                L'approche pédagogique est claire et structurée. Dans un
                environnement très calme, j'ai appris les principes clés du
                design que je peux mettre en œuvre immédiatement."
              </p>
              <p className="font-semibold text-blue-900">Rafik Ziani</p>
              <p className="text-sm text-gray-600">Infographie</p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter*/}
      <section className="py-24 bg-blue-950 text-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
            Abonnez-vous à notre newsletter
          </h2>
          <p className="text-xl text-blue-200 mb-12 max-w-2xl mx-auto">
            Recevez en exclusivité nos actualités, nouvelles formations et
            conseils en management & consulting.
          </p>

          <form className="flex flex-col md:flex-row gap-6 max-w-2xl mx-auto items-center justify-center">
            <input
              type="email"
              placeholder="Votre adresse email"
              required
              className="w-full px-8 py-5 text-lg text-gray-900 placeholder-gray-500 bg-white rounded-full focus:outline-none focus:ring-4 focus:ring-yellow-400 focus:ring-opacity-50 transition-shadow shadow-lg"
            />
            <button
              type="submit"
              className="w-full md:w-auto bg-yellow-500 text-blue-950 font-bold px-12 py-5 rounded-full text-lg hover:bg-yellow-400 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              S'abonner
            </button>
          </form>
        </div>
      </section>

      {/* Sponsors Section - Now using the client component */}
      <section className="py-16 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-blue-900 mb-12">
            Nos Partenaires et Sponsors
          </h2>
          <SponsorsCarousel /> {/* This is client-side, handles the carousel */}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-950 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-8">
          {/* Colonne 1 : CACEG */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">CACEG</h3>
            <p className="text-sm leading-relaxed">
              CACEG Consulting, spécialisé en Formation, consulting et étude
              ainsi en management et ressources humaines (RH). Notre cabinet de
              formation agréé en Algérie réalise des formations
              professionnelles.
            </p>
          </div>

          {/* Colonne 2 : Liens Utiles */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Liens Utiles</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/formations"
                  className="hover:text-white transition flex items-center gap-2"
                >
                  <span className="text-yellow-500">›</span> Formations
                </Link>
              </li>
              <li>
                <Link
                  href="/actualites"
                  className="hover:text-white transition flex items-center gap-2"
                >
                  <span className="text-yellow-500">›</span> Actualités
                </Link>
              </li>
              <li>
                <Link
                  href="/presentation"
                  className="hover:text-white transition flex items-center gap-2"
                >
                  <span className="text-yellow-500">›</span> À propos
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="hover:text-white transition flex items-center gap-2"
                >
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
                <span>
                  01, Place Ayachi Abderrahmane, BPS18 RP,Mostaganem, Algérie
                </span>
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
                <a
                  href="mailto:contact@caceg-dz.com"
                  className="hover:text-white transition"
                >
                  contact@caceg-dz.com
                </a>
              </li>
            </ul>
          </div>

          {/* Colonne 4 : Logo FEDE à droite */}
          <div className="flex flex-col items-end justify-start pr-8">
            {" "}
            {/* padding droite pour centrer visuellement */}
            <p className="text-sm text-gray-400 mb-4 w-full text-right">
              CACEG est agréé par :
            </p>
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
          © {new Date().getFullYear()} CACEG. Tous droits réservés. Designed by
          sefrone
        </div>
      </footer>
    </main>
  );
}
